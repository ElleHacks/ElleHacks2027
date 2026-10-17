const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: ["applicant", "admin"],
            default: "applicant"
        },

        // Password reset: only a hash of the emailed token is stored
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpires: { type: Date, select: false },
        // Tokens issued before this are rejected (e.g. after a password reset)
        passwordChangedAt: { type: Date }
    },
    { timestamps: true }
);

userSchema.methods.toPublic = function () {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        role: this.role
    };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
