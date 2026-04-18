import { createContext, useContext, useState, useEffect } from "react";
import { detectLocation } from "../lib/api";

const Ctx = createContext(null);

export function useLocation() {
  return useContext(Ctx) || { loc: { country: "", city: "", currency: "USD", detected: false }, setLoc: () => {} };
}

const CURRENCIES = [
  "USD","EUR","GBP","INR","CNY","JPY","KRW","SGD","AUD","CAD",
  "CHF","HKD","MXN","BRL","ZAR","THB","TWD","MYR","VND","IDR",
];

const CURRENCY_MAP = {
  US: "USD", GB: "GBP", IN: "INR", CN: "CNY", JP: "JPY",
  KR: "KRW", SG: "SGD", AU: "AUD", CA: "CAD", CH: "CHF",
  HK: "HKD", MX: "MXN", BR: "BRL", ZA: "ZAR", TH: "THB",
  TW: "TWD", MY: "MYR", VN: "VND", ID: "IDR",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR",
  PT: "EUR", IE: "EUR", AT: "EUR", BE: "EUR", FI: "EUR",
};

export { CURRENCIES };

export function LocationProvider({ children }) {
  const [loc, setLoc] = useState({
    country: "",
    country_code: "",
    city: "",
    currency: "USD",
    detected: false,
  });

  useEffect(() => {
    detectLocation()
      .then((d) => {
        const currency = d.currency || CURRENCY_MAP[d.country_code] || "USD";
        setLoc({
          country: d.country || "",
          country_code: d.country_code || "",
          city: d.city || "",
          currency,
          detected: true,
        });
      })
      .catch(() => {
        // Fallback: try to infer from browser locale
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const lang = navigator.language;
          setLoc((prev) => ({ ...prev, detected: true }));
        } catch {}
      });
  }, []);

  return <Ctx.Provider value={{ loc, setLoc }}>{children}</Ctx.Provider>;
}
