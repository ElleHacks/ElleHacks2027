const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  marginalizedGenderAcknowledgement: Boolean,
  firstName: String,
  lastName: String,
  preferredFirstName: String,
  pronouns: String,
  email: String,
  phone: String,
  age: Number,
  country: String,
  otherCountry: String,
  province: String,
  city: String,
  disability: String,
  indigenousIdentity: String,
  ethnicity: [String],
  otherEthnicity: String,
  studyLevel: String,
  school: String,
  graduationDate: String,
  fieldOfStudy: String,
  hackathonCount: Number,
  attendedElleHacks: String,
  yorkStudentNumber: String,
  yorkEmail: String,
  shareWithSponsors: String,
  linkedin: String,
  github: String,
  dietaryRestrictions: [String],
  otherDietary: String,
  tshirtSize: String,
  whyElleHacks: String,
  goals: String,
  projectStory: String,
  inPersonAcknowledgement: Boolean,
  overnightAccommodation: String,
  codeOfConduct: Boolean,
  mlhAuthorization: Boolean,
  mlhEmails: Boolean,
  additionalInfo: String,
  resume: {
    filename: String,
    originalName: String,
    size: Number,
    uploadedAt: Date
  },
  status: {
    type: String,
    enum: ["incomplete", "submitted", "accepted", "waitlisted", "rejected"],
    default: "incomplete"
  },
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  decisionNotifiedAt: Date,
  decisionEmailStatus: { type: String, enum: ["queued", "sent", "failed"] }
}, { timestamps: true });

applicationSchema.statics.APPLICATION_STATUSES = [
  "incomplete",
  "submitted",
  "accepted",
  "waitlisted",
  "rejected"
];

applicationSchema.statics.ADMIN_APPLICATION_STATUSES = [
  "submitted",
  "accepted",
  "waitlisted",
  "rejected"
];

module.exports = mongoose.model("Application", applicationSchema);
