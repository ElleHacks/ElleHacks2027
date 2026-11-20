import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API, { getErrorMessage } from "../../utils/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import "./SignIn.css";

function SignIn() {
  const { user, googleAuth, passwordLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [message, setMessage] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setUnverified(false);
    setBusy(true);
    try {
      const signedIn = await passwordLogin(email, password);
      const fallback = signedIn.role === "admin" ? "/admin" : "/application";
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setUnverified(err.response?.status === 403);
    } finally {
      setBusy(false);
    }
  };

  const resendVerification = async () => {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const res = await API.post("/auth/resend-verification", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError("");
    setMessage("");
    setUnverified(false);
    try {
      const signedIn = await googleAuth(credential, "login");
      const fallback = signedIn.role === "admin" ? "/admin" : "/application";
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="auth-card signin-card">
      <header className="signin-header">
        <h1>Welcome back</h1>
        <p>Enter your details to access your account</p>
      </header>

      <form className="signin-form" onSubmit={handlePasswordLogin}>
        <div className="signin-fields">
          <div className="signin-field">
            <label htmlFor="signin-email">Email</label>
            <input id="signin-email" type="email" autoComplete="email" placeholder="Enter your email"
              required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="signin-field">
            <label htmlFor="signin-password">Password</label>
            <input id="signin-password" type="password" autoComplete="current-password"
              placeholder="Enter your password" required value={password}
              onChange={(event) => setPassword(event.target.value)} />
            <Link className="signin-forgot" to="/forgot-password">Forgot your password?</Link>
          </div>
        </div>
        <button className="signin-submit" type="submit" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      {(error || message || unverified) && (
        <div className="signin-feedback">
          {error && <p className="error" role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}
          {unverified && (
            <button type="button" className="link-button" disabled={busy} onClick={resendVerification}>
              Resend verification email
            </button>
          )}
        </div>
      )}

      <div className="signin-alternatives">
        <div className="signin-divider">
          <span aria-hidden="true" />
          <span>OR</span>
          <span aria-hidden="true" />
        </div>
        <div className="signin-google-shell">
          <GoogleSignInButton onCredential={handleGoogleCredential} />
        </div>
      </div>

      <p className="signin-account">Don’t have an account? <Link to="/signup">Sign up</Link></p>
    </section>
  );
}

export default SignIn;
