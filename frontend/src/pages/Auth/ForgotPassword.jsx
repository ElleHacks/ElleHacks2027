import { useState } from "react";
import { Link } from "react-router-dom";
import API, { getErrorMessage } from "../../utils/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setBusy(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto flex w-[min(568px,calc(100vw-32px))] max-w-[568px] flex-col rounded-[40px] bg-[#060e22]/80 px-12 py-12 font-[Poppins] text-white backdrop-blur-[12.35px] max-[600px]:rounded-[28px] max-[600px]:px-6">
      <header className="mb-8 flex flex-col items-center gap-2 text-center max-[600px]:mb-8">
        <h1 className="m-0 text-[32px] font-semibold leading-12 max-[600px]:text-[28px] max-[600px]:leading-10">Reset your password</h1>
        <p className="m-0 text-[17px] leading-[27px] whitespace-nowrap max-[600px]:text-[16px] max-[600px]:leading-6 max-[600px]:whitespace-normal">Enter the email address associated with your account.</p>
      </header>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold leading-6" htmlFor="reset-request-email">Email *</label>
            <input id="reset-request-email" type="email" autoComplete="email"
              placeholder="Enter your email" className="h-[62px] w-full rounded-2xl border-[3px] border-[#5781af] bg-white px-4 py-4 font-medium text-[15px] leading-[22px] text-[#273659] placeholder:text-[#5781af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]" required value={email}
              onChange={(event) => setEmail(event.target.value)} />
          </div>
        </div>
        <button className="flex h-[46px] w-full items-center justify-center rounded-full border-0 bg-[#c4ecfd] px-2.5 py-2.5 text-[17px] font-bold leading-[26px] text-[#273659] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
      {(message || error) && (
        <div className="mt-4 flex flex-col gap-2" role="status">
          {message && <p>{message}</p>}
          {error && <p className="text-[#ffc2c2]" role="alert">{error}</p>}
        </div>
      )}
      <p className="mt-12 text-center text-[16px] font-semibold leading-6 text-white max-[600px]:mt-8"><Link className="text-[#c4ecfd] no-underline hover:underline" to="/signin">Back to sign in</Link></p>
    </section>
  );
}

export default ForgotPassword;
