const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");
const Application = require("../models/applicationModel");
const { signToken, requireAuth } = require("../middleware/auth");

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authResponse = (user) => ({ token: signToken(user), user: user.toPublic() });

router.post("/google", async (req, res) => {
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
        user = new User({ firstName, lastName, email, googleId: payload.sub });
    } else if (user.googleId && user.googleId !== payload.sub) {
        return res.status(409).json({ message: "This email is linked to a different Google account." });
    } else {
        user.googleId = payload.sub;
        if (!user.firstName && payload.given_name) user.firstName = payload.given_name.trim();
        if (!user.lastName && payload.family_name) user.lastName = payload.family_name.trim();
    }

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
