import { useEffect, useState } from "react";
import API, { getErrorMessage } from "../../../utils/api";
import "./MyApplication.css";

// Word shown in the status box, and the sentence under it, for each status the backend can return
const STATUS_LABELS = {
  incomplete: "Not submitted",
  submitted: "Submitted",
  accepted: "Accepted",
  waitlisted: "Waitlisted",
  rejected: "Not accepted",
};

const STATUS_MESSAGES = {
  incomplete: "You haven’t submitted your application yet. Your answers save automatically as you go.",
  submitted: "The ElleHacks team is reviewing your application. Check back here for updates.",
  accepted: "Congratulations, you’ve been accepted to ElleHacks 2027!",
  waitlisted: "You’re on the waitlist. We’ll email you if a spot opens up.",
  rejected: "Thank you for applying. We weren’t able to offer you a spot this year.",
};

// dietaryRestrictions is saved as an array, so turn it into "Vegan, Halal"
const joinList = (items) => (Array.isArray(items) && items.length ? items.join(", ") : "");

function MyApplication() {
    const [application, setApplication] = useState(null);
    const [error, setError] = useState("");

    // Runs once when the page opens: ask the backend for this hacker's application
    useEffect(() => {
        let active = true;
        API.get("/applications/me")
        .then((res) => active && setApplication(res.data.application))
        .catch((err) => active && setError(getErrorMessage(err, "We couldn’t load your application.")));
        return () => {
        active = false;
        };
    }, []);

    if (error) {
        return (
        <div className="dashboard-page">
            <h1 className="dashboard-page__title">My Application</h1>
            <p className="dashboard-page__placeholder" role="alert">{error}</p>
        </div>
        );
    }

    if (!application) {
        return (
        <div className="dashboard-page">
            <h1 className="dashboard-page__title">My Application</h1>
            <p className="dashboard-page__placeholder" role="status">Loading…</p>
        </div>
        );
    }

    const status = application.status || "incomplete";
    const fullName = [application.firstName, application.lastName].filter(Boolean).join(" ");
    const diet = [joinList(application.dietaryRestrictions), application.otherDietary]
        .filter(Boolean)
        .join(" — ");

    // One entry per line in the profile. Add or remove entries to change what shows.
    const details = [
        { label: "Name", value: fullName },
        { label: "Preferred name", value: application.preferredFirstName },
        { label: "Pronouns", value: application.pronouns },
        { label: "T-shirt size", value: application.tshirtSize },
        { label: "Dietary restrictions", value: diet },
        { label: "Overnight accommodation", value: application.overnightAccommodation },
    ];

    return (
        <div className="dashboard-page">
        <h1 className="dashboard-page__title">My Application</h1>

        <section className="appStatus" aria-labelledby="appStatusTitle">
            <h2 id="appStatusTitle" className="appSectionTitle">Application status</h2>
            <div className="appStatus__box">
            <strong className="appStatus__label">{STATUS_LABELS[status]}</strong>
            <p className="appStatus__message">{STATUS_MESSAGES[status]}</p>
            </div>
        </section>

        <section aria-labelledby="appProfileTitle">
            <h2 id="appProfileTitle" className="appSectionTitle">Your profile</h2>
            <dl className="appProfile__list">
            {details.map(({ label, value }) => (
                <div className="appProfile__row" key={label}>
                <dt>{label}</dt>
                <dd className={value ? undefined : "appProfile__empty"}>{value || "Not provided yet"}</dd>
                </div>
            ))}
            </dl>
        </section>
        </div>
    );
}

export default MyApplication;