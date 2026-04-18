import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, logoutUser, refreshToken, getMe, convertGuest } from "../lib/api";

const Ctx = createContext(null);

export function useAuth() {
  return useContext(Ctx) || {
    user: null, loading: false, accessToken: null, mergeResult: null,
    login: async()=>{}, register: async()=>{}, logout: ()=>{}, refreshAuth: async()=>{},
    loginWithOAuth: async()=>{},
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [mergeResult, setMergeResult] = useState(null);

  // Silent refresh on mount — HttpOnly cookie carries refresh token
  const refreshAuth = useCallback(async () => {
    try {
      const data = await refreshToken();
      setAccessToken(data.access_token);
      const me = await getMe(data.access_token);
      setUser(me);
      return data.access_token;
    } catch {
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshAuth().finally(() => setLoading(false));
  }, [refreshAuth]);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    setAccessToken(data.access_token);
    setUser(data.user);
    if (data.merge_result?.merged) setMergeResult(data.merge_result);
    // Try to convert guest session
    try {
      const guestToken = document.cookie.match(/pgi_guest=([^;]+)/)?.[1];
      if (guestToken) {
        const merge = await convertGuest(guestToken);
        if (merge?.merged) setMergeResult(merge);
      }
    } catch {}
    return data;
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    const data = await registerUser(email, password, fullName);
    setAccessToken(data.access_token);
    setUser(data.user);
    if (data.merge_result?.merged) setMergeResult(data.merge_result);
    try {
      const guestToken = document.cookie.match(/pgi_guest=([^;]+)/)?.[1];
      if (guestToken) {
        const merge = await convertGuest(guestToken);
        if (merge?.merged) setMergeResult(merge);
      }
    } catch {}
    return data;
  }, []);

  const loginWithOAuth = useCallback(async (data) => {
    if (data.access_token) setAccessToken(data.access_token);
    if (data.user) setUser(data.user);
    if (!data.user && data.access_token) {
      try {
        const me = await getMe(data.access_token);
        setUser(me);
      } catch {}
    }
    if (data.merge_result?.merged) setMergeResult(data.merge_result);
    // Convert guest session on OAuth login too
    try {
      const guestToken = document.cookie.match(/pgi_guest=([^;]+)/)?.[1];
      if (guestToken && data.access_token) {
        const merge = await convertGuest(guestToken);
        if (merge?.merged) setMergeResult(merge);
      }
    } catch {}
  }, []);

  const logout = useCallback(async () => {
    try { await logoutUser(); } catch {}
    setAccessToken(null);
    setUser(null);
    setMergeResult(null);
  }, []);

  const clearMergeResult = useCallback(() => setMergeResult(null), []);

  return (
    <Ctx.Provider value={{
      user, loading, accessToken, mergeResult,
      login, register, logout, refreshAuth, loginWithOAuth, clearMergeResult
    }}>
      {children}
    </Ctx.Provider>
  );
}
