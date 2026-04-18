import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export function useApiCall(apiFn, deps = [], options = { immediate: true }) {
  const { accessToken } = useAuth();
  const [state, setState] = useState({ data: null, loading: options.immediate, error: null });
  const mountedRef = useRef(true);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const execute = useCallback(async (...args) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await apiFn(accessToken, ...args);
      if (mountedRef.current) setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      if (mountedRef.current) setState(s => ({ ...s, loading: false, error }));
      throw error;
    }
  }, [apiFn, accessToken]);

  useEffect(() => {
    if (options.immediate) execute().catch(() => {});
  }, [...deps, execute]);

  return { ...state, execute, refetch: execute };
}

export function useVendorApiCall(apiFn, deps = [], options = { immediate: true }) {
  const [state, setState] = useState({ data: null, loading: options.immediate, error: null });
  // For vendor calls, token is passed directly
  const execute = useCallback(async (token, ...args) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await apiFn(token, ...args);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState(s => ({ ...s, loading: false, error }));
      throw error;
    }
  }, [apiFn]);

  return { ...state, execute, refetch: execute };
}
