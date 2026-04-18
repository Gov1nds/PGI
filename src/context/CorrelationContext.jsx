import { createContext, useContext, useMemo } from "react";
import { setCorrelationId } from "../lib/api";

const Ctx = createContext(null);

export function useCorrelation() {
  return useContext(Ctx) || { correlationId: null, generateRequestId: () => crypto.randomUUID() };
}

export function CorrelationProvider({ children }) {
  const correlationId = useMemo(() => {
    const id = crypto.randomUUID();
    setCorrelationId(id);
    return id;
  }, []);

  const generateRequestId = () => crypto.randomUUID();

  return (
    <Ctx.Provider value={{ correlationId, generateRequestId }}>
      {children}
    </Ctx.Provider>
  );
}
