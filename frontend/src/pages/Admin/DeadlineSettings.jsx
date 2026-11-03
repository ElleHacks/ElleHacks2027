import { useEffect, useState } from "react";
import API, { getErrorMessage } from "../../utils/api";

// Converts an ISO date to the local "YYYY-MM-DDTHH:mm" value datetime-local inputs expect
const toLocalInput = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

function DeadlineSettings() {
  const [settings, setSettings] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const applySettings = (data) => {
    setSettings(data);
    setDeadline(toLocalInput(data.applicationDeadline));
  };

  useEffect(() => {
    API.get("/admin/settings")
      .then((res) => applySettings(res.data))
      .catch((err) => setMessage(getErrorMessage(err)));
  }, []);

  const save = async (changes, successMessage) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await API.put("/admin/settings", changes);
      applySettings(res.data);
      setMessage(successMessage);
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return message ? <p className="error">{message}</p> : <p>Loading settings…</p>;

  return (
    <section className="notice">
      <h2>Application deadline</h2>
      <p>
        Applications are currently{" "}
        <strong>{settings.acceptingApplications ? "OPEN" : "CLOSED"}</strong>.
        {settings.applicationsOpen && !settings.acceptingApplications && " (The deadline has passed.)"}
      </p>

      <button
        type="button"
        disabled={saving}
        onClick={() =>
          save(
            { applicationsOpen: !settings.applicationsOpen },
            settings.applicationsOpen ? "Applications closed." : "Applications opened.",
          )
        }
      >
        {settings.applicationsOpen ? "Close applications now" : "Open applications"}
      </button>

      <form
        className="deadline-form"
        onSubmit={(e) => {
          e.preventDefault();
          save(
            { applicationDeadline: deadline ? new Date(deadline).toISOString() : null },
            deadline ? "Deadline saved." : "Deadline removed.",
          );
        }}
      >
        <label htmlFor="deadline">Close applications automatically at (your local time)</label>
        <input id="deadline" type="datetime-local" value={deadline}
          onChange={(e) => setDeadline(e.target.value)} />
        <div className="form-actions">
          <button type="submit" disabled={saving}>Save deadline</button>
          {settings.applicationDeadline && (
            <button type="button" disabled={saving}
              onClick={() => save({ applicationDeadline: null }, "Deadline removed.")}>
              Remove deadline
            </button>
          )}
        </div>
      </form>

      {message && <p role="status">{message}</p>}
    </section>
  );
}

export default DeadlineSettings;
