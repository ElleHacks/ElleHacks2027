import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";
import { validatePassword } from "../../utils/validation";
import "./SignIn.css";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      setError("This password reset link is invalid or has expired.");
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await API.post("/auth/reset-password", { token, password, confirmPassword });
      setMessage(res.data.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-card signin-card password-card">
      <header className="signin-header">
        <h1>Choose a new password</h1>
        <p>Create a new password for your account</p>
      </header>
      {token ? (
        <form className="signin-form password-form" onSubmit={handleSubmit}>
          <div className="signin-fields">
            <div className="signin-field">
              <label htmlFor="new-password">New Password *</label>
              <input id="new-password" type="password" autoComplete="new-password"
                placeholder="Enter new password" minLength="12" maxLength="72" required
                value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className="signin-field">
              <label htmlFor="confirm-new-password">Confirm New Password *</label>
              <input id="confirm-new-password" type="password" autoComplete="new-password"
                placeholder="Confirm new password" minLength="12" maxLength="72" required
                value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </div>
          </div>
          <button className="signin-submit" type="submit" disabled={busy}>
            {busy ? "Updating…" : "Reset password"}
          </button>
        </form>
      ) : (
        <p className="error" role="alert">This password reset link is invalid or missing.</p>
      )}
      {(message || error) && (
        <div className="signin-feedback" role="status">
          {message && <p>{message}</p>}
          {error && <p className="error" role="alert">{error}</p>}
        </div>
      )}
      <p className="password-account"><Link to="/signin">Back to sign in</Link></p>
    </section>
  );
}

export default ResetPassword;
