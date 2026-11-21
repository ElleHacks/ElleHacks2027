import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";
import { validatePassword } from "../../utils/validation";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      setError("This password reset link is invalid or has expired.");
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await API.post("/auth/reset-password", { token, password, confirmPassword });
      setMessage(res.data.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto flex w-[min(568px,calc(100vw-32px))] max-w-[568px] flex-col rounded-[40px] bg-[#060e22]/80 px-12 py-12 font-[Poppins] text-white backdrop-blur-[12.35px] max-[600px]:rounded-[28px] max-[600px]:px-6">
      <header className="mb-4 flex flex-col items-center gap-2 text-center">
        <h1 className="m-0 text-[32px] font-semibold leading-12 max-[600px]:text-[28px] max-[600px]:leading-10">Choose a new password</h1>
        <p className="m-0 text-[18px] leading-[27px] max-[600px]:text-[16px] max-[600px]:leading-6">Create a new password for your account</p>
      </header>
      {token ? (
        <form className="flex flex-col gap-16 max-[600px]:gap-10" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold leading-6" htmlFor="new-password">New Password *</label>
              <input id="new-password" type="password" autoComplete="new-password"
                placeholder="Enter new password" className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]" minLength="12" maxLength="72" required
                value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold leading-6" htmlFor="confirm-new-password">Confirm New Password *</label>
              <input id="confirm-new-password" type="password" autoComplete="new-password"
                placeholder="Confirm new password" className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]" minLength="12" maxLength="72" required
                value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-6 max-[600px]:gap-4">
            <button className="flex h-[46px] w-full items-center justify-center rounded-full border-0 bg-[#c4ecfd] px-2.5 py-2.5 text-[17px] font-bold leading-[26px] text-[#273659] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={busy}>
              {busy ? "Updating…" : "Reset password"}
            </button>
            {(message || error) && (
              <div className="flex flex-col gap-2 text-center" role="status">
                {message && <p>{message}</p>}
                {error && <p className="text-[#ffc2c2]" role="alert">{error}</p>}
              </div>
            )}
            <Link className="text-center text-[16px] font-semibold leading-6 text-[#c4ecfd] no-underline hover:underline" to="/signin">Back to sign in</Link>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-6 text-center">
          <p className="m-0 text-[#ffc2c2]" role="alert">This password reset link is invalid or missing.</p>
          <Link className="text-[16px] font-semibold leading-6 text-[#c4ecfd] no-underline hover:underline" to="/signin">Back to sign in</Link>
        </div>
      )}
    </section>
  );
}

export default ResetPassword;
