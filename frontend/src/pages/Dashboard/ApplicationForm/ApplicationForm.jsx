import { useEffect, useState } from "react";
import Field from "../../../components/Field";
import API, { getErrorMessage } from "../../../utils/api";
import {
  COUNTRIES,
  DIETARY_RESTRICTIONS,
  ETHNICITIES,
  FIELD_ORDER,
  MAX_RESUME_BYTES,
  PROVINCES,
  STUDY_LEVELS,
  TSHIRT_SIZES,
  YES_NO,
  YES_NO_PREFER_NOT,
  initialAnswers,
  toFormAnswers,
  validateApplication,
} from "./applicationQuestions";
import "./ApplicationForm.css";

const STATUS_MESSAGES = {
  incomplete: "Not submitted yet. Your progress is saved whenever you click “Save progress”.",
  submitted: "Submitted! The ElleHacks team is reviewing your application. Check back here for updates.",
  accepted: "Congratulations, you've been accepted to ElleHacks 2027! Your hacker dashboard is coming soon.",
  waitlisted: "You're on the waitlist. We'll email you if a spot opens up.",
  rejected: "Unfortunately we weren't able to offer you a spot this year. Thank you for applying!",
};

const STATUS_LABELS = {
  incomplete: "Incomplete",
  submitted: "Submitted",
  accepted: "Accepted",
  waitlisted: "Waitlisted",
  rejected: "Rejected",
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" });

function ApplicationForm() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [status, setStatus] = useState("incomplete");
  const [savedResume, setSavedResume] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [appWindow, setWindow] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const applyApplication = (application) => {
    setAnswers(toFormAnswers(application));
    setStatus(application.status);
    setSavedResume(application.resume?.filename ? application.resume : null);
    setResumeFile(null);
    setLastSaved(application.updatedAt || null);
    setDirty(false);
  };

  useEffect(() => {
    API.get("/applications/me")
      .then((res) => {
        applyApplication(res.data.application);
        setWindow(res.data.window);
      })
      .catch((err) => setLoadError(getErrorMessage(err, "Could not load your application.")))
      .finally(() => setLoading(false));
  }, []);

  // Warn before leaving the page with unsaved answers
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (loading) return <p>Loading your application…</p>;
  if (loadError) return <p className="error">{loadError}</p>;

  const isOpen = appWindow?.acceptingApplications;
  const editable = status === "incomplete" && isOpen;

  const update = (name, value) => {
    setAnswers((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setDirty(true);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    update(name, type === "checkbox" ? checked : value);
  };

  const toggleInList = (name, value) => (e) => {
    const list = answers[name];
    update(name, e.target.checked ? [...list, value] : list.filter((item) => item !== value));
  };

  const handleResume = (e) => {
    const file = e.target.files?.[0];
    setErrors((current) => ({ ...current, resume: undefined }));
    if (!file) return;

    if (file.type !== "application/pdf") {
      e.target.value = "";
      return setErrors((current) => ({ ...current, resume: "Resume must be a PDF." }));
    }
    if (file.size > MAX_RESUME_BYTES) {
      e.target.value = "";
      return setErrors((current) => ({ ...current, resume: "Resume must be 5 MB or smaller." }));
    }
    setResumeFile(file);
    setDirty(true);
    setMessage("");
  };

  const buildPayload = () => {
    const data = new FormData();
    data.append("answers", JSON.stringify(answers));
    if (resumeFile) data.append("resume", resumeFile);
    return data;
  };

  const scrollToFirstError = (fieldErrors) => {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSave = async () => {
    setBusy(true);
    setMessage("");
    try {
      const res = await API.put("/applications/me", buildPayload());
      applyApplication(res.data.application);
      setMessage("Progress saved. You can sign out and come back any time before the deadline.");
    } catch (err) {
      setMessage(getErrorMessage(err, "Could not save your progress."));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const fieldErrors = validateApplication(answers, Boolean(resumeFile || savedResume));
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setMessage("Please fix the highlighted questions before submitting.");
      scrollToFirstError(fieldErrors);
      return;
    }

    setBusy(true);
    try {
      const res = await API.post("/applications/me/submit", buildPayload());
      applyApplication(res.data.application);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
        scrollToFirstError(serverErrors);
      }
      setMessage(getErrorMessage(err, "Could not submit your application."));
    } finally {
      setBusy(false);
    }
  };

  const describedBy = (name) => (errors[name] ? `${name}-error` : undefined);

  const textInput = (name, label, { type = "text", required = false, hint, ...props } = {}) => (
    <Field label={label} name={name} required={required} error={errors[name]} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        value={answers[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={describedBy(name)}
        {...props}
      />
    </Field>
  );

  const textArea = (name, label, { required = false, hint } = {}) => (
    <Field label={label} name={name} required={required} error={errors[name]} hint={hint}>
      <textarea
        id={name}
        name={name}
        rows={6}
        maxLength={3000}
        value={answers[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={describedBy(name)}
      />
    </Field>
  );

  const select = (name, label, options, { required = false, hint } = {}) => (
    <Field label={label} name={name} required={required} error={errors[name]} hint={hint}>
      <select
        id={name}
        name={name}
        value={answers[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={describedBy(name)}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </Field>
  );

  const radios = (name, label, options, { required = false, hint } = {}) => (
    <Field as="fieldset" label={label} name={name} required={required} error={errors[name]} hint={hint}>
      {options.map((option) => {
        const { value, label: optionLabel } = typeof option === "string" ? { value: option, label: option } : option;
        return (
          <label key={value} className="choice">
            <input
              type="radio"
              name={name}
              value={value}
              checked={answers[name] === value}
              onChange={handleChange}
            />
            {optionLabel}
          </label>
        );
      })}
    </Field>
  );

  const checkboxes = (name, label, options, { required = false, hint } = {}) => (
    <Field as="fieldset" label={label} name={name} required={required} error={errors[name]} hint={hint}>
      {options.map(({ value, label: optionLabel }) => (
        <label key={value} className="choice">
          <input
            type="checkbox"
            checked={answers[name].includes(value)}
            onChange={toggleInList(name, value)}
          />
          {optionLabel}
        </label>
      ))}
    </Field>
  );

  const agreement = (name, children, { required = false } = {}) => (
    <div className="field" id={`field-${name}`}>
      <label className="choice">
        <input type="checkbox" name={name} checked={answers[name]} onChange={handleChange} />
        <span>
          {children}
          {required && <span className="required"> *</span>}
        </span>
      </label>
      {errors[name] && <p className="error" id={`${name}-error`} role="alert">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="application">
      <h1>ElleHacks 2027 Hacker Application</h1>

      <div className="notice" role="status">
        <p>
          <strong>Application status:</strong> {STATUS_LABELS[status]}
        </p>
        <p>{STATUS_MESSAGES[status]}</p>
        {appWindow?.applicationDeadline && (
          <p>
            <strong>Application deadline:</strong> {formatDateTime(appWindow.applicationDeadline)}
          </p>
        )}
        {status === "incomplete" && !isOpen && (
          <p className="error">Applications are currently closed.</p>
        )}
        {status === "incomplete" && lastSaved && (
          <p className="muted">Last saved {formatDateTime(lastSaved)}</p>
        )}
      </div>

      {status === "incomplete" && (
        <section className="intro">
          <p>
            This form will only take about 10 minutes of your time. Keep your resume close by! You
            can save your progress and come back later. Questions marked with
            <span className="required"> *</span> are required.
          </p>
          <h2>What is ElleHacks?</h2>
          <p>
            Hello! We're ElleHacks, one of Canada's largest hackathons for women &amp;
            gender-diverse students! This event takes place from Friday afternoon to Sunday evening
            at York University's Keele campus in Toronto, Ontario. We have overnight accommodations,
            but you are not required to stay overnight.
          </p>
          <h3>What's a hackathon?</h3>
          <p>
            A hackathon is a competition where students work together to design solutions for a
            given challenge. You'll meet new friends, network with recruiters, and pick up cool
            skills through workshops, speaker sessions, and games.
          </p>
          <h3>Who can sign up?</h3>
          <p>
            Women &amp; gender-diverse students in high school or post-secondary who study or live
            in North America!
          </p>
          <h3>What if I can't code or I'm not a STEM student?</h3>
          <p>That's okay! Many participants are total beginners. We'll be there to help you along the way.</p>
          <h3>Do I need a team?</h3>
          <p>
            You're welcome to compete in teams of 1–4 students. Don't have a team? We'll help you
            find one on the first day!
          </p>
        </section>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="form-body" disabled={!editable || busy}>
          <section>
            {agreement(
              "marginalizedGenderAcknowledgement",
              "I understand that this is an event for marginalized gender groups. Preference will be given to these groups when selecting accepted hackers.",
              { required: true },
            )}
          </section>

          <section>
            <h2>Participant Info</h2>
            <div className="field-grid">
              {textInput("firstName", "First name", { required: true, autoComplete: "given-name" })}
              {textInput("lastName", "Last name", { required: true, autoComplete: "family-name" })}
              {textInput("preferredFirstName", "Preferred first name")}
              {textInput("pronouns", "Pronouns", { required: true, placeholder: "e.g. she/her" })}
              {textInput("email", "Email address", { type: "email", required: true, autoComplete: "email" })}
              {textInput("phone", "Phone number", { type: "tel", required: true, autoComplete: "tel" })}
              {textInput("age", "What will be your age by January 23, 2027?", {
                type: "number",
                required: true,
                min: 13,
                inputMode: "numeric",
              })}
            </div>
          </section>

          <section>
            <h2>Country Background</h2>
            <div className="field-grid">
              {select("country", "Which country do you reside in?", COUNTRIES, { required: true })}
              {answers.country === "Other" &&
                textInput("otherCountry", "Please specify your country", { required: true })}
              {answers.country === "Canada"
                ? select("province", "Province/territory", PROVINCES, { required: true })
                : textInput("province", "Province/territory/state", { required: true })}
              {textInput("city", "City/town (for Ontario residents)", {
                required: answers.province === "Ontario",
              })}
            </div>
            {radios("disability", "Do you identify as a person with a disability?", YES_NO_PREFER_NOT, {
              hint:
                "According to the Accessible Canada Act, disability means \"any impairment, including a physical, mental, intellectual, cognitive, learning, communication or sensory impairment—or a functional limitation—whether permanent, temporary or episodic in nature, or evident or not, that in interaction with a barrier, hinders a person's full and equal participation in society\".",
            })}
            {radios(
              "indigenousIdentity",
              "Do you identify as First Nations, Inuk/Inuit and/or Métis?",
              YES_NO_PREFER_NOT,
              { required: true },
            )}
            {checkboxes(
              "ethnicity",
              "Which ethnic/racial categories best describe how you self-identify?",
              ETHNICITIES,
              { hint: "Select all that apply." },
            )}
            {answers.ethnicity.includes("Other") &&
              textInput("otherEthnicity", "Please specify", { required: true })}
          </section>

          <section>
            <h2>Educational Background &amp; Interests</h2>
            <div className="field-grid">
              {select("studyLevel", "What is your current level of study?", STUDY_LEVELS, { required: true })}
              {textInput("school", "Which school do you attend?", { required: true })}
              {textInput("graduationDate", "Expected graduation date?", {
                type: "month",
                required: true,
                hint: "Month and year",
              })}
              {textInput("fieldOfStudy", "What is your field of study?", { required: true })}
              {textInput("hackathonCount", "How many hackathons have you previously attended?", {
                type: "number",
                required: true,
                min: 0,
                inputMode: "numeric",
              })}
            </div>
            {radios("attendedElleHacks", "Have you attended ElleHacks before?", YES_NO, { required: true })}
          </section>

          <section>
            <h2>YorkU Student Info</h2>
            <p className="muted">For York University students only.</p>
            <div className="field-grid">
              {textInput("yorkStudentNumber", "Please enter your student number", { inputMode: "numeric" })}
              {textInput("yorkEmail", "YorkU email", { type: "email" })}
            </div>
          </section>

          <section>
            <h2>Resume and Professional Links</h2>
            <Field
              label="Upload your resume here as LastName_FirstName.pdf"
              name="resume"
              required
              error={errors.resume}
              hint="PDF only, up to 5 MB. Example: Doe_Jane.pdf"
            >
              {savedResume && !resumeFile && (
                <p>
                  Uploaded: {savedResume.originalName}{" "}
                  <button type="button" className="link-button" onClick={downloadOwnResume}>
                    View
                  </button>
                </p>
              )}
              {resumeFile && <p>Selected: {resumeFile.name} (saved when you save or submit)</p>}
              <input
                id="resume"
                type="file"
                accept="application/pdf"
                onChange={handleResume}
                aria-describedby={describedBy("resume")}
              />
            </Field>
            {radios(
              "shareWithSponsors",
              "Can we share your resume and form responses with our sponsors for recruitment opportunities?",
              [
                { value: "Yes", label: "Yes, you can share this information with sponsors." },
                { value: "No", label: "No, you cannot share this information with sponsors." },
              ],
            )}
            <div className="field-grid">
              {textInput("linkedin", "If you have a LinkedIn / Portfolio link, you can provide the link here", { type: "url" })}
              {textInput("github", "If you have a GitHub account, you can provide the link here", { type: "url" })}
            </div>
          </section>

          <section>
            <h2>Event Logistics</h2>
            {checkboxes("dietaryRestrictions", "Dietary restrictions", DIETARY_RESTRICTIONS, {
              required: true,
              hint: "Select all that apply. If you have any allergies, please specify them below.",
            })}
            {answers.dietaryRestrictions.some((item) => item === "Other" || item === "Allergies") &&
              textInput("otherDietary", "Please specify your allergies / other dietary restrictions", { required: true })}
            {radios("tshirtSize", "T-shirt size (unisex)", TSHIRT_SIZES, { required: true })}
          </section>

          <section>
            <h2>Questions</h2>
            {textArea("whyElleHacks", "Why are you interested in participating in ElleHacks 2027?", { required: true })}
            {textArea("goals", "What do you hope to achieve during the hackathon?", { required: true })}
            {textArea(
              "projectStory",
              "Tell us about a project/assignment you worked on that you're proud of, or one that totally broke and taught you something anyway.",
              { required: true },
            )}
          </section>

          <section>
            <h2>Final Section</h2>
            {agreement(
              "inPersonAcknowledgement",
              "I confirm that I understand ElleHacks 2027 is an in-person event, taking place at York University (4700 Keele St, Toronto, ON M3J 1P3).",
              { required: true },
            )}
            {radios(
              "overnightAccommodation",
              "Will you require overnight accommodations? (i.e. a quiet place to sleep)",
              [
                { value: "Yes", label: "Yes, I will be staying overnight for some or all of ElleHacks." },
                { value: "No", label: "No, I will commute to and from the event each day." },
              ],
              { required: true },
            )}
            {agreement(
              "codeOfConduct",
              <>
                I have read and agree to the{" "}
                <a href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md" target="_blank" rel="noreferrer">
                  MLH Code of Conduct
                </a>.
              </>,
              { required: true },
            )}
            {agreement(
              "mlhAuthorization",
              <>
                I authorize you to share my application/registration information with Major League
                Hacking for event administration, ranking, and MLH administration in-line with the{" "}
                <a href="https://www.mlh.com/privacy" target="_blank" rel="noreferrer">MLH Privacy Policy</a>.
                I further agree to the terms of both the{" "}
                <a href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md" target="_blank" rel="noreferrer">
                  MLH Contest Terms and Conditions
                </a>{" "}
                and the{" "}
                <a href="https://www.mlh.com/privacy" target="_blank" rel="noreferrer">MLH Privacy Policy</a>.
              </>,
              { required: true },
            )}
            {agreement(
              "mlhEmails",
              "I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.",
            )}
            {textArea("additionalInfo", "Anything else you'd like us to know?", {
              hint: "If you have any accessibility requests or concerns, please let us know here.",
            })}
          </section>
        </fieldset>

        {message && <p className="notice" role="status">{message}</p>}

        {editable && (
          <div className="form-actions">
            <button type="button" onClick={handleSave} disabled={busy}>
              {busy ? "Saving…" : "Save progress"}
            </button>
            <button type="submit" disabled={busy}>
              Submit application
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

async function downloadOwnResume() {
  const res = await API.get("/applications/me/resume", { responseType: "blob" });
  window.open(URL.createObjectURL(res.data), "_blank");
}

export default ApplicationForm;
