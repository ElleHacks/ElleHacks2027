import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/api";

const MIN_PASSWORD_LENGTH = 8;

function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <section className="auth-card">
        <h1>Reset your password</h1>
        <p className="error">This reset link is missing its token.</p>
        <p><Link to="/forgot-password">Request a new link</Link></p>
      </section>
    );
  }

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
      await resetPassword(token, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Choose a new password</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="password">New password</label>
        <small className="hint">At least {MIN_PASSWORD_LENGTH} characters.</small>
        <input id="password" name="password" type="password" autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH} value={form.password} onChange={handleChange} required />

        <label htmlFor="confirmPassword">Confirm new password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
          value={form.confirmPassword} onChange={handleChange} required />

        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Reset password"}
        </button>
      </form>

      <p><Link to="/forgot-password">Request a new link</Link></p>
    </section>
  );
}

export default ResetPassword;
