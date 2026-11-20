import { useState } from "react";
import { Link } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";
import "./SignIn.css";
import "./ResetPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setBusy(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
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
        <h1>Reset your password</h1>
        <p>Enter the email address associated with your account.</p>
      </header>
      <form className="signin-form password-form" onSubmit={handleSubmit}>
        <div className="signin-fields">
          <div className="signin-field">
            <label htmlFor="reset-request-email">Email *</label>
            <input id="reset-request-email" type="email" autoComplete="email"
              placeholder="Enter your email" required value={email}
              onChange={(event) => setEmail(event.target.value)} />
          </div>
        </div>
        <button className="signin-submit" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
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

export default ForgotPassword;
