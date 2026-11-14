import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API, { getErrorMessage } from "../../utils/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function SignUp() {
  const { user, googleAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
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

  const handleGoogleCredential = async (credential) => {
    setError("");
    try {
      const signedIn = await googleAuth(credential, "signup");
      navigate(signedIn.role === "admin" ? "/admin" : "/application", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="auth-card">
      <h1>Create an account</h1>
      <p className="muted">You'll need an account before starting your application.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="signup-first-name">First name</label>
        <input id="signup-first-name" autoComplete="given-name" required value={form.firstName}
          onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
        <label htmlFor="signup-last-name">Last name</label>
        <input id="signup-last-name" autoComplete="family-name" required value={form.lastName}
          onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" type="email" autoComplete="email" required value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" type="password" autoComplete="new-password" minLength="12" required
          value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <label htmlFor="signup-confirm-password">Confirm password</label>
        <input id="signup-confirm-password" type="password" autoComplete="new-password" minLength="12" required
          value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
        <button type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>

      {message && (
        <div className="notice" role="status">
          <p>{message}</p>
          {form.email && (
            <button type="button" className="link-button" disabled={busy} onClick={resendVerification}>
              Resend verification email
            </button>
          )}
        </div>
      )}
      {error && <p className="error" role="alert">{error}</p>}
      <p>Or continue with Google</p>
      <GoogleSignInButton onCredential={handleGoogleCredential} />
      <p>Already have an account? <Link to="/signin">Sign in</Link></p>
    </section>
  );
}

export default SignUp;
