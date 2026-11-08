import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_URL = "https://accounts.google.com/gsi/client";
let googleScriptPromise;

const loadGoogleIdentity = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) resolve();
      else reject(new Error("Google sign-in could not be loaded."));
    };
    script.onerror = () => reject(new Error("Google sign-in could not be loaded."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

function GoogleSignInButton({ onCredential }) {
  const buttonRef = useRef(null);
  const credentialRef = useRef(onCredential);
  const [error, setError] = useState(() =>
    import.meta.env.VITE_GOOGLE_CLIENT_ID ? "" : "Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID.",
  );

  useEffect(() => {
    credentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    loadGoogleIdentity()
      .then(() => {
        if (!buttonRef.current) return;
        buttonRef.current.replaceChildren();
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) credentialRef.current(response.credential);
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: Math.min(buttonRef.current.clientWidth || 360, 400),
        });
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  return (
    <>
      <div ref={buttonRef} />
      {error && <p className="error" role="alert">{error}</p>}
    </>
  );
}

export default GoogleSignInButton;
