import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function ScoreSparkBar({ score, size = "sm" }) {
  const pct = Math.round((score || 0) * 100);
  const color = pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  const h = size === "sm" ? "h-1" : "h-1.5";
  return (<div className="flex items-center gap-2"><div className={`flex-1 ${h} rounded-full bg-[#F5F5F5] overflow-hidden min-w-[40px]`}><div className={`${h} rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-[11px] text-[#6B7280] font-mono w-8 text-right">{pct}</span></div>);
}

function WhyMatchedTooltip({ reasons }) {
  const [show, setShow] = useState(false);
  if (!reasons?.length) return null;
  return (
    <div className="relative inline-block">
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)} className="text-[10px] text-[#6B7280] hover:text-[#0A0A0A] underline underline-offset-2 cursor-help" aria-label="Why this vendor was matched">Why matched?</button>
      {show && (<div className="absolute z-50 bottom-full left-0 mb-1 w-56 p-3 rounded-xl border border-[#E5E5E5] bg-white shadow-lg text-xs text-[#6B7280] space-y-1 animate-fade-in">{reasons.map((r, i) => (<div key={i} className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">✓</span><span>{r}</span></div>))}</div>)}
    </div>
  );
}

export default function VendorShortlistTable({ lineId, projectId, vendors: propVendors, onSendRFQ, onChat, onExclude }) {
  const { accessToken } = useAuth();
  const [vendors, setVendors] = useState(propVendors || []);
  const [loading, setLoading] = useState(!propVendors);

  useEffect(() => {
    if (propVendors) return;
    if (!lineId || !projectId) return;
    import("../../lib/api").then(({ apiCall }) => apiCall(`/api/v1/projects/${projectId}/bom-lines/${lineId}/vendors`, {}, accessToken)).then((d) => setVendors(d.items || d || [])).catch(() => {}).finally(() => setLoading(false));
  }, [lineId, projectId, accessToken, propVendors]);

  if (loading) return <div className="py-6 text-center text-xs text-[#9CA3AF]">Loading vendors…</div>;
  if (!vendors?.length) return <div className="py-6 text-center text-xs text-[#9CA3AF]">No vendors matched for this component yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead><tr className="text-left text-[10px] uppercase tracking-wider text-[#9CA3AF] border-b border-[#E5E5E5]"><th className="pb-2 pr-2 w-8">#</th><th className="pb-2 pr-3">Vendor</th><th className="pb-2 pr-3 w-20">Score</th><th className="pb-2 pr-3">Country</th><th className="pb-2 pr-3">Est. Price</th><th className="pb-2 pr-3">Lead Time</th><th className="pb-2 pr-3">Strengths</th><th className="pb-2 pr-3">Match</th><th className="pb-2 text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-[#F0F0F0]">
          {vendors.slice(0, 5).map((v, i) => (
            <tr key={v.vendor_id || i} className="hover:bg-[#FAFAFA] transition">
              <td className="py-2.5 pr-2"><span className="text-[#9CA3AF] font-mono">{i + 1}</span></td>
              <td className="py-2.5 pr-3"><Link to={`/vendors/${v.vendor_id}`} className="text-[#0A0A0A] hover:underline transition font-medium">{v.name}</Link>{v.verified && (<span className="ml-1 text-[9px] text-emerald-500" title="Verified">✓</span>)}</td>
              <td className="py-2.5 pr-3 w-28"><ScoreSparkBar score={v.overall_score} /></td>
              <td className="py-2.5 pr-3 text-[#6B7280]">{v.country || "—"}</td>
              <td className="py-2.5 pr-3 text-[#0A0A0A] font-mono">{v.est_unit_price ? `$${v.est_unit_price.toLocaleString()}` : "—"}</td>
              <td className="py-2.5 pr-3 text-[#6B7280]">{v.lead_time_days ? `${v.lead_time_days}d` : "—"}</td>
              <td className="py-2.5 pr-3"><div className="flex flex-wrap gap-1">{(v.key_strengths || []).slice(0, 2).map((s, j) => (<span key={j} className="px-1.5 py-0.5 rounded bg-[#F5F5F5] border border-[#E5E5E5] text-[10px] text-[#6B7280]">{s}</span>))}</div></td>
              <td className="py-2.5 pr-3"><WhyMatchedTooltip reasons={v.match_reasons} /></td>
              <td className="py-2.5 text-right"><div className="flex items-center justify-end gap-1.5"><button onClick={() => onSendRFQ?.(v)} className="px-2 py-1 bg-[#0A0A0A] text-white text-[10px] rounded-md hover:bg-[#1A1A1A]">RFQ</button><Link to={`/vendors/${v.vendor_id}`} className="px-2 py-1 bg-[#F5F5F5] text-[#6B7280] text-[10px] rounded-md border border-[#E5E5E5] hover:bg-[#E5E5E5]">Profile</Link><button onClick={() => onChat?.(v)} className="px-2 py-1 bg-[#F5F5F5] text-[#6B7280] text-[10px] rounded-md border border-[#E5E5E5] hover:bg-[#E5E5E5]">Chat</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { ScoreSparkBar, WhyMatchedTooltip };
