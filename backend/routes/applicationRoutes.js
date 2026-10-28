const express = require("express");
const fs = require("fs/promises");
const Application = require("../models/applicationModel");
const Settings = require("../models/settingsModel");
const User = require("../models/userModel");
const { requireAuth } = require("../middleware/auth");
const { uploadResume, resumePath } = require("../middleware/upload");
const { sanitizeAnswers, validateAnswers } = require("../config/applicationFields");
const { sendMailSafely } = require("../utils/mailer");

const router = express.Router();

const isEditableDraft = (application) =>
    !application || application.status === "incomplete" || application.status === "draft";

const removeFile = (filename) => fs.unlink(resumePath(filename)).catch(() => {});

const toApplicantView = (application) => {
    const { reviewedBy, ...rest } = application.toObject();
    return rest;
};

// Public: lets the form show whether applications are open and the deadline
router.get("/window", async (req, res) => {
    const settings = await Settings.get();
    res.json(settings.toPublic());
});

router.get("/me", requireAuth, async (req, res) => {
    const [application, settings] = await Promise.all([
        Application.findOne({ user: req.user._id }),
        Settings.get()
    ]);

    const applicantApplication = application
        ? { ...toApplicantView(application), status: application.status === "draft" ? "incomplete" : application.status }
        : { status: "incomplete" };

    res.json({
        application: {
            ...applicantApplication,
            firstName: applicantApplication.firstName || req.user.firstName,
            lastName: applicantApplication.lastName || req.user.lastName,
            email: applicantApplication.email || req.user.email
        },
        window: settings.toPublic()
    });
});

router.get("/me/resume", requireAuth, async (req, res) => {
    const application = await Application.findOne({ user: req.user._id });
    if (!application?.resume?.filename) {
        return res.status(404).json({ message: "No resume uploaded." });
    }
    res.download(resumePath(application.resume.filename), application.resume.originalName);
});

// Check submission eligibility before the upload writes a temporary file.
const ensureEditable = async (req, res, next) => {
    const settings = await Settings.get();
    if (!settings.isAcceptingApplications()) {
        return res.status(403).json({ message: "Applications are closed." });
    }

    const application = await Application.findOne({ user: req.user._id });
    if (!isEditableDraft(application)) {
        return res.status(409).json({ message: "Your application has already been submitted." });
    }

    req.application = application || new Application({ user: req.user._id });
    next();
};

const parseAnswers = async (req, res) => {
    let raw;
    try {
        raw = JSON.parse(req.body.answers || "{}");
    } catch {
        if (req.file) await removeFile(req.file.filename);
        res.status(400).json({ message: "Invalid application data." });
        return null;
    }

    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        if (req.file) await removeFile(req.file.filename);
        res.status(400).json({ message: "Invalid application data." });
        return null;
    }

    return raw;
};

const applyDraft = (application, raw, req) => {
    application.set(sanitizeAnswers(raw));
    application.user = req.user._id;
    application.status = "incomplete";

    if (req.file) {
        application.resume = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            uploadedAt: new Date()
        };
    }
};

router.put("/me", requireAuth, ensureEditable, uploadResume, async (req, res) => {
    const raw = await parseAnswers(req, res);
    if (!raw) return;

    const application = req.application;
    const previousResume = application.resume?.filename;
    applyDraft(application, raw, req);
    await application.save();
    await User.updateOne({ _id: req.user._id }, { application: application._id });

    if (req.file && previousResume) await removeFile(previousResume);
    res.json({ application: toApplicantView(application) });
});

router.post("/me/submit", requireAuth, ensureEditable, uploadResume, async (req, res) => {
    const raw = await parseAnswers(req, res);
    if (!raw) return;

    const application = req.application;
    const previousResume = application.resume?.filename;
    applyDraft(application, raw, req);

    const errors = validateAnswers(application.toObject(), Boolean(application.resume?.filename));
    if (Object.keys(errors).length > 0) {
        await application.save();
        await User.updateOne({ _id: req.user._id }, { application: application._id });
        if (req.file && previousResume) await removeFile(previousResume);
        return res.status(400).json({
            message: "Please fix the highlighted questions before submitting.",
            errors
        });
    }

    application.status = "submitted";
    application.submittedAt = new Date();
    await application.save();
    await User.updateOne({ _id: req.user._id }, { application: application._id });
    if (req.file && previousResume) await removeFile(previousResume);

    res.json({ application: toApplicantView(application) });

    void sendMailSafely({
        to: req.user.email,
        subject: "We received your ElleHacks 2027 application",
        text:
            `Hi ${application.preferredFirstName || application.firstName},\n\n` +
            `Thanks for applying to ElleHacks 2027! Your application has been submitted. ` +
            `You can sign in at any time to check your application status.\n\n` +
            `— The ElleHacks Team`
    });
});

module.exports = router;
