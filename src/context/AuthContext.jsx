/**
 * PGI HUB — Auth Context
 * Provides user state, login, register, logout across the app.
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

  // Try to restore user from stored token
  useEffect(() => {
    const stored = localStorage.getItem("pgi_user");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
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
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}