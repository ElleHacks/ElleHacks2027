import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/api";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      setMessage(await forgotPassword(email));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Reset your password</h1>

      {message ? (
        <p role="status">{message}</p>
      ) : (
        <>
          <p className="muted">
            Enter the email you signed up with and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />

            {error && <p className="error" role="alert">{error}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send reset link"}
            </button>
          </form>
        </>
      )}

      <p><Link to="/signin">Back to sign in</Link></p>
    </section>
  );
}

export default ForgotPassword;
