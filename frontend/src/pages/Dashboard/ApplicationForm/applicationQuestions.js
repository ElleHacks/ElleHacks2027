// Answer options, defaults and validation for the hacker application.
// Keep field names and rules in sync with backend/config/applicationFields.js

export const YES_NO = ["Yes", "No"];
export const YES_NO_PREFER_NOT = ["Yes", "No", "Prefer not to answer"];

export const COUNTRIES = ["Canada", "United States", "Other"];

export const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

export const ETHNICITIES = [
  { value: "Black", label: "Black [African, African-Canadian, Afro-Caribbean descent]" },
  { value: "East Asian", label: "East Asian [Chinese, Japanese, Korean, Taiwanese descent]" },
  { value: "Indigenous", label: "Indigenous [First Nations, Inuk/Inuit, Métis]" },
  { value: "Latin American", label: "Latin American [Hispanic or Latin American descent]" },
  {
    value: "Middle Eastern",
    label:
      "Middle Eastern [Arab, Persian, West Asian descent (e.g. Afghan, Egyptian, Iranian, Kurdish, Lebanese, Turkish)]",
  },
  {
    value: "South Asian",
    label:
      "South Asian [South Asian descent (e.g. Bangladeshi, Indian, Indo-Caribbean, Pakistani, Sri Lankan)]",
  },
  {
    value: "Southeast Asian",
    label:
      "Southeast Asian [Cambodian, Filipino, Indonesian, Thai, Vietnamese, or other Southeast Asian descent]",
  },
  { value: "Caucasian", label: "Caucasian [European descent]" },
  { value: "Prefer not to answer", label: "Prefer not to answer" },
  { value: "Other", label: "Other" },
];

export const PRONOUNS = ["she/her", "they/them", "he/him", "she/they", "he/they", "Prefer not to answer"];

export const GRADUATION_YEARS = ["2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"];

export const STUDY_LEVELS = ["High School", "Undergraduate", "Graduate", "Other"];

export const DIETARY_RESTRICTIONS = [
  { value: "None", label: "No, I do not have any dietary restrictions" },
  { value: "Halal", label: "Halal" },
  { value: "Kosher", label: "Kosher" },
  { value: "Vegetarian", label: "Vegetarian" },
  { value: "Vegan", label: "Vegan" },
  { value: "Gluten-Free", label: "Gluten-Free" },
  { value: "Dairy-Free", label: "Dairy-Free" },
  { value: "Allergies", label: "Allergies" },
  { value: "Other", label: "Other" },
];

export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const initialAnswers = {
  marginalizedGenderAcknowledgement: false,
  firstName: "",
  lastName: "",
  preferredFirstName: "",
  pronouns: "",
  email: "",
  phone: "",
  age: "",
  country: "",
  otherCountry: "",
  province: "",
  city: "",
  disability: "",
  indigenousIdentity: "",
  ethnicity: [],
  otherEthnicity: "",
  studyLevel: "",
  school: "",
  graduationDate: "",
  fieldOfStudy: "",
  hackathonCount: "",
  attendedElleHacks: "",
  yorkStudentNumber: "",
  yorkEmail: "",
  shareWithSponsors: "",
  linkedin: "",
  github: "",
  dietaryRestrictions: [],
  otherDietary: "",
  tshirtSize: "",
  whyElleHacks: "",
  goals: "",
  projectStory: "",
  inPersonAcknowledgement: false,
  overnightAccommodation: "",
  codeOfConduct: false,
  mlhAuthorization: false,
  mlhEmails: false,
  additionalInfo: "",
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
  "mlhAuthorization",
];

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

// One page per step; `fields` decides which errors block the Next button
export const STEPS = [
  { title: null, fields: ["marginalizedGenderAcknowledgement"] },
  {
    title: "Firstly, we would love to know more about you!",
    fields: ["firstName", "lastName", "preferredFirstName", "pronouns", "email", "phone", "age"],
  },
  {
    title: "What is your background?",
    fields: [
      "country",
      "otherCountry",
      "province",
      "city",
      "disability",
      "indigenousIdentity",
      "ethnicity",
      "otherEthnicity",
    ],
  },
  {
    title: "What is your educational background?",
    fields: ["studyLevel", "graduationDate", "school", "fieldOfStudy", "hackathonCount", "attendedElleHacks"],
  },
  { title: "YorkU Students Only", fields: ["yorkStudentNumber", "yorkEmail"] },
  { title: "Resume and Professional Links", fields: ["resume", "shareWithSponsors", "linkedin", "github"] },
  { title: "More about you :D", fields: ["dietaryRestrictions", "otherDietary", "tshirtSize"] },
  { title: "Tell us more about your hackathon background!", fields: ["whyElleHacks", "goals", "projectStory"] },
  {
    title: "Final Section",
    fields: [
      "inPersonAcknowledgement",
      "overnightAccommodation",
      "codeOfConduct",
      "mlhAuthorization",
      "mlhEmails",
      "additionalInfo",
    ],
  },
];

// Order fields appear on the page, used to scroll to the first error
export const FIELD_ORDER = STEPS.flatMap((step) => step.fields);

const isBlank = (value) =>
  value === undefined ||
  value === null ||
  value === false ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0);

// Only keep server fields we know about, filling gaps with defaults
export function toFormAnswers(application = {}) {
  const answers = { ...initialAnswers };
  for (const field of Object.keys(initialAnswers)) {
    if (application[field] !== undefined && application[field] !== null) {
      answers[field] = application[field];
    }
  }
  return answers;
}

// Returns { field: message } for every problem; empty object means valid
export function validateApplication(answers, hasResume) {
  const errors = {};
  const required = (field) => {
    if (isBlank(answers[field])) errors[field] = "This question is required.";
  };

  REQUIRED_FIELDS.forEach(required);

  if (answers.country === "Other") required("otherCountry");
  if (answers.ethnicity.includes("Other")) required("otherEthnicity");
  if (answers.dietaryRestrictions.some((item) => item === "Other" || item === "Allergies")) {
    required("otherDietary");
  }

  if (answers.email && !EMAIL_PATTERN.test(answers.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (answers.yorkEmail && !EMAIL_PATTERN.test(answers.yorkEmail)) {
    errors.yorkEmail = "Enter a valid email address.";
  }
  if (answers.age !== "" && (Number(answers.age) < 13 || Number(answers.age) > 120)) {
    errors.age = "Enter a valid age.";
  }
  if (answers.hackathonCount !== "" && Number(answers.hackathonCount) < 0) {
    errors.hackathonCount = "Enter 0 or more.";
  }
  if (!hasResume) {
    errors.resume = "Please upload your resume as a PDF.";
  }

  return errors;
}
