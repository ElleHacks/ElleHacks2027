import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const started = useRef(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    API.post("/auth/verify-email", { token })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setError(getErrorMessage(err)));
  }, [token]);

  return (
    <section className="auth-card">
      <h1>Verify your email</h1>
      {!token && <p className="error" role="alert">This verification link is invalid or missing.</p>}
      {!message && !error && token && <p role="status">Verifying your email…</p>}
      {message && <p role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <p><Link to="/signin">Continue to sign in</Link></p>
    </section>
  );
}

export default VerifyEmail;
