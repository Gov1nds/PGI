import { useEffect } from "react";
import { useRealTimeCtx } from "../context/RealTimeContext";

export function useRealTime(eventType, callback) {
  const { subscribe, unsubscribe } = useRealTimeCtx();
  useEffect(() => {
    subscribe(eventType, callback);
    return () => unsubscribe(eventType, callback);
  }, [eventType, callback, subscribe, unsubscribe]);
}
