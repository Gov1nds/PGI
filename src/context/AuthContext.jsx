import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutBuyer, apiCall } from "../lib/api";
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx) || { user:null, loading:false, login:async()=>{}, register:async()=>{}, logout:()=>{} };
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mergeResult, setMergeResult] = useState(null);
  useEffect(() => {
    (async () => {
      const t = localStorage.getItem("pgi_buyer_token");
      if (!t) { setLoading(false); return; }
      try { const r = await apiCall("/api/v1/auth/me"); if (r.ok) { const u = await r.json(); setUser(u); localStorage.setItem("pgi_user",JSON.stringify(u)); } else { try { setUser(JSON.parse(localStorage.getItem("pgi_user"))); } catch {} } } catch { try { setUser(JSON.parse(localStorage.getItem("pgi_user"))); } catch {} }
      setLoading(false);
    })();
  }, []);
  useEffect(() => { const h = () => setUser(null); window.addEventListener("pgi_auth_expired",h); return ()=>window.removeEventListener("pgi_auth_expired",h); }, []);
  const login = async (e, p) => { const d = await loginUser(e, p); setUser(d.user); localStorage.setItem("pgi_user",JSON.stringify(d.user)); if (d.merge_result?.merged) setMergeResult(d.merge_result); return d; };
  const register = async (e, p, n) => { const d = await registerUser(e, p, n); setUser(d.user); localStorage.setItem("pgi_user",JSON.stringify(d.user)); if (d.merge_result?.merged) setMergeResult(d.merge_result); return d; };
  const logout = () => { logoutBuyer(); setUser(null); setMergeResult(null); };
  return <Ctx.Provider value={{ user, loading, login, register, logout, mergeResult }}>{children}</Ctx.Provider>;
}
