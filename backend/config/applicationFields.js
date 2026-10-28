// Single source of truth for which answers the backend accepts and requires.
// Keep in sync with frontend/src/pages/Dashboard/ApplicationForm/applicationQuestions.js

const FIELD_TYPES = {
    marginalizedGenderAcknowledgement: Boolean,

    // Participant info
    firstName: String,
    lastName: String,
    preferredFirstName: String,
    pronouns: String,
    email: String,
    phone: String,
    age: Number,

    // Country background
    country: String,
    otherCountry: String,
    province: String,
    city: String,
    disability: String,
    indigenousIdentity: String,
    ethnicity: [String],
    otherEthnicity: String,

    // Educational background & interests
    studyLevel: String,
    school: String,
    graduationDate: String,
    fieldOfStudy: String,
    hackathonCount: Number,
    attendedElleHacks: String,

    // YorkU student info
    yorkStudentNumber: String,
    yorkEmail: String,

    // Resume and professional links (the resume file itself is stored separately)
    shareWithSponsors: String,
    linkedin: String,
    github: String,

    // Event logistics
    dietaryRestrictions: [String],
    otherDietary: String,
    tshirtSize: String,

    // Questions
    whyElleHacks: String,
    goals: String,
    projectStory: String,

    // Final section
    inPersonAcknowledgement: Boolean,
    overnightAccommodation: String,
    codeOfConduct: Boolean,
    mlhAuthorization: Boolean,
    mlhEmails: Boolean,
    additionalInfo: String
};

const REQUIRED_FIELDS = [
    "marginalizedGenderAcknowledgement",
    "firstName",
    "lastName",
    "pronouns",
    "email",
    "phone",
    "age",
    "country",
    "province",
    "disability",
    "indigenousIdentity",
    "studyLevel",
    "school",
    "graduationDate",
    "fieldOfStudy",
    "hackathonCount",
    "attendedElleHacks",
    "shareWithSponsors",
    "dietaryRestrictions",
    "tshirtSize",
    "whyElleHacks",
    "goals",
    "projectStory",
    "inPersonAcknowledgement",
    "overnightAccommodation",
    "codeOfConduct",
    "mlhAuthorization"
];

const MAX_TEXT_LENGTH = 3000;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const toBoolean = (value) => value === true || value === "true";

// Keeps only known fields and coerces them to the right type
const sanitizeAnswers = (raw = {}) => {
    const answers = {};

    for (const [field, type] of Object.entries(FIELD_TYPES)) {
        if (!(field in raw)) continue;
        const value = raw[field];

        if (Array.isArray(type)) {
            answers[field] = (Array.isArray(value) ? value : [value])
                .filter((item) => typeof item === "string" && item.trim())
                .map((item) => item.trim().slice(0, MAX_TEXT_LENGTH));
        } else if (type === Boolean) {
            answers[field] = toBoolean(value);
        } else if (type === Number) {
            const number = Number(value);
            answers[field] = value === "" || value === null || Number.isNaN(number) ? null : number;
        } else {
            answers[field] = value == null ? "" : String(value).trim().slice(0, MAX_TEXT_LENGTH);
        }
    }

    return answers;
};

const isBlank = (value) =>
    value === undefined ||
    value === null ||
    value === "" ||
    value === false ||
    (Array.isArray(value) && value.length === 0);

// Returns { field: message } for every problem; empty object means valid
const validateAnswers = (answers, hasResume) => {
    const errors = {};
    const required = (field) => {
        if (isBlank(answers[field])) errors[field] = "This question is required.";
    };

    REQUIRED_FIELDS.forEach(required);

    if (answers.country === "Other") required("otherCountry");
    if (answers.ethnicity?.includes("Other")) required("otherEthnicity");
    if (answers.dietaryRestrictions?.some((item) => item === "Other" || item === "Allergies")) {
        required("otherDietary");
    }

    if (answers.email && !EMAIL_PATTERN.test(answers.email)) {
        errors.email = "Enter a valid email address.";
    }
    if (answers.yorkEmail && !EMAIL_PATTERN.test(answers.yorkEmail)) {
        errors.yorkEmail = "Enter a valid email address.";
    }
    if (answers.age != null && (answers.age < 13 || answers.age > 120)) {
        errors.age = "Enter a valid age.";
    }
    if (answers.hackathonCount != null && answers.hackathonCount < 0) {
        errors.hackathonCount = "Enter 0 or more.";
    }
    if (!hasResume) {
        errors.resume = "Please upload your resume as a PDF.";
    }

    return errors;
};

module.exports = { FIELD_TYPES, REQUIRED_FIELDS, sanitizeAnswers, validateAnswers };
