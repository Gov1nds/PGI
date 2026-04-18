import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

/* ─── Score Spark Bar ─── */
function ScoreSparkBar({ score, size = "sm" }) {
  const pct = Math.round((score || 0) * 100);
  const color =
    pct >= 75 ? "bg-emerald-400" : pct >= 50 ? "bg-amber-300" : "bg-red-300";
  const h = size === "sm" ? "h-1" : "h-1.5";
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${h} rounded-full bg-white/[0.06] overflow-hidden min-w-[40px]`}>
        <div className={`${h} rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-white/50 font-mono w-8 text-right">{pct}</span>
    </div>
  );
}

/* ─── Why Matched Tooltip ─── */
function WhyMatchedTooltip({ reasons }) {
  const [show, setShow] = useState(false);
  if (!reasons?.length) return null;
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-[10px] text-indigo-300/60 hover:text-indigo-200 underline underline-offset-2 cursor-help"
        aria-label="Why this vendor was matched"
      >
        Why matched?
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-0 mb-1 w-56 p-3 rounded-xl border border-white/[0.08] bg-[#0d0e1a] shadow-2xl text-xs text-white/60 space-y-1 animate-fade-in">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Vendor Shortlist Table ─── */
export default function VendorShortlistTable({ lineId, projectId, vendors: propVendors, onSendRFQ, onChat, onExclude }) {
  const { accessToken } = useAuth();
  const [vendors, setVendors] = useState(propVendors || []);
  const [loading, setLoading] = useState(!propVendors);

  useEffect(() => {
    if (propVendors) return;
    if (!lineId || !projectId) return;
    import("../../lib/api")
      .then(({ apiCall }) =>
        apiCall(`/api/v1/projects/${projectId}/bom-lines/${lineId}/vendors`, {}, accessToken)
      )
      .then((d) => setVendors(d.items || d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lineId, projectId, accessToken, propVendors]);

  if (loading) {
    return (
      <div className="py-6 text-center text-xs text-white/30">
        Loading vendors…
      </div>
    );
  }
  if (!vendors?.length) {
    return (
      <div className="py-6 text-center text-xs text-white/30">
        No vendors matched for this component yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-white/25 border-b border-white/[0.04]">
            <th className="pb-2 pr-2 w-8">#</th>
            <th className="pb-2 pr-3">Vendor</th>
            <th className="pb-2 pr-3 w-20">Score</th>
            <th className="pb-2 pr-3">Country</th>
            <th className="pb-2 pr-3">Est. Price</th>
            <th className="pb-2 pr-3">Lead Time</th>
            <th className="pb-2 pr-3">Strengths</th>
            <th className="pb-2 pr-3">Match</th>
            <th className="pb-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {vendors.slice(0, 5).map((v, i) => (
            <tr key={v.vendor_id || i} className="hover:bg-white/[0.015] transition">
              <td className="py-2.5 pr-2">
                <span className="text-white/30 font-mono">{i + 1}</span>
              </td>
              <td className="py-2.5 pr-3">
                <Link
                  to={`/vendors/${v.vendor_id}`}
                  className="text-white hover:text-indigo-300 transition font-medium"
                >
                  {v.name}
                </Link>
                {v.verified && (
                  <span className="ml-1 text-[9px] text-emerald-400" title="Verified">✓</span>
                )}
              </td>
              <td className="py-2.5 pr-3 w-28">
                <ScoreSparkBar score={v.overall_score} />
              </td>
              <td className="py-2.5 pr-3 text-white/50">{v.country || "—"}</td>
              <td className="py-2.5 pr-3 text-white/70 font-mono">
                {v.est_unit_price ? `$${v.est_unit_price.toLocaleString()}` : "—"}
              </td>
              <td className="py-2.5 pr-3 text-white/50">
                {v.lead_time_days ? `${v.lead_time_days}d` : "—"}
              </td>
              <td className="py-2.5 pr-3">
                <div className="flex flex-wrap gap-1">
                  {(v.key_strengths || []).slice(0, 2).map((s, j) => (
                    <span key={j} className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40">
                      {s}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-2.5 pr-3">
                <WhyMatchedTooltip reasons={v.match_reasons} />
              </td>
              <td className="py-2.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onSendRFQ?.(v)}
                    className="px-2 py-1 bg-indigo-600 text-white text-[10px] rounded-md hover:bg-indigo-500"
                  >
                    RFQ
                  </button>
                  <Link
                    to={`/vendors/${v.vendor_id}`}
                    className="px-2 py-1 bg-white/[0.04] text-white/60 text-[10px] rounded-md border border-white/[0.06] hover:bg-white/[0.07]"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => onChat?.(v)}
                    className="px-2 py-1 bg-white/[0.04] text-white/60 text-[10px] rounded-md border border-white/[0.06] hover:bg-white/[0.07]"
                  >
                    Chat
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { ScoreSparkBar, WhyMatchedTooltip };
