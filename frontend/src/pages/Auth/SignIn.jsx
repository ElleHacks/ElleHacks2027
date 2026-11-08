import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function SignIn() {
  const { user, googleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleGoogleCredential = async (credential) => {
    setError("");
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

      <GoogleSignInButton onCredential={handleGoogleCredential} />
      {error && <p className="error" role="alert">{error}</p>}
      <p>New to ElleHacks 2027? <Link to="/signup">Create an account</Link></p>
    </section>
  );
}

export default SignIn;
