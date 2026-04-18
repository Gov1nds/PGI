import { createContext, useContext, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCorrelation } from "./CorrelationContext";
import { sendTelemetry } from "../lib/api";

const Ctx = createContext(null);

export function useAnalytics() {
  return useContext(Ctx) || { trackEvent: () => {}, trackPageView: () => {} };
}

const FLUSH_INTERVAL = 5000;
const FLUSH_THRESHOLD = 10;

export function AnalyticsProvider({ children }) {
  const bufferRef = useRef([]);
  const timerRef = useRef(null);
  const { correlationId } = useCorrelation();
  const location = useLocation();

  const flush = useCallback(() => {
    if (bufferRef.current.length === 0) return;
    const batch = [...bufferRef.current];
    bufferRef.current = [];
    sendTelemetry(batch);
  }, []);

  const enqueue = useCallback((event) => {
    bufferRef.current.push(event);
    if (bufferRef.current.length >= FLUSH_THRESHOLD) flush();
  }, [flush]);

  const trackEvent = useCallback((category, action, metadata = {}) => {
    enqueue({
      event_id: crypto.randomUUID(),
      category,
      action,
      metadata,
      route: location.pathname,
      correlation_id: correlationId,
      timestamp: new Date().toISOString(),
    });
  }, [enqueue, location.pathname, correlationId]);

  const trackPageView = useCallback((route, shell) => {
    enqueue({
      event_id: crypto.randomUUID(),
      category: "navigation",
      action: "page_view",
      metadata: { shell },
      route,
      correlation_id: correlationId,
      timestamp: new Date().toISOString(),
    });
  }, [enqueue, correlationId]);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname, "auto");
  }, [location.pathname, trackPageView]);

  // Periodic flush
  useEffect(() => {
    timerRef.current = setInterval(flush, FLUSH_INTERVAL);
    return () => { clearInterval(timerRef.current); flush(); };
  }, [flush]);

  return <Ctx.Provider value={{ trackEvent, trackPageView }}>{children}</Ctx.Provider>;
}
