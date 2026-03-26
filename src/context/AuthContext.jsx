/**
 * PGI HUB — Auth Context
 * FIXED: Gracefully handles missing /auth/me endpoint.
 * Falls back to localStorage restoration if backend is unavailable.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
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

  // Restore session on startup
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("pgi_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Try /auth/me first for proper validation
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE ||
          "https://platform-api-production-d66b.up.railway.app";

        const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem("pgi_user", JSON.stringify(userData));
          setLoading(false);
          return;
        }
      } catch (e) {
        // /auth/me not available — fall through to localStorage
        console.log("Auth validation unavailable, using cached session");
      }

      // Fallback: restore from localStorage (original behavior)
      const stored = localStorage.getItem("pgi_user");
      if (stored && storedToken) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // corrupted data — clear it
          localStorage.removeItem("pgi_user");
          localStorage.removeItem("pgi_token");
          setToken(null);
        }
      }
      setLoading(false);
    };

    restoreSession();
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
    localStorage.removeItem("pgi_session");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}