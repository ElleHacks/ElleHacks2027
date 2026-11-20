import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API, { getErrorMessage } from "../../utils/api";
import { validatePassword } from "../../utils/validation";
import "./SignIn.css";
import "./SignUp.css";

function SignUp() {
  const { user } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await API.post("/auth/signup", form);
      setMessage(res.data.message);
    } catch (err) {
      const requestError = getErrorMessage(err);
      if (err.response?.status === 503) setMessage(requestError);
      else setError(requestError);
    } finally {
      setBusy(false);
    }
  };

  const resendVerification = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await API.post("/auth/resend-verification", { email: form.email });
      setMessage(res.data.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-card signup-card">
      <header className="signup-header">
        <h1>Join ElleHacks27</h1>
        <p>Create your account to start your application</p>
      </header>

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-fields">
          <div className="signup-name-row">
            <div className="signup-field">
              <label htmlFor="signup-first-name">First Name *</label>
              <input id="signup-first-name" autoComplete="given-name" placeholder="Enter first name"
                required value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
            </div>
            <div className="signup-field">
              <label htmlFor="signup-last-name">Last Name *</label>
              <input id="signup-last-name" autoComplete="family-name" placeholder="Enter last name"
                required value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
            </div>
          </div>

          <div className="signup-field">
            <label htmlFor="signup-email">Email *</label>
            <input id="signup-email" type="email" autoComplete="email" placeholder="Enter your email"
              required value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>

          <div className="signup-field">
            <label htmlFor="signup-password">Password *</label>
            <input id="signup-password" type="password" autoComplete="new-password" minLength="12" maxLength="72"
              placeholder="Create password" required value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </div>

          <div className="signup-field">
            <label htmlFor="signup-confirm-password">Confirm Password *</label>
            <input id="signup-confirm-password" type="password" autoComplete="new-password" minLength="12" maxLength="72"
              placeholder="Confirm Password" required value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
          </div>
        </div>

        <div className="signup-actions">
          <button className="signup-submit" type="submit" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}
          </button>

          {message && (
            <div className="signup-feedback" role="status">
              <p>{message}</p>
              {form.email && (
                <button type="button" className="link-button" disabled={busy} onClick={resendVerification}>
                  Resend verification email
                </button>
              )}
            </div>
          )}
          {error && <p className="signup-feedback error" role="alert">{error}</p>}
          <p className="signup-account">Already have an account? <Link to="/signin">Sign In</Link></p>
        </div>
      </form>
    </section>
  );
}

export default SignUp;
