import { useEffect, useState } from "react";
import Field from "../../../components/Field";
import API, { getErrorMessage } from "../../../utils/api";
import {
  COUNTRIES,
  DIETARY_RESTRICTIONS,
  ETHNICITIES,
  FIELD_ORDER,
  GRADUATION_YEARS,
  MAX_RESUME_BYTES,
  PRONOUNS,
  PROVINCES,
  STEPS,
  STUDY_LEVELS,
  TSHIRT_SIZES,
  YES_NO,
  YES_NO_PREFER_NOT,
  initialAnswers,
  toFormAnswers,
  validateApplication,
} from "./applicationQuestions";
import penguin from "../../../assets/application/penguin.png";
import flower from "../../../assets/application/flower.png";
import campfire from "../../../assets/application/campfire.png";
import snowman from "../../../assets/application/snowman.png";
import coral from "../../../assets/application/coral.png";
import pdfUpload from "../../../assets/application/pdf-upload.png";
import "./ApplicationForm.css";

const STATUS_MESSAGES = {
  incomplete: "Not submitted yet. Your progress is saved each time you click “Next”.",
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

// Decorations that sit in the bottom-right corner of a step's card
const CARD_ART = {
  4: { src: campfire, className: "card-art card-art--campfire" },
  5: { src: snowman, className: "card-art card-art--snowman" },
  6: { src: coral, className: "card-art card-art--coral" },
};

const LAST_STEP = STEPS.length - 1;

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
  const [step, setStep] = useState(0);

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

  if (loading) return <div className="application"><p className="application-loading">Loading your application…</p></div>;
  if (loadError) return <div className="application"><p className="application-loading error">{loadError}</p></div>;

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

  // Typing in an "Other:" box also ticks the Other checkbox beside it
  const handleOtherText = (listName) => (e) => {
    handleChange(e);
    if (e.target.value && !answers[listName].includes("Other")) {
      setAnswers((current) => ({ ...current, [listName]: [...current[listName], "Other"] }));
    }
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
    // Wait a frame so a newly shown step has rendered
    requestAnimationFrame(() =>
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  };

  const goToStep = (next) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    const res = await API.put("/applications/me", buildPayload());
    applyApplication(res.data.application);
  };

  const handleSave = async () => {
    setBusy(true);
    setMessage("");
    try {
      await save();
      setMessage("Progress saved. You can sign out and come back any time before the deadline.");
    } catch (err) {
      setMessage(getErrorMessage(err, "Could not save your progress."));
    } finally {
      setBusy(false);
    }
  };

  const hasResume = Boolean(resumeFile || savedResume);

  const handleNext = async () => {
    setMessage("");
    if (!editable) return goToStep(step + 1);

    const allErrors = validateApplication(answers, hasResume);
    const stepErrors = Object.fromEntries(
      STEPS[step].fields.filter((field) => allErrors[field]).map((field) => [field, allErrors[field]]),
    );
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setMessage("Please fix the highlighted questions before continuing.");
      scrollToFirstError(stepErrors);
      return;
    }

    if (dirty) {
      setBusy(true);
      try {
        await save();
      } catch (err) {
        setMessage(getErrorMessage(err, "Could not save your progress."));
        return;
      } finally {
        setBusy(false);
      }
    }
    goToStep(step + 1);
  };

  const handleBack = () => {
    setMessage("");
    goToStep(step - 1);
  };

  const showErrors = (fieldErrors) => {
    setErrors(fieldErrors);
    const firstStep = STEPS.findIndex((s) => s.fields.some((field) => fieldErrors[field]));
    if (firstStep !== -1) setStep(firstStep);
    scrollToFirstError(fieldErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== LAST_STEP) return handleNext();
    setMessage("");

    const fieldErrors = validateApplication(answers, hasResume);
    if (Object.keys(fieldErrors).length > 0) {
      setMessage("Please fix the highlighted questions before submitting.");
      showErrors(fieldErrors);
      return;
    }

    setBusy(true);
    try {
      const res = await API.post("/applications/me/submit", buildPayload());
      applyApplication(res.data.application);
      goToStep(0);
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) showErrors(serverErrors);
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

  const radios = (name, label, options, { required = false, hint, inline = false } = {}) => (
    <Field as="fieldset" label={label} name={name} required={required} error={errors[name]} hint={hint}>
      <div className={inline ? "choices choices--inline" : "choices"}>
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
              <span>{optionLabel}</span>
            </label>
          );
        })}
      </div>
    </Field>
  );

  // `otherField` adds an inline text box after the "Other" option
  const checkboxes = (name, label, options, { required = false, hint, otherField } = {}) => (
    <Field as="fieldset" label={label} name={name} required={required} error={errors[name]} hint={hint}>
      <div className="choices">
        {options.map(({ value, label: optionLabel }) =>
          value === "Other" && otherField ? (
            <div key={value} className="choice-other" id={`field-${otherField}`}>
              <label className="choice">
                <input type="checkbox" checked={answers[name].includes(value)} onChange={toggleInList(name, value)} />
                <span>Other:</span>
              </label>
              <input
                name={otherField}
                value={answers[otherField]}
                onChange={handleOtherText(name)}
                aria-label={`${label} (other)`}
                aria-invalid={Boolean(errors[otherField])}
                aria-describedby={describedBy(otherField)}
              />
            </div>
          ) : (
            <label key={value} className="choice">
              <input type="checkbox" checked={answers[name].includes(value)} onChange={toggleInList(name, value)} />
              <span>{optionLabel}</span>
            </label>
          ),
        )}
      </div>
      {otherField && errors[otherField] && (
        <p className="error" id={`${otherField}-error`} role="alert">
          Please fill in the “Other” box.
        </p>
      )}
    </Field>
  );

  // Single tick-box answer (agreements); round to match the design's radio look
  const agreement = (name, question, optionLabel, { required = false, square = false } = {}) => (
    <Field as="fieldset" label={question} name={name} required={required} error={errors[name]}>
      <label className="choice">
        <input
          type="checkbox"
          className={square ? undefined : "round"}
          name={name}
          checked={answers[name]}
          onChange={handleChange}
          aria-describedby={describedBy(name)}
        />
        <span>{optionLabel}</span>
      </label>
    </Field>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Field
            as="fieldset"
            label="I understand that ElleHacks is an event for marginalized gender groups. Preference will be given to these groups when selecting accepted hackers."
            name="marginalizedGenderAcknowledgement"
            required
            error={errors.marginalizedGenderAcknowledgement}
          >
            <label className="choice choice--rose">
              <input
                type="checkbox"
                className="round"
                name="marginalizedGenderAcknowledgement"
                checked={answers.marginalizedGenderAcknowledgement}
                onChange={handleChange}
              />
              <span>Yes, I understand.</span>
            </label>
          </Field>
        );

      case 1:
        return (
          <div className="field-grid">
            {textInput("firstName", "First Name", { required: true, autoComplete: "given-name", placeholder: "ex. Mary" })}
            {textInput("lastName", "Last Name", { required: true, autoComplete: "family-name", placeholder: "ex. Smith" })}
            {textInput("preferredFirstName", "Preferred First Name")}
            <Field label="Pronouns" name="pronouns" required error={errors.pronouns}>
              <input
                id="pronouns"
                name="pronouns"
                className="combo"
                list="pronoun-options"
                value={answers.pronouns}
                onChange={handleChange}
                aria-invalid={Boolean(errors.pronouns)}
                aria-describedby={describedBy("pronouns")}
              />
              <datalist id="pronoun-options">
                {PRONOUNS.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </Field>
            {textInput("email", "Email Address", {
              type: "email",
              required: true,
              autoComplete: "email",
              placeholder: "ex. mary.smith@example.com",
            })}
            {textInput("phone", "Phone Number", { type: "tel", required: true, autoComplete: "tel" })}
            {textInput("age", "What will be your age as of January 23, 2027?", {
              type: "number",
              required: true,
              min: 13,
              inputMode: "numeric",
            })}
          </div>
        );

      case 2:
        return (
          <>
            <div className="field-grid">
              {select("country", "Which country do you reside in?", COUNTRIES, { required: true })}
              {answers.country === "Canada"
                ? select("province", "Please specify your province/territory", PROVINCES, { required: true })
                : textInput("province", "Please specify your province/territory/state", { required: true })}
              {answers.country === "Other" &&
                textInput("otherCountry", "Please specify your country", { required: true })}
              {textInput("city", "Please specify your city/town (For Ontario Residents)", {
                required: answers.province === "Ontario",
              })}
            </div>
            <p className="note">
              According to the Accessible Canada Act, disability means "any impairment, including a physical,
              mental, intellectual, cognitive, learning, communication or sensory impairment—or a functional
              limitation—whether permanent, temporary or episodic in nature, or evident or not, that in
              interaction with a barrier, hinders a person's full and equal participation in society".
            </p>
            {radios(
              "disability",
              "Do you identify as a person with a disability as described in the Accessible Canada Act?",
              YES_NO_PREFER_NOT,
              { inline: true },
            )}
            {radios(
              "indigenousIdentity",
              "Do you identify as First Nations, Inuk/Inuit and/or Métis?",
              YES_NO_PREFER_NOT,
              { required: true, inline: true },
            )}
            {checkboxes(
              "ethnicity",
              "Which of the following ethnic or racial categories best describes how you self-identify? Select all that apply.",
              ETHNICITIES,
              { otherField: "otherEthnicity" },
            )}
          </>
        );

      case 3:
        return (
          <>
            <div className="field-grid">
              {select("studyLevel", "What is your current level of study?", STUDY_LEVELS, { required: true })}
              {textInput("school", "Which school do you attend?", { required: true })}
              {select("graduationDate", "Expected graduation year? (For post-secondary students)", GRADUATION_YEARS, {
                required: true,
              })}
              {textInput("fieldOfStudy", "What is your field of study?", { required: true })}
              {textInput("hackathonCount", "How many hackathons have you previously attended?", {
                type: "number",
                required: true,
                min: 0,
                inputMode: "numeric",
              })}
            </div>
            {radios("attendedElleHacks", "Have you attended ElleHacks before?", YES_NO, { required: true, inline: true })}
          </>
        );

      case 4:
        return (
          <div className="field-grid">
            {textInput("yorkStudentNumber", "Please enter your Student Number below", { inputMode: "numeric" })}
            {textInput("yorkEmail", "YorkU email", { type: "email" })}
          </div>
        );

      case 5:
        return (
          <>
            <Field
              label="Upload your resume here, named in the following format"
              name="resume"
              required
              error={errors.resume}
            >
              <p className="resume-format">LastName_FirstName.pdf</p>
              <p className="resume-example">Example: Doe_Jane.pdf</p>
              <div className="resume-upload">
                <label htmlFor="resume" className="resume-button">
                  <img src={pdfUpload} alt="" width="85" height="85" />
                  <span className="sr-only">Choose a PDF resume (up to 5 MB)</span>
                </label>
                <input
                  id="resume"
                  className="sr-only"
                  type="file"
                  accept="application/pdf"
                  onChange={handleResume}
                  aria-describedby={describedBy("resume")}
                />
                <div className="resume-status">
                  {resumeFile && <p>Selected: {resumeFile.name} (saved when you click Next)</p>}
                  {savedResume && !resumeFile && (
                    <p>
                      Uploaded: {savedResume.originalName}{" "}
                      <button type="button" className="link-button" onClick={downloadOwnResume}>
                        View
                      </button>
                    </p>
                  )}
                  {!resumeFile && !savedResume && <p className="muted">PDF only, up to 5 MB.</p>}
                </div>
              </div>
            </Field>
            {radios(
              "shareWithSponsors",
              "Can we share your resume & form responses with our sponsors for recruitment opportunities?",
              [
                { value: "Yes", label: "Yes, you can share this information with sponsors." },
                { value: "No", label: "No, you cannot share this information with sponsors." },
              ],
            )}
            <div className="field-stack">
              {textInput("linkedin", "If you have a LinkedIn / Portfolio Link, you can provide the link here", { type: "url" })}
              {textInput("github", "If you have a GitHub account, you can provide the link here", { type: "url" })}
            </div>
          </>
        );

      case 6:
        return (
          <>
            {checkboxes("dietaryRestrictions", "Dietary Restrictions", DIETARY_RESTRICTIONS, {
              required: true,
              hint: 'If you have any allergies, please specify under "Other"',
              otherField: "otherDietary",
            })}
            {radios("tshirtSize", "T-Shirt Size (unisex)", TSHIRT_SIZES, { required: true })}
          </>
        );

      case 7:
        return (
          <>
            {textArea("whyElleHacks", "Why are you interested in participating in ElleHacks 2027?", { required: true })}
            {textArea("goals", "What do you hope to achieve during the hackathon?", { required: true })}
            {textArea(
              "projectStory",
              "Tell us about a project/assignment you worked on that you're proud of, or one that totally broke and taught you something anyway.",
              { required: true },
            )}
          </>
        );

      default:
        return (
          <>
            {agreement(
              "inPersonAcknowledgement",
              <>
                Please confirm that you understand ElleHacks 2027 is an in-person event, taking place at York
                University <span className="aside">(4700 Keele St, Toronto, ON, Canada, M3J 1P3)</span>
              </>,
              "I am able to attend ElleHacks in-person at York University.",
              { required: true },
            )}
            {radios(
              "overnightAccommodation",
              <>
                Will you require overnight accommodations at ElleHacks{" "}
                <span className="aside">(ie. a quiet place to sleep)</span>?
              </>,
              [
                { value: "Yes", label: "Yes, I will be staying overnight for some or all of ElleHacks." },
                {
                  value: "No",
                  label: "No, I will not be staying overnight for ElleHacks. I will commute to and from the event each day.",
                },
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
              "I have read and agree to the MLH Code of Conduct.",
              { required: true },
            )}
            {agreement(
              "mlhAuthorization",
              <>
                I authorize you to share my application/registration information with Major League Hacking for
                event administration, ranking, and MLH administration in-line with the{" "}
                <a href="https://www.mlh.com/privacy" target="_blank" rel="noreferrer">MLH Privacy Policy</a>. I
                further agree to the terms of both the{" "}
                <a href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md" target="_blank" rel="noreferrer">
                  MLH Contest Terms and Conditions
                </a>{" "}
                and the{" "}
                <a href="https://www.mlh.com/privacy" target="_blank" rel="noreferrer">MLH Privacy Policy</a>.
              </>,
              "I agree.",
              { required: true },
            )}
            {agreement(
              "mlhEmails",
              <>
                I authorize MLH to send me occasional emails about relevant events, career opportunities, and
                community announcements. <em className="optional">[OPTIONAL]</em>
              </>,
              "I agree.",
              { square: true },
            )}
            {textArea("additionalInfo", "... and we're done! Anything else you'd like to let us know?", {
              hint: "If you have any accessibility requests or concerns, please let us know here.",
            })}
          </>
        );
    }
  };

  const { title } = STEPS[step];
  const art = CARD_ART[step];

  return (
    <div className="application">
      <img className="application-flower" src={flower} alt="" />
      {step === 0 && <img className="application-penguin" src={penguin} alt="" />}

      <div className="application-inner">
        {step === 0 && (
          <header className="application-intro">
            <h1>ElleHacks 2027 - Hacker Application</h1>
            <p className="application-tagline">
              ElleHacks is Canada's largest hackathon for women and gender-diverse students, embarking into our
              11th year!
            </p>
            <div className="status-note" role="status">
              <p>
                <strong>Application status:</strong> {STATUS_LABELS[status]}. {STATUS_MESSAGES[status]}
              </p>
              {appWindow?.applicationDeadline && (
                <p>
                  <strong>Deadline:</strong> {formatDateTime(appWindow.applicationDeadline)}
                </p>
              )}
              {status === "incomplete" && !isOpen && <p className="error">Applications are currently closed.</p>}
            </div>
          </header>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <section className={title ? "step" : "step step--intro"} aria-labelledby={title ? "step-title" : undefined}>
            {title && (
              <h2 className="step-tab" id="step-title">
                {title}
              </h2>
            )}
            <fieldset className="step-card" disabled={!editable || busy}>
              {renderStep()}
              {art && <img className={art.className} src={art.src} alt="" />}
            </fieldset>
          </section>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          <div className="step-actions">
            {editable && lastSaved && <span className="last-saved">Last saved {formatDateTime(lastSaved)}</span>}
            {editable && (
              <button type="button" className="step-button step-button--ghost" onClick={handleSave} disabled={busy}>
                Save
              </button>
            )}
            {step > 0 && (
              <button type="button" className="step-button" onClick={handleBack} disabled={busy}>
                Back
              </button>
            )}
            {step < LAST_STEP && (
              <button type="button" className="step-button" onClick={handleNext} disabled={busy}>
                {busy ? "Saving…" : "Next"}
              </button>
            )}
            {step === LAST_STEP && editable && (
              <button type="submit" className="step-button step-button--submit" disabled={busy}>
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

async function downloadOwnResume() {
  const res = await API.get("/applications/me/resume", { responseType: "blob" });
  window.open(URL.createObjectURL(res.data), "_blank");
}

export default ApplicationForm;
