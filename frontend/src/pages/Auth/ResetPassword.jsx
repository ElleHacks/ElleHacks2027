import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";

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
    <section className="auth-card">
      <h1>Choose a new password</h1>
      {token ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="new-password">New password</label>
          <input id="new-password" type="password" autoComplete="new-password" minLength="12" required
            value={password} onChange={(event) => setPassword(event.target.value)} />
          <label htmlFor="confirm-new-password">Confirm new password</label>
          <input id="confirm-new-password" type="password" autoComplete="new-password" minLength="12" required
            value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          <button type="submit" disabled={busy}>{busy ? "Updating…" : "Reset password"}</button>
        </form>
      ) : (
        <p className="error" role="alert">This password reset link is invalid or missing.</p>
      )}
      {message && <p role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <p><Link to="/signin">Back to sign in</Link></p>
    </section>
  );
}

export default ResetPassword;
