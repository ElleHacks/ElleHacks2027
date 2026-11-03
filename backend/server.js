const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./db.js");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");

if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing from .env");
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

connectDB()

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
// Express 5 leaves req.body undefined when there is no body
app.use((req, res, next) => {
    req.body ??= {};
    next();
});

app.get("/", (req, res) => {
    res.json({
        message: "ElleHacks Application System API is running!"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? "Resume must be 5 MB or smaller."
            : "Invalid file upload.";
        return res.status(400).json({ message });
    }
    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }

    console.error("❌ Error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
