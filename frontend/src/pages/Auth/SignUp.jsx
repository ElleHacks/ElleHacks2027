import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function SignUp() {
  const { user, googleAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

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

      <GoogleSignInButton onCredential={handleGoogleCredential} />
      {error && <p className="error" role="alert">{error}</p>}
      <p>Already have an account? <Link to="/signin">Sign in</Link></p>
    </section>
  );
}

export default SignUp;
