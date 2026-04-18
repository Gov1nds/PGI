import RiskFlagBadge from "./RiskFlagBadge";
import StrategyExplainer from "./StrategyExplainer";
import StaleBadge from "./StaleBadge";

export default function FreeReportCard({ component: c, strategy, currency = "USD" }) {
  const price = c.price_estimate || c.cost_estimate;

  return (
    <div className="card p-5 hover:border-white/[0.1] transition group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">
            {c.canonical_name || c.raw_text}
          </h3>
          {c.canonical_name && c.canonical_name !== c.raw_text && (
            <div className="text-[11px] text-white/30 mt-0.5">
              Input: {c.raw_text}
            </div>
          )}
          {c.category && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] border border-white/[0.06] text-white/50 capitalize">
              {c.category}
            </span>
          )}
        </div>
        {c.data_quality_label && (
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              c.data_quality_label === "high"
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/15"
                : c.data_quality_label === "medium"
                ? "bg-amber-500/10 text-amber-300 border border-amber-400/15"
                : "bg-white/[0.04] text-white/40 border border-white/[0.06]"
            }`}
          >
            {c.data_quality_label} confidence
          </span>
        )}
      </div>

      {/* Price band */}
      {price && (
        <div className="mb-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
            Estimated Unit Price ({currency})
          </div>
          <div className="flex items-baseline gap-2">
            {price.low != null && price.high != null ? (
              <span className="text-lg font-bold text-white font-mono">
                {currency} {price.low?.toLocaleString()} – {price.high?.toLocaleString()}
              </span>
            ) : price.mid != null ? (
              <span className="text-lg font-bold text-white font-mono">
                {currency} {price.mid?.toLocaleString()}
              </span>
            ) : (
              <span className="text-sm text-white/40">Price unavailable</span>
            )}
            {price.unit && (
              <span className="text-xs text-white/30">/ {price.unit}</span>
            )}
          </div>
          {price.computed_at && (
            <StaleBadge computedAt={price.computed_at} variant="inline" />
          )}
        </div>
      )}

      {/* Strategy recommendation */}
      {c.strategy && (
        <StrategyExplainer
          strategy={c.strategy}
          rationale={c.strategy_rationale || c.why_this_strategy}
        />
      )}

      {/* Risk flags */}
      {c.risk_flags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {c.risk_flags.map((flag, i) => (
            <RiskFlagBadge key={i} flag={flag} />
          ))}
        </div>
      )}

      {/* Additional details */}
      {(c.lead_time_days || c.moq || c.availability) && (
        <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-white/40">
          {c.lead_time_days && (
            <span>Lead time: <strong className="text-white/60">{c.lead_time_days}d</strong></span>
          )}
          {c.moq && (
            <span>MOQ: <strong className="text-white/60">{c.moq}</strong></span>
          )}
          {c.availability && (
            <span>Availability: <strong className="text-white/60 capitalize">{c.availability}</strong></span>
          )}
        </div>
      )}
    </div>
  );
}
