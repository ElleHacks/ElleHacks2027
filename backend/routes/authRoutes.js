const express = require("express");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const User = require("../models/userModel");
const Application = require("../models/applicationModel");
const { signToken, requireAuth } = require("../middleware/auth");
const { sendMailSafely } = require("../utils/mailer");

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const verificationTokenLifetime = 24 * 60 * 60 * 1000;
const resetTokenLifetime = 60 * 60 * 1000;
const passwordHashRounds = 12;

const credentialsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many sign-in attempts. Please try again later." }
});
const emailActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many email requests. Please try again later." }
});

const normalizeEmail = (email) => email.trim().toLowerCase();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const createToken = () => crypto.randomBytes(32).toString("hex");
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const frontendUrl = () => (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
const validatePassword = (password) =>
    typeof password === "string" &&
    Buffer.byteLength(password, "utf8") >= 12 &&
    Buffer.byteLength(password, "utf8") <= 72;

const authResponse = (user) => ({ token: signToken(user), user: user.toPublic() });
const sendVerificationEmail = (user, token) => sendMailSafely({
    to: user.email,
    subject: "Verify your ElleHacks 2027 account",
    text:
        `Hi ${user.firstName},\n\n` +
        `Verify your email address to finish creating your ElleHacks 2027 account:\n` +
        `${frontendUrl()}/verify-email?token=${token}\n\n` +
        "This link expires in 24 hours. If you did not create this account, you can ignore this email."
});

router.post("/signup", credentialsLimiter, async (req, res) => {
    const { firstName, lastName, password, confirmPassword } = req.body;
    const email = typeof req.body.email === "string" ? normalizeEmail(req.body.email) : "";

    if (
        typeof firstName !== "string" ||
        !firstName.trim() ||
        typeof lastName !== "string" ||
        !lastName.trim() ||
        !isValidEmail(email)
    ) {
        return res.status(400).json({ message: "Enter your first name, last name, and a valid email address." });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ message: "Password must be at least 12 characters and no more than 72 bytes." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }
    if (await User.exists({ email })) {
        return res.status(409).json({
            message: "An account with this email already exists. Sign in with Google or use Forgot password to set a password."
        });
    }

    const token = createToken();
    const user = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        passwordHash: await bcrypt.hash(password, passwordHashRounds),
        emailVerificationTokenHash: hashToken(token),
        emailVerificationTokenExpiresAt: new Date(Date.now() + verificationTokenLifetime)
    });

    try {
        await user.save();
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists. Sign in with Google or use Forgot password to set a password."
            });
        }
        throw error;
    }

    const emailSent = await sendVerificationEmail(user, token);
    if (!emailSent) {
        return res.status(503).json({
            message: "Your account was created, but the verification email could not be sent. Please request a new verification email."
        });
    }

    res.status(201).json({ message: "Check your email for a verification link to finish creating your account." });
});

router.post("/login", credentialsLimiter, async (req, res) => {
    const { password } = req.body;
    const email = typeof req.body.email === "string" ? normalizeEmail(req.body.email) : "";
    if (!isValidEmail(email) || typeof password !== "string") {
        return res.status(400).json({ message: "Enter a valid email address and password." });
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user?.passwordHash) {
        return res.status(401).json({ message: "Email or password is incorrect." });
    }
    if (!(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: "Email or password is incorrect." });
    }
    if (!user.emailVerifiedAt) {
        return res.status(403).json({ message: "Please verify your email before signing in. You can request a new verification link." });
    }

    res.json(authResponse(user));
});

router.post("/verify-email", emailActionLimiter, async (req, res) => {
    const { token } = req.body;
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
        return res.status(400).json({ message: "This verification link is invalid or has expired." });
    }

    const result = await User.updateOne(
        {
            emailVerificationTokenHash: hashToken(token),
            emailVerificationTokenExpiresAt: { $gt: new Date() },
            emailVerifiedAt: null
        },
        {
            $set: { emailVerifiedAt: new Date() },
            $unset: { emailVerificationTokenHash: 1, emailVerificationTokenExpiresAt: 1 }
        }
    );
    if (!result.modifiedCount) {
        return res.status(400).json({ message: "This verification link is invalid or has expired." });
    }

    res.json({ message: "Your email is verified. You can now sign in." });
});

router.post("/resend-verification", emailActionLimiter, async (req, res) => {
    const email = typeof req.body.email === "string" ? normalizeEmail(req.body.email) : "";
    const genericMessage = "If an unverified account exists for that email, a verification link has been sent.";
    if (!isValidEmail(email)) return res.json({ message: genericMessage });

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user?.passwordHash || user.emailVerifiedAt) return res.json({ message: genericMessage });

    const token = createToken();
    user.emailVerificationTokenHash = hashToken(token);
    user.emailVerificationTokenExpiresAt = new Date(Date.now() + verificationTokenLifetime);
    await user.save();

    await sendVerificationEmail(user, token);
    res.json({ message: genericMessage });
});

router.post("/forgot-password", emailActionLimiter, async (req, res) => {
    const email = typeof req.body.email === "string" ? normalizeEmail(req.body.email) : "";
    const genericMessage = "If a verified account exists for that email, password setup or reset instructions have been sent.";
    if (!isValidEmail(email)) return res.json({ message: genericMessage });

    const user = await User.findOne({ email, emailVerifiedAt: { $ne: null } });
    if (!user) return res.json({ message: genericMessage });

    const token = createToken();
    user.passwordResetTokenHash = hashToken(token);
    user.passwordResetTokenExpiresAt = new Date(Date.now() + resetTokenLifetime);
    await user.save();

    await sendMailSafely({
        to: user.email,
        subject: "Reset your ElleHacks 2027 password",
        text:
            `Hi ${user.firstName},\n\n` +
            `Use this link to reset your ElleHacks 2027 password:\n` +
            `${frontendUrl()}/reset-password?token=${token}\n\n` +
            "This link expires in 1 hour. If you did not request a password reset, you can ignore this email."
    });
    res.json({ message: genericMessage });
});

router.post("/reset-password", emailActionLimiter, async (req, res) => {
    const { token, password, confirmPassword } = req.body;
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
        return res.status(400).json({ message: "This password reset link is invalid or has expired." });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ message: "Password must be at least 12 characters and no more than 72 bytes." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    const passwordHash = await bcrypt.hash(password, passwordHashRounds);
    const result = await User.updateOne(
        {
            passwordResetTokenHash: hashToken(token),
            passwordResetTokenExpiresAt: { $gt: new Date() },
            emailVerifiedAt: { $ne: null }
        },
        {
            $set: { passwordHash },
            $unset: { passwordResetTokenHash: 1, passwordResetTokenExpiresAt: 1 }
        }
    );
    if (!result.modifiedCount) {
        return res.status(400).json({ message: "This password reset link is invalid or has expired." });
    }

    res.json({ message: "Your password has been reset. You can now sign in." });
});

router.post("/google", credentialsLimiter, async (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(503).json({ message: "Google sign-in is not configured." });
    }

    const { credential, mode } = req.body;
    if (!credential || !["signup", "login"].includes(mode)) {
        return res.status(400).json({ message: "A Google credential and valid sign-in mode are required." });
    }

    let payload;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
    } catch {
        return res.status(401).json({ message: "Google sign-in could not be verified. Please try again." });
    }

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        return res.status(401).json({ message: "Use a Google account with a verified email address." });
    }

    const email = payload.email.trim().toLowerCase();
    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });
    if (!user && mode === "login") {
        return res.status(404).json({ message: "No account found. Please create an account first." });
    }

    if (!user) {
        const [firstNameFallback, ...lastNameFallback] = (payload.name || "").trim().split(/\s+/);
        const firstName = payload.given_name?.trim() || firstNameFallback;
        const lastName = payload.family_name?.trim() || lastNameFallback.join(" ");
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "Your Google profile must include your first and last name." });
        }
        user = new User({ firstName, lastName, email, googleId: payload.sub, emailVerifiedAt: new Date() });
    } else if (user.googleId && user.googleId !== payload.sub) {
        return res.status(409).json({ message: "This email is linked to a different Google account." });
    } else {
        user.googleId = payload.sub;
        if (!user.firstName && payload.given_name) user.firstName = payload.given_name.trim();
        if (!user.lastName && payload.family_name) user.lastName = payload.family_name.trim();
    }
    user.emailVerifiedAt = user.emailVerifiedAt || new Date();

    if (process.env.ADMIN_EMAIL?.trim().toLowerCase() === email) {
        user.role = "admin";
    }

    await user.save();
    res.status(200).json(authResponse(user));
});

router.get("/me", requireAuth, async (req, res) => {
    const application = await Application.findOne({ user: req.user._id }).select("status");
    res.json({
        user: req.user.toPublic(),
        applicationStatus: application?.status || null
    });
});

module.exports = router;
