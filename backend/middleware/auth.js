const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

// Requires a valid "Authorization: Bearer <token>" header and loads req.user
const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Please sign in." });
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }

    const user = await User.findById(payload.id);
    const changedAt = user?.passwordChangedAt?.getTime() / 1000;
    if (!user || (changedAt && payload.iat < Math.floor(changedAt))) {
        return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }

    req.user = user;
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required." });
    }
    next();
};

module.exports = { signToken, requireAuth, requireAdmin };
