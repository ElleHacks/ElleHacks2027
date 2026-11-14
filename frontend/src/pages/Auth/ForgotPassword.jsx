import { useState } from "react";
import { Link } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";

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
    <section className="auth-card">
      <h1>Reset your password</h1>
      <p className="muted">Enter the email address associated with your account.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="reset-request-email">Email</label>
        <input id="reset-request-email" type="email" autoComplete="email" required value={email}
          onChange={(event) => setEmail(event.target.value)} />
        <button type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
      </form>
      {message && <p role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <p><Link to="/signin">Back to sign in</Link></p>
    </section>
  );
}

export default ForgotPassword;
