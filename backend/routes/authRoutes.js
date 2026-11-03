const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const Application = require("../models/applicationModel");
const { signToken, requireAuth } = require("../middleware/auth");
const { sendMailSafely } = require("../utils/mailer");

const router = express.Router();

const MIN_PASSWORD_LENGTH = 8;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const authResponse = (user) => ({ token: signToken(user), user: user.toPublic() });

router.post("/signup", async (req, res) => {
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (!EMAIL_PATTERN.test(email)) {
        return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
        });
    }
    if (await User.exists({ email })) {
        return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10)
    });

    res.status(201).json(authResponse(user));
});

router.post("/login", async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    const user = email && (await User.findOne({ email }).select("+password"));
    if (!user || !password || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json(authResponse(user));
});

router.get("/me", requireAuth, async (req, res) => {
    const application = await Application.findOne({ user: req.user._id }).select("status");
    res.json({
        user: req.user.toPublic(),
        applicationStatus: application?.status || null
    });
});

// Always responds the same way so it can't be used to check which emails have accounts
router.post("/forgot-password", async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const user = email && (await User.findOne({ email }));

    if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = hashToken(token);
        user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        await sendMailSafely({
            to: user.email,
            subject: "Reset your ElleHacks 2027 password",
            text:
                `Hi ${user.firstName},\n\n` +
                `Use the link below to reset your password. It expires in 1 hour.\n\n` +
                `${clientUrl}/reset-password?token=${token}\n\n` +
                `If you didn't request this, you can ignore this email.`
        });
    }

    res.json({
        message: "If an account exists for that email, a password reset link has been sent."
    });
});

router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
        });
    }

    const user = token && (await User.findOne({
        resetPasswordToken: hashToken(token),
        resetPasswordExpires: { $gt: new Date() }
    }));
    if (!user) {
        return res.status(400).json({ message: "This reset link is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Back-date by a second so the token issued below is still valid
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save();

    res.json(authResponse(user));
});

module.exports = router;
