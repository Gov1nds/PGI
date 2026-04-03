/**
 * PGI HUB — Auth Context
 * FIXED: Validates token via /auth/me with graceful fallback to localStorage.
 * Clears pgi_user on logout. No new imports that could break build.
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, apiCall } from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  // 🔥 Prevent crash in production
  if (!ctx) {
    return {
      user: null,
      token: null,
      loading: false,
      login: async () => {},
      register: async () => {},
      logout: () => {},
    };
  }

  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("pgi_token"));
  const [loading, setLoading] = useState(true);

  // Persist token
  useEffect(() => {
    if (token) {
      localStorage.setItem("pgi_token", token);
    } else {
      localStorage.removeItem("pgi_token");
    }
  }, [token]);

  // Restore session on startup — try /auth/me, fall back to localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("pgi_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Try /auth/me for proper validation (uses apiCall to avoid duplication)
      try {
        const res = await apiCall("/api/v1/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem("pgi_user", JSON.stringify(userData));
          setLoading(false);
          return;
        }
      } catch (e) {
        // /auth/me not available — fall through to localStorage
      }

      // Fallback: restore from localStorage
      const stored = localStorage.getItem("pgi_user");
      if (stored && storedToken) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  // Listen for confirmed auth expiry from apiCall
  useEffect(() => {
    const handleExpiry = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("pgi_auth_expired", handleExpiry);
    return () => window.removeEventListener("pgi_auth_expired", handleExpiry);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("pgi_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pgi_user");
    }
  }, [user]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async (email, password, fullName) => {
    const data = await registerUser(email, password, fullName);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("pgi_token");
    localStorage.removeItem("pgi_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.access_token);
    setUser(data.user);
    return data; // data.merged_project_id will be available if guest session was merged
  };

  const register = async (email, password, fullName) => {
    const data = await registerUser(email, password, fullName);
    setToken(data.access_token);
    setUser(data.user);
    return data; // data.merged_project_id will be available if guest session was merged
  };