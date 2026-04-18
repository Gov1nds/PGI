const STRATEGY_META = {
  local: { label: "Local Sourcing", color: "text-emerald-700", bg: "bg-emerald-50", icon: "📍" },
  international: { label: "International", color: "text-sky-700", bg: "bg-sky-50", icon: "🌍" },
  distributor: { label: "Distributor", color: "text-purple-700", bg: "bg-purple-50", icon: "🏪" },
  direct: { label: "Direct from Manufacturer", color: "text-teal-700", bg: "bg-teal-50", icon: "🏭" },
  mixed: { label: "Mixed Strategy", color: "text-amber-700", bg: "bg-amber-50", icon: "🔀" },
};

export default function StrategyExplainer({ strategy, rationale }) {
  if (!strategy) return null;
  const key = typeof strategy === "string" ? strategy.toLowerCase() : "mixed";
  const meta = STRATEGY_META[key] || { label: strategy, color: "text-[#6B7280]", bg: "bg-[#F5F5F5]", icon: "📋" };
  return (
    <div className={`rounded-xl p-3 ${meta.bg} border border-[#E5E5E5]`}>
      <div className="flex items-center gap-2 mb-1"><span className="text-sm">{meta.icon}</span><span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span></div>
      {rationale && (<p className="text-[11px] text-[#6B7280] leading-4 pl-6">{rationale}</p>)}
    </div>
  );
}
