import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";
import "./VerifyEmail.css";

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
    <section className="verifyEmailCard">
      <h1 className="verifyEmailTitle">Verify your email</h1>
      {!token && (
        <p className="verifyEmailMessage verifyEmailError" role="alert">
          This verification link is invalid or missing.
        </p>
      )}
      {!message && !error && token && (
        <p className="verifyEmailMessage" role="status">Verifying your email…</p>
      )}
      {message && (
        <p className="verifyEmailMessage verifyEmailSuccess" role="status">{message}</p>
      )}
      {error && (
        <p className="verifyEmailMessage verifyEmailError" role="alert">{error}</p>
      )}
      <Link className="verifyEmailLink" to="/signin">Continue to sign in</Link>
    </section>
  );
}

export default VerifyEmail;
