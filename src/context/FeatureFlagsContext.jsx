import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";

const Ctx = createContext(null);

export function useFlags() {
  return useContext(Ctx) || { tier: "free", flags: {}, hasFeature: () => false, isLocked: () => true };
}

const TIER_FEATURES = {
  free: ["guest_search", "basic_bom", "limited_vendors"],
  starter: ["guest_search", "basic_bom", "limited_vendors", "bom_upload", "vendor_match", "rfq_basic", "chat", "basic_reports"],
  pro: ["guest_search", "basic_bom", "limited_vendors", "bom_upload", "vendor_match", "rfq_basic", "chat", "basic_reports", "rfq_advanced", "quote_matrix", "po_tracking", "full_reports", "analytics", "bulk_actions", "export"],
  enterprise: ["*"],
};

export function FeatureFlagsProvider({ children }) {
  const { user } = useAuth();

  const value = useMemo(() => {
    const tier = user?.plan_tier || user?.flags?.plan_tier || "free";
    const enabled = user?.flags?.enabled_features || [];
    const tierFeatures = TIER_FEATURES[tier] || TIER_FEATURES.free;

    const hasFeature = (feature) => {
      if (tierFeatures.includes("*")) return true;
      return tierFeatures.includes(feature) || enabled.includes(feature);
    };

    const isLocked = (feature) => !hasFeature(feature);

    return { tier, flags: user?.flags || {}, hasFeature, isLocked };
  }, [user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
