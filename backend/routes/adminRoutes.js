const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/applicationModel");
const Settings = require("../models/settingsModel");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { resumePath } = require("../middleware/upload");
const { sendMailSafely } = require("../utils/mailer");

const { APPLICATION_STATUSES } = Application;
// "submitted" moves an application back to the review queue
const REVIEW_STATUSES = ["submitted", "accepted", "waitlisted", "rejected"];

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

const findApplication = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(404).json({ message: "Application not found." });
        return null;
    }
    const application = await Application.findById(req.params.id).populate("user", "email");
    if (!application) res.status(404).json({ message: "Application not found." });
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
    if (sent) {
        application.decisionNotifiedAt = new Date();
        await application.save();
    }
    return sent;
};

router.get("/applications", async (req, res) => {
    const { status, search } = req.query;
    const filter = {};

    if (APPLICATION_STATUSES.includes(status)) filter.status = status;
    if (search?.trim()) {
        const pattern = new RegExp(escapeRegex(search.trim()), "i");
        filter.$or = [
            { firstName: pattern },
            { lastName: pattern },
            { preferredFirstName: pattern },
            { email: pattern },
            { school: pattern }
        ];
    }

    const [applications, counts] = await Promise.all([
        Application.find(filter)
            .select("firstName lastName preferredFirstName email school studyLevel status submittedAt decisionNotifiedAt updatedAt")
            .sort({ submittedAt: -1, updatedAt: -1 }),
        Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    ]);

    res.json({
        applications,
        counts: Object.fromEntries(counts.map(({ _id, count }) => [_id, count]))
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
    if (!REVIEW_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
    }

    const application = await findApplication(req, res);
    if (!application) return;
    if (application.status === "incomplete") {
        return res.status(409).json({ message: "This application hasn't been submitted yet." });
    }

    if (application.status !== status) {
        application.status = status;
        application.reviewedAt = new Date();
        application.reviewedBy = req.user._id;
        application.decisionNotifiedAt = undefined;
        await application.save();
    }

    const notified = notify ? await notifyDecision(application) : false;
    res.json({ application, notified });
});

// Sends (or re-sends) the decision email for the current status
router.post("/applications/:id/notify", async (req, res) => {
    const application = await findApplication(req, res);
    if (!application) return;
    if (!DECISION_EMAILS[application.status]) {
        return res.status(400).json({ message: "Make a decision before notifying the applicant." });
    }

    const notified = await notifyDecision(application);
    if (!notified) {
        return res.status(502).json({ message: "The email could not be sent. Try again later." });
    }
    res.json({ application, notified });
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
