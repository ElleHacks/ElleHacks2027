export const STATUS_LABELS = {
  incomplete: "Incomplete",
  submitted: "Submitted",
  accepted: "Accepted",
  waitlisted: "Waitlisted",
  rejected: "Rejected",
};

// Readable labels for the admin application view, in display order
export const ANSWER_SECTIONS = [
  {
    title: "Participant Info",
    fields: {
      marginalizedGenderAcknowledgement: "Understands event is for marginalized gender groups",
      firstName: "First name",
      lastName: "Last name",
      preferredFirstName: "Preferred first name",
      pronouns: "Pronouns",
      email: "Email",
      phone: "Phone",
      age: "Age by January 23, 2027",
    },
  },
  {
    title: "Country Background",
    fields: {
      country: "Country",
      otherCountry: "Country (other)",
      province: "Province/territory",
      city: "City/town",
      disability: "Person with a disability",
      indigenousIdentity: "First Nations, Inuk/Inuit and/or Métis",
      ethnicity: "Ethnic/racial categories",
      otherEthnicity: "Ethnicity (other)",
    },
  },
  {
    title: "Educational Background & Interests",
    fields: {
      studyLevel: "Level of study",
      school: "School",
      graduationDate: "Expected graduation",
      fieldOfStudy: "Field of study",
      hackathonCount: "Hackathons attended",
      attendedElleHacks: "Attended ElleHacks before",
    },
  },
  {
    title: "YorkU Student Info",
    fields: {
      yorkStudentNumber: "Student number",
      yorkEmail: "YorkU email",
    },
  },
  {
    title: "Resume and Professional Links",
    fields: {
      shareWithSponsors: "Share with sponsors",
      linkedin: "LinkedIn / Portfolio",
      github: "GitHub",
    },
  },
  {
    title: "Event Logistics",
    fields: {
      dietaryRestrictions: "Dietary restrictions",
      otherDietary: "Allergies / other dietary",
      tshirtSize: "T-shirt size",
    },
  },
  {
    title: "Questions",
    fields: {
      whyElleHacks: "Why are you interested in participating in ElleHacks 2027?",
      goals: "What do you hope to achieve during the hackathon?",
      projectStory: "A project you're proud of, or one that broke and taught you something",
    },
  },
  {
    title: "Final Section",
    fields: {
      inPersonAcknowledgement: "Confirms in-person at York University",
      overnightAccommodation: "Requires overnight accommodations",
      codeOfConduct: "Agrees to MLH Code of Conduct",
      mlhAuthorization: "MLH data sharing authorization",
      mlhEmails: "MLH emails opt-in",
      additionalInfo: "Anything else",
    },
  },
];
