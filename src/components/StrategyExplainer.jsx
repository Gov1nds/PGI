const STRATEGY_META = {
  local: { label: "Local Sourcing", color: "text-emerald-300", bg: "bg-emerald-500/8", icon: "📍" },
  international: { label: "International", color: "text-sky-300", bg: "bg-sky-500/8", icon: "🌍" },
  distributor: { label: "Distributor", color: "text-purple-300", bg: "bg-purple-500/8", icon: "🏪" },
  direct: { label: "Direct from Manufacturer", color: "text-teal-300", bg: "bg-teal-500/8", icon: "🏭" },
  mixed: { label: "Mixed Strategy", color: "text-amber-300", bg: "bg-amber-500/8", icon: "🔀" },
};

export default function StrategyExplainer({ strategy, rationale }) {
  if (!strategy) return null;

  const key = typeof strategy === "string" ? strategy.toLowerCase() : "mixed";
  const meta = STRATEGY_META[key] || {
    label: strategy,
    color: "text-white/60",
    bg: "bg-white/[0.03]",
    icon: "📋",
  };

  return (
    <div className={`rounded-xl p-3 ${meta.bg} border border-white/[0.04]`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{meta.icon}</span>
        <span className={`text-xs font-semibold ${meta.color}`}>
          {meta.label}
        </span>
      </div>
      {rationale && (
        <p className="text-[11px] text-white/45 leading-4 pl-6">
          {rationale}
        </p>
      )}
    </div>
  );
}
