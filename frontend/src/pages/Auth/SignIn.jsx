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
      const fallback = signedIn.role === "admin" ? "/admin" : "/";
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
      const fallback = signedIn.role === "admin" ? "/admin" : "/";
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="mx-auto flex w-[min(568px,calc(100vw-32px))] min-h-[785px] flex-col rounded-[40px] bg-[#060e22]/80 px-12 py-12 font-[Poppins] text-white backdrop-blur-[12.35px] max-[600px]:min-h-0 max-[600px]:rounded-[28px] max-[600px]:px-6">
      <header className="mb-8 flex flex-col items-center gap-2 text-center max-[600px]:mb-6">
        <h1 className="m-0 text-[32px] font-semibold leading-12 max-[600px]:text-[28px] max-[600px]:leading-10">Welcome back</h1>
        <p className="m-0 text-[18px] leading-[27px] max-[600px]:text-[16px] max-[600px]:leading-6">Enter your details to access your account</p>
      </header>

      <form className="flex flex-col gap-8" onSubmit={handlePasswordLogin}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <label className="text-[16px] font-semibold leading-6" htmlFor="signin-email">Email</label>
            <input id="signin-email" type="email" autoComplete="email" placeholder="Enter your email"
              className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]"
              required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[16px] font-semibold leading-6" htmlFor="signin-password">Password</label>
            <input id="signin-password" type="password" autoComplete="current-password"
              placeholder="Enter your password" className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]" required value={password}
              onChange={(event) => setPassword(event.target.value)} />
            <Link className="self-start text-[16px] font-semibold leading-6 text-[#c4ecfd] no-underline hover:underline max-[600px]:text-[13px] max-[600px]:leading-5" to="/forgot-password">Forgot your password?</Link>
          </div>
        </div>
        <button className="flex h-[46px] w-full items-center justify-center rounded-full border-0 bg-[#c4ecfd] px-2.5 py-2.5 text-[17px] font-bold leading-[26px] text-[#273659] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      {(error || message || unverified) && (
        <div className="mt-4 flex flex-col gap-2">
          {error && <p className="text-[#ffc2c2]" role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}
          {unverified && (
            <button type="button" className="self-start border-0 bg-transparent p-0 text-[#c4ecfd] underline disabled:cursor-not-allowed" disabled={busy} onClick={resendVerification}>
              Resend verification email
            </button>
          )}
        </div>
      )}

      <div className="mt-8 flex w-full flex-col gap-5 max-[600px]:mt-6">
        <div className="flex h-6 items-center justify-center gap-5 text-[14px] font-medium leading-6 text-white/80">
          <span className="h-0 flex-1 border-t border-white/10" aria-hidden="true" />
          <span>OR CONTINUE WITH</span>
          <span className="h-0 flex-1 border-t border-white/10" aria-hidden="true" />
        </div>
        <div className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-white p-2 [&>div]:flex [&>div]:w-full [&>div]:justify-center [&_.error]:text-center [&_.error]:text-sm [&_.error]:text-[#ffc2c2]">
          <GoogleSignInButton onCredential={handleGoogleCredential} />
        </div>
      </div>

      <p className="mt-16 text-center text-[16px] leading-6 text-white max-[600px]:mt-10">Don’t have an account? <Link className="text-[#c4ecfd] no-underline hover:underline" to="/signup">Sign up</Link></p>
    </section>
  );
}

export default SignIn;
