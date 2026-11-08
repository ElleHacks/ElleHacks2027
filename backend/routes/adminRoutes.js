const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/applicationModel");
const Settings = require("../models/settingsModel");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { resumePath } = require("../middleware/upload");
const { sendMailSafely } = require("../utils/mailer");

const { ADMIN_APPLICATION_STATUSES } = Application;

const DECISION_EMAILS = {
    accepted: {
        subject: "You're in! Welcome to ElleHacks 2027 🎉",
        body:
            "Congratulations! Your application to ElleHacks 2027 has been accepted. " +
            "Sign in to the ElleHacks portal for next steps and event details."
    },
    waitlisted: {
        subject: "Your ElleHacks 2027 application status",
        body:
            "Thank you for applying to ElleHacks 2027. You've been placed on our waitlist. " +
            "We'll reach out if a spot opens up, so keep an eye on your inbox."
    },
    rejected: {
        subject: "Your ElleHacks 2027 application status",
        body:
            "Thank you for applying to ElleHacks 2027. Unfortunately, we aren't able to offer " +
            "you a spot this year. We received many strong applications and hope you'll apply again!"
    }
};

const router = express.Router();
router.use(requireAuth, requireAdmin);

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Query params that must equal a stored answer exactly (dietary matches one item in the list)
const EXACT_MATCH_FILTERS = {
    pronouns: "pronouns",
    tshirtSize: "tshirtSize",
    studyLevel: "studyLevel",
    country: "country",
    dietary: "dietaryRestrictions",
    overnight: "overnightAccommodation"
};

const AGE_RANGES = {
    "under-18": { $lt: 18 },
    "18-21": { $gte: 18, $lte: 21 },
    "22-25": { $gte: 22, $lte: 25 },
    "26-plus": { $gte: 26 }
};

// Only accept plain strings so query params can't inject Mongo operators
const queryString = (value) => (typeof value === "string" ? value.trim() : "");

const buildApplicationFilter = (query) => {
    const filter = {};

    for (const [param, field] of Object.entries(EXACT_MATCH_FILTERS)) {
        const value = queryString(query[param]);
        if (value) filter[field] = value;
    }

    // City is typed freely, so ignore case and stray spaces ("toronto " matches "Toronto")
    const city = queryString(query.city);
    if (city) filter.city = new RegExp(`^\\s*${escapeRegex(city)}\\s*$`, "i");

    const ageRange = AGE_RANGES[queryString(query.age)];
    if (ageRange) filter.age = ageRange;

    // YorkU students are the ones who filled in the YorkU student number
    const york = queryString(query.york);
    if (york === "yes") filter.yorkStudentNumber = { $nin: [null, ""] };
    if (york === "no") filter.yorkStudentNumber = { $in: [null, ""] };

    const search = queryString(query.search);
    if (search) {
        const pattern = new RegExp(escapeRegex(search), "i");
        filter.$or = [
            { firstName: pattern },
            { lastName: pattern },
            { preferredFirstName: pattern },
            { email: pattern },
            { school: pattern },
            { city: pattern },
            { province: pattern },
            { fieldOfStudy: pattern },
            { pronouns: pattern }
        ];
    }

    return filter;
};

// Distinct cities among the given applications, merged case-insensitively, for the city dropdown
const listCities = async (filter) => {
    const cities = await Application.distinct("city", filter);
    const byKey = new Map();
    for (const city of cities) {
        const name = typeof city === "string" ? city.trim() : "";
        if (name && !byKey.has(name.toLowerCase())) byKey.set(name.toLowerCase(), name);
    }
    return [...byKey.values()].sort((a, b) => a.localeCompare(b));
};

const findApplication = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(404).json({ message: "Application not found." });
        return null;
    }
    const application = await Application.findById(req.params.id).populate("user", "email");
    if (!application || !ADMIN_APPLICATION_STATUSES.includes(application.status)) {
        res.status(404).json({ message: "Application not found." });
        return null;
    }
    return application;
};

const notifyDecision = async (application) => {
    const email = DECISION_EMAILS[application.status];
    if (!email) return false;

    const sent = await sendMailSafely({
        to: application.user.email,
        subject: email.subject,
        text:
            `Hi ${application.preferredFirstName || application.firstName},\n\n` +
            `${email.body}\n\n— The ElleHacks Team`
    });
    await Application.updateOne(
        { _id: application._id, status: application.status, decisionEmailStatus: "queued" },
        {
            $set: {
                decisionEmailStatus: sent ? "sent" : "failed",
                decisionNotifiedAt: sent ? new Date() : null
            }
        }
    );
    return sent;
};

const queueDecisionNotification = (application) => {
    void notifyDecision(application).catch((error) => {
        console.error("❌ Failed to record decision email notification:", error);
        void Application.updateOne(
            { _id: application._id, status: application.status, decisionEmailStatus: "queued" },
            { $set: { decisionEmailStatus: "failed" } }
        ).catch((updateError) => {
            console.error("❌ Failed to update decision email status:", updateError);
        });
    });
};

router.get("/applications", async (req, res) => {
    // Status counts use the same search and filters, so the buttons match what the table would show
    const answerFilter = buildApplicationFilter(req.query);
    const filter = { ...answerFilter, status: { $in: ADMIN_APPLICATION_STATUSES } };
    if (ADMIN_APPLICATION_STATUSES.includes(req.query.status)) filter.status = req.query.status;

    // City choices follow every other filter but not the city itself, so picking a city
    // doesn't hide the alternatives
    const { city, ...queryWithoutCity } = req.query;
    const cityFilter = { ...buildApplicationFilter(queryWithoutCity), status: filter.status };

    const [applications, counts, cities] = await Promise.all([
        Application.find(filter)
            .select("firstName lastName preferredFirstName pronouns age tshirtSize email school studyLevel status submittedAt decisionNotifiedAt updatedAt")
            .sort({ submittedAt: -1, updatedAt: -1 }),
        Application.aggregate([
            { $match: { ...answerFilter, status: { $in: ADMIN_APPLICATION_STATUSES } } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]),
        listCities(cityFilter)
    ]);

    res.json({
        applications,
        counts: Object.fromEntries(counts.map(({ _id, count }) => [_id, count])),
        cities
    });
});

router.get("/applications/:id", async (req, res) => {
    const application = await findApplication(req, res);
    if (application) res.json(application);
});

router.get("/applications/:id/resume", async (req, res) => {
    const application = await findApplication(req, res);
    if (!application) return;
    if (!application.resume?.filename) {
        return res.status(404).json({ message: "No resume uploaded." });
    }
    res.download(resumePath(application.resume.filename), application.resume.originalName);
});

// Accept / waitlist / reject, optionally emailing the applicant
router.patch("/applications/:id/status", async (req, res) => {
    const { status, notify } = req.body;
    if (!ADMIN_APPLICATION_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
    }

    const application = await findApplication(req, res);
    if (!application) return;

    const statusChanged = application.status !== status;
    if (statusChanged) {
        application.status = status;
        if (status === "submitted") {
            application.reviewedAt = undefined;
            application.reviewedBy = undefined;
        } else {
            application.reviewedAt = new Date();
            application.reviewedBy = req.user._id;
        }
        application.decisionNotifiedAt = undefined;
        application.decisionEmailStatus = undefined;
    }

    const notificationQueued = Boolean(notify && DECISION_EMAILS[status]);
    if (notificationQueued) {
        application.decisionEmailStatus = "queued";
        application.decisionNotifiedAt = undefined;
    }
    if (statusChanged || notificationQueued) await application.save();
    if (notificationQueued) queueDecisionNotification(application);
    res.json({ application, notificationQueued });
});

// Sends (or re-sends) the decision email for the current status
router.post("/applications/:id/notify", async (req, res) => {
    const application = await findApplication(req, res);
    if (!application) return;
    if (!DECISION_EMAILS[application.status]) {
        return res.status(400).json({ message: "Make a decision before notifying the applicant." });
    }

    application.decisionEmailStatus = "queued";
    application.decisionNotifiedAt = undefined;
    await application.save();
    queueDecisionNotification(application);
    res.json({ application, notificationQueued: true });
});

router.get("/settings", async (req, res) => {
    const settings = await Settings.get();
    res.json(settings.toPublic());
});

// Application deadline controls
router.put("/settings", async (req, res) => {
    const { applicationsOpen, applicationDeadline } = req.body;
    const settings = await Settings.get();

    if (typeof applicationsOpen === "boolean") {
        settings.applicationsOpen = applicationsOpen;
    }
    if (applicationDeadline !== undefined) {
        const deadline = applicationDeadline ? new Date(applicationDeadline) : null;
        if (deadline && Number.isNaN(deadline.getTime())) {
            return res.status(400).json({ message: "Invalid deadline." });
        }
        settings.applicationDeadline = deadline;
    }

    await settings.save();
    res.json(settings.toPublic());
});

module.exports = router;
