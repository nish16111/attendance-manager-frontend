import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AUTH_EXPIRED_EVENT,
  clearStoredSession,
  getStoredSession,
  loginUser,
  logoutUser,
  registerUser,
} from "../API/HomeAPI";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession());

  const clearSession = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      setSession(null);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const nextSession = await loginUser(credentials);
    setSession(nextSession?.accessToken ? nextSession : null);
    return nextSession;
  }, []);

  const register = useCallback(async (payload) => {
    const nextSession = await registerUser(payload);
    setSession(nextSession?.accessToken ? nextSession : null);
    return nextSession;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      accessToken: session?.accessToken || "",
      isAuthenticated: Boolean(session?.accessToken),
      login,
      register,
      logout,
      clearSession,
    }),
    [clearSession, login, logout, register, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
