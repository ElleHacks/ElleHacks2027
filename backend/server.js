const express = require("express");
const cors = require("cors");
const connectDB = require("./db.js");
const Application = require("./models/applicationModel");

const dotenv = require("dotenv")

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB()

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "ElleHacks Application System API is running!"
    });
});

app.get("/test-db", async (req, res) => {
    try {
        console.log("here")
        const application = await Application.create({
            name: "Test User",
            email: "test@example.com"
        });

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});