/**
 * PGI HUB — Auth Context
 * FIXED: Validates token via /auth/me on startup. Reliable loading state.
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, fetchMe } from "../lib/api";

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

  // FIXED: Validate token on startup via /auth/me
  useEffect(() => {
    const validateSession = async () => {
      const storedToken = localStorage.getItem("pgi_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchMe();
        setUser(userData);
        localStorage.setItem("pgi_user", JSON.stringify(userData));
      } catch {
        // Token is invalid — clear it
        localStorage.removeItem("pgi_token");
        localStorage.removeItem("pgi_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
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