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

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    startSession(res.data);
    return res.data.user;
  };

  const signup = async (firstName, lastName, email, password) => {
    const res = await API.post("/auth/signup", { firstName, lastName, email, password });
    startSession(res.data);
    return res.data.user;
  };

  const forgotPassword = async (email) => {
    const res = await API.post("/auth/forgot-password", { email });
    return res.data.message;
  };

  const resetPassword = async (token, password) => {
    const res = await API.post("/auth/reset-password", { token, password });
    startSession(res.data);
    return res.data.user;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
