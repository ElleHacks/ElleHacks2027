import { createContext, useCallback, useContext, useEffect, useState } from "react";
import API, { TOKEN_KEY } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // True until we've checked whether a saved token is still valid
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const startSession = ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  const googleAuth = async (credential, mode) => {
    const res = await API.post("/auth/google", { credential, mode });
    startSession(res.data);
    return res.data.user;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, googleAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
