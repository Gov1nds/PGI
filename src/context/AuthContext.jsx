// ============================================================
// SECTION 1: Frontend Auth / Session Fixes
// FILE: src/context/AuthContext.jsx  (FULL REPLACEMENT)
// ============================================================

/**
 * PGI HUB — Auth Context (Fixed)
 *
 * Fixes:
 *  1. `loading` is true until auth hydration is confirmed
 *  2. Added /auth/me server validation on mount to catch expired tokens
 *  3. Token stored only here, not duplicated in loginUser/registerUser
 *  4. Proper logout clears all storage
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, fetchCurrentUser } from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // loading = true until we've confirmed auth state from server (or confirmed no token)
  const [loading, setLoading] = useState(true);

  // ── On mount: restore token from localStorage, then validate with server ──
  useEffect(() => {
    const storedToken = localStorage.getItem("pgi_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    // Token exists — validate it with the server
    setToken(storedToken);
    fetchCurrentUser(storedToken)
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        // Token is invalid/expired — clean up silently
        localStorage.removeItem("pgi_token");
        localStorage.removeItem("pgi_user");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ── Persist token changes ──
  useEffect(() => {
    if (token) {
      localStorage.setItem("pgi_token", token);
    } else {
      localStorage.removeItem("pgi_token");
      localStorage.removeItem("pgi_user");
    }
  }, [token]);

  // ── Persist user changes ──
  useEffect(() => {
    if (user) {
      localStorage.setItem("pgi_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pgi_user");
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    const data = await registerUser(email, password, fullName);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    // Clear session token so next guest upload gets a fresh one
    // (do NOT clear pgi_session — keep it for continuity)
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
