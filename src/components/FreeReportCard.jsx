import RiskFlagBadge from "./RiskFlagBadge";
import StrategyExplainer from "./StrategyExplainer";
import StaleBadge from "./StaleBadge";

export default function FreeReportCard({ component: c, strategy, currency = "USD" }) {
  const price = c.price_estimate || c.cost_estimate;
  return (
    <div className="card p-5 hover:border-[#D4D4D4] transition group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#0A0A0A] truncate">{c.canonical_name || c.raw_text}</h3>
          {c.canonical_name && c.canonical_name !== c.raw_text && (<div className="text-[11px] text-[#9CA3AF] mt-0.5">Input: {c.raw_text}</div>)}
          {c.category && (<span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] bg-[#F5F5F5] border border-[#E5E5E5] text-[#6B7280] capitalize">{c.category}</span>)}
        </div>
        {c.data_quality_label && (<span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${c.data_quality_label === "high" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : c.data_quality_label === "medium" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-[#F5F5F5] text-[#6B7280] border border-[#E5E5E5]"}`}>{c.data_quality_label} confidence</span>)}
      </div>
      {price && (<div className="mb-3 p-3 rounded-xl bg-[#FAFAFA] border border-[#F0F0F0]"><div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">Estimated Unit Price ({currency})</div><div className="flex items-baseline gap-2">{price.low != null && price.high != null ? (<span className="text-lg font-bold text-[#0A0A0A] font-mono">{currency} {price.low?.toLocaleString()} – {price.high?.toLocaleString()}</span>) : price.mid != null ? (<span className="text-lg font-bold text-[#0A0A0A] font-mono">{currency} {price.mid?.toLocaleString()}</span>) : (<span className="text-sm text-[#9CA3AF]">Price unavailable</span>)}{price.unit && (<span className="text-xs text-[#9CA3AF]">/ {price.unit}</span>)}</div>{price.computed_at && (<StaleBadge computedAt={price.computed_at} variant="inline" />)}</div>)}
      {c.strategy && (<StrategyExplainer strategy={c.strategy} rationale={c.strategy_rationale || c.why_this_strategy} />)}
      {c.risk_flags?.length > 0 && (<div className="flex flex-wrap gap-1.5 mt-3">{c.risk_flags.map((flag, i) => (<RiskFlagBadge key={i} flag={flag} />))}</div>)}
      {(c.lead_time_days || c.moq || c.availability) && (<div className="flex flex-wrap gap-4 mt-3 text-[11px] text-[#9CA3AF]">{c.lead_time_days && (<span>Lead time: <strong className="text-[#6B7280]">{c.lead_time_days}d</strong></span>)}{c.moq && (<span>MOQ: <strong className="text-[#6B7280]">{c.moq}</strong></span>)}{c.availability && (<span>Availability: <strong className="text-[#6B7280] capitalize">{c.availability}</strong></span>)}</div>)}
    </div>
  );
}
