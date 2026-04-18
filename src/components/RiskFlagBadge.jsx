const SEVERITY_STYLES = {
  high: "bg-red-50 text-red-700 border-red-200",
  critical: "bg-red-100 text-red-800 border-red-300",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-sky-50 text-sky-700 border-sky-200",
};
const ICONS = { sole_source: "⚠", long_lead: "⏱", tariff_risk: "📦", quality_risk: "⚡", eol: "⛔", compliance: "📋", price_volatility: "📈", supply_shortage: "🔻", geopolitical: "🌍" };

export default function RiskFlagBadge({ flag }) {
  const severity = flag.severity || flag.level || "medium";
  const styles = SEVERITY_STYLES[severity] || SEVERITY_STYLES.medium;
  const label = flag.label || flag.flag || flag.type || "Risk";
  const icon = ICONS[flag.type] || "⚠";
  return (<span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles}`} title={flag.description || flag.detail || label}><span>{icon}</span><span>{label}</span></span>);
}
