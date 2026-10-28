const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ["applicant", "admin"], default: "applicant" },
  application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
}, { timestamps: true });

userSchema.virtual("applicationStatus", {
  ref: "Application",
  localField: "application",
  foreignField: "_id",
  justOne: true,
  options: { select: "status" }
});

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    role: this.role,
    application: this.application || null
  };
};

module.exports = mongoose.model("User", userSchema);
