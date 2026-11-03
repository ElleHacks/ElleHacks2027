import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";
import DeadlineSettings from "./DeadlineSettings";
import { STATUS_LABELS } from "./adminConstants";
import "./Admin.css";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

function AdminDashboard() {
  // Default to the review queue
  const [status, setStatus] = useState("submitted");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState({ applications: [], counts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    API.get("/admin/applications", { params: { status: status || undefined, search: query || undefined } })
      .then((res) => !ignore && setData(res.data))
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [status, query]);

  const total = Object.values(data.counts).reduce((sum, count) => sum + count, 0);

  const changeStatus = (next) => {
    setLoading(true);
    setStatus(next);
  };

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>

      <DeadlineSettings />

      <h2>Applications</h2>
      <div className="status-filters" role="group" aria-label="Filter by status">
        <button type="button" aria-pressed={status === ""} onClick={() => changeStatus("")}>
          All ({total})
        </button>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={status === value} onClick={() => changeStatus(value)}>
            {label} ({data.counts[value] || 0})
          </button>
        ))}
      </div>

      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setQuery(search.trim());
        }}
      >
        <label htmlFor="search">Search by name, email, or school</label>
        <div className="search-row">
          <input id="search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit">Search</button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading applications…</p>
      ) : data.applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>School</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Notified</th>
              </tr>
            </thead>
            <tbody>
              {data.applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <Link to={`/admin/applications/${app._id}`}>
                      {[app.preferredFirstName || app.firstName, app.lastName].filter(Boolean).join(" ") || "(no name yet)"}
                    </Link>
                  </td>
                  <td>{app.email}</td>
                  <td>{app.school || "—"}</td>
                  <td>{STATUS_LABELS[app.status]}</td>
                  <td>{formatDate(app.submittedAt)}</td>
                  <td>{formatDate(app.decisionNotifiedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
