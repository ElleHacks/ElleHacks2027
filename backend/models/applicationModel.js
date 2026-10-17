const mongoose = require("mongoose");
const { FIELD_TYPES } = require("../config/applicationFields");

const APPLICATION_STATUSES = ["incomplete", "submitted", "accepted", "waitlisted", "rejected"];

const answerDefinitions = Object.fromEntries(
    Object.entries(FIELD_TYPES).map(([field, type]) => [field, { type }])
);

const applicationSchema = new mongoose.Schema(
    {
        // Each applicant account has exactly one application
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        ...answerDefinitions,

        resume: {
            filename: String, // name on disk in uploads/resumes
            originalName: String,
            size: Number,
            uploadedAt: Date
        },

        status: {
            type: String,
            enum: APPLICATION_STATUSES,
            default: "incomplete"
        },
        submittedAt: Date,

        // Admin review
        reviewedAt: Date,
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        decisionNotifiedAt: Date
    },
    { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
module.exports.APPLICATION_STATUSES = APPLICATION_STATUSES;
