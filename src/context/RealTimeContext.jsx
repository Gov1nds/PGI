import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthContext";

const Ctx = createContext(null);

export function useRealTimeCtx() {
  return useContext(Ctx) || { connected: false, subscribe: () => {}, unsubscribe: () => {} };
}

const SSE_URL = import.meta.env.VITE_SSE_ENDPOINT ||
  `${import.meta.env.VITE_API_BASE_URL || ""}/api/v1/events/stream`;

export function RealTimeProvider({ children }) {
  const { user, accessToken } = useAuth();
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef(new Map());
  const esRef = useRef(null);
  const retryRef = useRef(null);
  const backoffRef = useRef(1000);

  const subscribe = useCallback((eventType, cb) => {
    if (!listenersRef.current.has(eventType)) {
      listenersRef.current.set(eventType, new Set());
    }
    listenersRef.current.get(eventType).add(cb);
  }, []);

  const unsubscribe = useCallback((eventType, cb) => {
    listenersRef.current.get(eventType)?.delete(cb);
  }, []);

  const dispatch = useCallback((eventType, data) => {
    listenersRef.current.get(eventType)?.forEach(cb => {
      try { cb(data); } catch {}
    });
    // Also dispatch to wildcard listeners
    listenersRef.current.get("*")?.forEach(cb => {
      try { cb({ type: eventType, ...data }); } catch {}
    });
  }, []);

  useEffect(() => {
    if (!user || !accessToken) {
      if (esRef.current) { esRef.current.close(); esRef.current = null; }
      setConnected(false);
      return;
    }

    function connect() {
      const url = `${SSE_URL}?token=${encodeURIComponent(accessToken)}`;
      const es = new EventSource(url, { withCredentials: true });
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        backoffRef.current = 1000;
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          dispatch(data.event_type || data.type || "message", data);
        } catch {}
      };

      es.onerror = () => {
        es.close();
        esRef.current = null;
        setConnected(false);
        // Reconnect with exponential backoff
        const delay = Math.min(backoffRef.current, 30000);
        backoffRef.current = delay * 2;
        retryRef.current = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      if (retryRef.current) clearTimeout(retryRef.current);
      if (esRef.current) { esRef.current.close(); esRef.current = null; }
      setConnected(false);
    };
  }, [user, accessToken, dispatch]);

  return (
    <Ctx.Provider value={{ connected, subscribe, unsubscribe }}>
      {children}
    </Ctx.Provider>
  );
}
