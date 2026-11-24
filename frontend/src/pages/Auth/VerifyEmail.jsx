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
    <section className="mx-auto flex w-[min(568px,calc(100vw-32px))] min-h-[360px] flex-col items-center justify-center gap-8 rounded-[40px] bg-[#060e22]/80 px-12 py-12 text-center font-[Poppins] text-white backdrop-blur-[12.35px] max-[600px]:min-h-[320px] max-[600px]:rounded-[28px] max-[600px]:px-6">
      <header className="flex flex-col items-center gap-2">
        <h1 className="m-0 text-[32px] font-semibold leading-12 max-[600px]:text-[28px] max-[600px]:leading-10">Verify your email</h1>
        {!message && !error && token && (
          <p className="m-0 text-[18px] leading-[27px] max-[600px]:text-[16px] max-[600px]:leading-6" role="status">
            Verifying your email…
          </p>
        )}
      </header>
      {message && <p className="m-0 text-[18px] leading-[27px] max-[600px]:text-[16px] max-[600px]:leading-6" role="status">{message}</p>}
      {!token && <p className="m-0 text-[16px] leading-6 text-[#ffc2c2]" role="alert">This verification link is invalid or missing.</p>}
      {error && <p className="m-0 text-[16px] leading-6 text-[#ffc2c2]" role="alert">{error}</p>}
      <Link className="text-[16px] font-semibold leading-6 text-[#c4ecfd] no-underline hover:underline" to="/signin">
        Continue to sign in
      </Link>
    </section>
  );
}

export default VerifyEmail;
