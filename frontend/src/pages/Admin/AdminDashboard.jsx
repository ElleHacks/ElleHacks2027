import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";
import DeadlineSettings from "./DeadlineSettings";
import { STATUS_LABELS } from "./adminConstants";
import {
  COUNTRIES,
  DIETARY_RESTRICTIONS,
  PRONOUNS,
  STUDY_LEVELS,
  TSHIRT_SIZES,
  YES_NO,
} from "../Dashboard/ApplicationForm/applicationQuestions";
import "./Admin.css";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

const toOptions = (values) => values.map((value) => (typeof value === "string" ? { value, label: value } : value));

// Dropdown filters for answers with fixed choices; `param` is the query param the backend reads
const ANSWER_FILTERS = [
  { param: "pronouns", label: "Pronouns", options: toOptions(PRONOUNS) },
  {
    param: "age",
    label: "Age",
    options: [
      { value: "under-18", label: "Under 18" },
      { value: "18-21", label: "18–21" },
      { value: "22-25", label: "22–25" },
      { value: "26-plus", label: "26+" },
    ],
  },
  { param: "tshirtSize", label: "T-shirt size", options: toOptions(TSHIRT_SIZES) },
  { param: "studyLevel", label: "Level of study", options: toOptions(STUDY_LEVELS) },
  {
    param: "dietary",
    label: "Dietary restrictions",
    options: toOptions(DIETARY_RESTRICTIONS.map(({ value }) => value)),
  },
  { param: "country", label: "Country", options: toOptions(COUNTRIES) },
  // City is typed freely on the form, so its choices come from the backend (see `cities` below)
  { param: "city", label: "City" },
  {
    param: "york",
    label: "YorkU student",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  { param: "overnight", label: "Overnight accommodation", options: toOptions(YES_NO) },
];

const EMPTY_FILTERS = Object.fromEntries(ANSWER_FILTERS.map(({ param }) => [param, ""]));

function AdminDashboard() {
  // Default to the review queue
  const [status, setStatus] = useState("submitted");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [data, setData] = useState({ applications: [], counts: {}, cities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    // Leave out empty filters so the backend only sees the ones in use
    const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    API.get("/admin/applications", {
      params: { status: status || undefined, search: query || undefined, ...activeFilters },
    })
      .then((res) => {
        if (ignore) return;
        setData(res.data);
        setError("");
      })
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [status, query, filters]);

  // Search as the admin types, waiting for a short pause so every keystroke isn't a request
  useEffect(() => {
    const next = search.trim();
    if (next === query) return undefined;
    const timer = setTimeout(() => {
      setLoading(true);
      setQuery(next);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, query]);

  // Keep the chosen city in the list even when other filters no longer match it
  const cityChoices = data.cities ?? [];
  const cityOptions = toOptions(
    filters.city && !cityChoices.includes(filters.city) ? [filters.city, ...cityChoices] : cityChoices,
  );

  const total = Object.values(data.counts).reduce((sum, count) => sum + count, 0);
  const hasActiveFilters = Boolean(query || Object.values(filters).some(Boolean));

  const changeStatus = (next) => {
    setLoading(true);
    setStatus(next);
  };

  const changeFilter = (param, value) => {
    setLoading(true);
    setFilters((current) => ({ ...current, [param]: value }));
  };

  const clearFilters = () => {
    setLoading(true);
    setFilters(EMPTY_FILTERS);
    setSearch("");
    setQuery("");
  };

  return (
    <div className="admin">
      <header className="admin-header">
        <p className="admin-eyebrow">ElleHacks 2027 · Administration</p>
        <h1>Admin Dashboard</h1>
        <p>Manage applications, review decisions, and update your application window.</p>
      </header>

      <DeadlineSettings />

      <section className="admin-panel admin-applications-panel" aria-labelledby="applications-heading">
        <div className="admin-section-heading">
          <div>
            <p className="admin-eyebrow">Review queue</p>
            <h2 id="applications-heading">Applications</h2>
          </div>
          <span className="admin-total">
            {total} {hasActiveFilters ? "matching" : "total"}
          </span>
        </div>
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
          <label htmlFor="search">Search applicants</label>
          <div className="search-row">
            <input
              id="search"
              type="search"
              value={search}
              placeholder="Name, email, school, city, field of study, pronouns…"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>

        <fieldset className="answer-filters">
          <legend>Filter by answers</legend>
          <div className="answer-filters-grid">
            {ANSWER_FILTERS.map(({ param, label, options = cityOptions }) => (
              <div key={param}>
                <label htmlFor={`filter-${param}`}>{label}</label>
                <select
                  id={`filter-${param}`}
                  value={filters[param]}
                  onChange={(e) => changeFilter(param, e.target.value)}
                >
                  <option value="">Any</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button type="button" className="clear-filters" onClick={clearFilters} disabled={!hasActiveFilters && !search}>
            Clear filters
          </button>
        </fieldset>

        {error && <p className="error">{error}</p>}
        {loading ? (
          <p className="admin-empty" role="status">Loading applications…</p>
        ) : data.applications.length === 0 ? (
          <p className="admin-empty">No applications found.</p>
        ) : (
          <div className="table-scroll admin-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Pronouns</th>
                  <th>Age</th>
                  <th>T-shirt</th>
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
                    <td>{app.pronouns || "—"}</td>
                    <td>{app.age ?? "—"}</td>
                    <td>{app.tshirtSize || "—"}</td>
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
      </section>
    </div>
  );
}

export default AdminDashboard;
