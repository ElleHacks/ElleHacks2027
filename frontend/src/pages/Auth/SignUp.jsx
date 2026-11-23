import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API, { getErrorMessage } from "../../utils/api";
import { validatePassword } from "../../utils/validation";
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
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
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
    setMessage("");
    setBusy(true);
    try {
      const signedIn = await googleAuth(credential, "signup");
      navigate(signedIn.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto flex w-[min(791px,calc(100vw-32px))] max-w-[791px] min-h-[828px] flex-col justify-center rounded-[40px] bg-[#060e22]/80 px-12 py-12 font-[Poppins] text-white backdrop-blur-[12.35px] max-[600px]:min-h-0 max-[600px]:rounded-[28px] max-[600px]:px-6">
      <header className="mb-4 flex flex-col items-center gap-2 text-center">
        <h1 className="m-0 text-[32px] font-semibold leading-12 max-[600px]:text-[28px] max-[600px]:leading-10">Join ElleHacks27</h1>
        <p className="m-0 text-[20px] leading-[30px] max-[600px]:text-[16px] max-[600px]:leading-6">Create your account to start your application</p>
      </header>

      <form className="flex flex-col gap-16 max-[600px]:gap-10" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-8 max-[600px]:gap-6">
          <div className="grid grid-cols-2 gap-8 max-[600px]:grid-cols-1 max-[600px]:gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-bold leading-6" htmlFor="signup-first-name">First Name *</label>
              <input id="signup-first-name" autoComplete="given-name" placeholder="Enter first name"
                className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]"
                required value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-bold leading-6" htmlFor="signup-last-name">Last Name *</label>
              <input id="signup-last-name" autoComplete="family-name" placeholder="Enter last name"
                className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]"
                required value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold leading-6" htmlFor="signup-email">Email *</label>
            <input id="signup-email" type="email" autoComplete="email" placeholder="Enter your email"
              className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]"
              required value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-bold leading-6" htmlFor="signup-password">Password *</label>
            <input id="signup-password" type="password" autoComplete="new-password" minLength="12" maxLength="72"
              placeholder="Create password" className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]" required value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-bold leading-6" htmlFor="signup-confirm-password">Confirm Password *</label>
            <input id="signup-confirm-password" type="password" autoComplete="new-password" minLength="12" maxLength="72"
              placeholder="Confirm Password" className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]" required value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 max-[600px]:gap-4">
          <button className="flex h-[46px] w-full items-center justify-center rounded-full border-0 bg-[#c4ecfd] px-2.5 py-2.5 text-[17px] font-bold leading-[26px] text-[#273659] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}
          </button>

          <div className="flex w-full flex-col gap-4">
            <div className="flex h-6 items-center justify-center gap-5 text-[14px] font-medium leading-6 text-white/80">
              <span className="h-0 flex-1 border-t border-white/20" aria-hidden="true" />
              <span>OR SIGN UP WITH</span>
              <span className="h-0 flex-1 border-t border-white/20" aria-hidden="true" />
            </div>
            <div className={`flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-white p-2 [&>div]:flex [&>div]:w-full [&>div]:justify-center [&_.error]:text-center [&_.error]:text-sm [&_.error]:text-[#b42318] ${busy ? "pointer-events-none opacity-60" : ""}`}>
              <GoogleSignInButton onCredential={handleGoogleCredential} />
            </div>
          </div>

          {message && (
            <div className="w-full text-center text-white" role="status">
              <p>{message}</p>
              {form.email && (
                <button type="button" className="border-0 bg-transparent p-0 text-[14px] text-[#c4ecfd] underline disabled:cursor-not-allowed" disabled={busy} onClick={resendVerification}>
                  Resend verification email
                </button>
              )}
            </div>
          )}
          {error && <p className="w-full text-center text-[#ffc2c2]" role="alert">{error}</p>}
          <p className="text-center text-[16px] font-semibold leading-6 text-white">Already have an account? <Link className="text-[#c4ecfd] no-underline hover:underline" to="/signin">Sign In</Link></p>
        </div>
      </form>
    </section>
  );
}

export default SignUp;
