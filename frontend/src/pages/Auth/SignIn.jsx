import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API, { getErrorMessage } from "../../utils/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";

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
    <section className="auth-card">
      <h1>Sign in</h1>
      <p className="muted">Sign in to start or continue your ElleHacks 2027 application.</p>

      <form onSubmit={handlePasswordLogin}>
        <label htmlFor="signin-email">Email</label>
        <input id="signin-email" type="email" autoComplete="email" required value={email}
          onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="signin-password">Password</label>
        <input id="signin-password" type="password" autoComplete="current-password" required value={password}
          onChange={(event) => setPassword(event.target.value)} />
        <button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <p><Link to="/forgot-password">Forgot your password?</Link></p>
      {unverified && (
        <button type="button" className="link-button" disabled={busy} onClick={resendVerification}>
          Resend verification email
        </button>
      )}
      {message && <p role="status">{message}</p>}
      <p>Or continue with Google</p>
      <GoogleSignInButton onCredential={handleGoogleCredential} />
      {error && <p className="error" role="alert">{error}</p>}
      <p>New to ElleHacks 2027? <Link to="/signup">Create an account</Link></p>
    </section>
  );
}

export default SignIn;
