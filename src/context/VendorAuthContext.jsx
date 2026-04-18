import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { vendorLoginApi, vendorRefreshToken, vendorLogoutApi } from "../lib/api";

const Ctx = createContext(null);

export function useVendorAuth() {
  return useContext(Ctx) || { vendorUser: null, vendorLoading: false, vendorAccessToken: null, vendorLogin: async()=>{}, vendorLogout: ()=>{} };
}

export function VendorAuthProvider({ children }) {
  const [vendorUser, setVendorUser] = useState(null);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [vendorAccessToken, setVendorAccessToken] = useState(null);

  // Attempt silent refresh on mount
  useEffect(() => {
    vendorRefreshToken()
      .then(data => {
        setVendorAccessToken(data.access_token);
        setVendorUser(data.vendor_user || data.user);
      })
      .catch(() => {})
      .finally(() => setVendorLoading(false));
  }, []);

  const vendorLogin = useCallback(async (email, password) => {
    const data = await vendorLoginApi(email, password);
    setVendorAccessToken(data.access_token);
    setVendorUser(data.vendor_user || data.user);
    return data;
  }, []);

  const vendorLogout = useCallback(async () => {
    try { await vendorLogoutApi(); } catch {}
    setVendorAccessToken(null);
    setVendorUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ vendorUser, vendorLoading, vendorAccessToken, vendorLogin, vendorLogout }}>
      {children}
    </Ctx.Provider>
  );
}
