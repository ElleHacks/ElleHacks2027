import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";
import { ANSWER_SECTIONS, STATUS_LABELS } from "./adminConstants";
import "./Admin.css";

const DECISIONS = [
  { status: "submitted", label: "Move to submitted" },
  { status: "accepted", label: "Accept" },
  { status: "waitlisted", label: "Waitlist" },
  { status: "rejected", label: "Reject" },
];

const EMAIL_DECISION_STATUSES = ["accepted", "waitlisted", "rejected"];

const formatValue = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
};

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : "—");

function AdminApplication() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    API.get(`/admin/applications/${id}`)
      .then((res) => setApplication(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  useEffect(() => {
    if (application?.decisionEmailStatus !== "queued") return undefined;

    const timer = setInterval(() => {
      API.get(`/admin/applications/${id}`)
        .then((res) => setApplication(res.data))
        .catch((err) => setMessage(`Could not refresh email status: ${getErrorMessage(err)}`));
    }, 1500);

    return () => clearInterval(timer);
  }, [application?.decisionEmailStatus, id]);

  if (error) return <p className="error">{error}</p>;
  if (!application) return <p>Loading application…</p>;

  const run = async (request, describe) => {
    setBusy(true);
    setMessage("");
    try {
      const res = await request();
      setApplication(res.data.application);
      setMessage(describe(res.data));
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const decide = (status) =>
    run(
      () => API.patch(`/admin/applications/${id}/status`, {
        status,
        notify: notify && EMAIL_DECISION_STATUSES.includes(status),
      }),
      ({ notificationQueued }) =>
        `Status set to ${STATUS_LABELS[status]}.` +
        (notificationQueued ? " The decision email has been queued." : ""),
    );

  const sendNotification = () =>
    run(
      () => API.post(`/admin/applications/${id}/notify`),
      () => "Decision email has been queued.",
    );

  const openResume = async () => {
    try {
      const res = await API.get(`/admin/applications/${id}/resume`, { responseType: "blob" });
      window.open(URL.createObjectURL(res.data), "_blank");
    } catch {
      setMessage("Could not open the resume.");
    }
  };

  const name = [application.firstName, application.lastName].filter(Boolean).join(" ") || "(no name yet)";
  const isDecided = ["accepted", "waitlisted", "rejected"].includes(application.status);

  return (
    <div className="admin">
      <p><Link to="/admin">← Back to applications</Link></p>
      <h1>{name}</h1>

      <section className="notice">
        <p><strong>Status:</strong> {STATUS_LABELS[application.status]}</p>
        <p><strong>Account email:</strong> {application.user?.email}</p>
        <p><strong>Submitted:</strong> {formatDateTime(application.submittedAt)}</p>
        <p><strong>Last reviewed:</strong> {formatDateTime(application.reviewedAt)}</p>
        <p>
          <strong>Decision email sent:</strong>{" "}
          {application.decisionNotifiedAt ? formatDateTime(application.decisionNotifiedAt) : "—"}
        </p>
        {application.decisionEmailStatus === "queued" && (
          <p role="status">Decision email queued; waiting for delivery…</p>
        )}
        {application.decisionEmailStatus === "failed" && (
          <p className="error" role="alert">
            Decision email could not be sent. Check SMTP configuration and try again.
          </p>
        )}

        <h2>Application status</h2>
        <label className="choice">
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          Email the applicant when setting an acceptance, waitlist, or rejection decision
        </label>
        <div className="form-actions">
          {DECISIONS.filter((d) => d.status !== application.status).map((d) => (
            <button key={d.status} type="button" disabled={busy} onClick={() => decide(d.status)}>
              {d.label}
            </button>
          ))}
          {isDecided && (
            <button type="button" disabled={busy} onClick={sendNotification}>
              {application.decisionNotifiedAt ? "Resend decision email" : "Send decision email"}
            </button>
          )}
        </div>
        {message && <p role="status">{message}</p>}
      </section>

      <section>
        <h2>Resume</h2>
        {application.resume?.filename ? (
          <button type="button" className="link-button" onClick={openResume}>
            {application.resume.originalName}
          </button>
        ) : (
          <p>—</p>
        )}
      </section>

      {ANSWER_SECTIONS.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <dl className="answers">
            {Object.entries(section.fields).map(([field, label]) => (
              <div key={field}>
                <dt>{label}</dt>
                <dd>{formatValue(application[field])}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

export default AdminApplication;
