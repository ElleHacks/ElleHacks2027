import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/api";

const MIN_PASSWORD_LENGTH = 8;

function SignUp() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < MIN_PASSWORD_LENGTH) {
      return setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setSubmitting(true);
    try {
      await signup(form.firstName, form.lastName, form.email, form.password);
      navigate("/application", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Create an account</h1>
      <p className="muted">You'll need an account before starting your application.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name</label>
        <input id="firstName" name="firstName" autoComplete="given-name"
          value={form.firstName} onChange={handleChange} required />

        <label htmlFor="lastName">Last name</label>
        <input id="lastName" name="lastName" autoComplete="family-name"
          value={form.lastName} onChange={handleChange} required />

        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={handleChange} required />

        <label htmlFor="password">Password</label>
        <small className="hint">At least {MIN_PASSWORD_LENGTH} characters.</small>
        <input id="password" name="password" type="password" autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH} value={form.password} onChange={handleChange} required />

        <label htmlFor="confirmPassword">Confirm password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
          value={form.confirmPassword} onChange={handleChange} required />

        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p>Already have an account? <Link to="/signin">Sign in</Link></p>
    </section>
  );
}

export default SignUp;
