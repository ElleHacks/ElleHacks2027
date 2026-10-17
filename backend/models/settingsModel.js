const mongoose = require("mongoose");

// Single settings document controlling whether applications are accepted
const settingsSchema = new mongoose.Schema(
    {
        key: { type: String, default: "global", unique: true },
        applicationsOpen: { type: Boolean, default: true },
        // Applications close automatically after this time (optional)
        applicationDeadline: { type: Date, default: null }
    },
    { timestamps: true }
);

settingsSchema.statics.get = async function () {
    return this.findOneAndUpdate(
        { key: "global" },
        { $setOnInsert: { key: "global" } },
        { upsert: true, returnDocument: "after" }
    );
};

settingsSchema.methods.isAcceptingApplications = function () {
    if (!this.applicationsOpen) return false;
    return !this.applicationDeadline || Date.now() < this.applicationDeadline.getTime();
};

settingsSchema.methods.toPublic = function () {
    return {
        applicationsOpen: this.applicationsOpen,
        applicationDeadline: this.applicationDeadline,
        acceptingApplications: this.isAcceptingApplications()
    };
};

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
