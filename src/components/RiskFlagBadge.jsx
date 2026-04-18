const SEVERITY_STYLES = {
  high: "bg-red-500/10 text-red-300 border-red-400/15",
  critical: "bg-red-500/15 text-red-200 border-red-400/20",
  medium: "bg-amber-500/10 text-amber-300 border-amber-400/15",
  low: "bg-sky-500/10 text-sky-300 border-sky-400/15",
};

const ICONS = {
  sole_source: "⚠",
  long_lead: "⏱",
  tariff_risk: "📦",
  quality_risk: "⚡",
  eol: "⛔",
  compliance: "📋",
  price_volatility: "📈",
  supply_shortage: "🔻",
  geopolitical: "🌍",
};

export default function RiskFlagBadge({ flag }) {
  const severity = flag.severity || flag.level || "medium";
  const styles = SEVERITY_STYLES[severity] || SEVERITY_STYLES.medium;
  const label = flag.label || flag.flag || flag.type || "Risk";
  const icon = ICONS[flag.type] || "⚠";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles}`}
      title={flag.description || flag.detail || label}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
