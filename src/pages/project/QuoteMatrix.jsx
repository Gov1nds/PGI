import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getComparisonMatrix, listProjectRFQs, createPurchaseOrder } from "../../lib/api";
import { LoadingState, EmptyState } from "../../components/Shared";
import StaleBadge from "../../components/StaleBadge";

/* ─── Matrix Cell ─── */
function MatrixCell({ cell, isBest, isSelected, onSelect }) {
  if (!cell) return <td className="px-2 py-2 text-center text-[10px] text-white/15">—</td>;
  const bg = isBest
    ? "bg-emerald-500/[0.06] border-emerald-500/15"
    : isSelected
    ? "bg-indigo-500/[0.06] border-indigo-500/20"
    : "hover:bg-white/[0.02]";

  return (
    <td
      onClick={() => onSelect?.()}
      className={`px-2 py-2 border border-white/[0.03] cursor-pointer transition ${bg} group`}
    >
      <div className="text-xs text-white font-mono">
        ${Number(cell.unit_price || 0).toLocaleString()}
      </div>
      {cell.lead_time_weeks != null && (
        <div className="text-[10px] text-white/35">{cell.lead_time_weeks}w lead</div>
      )}
      {cell.tlc_total != null && (
        <div className="text-[10px] text-amber-300/50 font-mono">
          TLC ${Number(cell.tlc_total).toLocaleString()}
        </div>
      )}
      {isSelected && (
        <div className="text-[9px] text-indigo-300 mt-0.5">✓ Selected</div>
      )}
    </td>
  );
}

/* ─── Constraints Toggle ─── */
function ConstraintsToggle({ show, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-lg text-[11px] border transition ${
        show
          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-200"
          : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60"
      }`}
    >
      {show ? "Hide" : "Show"} Constraints
    </button>
  );
}

/* ─── Split BOM Selector ─── */
function SplitBOMSelector({ selections, vendors, lines, onConfirm, confirming }) {
  const groups = useMemo(() => {
    const map = {};
    Object.entries(selections).forEach(([lineId, vendorId]) => {
      if (!map[vendorId]) map[vendorId] = [];
      map[vendorId].push(lineId);
    });
    return Object.entries(map).map(([vendorId, lineIds]) => ({
      vendor: vendors.find((v) => v.vendor_id === vendorId) || { name: vendorId.slice(0, 8) },
      lineIds,
    }));
  }, [selections, vendors]);

  if (groups.length === 0) return null;

  return (
    <div className="card p-4 border-indigo-500/15">
      <h3 className="text-sm font-semibold text-white mb-3">
        Split BOM Summary — {groups.length} PO{groups.length > 1 ? "s" : ""} will be created
      </h3>
      <div className="space-y-2 mb-4">
        {groups.map((g) => (
          <div key={g.vendor.vendor_id || g.vendor.name} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div>
              <span className="text-xs text-white font-medium">{g.vendor.name}</span>
              <span className="text-[11px] text-white/30 ml-2">{g.lineIds.length} lines</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onConfirm(groups)}
        disabled={confirming}
        className="primary-btn rounded-xl px-5 py-2 text-xs font-medium w-full disabled:opacity-50"
      >
        {confirming ? "Creating POs…" : `Create ${groups.length} Purchase Order${groups.length > 1 ? "s" : ""}`}
      </button>
    </div>
  );
}

/* ─── Main Quote Matrix ─── */
export default function QuoteMatrix() {
  const { id: projectId } = useParams();
  const { accessToken } = useAuth();
  const [matrix, setMatrix] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rfqs, setRFQs] = useState([]);
  const [activeRfq, setActiveRfq] = useState(null);
  const [showConstraints, setShowConstraints] = useState(false);
  const [selections, setSelections] = useState({});
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const rfqData = await listProjectRFQs(projectId, accessToken);
        const rfqList = rfqData.items || rfqData || [];
        setRFQs(rfqList);
        if (rfqList.length > 0) {
          const rid = rfqList[0].id || rfqList[0].rfq_id;
          setActiveRfq(rid);
          const m = await getComparisonMatrix(projectId, rid, accessToken);
          setMatrix(m);
        }
      } catch {}
      setLoading(false);
    })();
  }, [projectId, accessToken]);

  const toggleSelection = (lineId, vendorId) => {
    setSelections((prev) => {
      const copy = { ...prev };
      if (copy[lineId] === vendorId) {
        delete copy[lineId];
      } else {
        copy[lineId] = vendorId;
      }
      return copy;
    });
  };

  const autoSelect = () => {
    if (!matrix?.lines) return;
    const auto = {};
    matrix.lines.forEach((line) => {
      let best = null;
      let bestTlc = Infinity;
      (line.quotes || []).forEach((q) => {
        const tlc = q.tlc_total || q.unit_price || Infinity;
        if (tlc < bestTlc) {
          bestTlc = tlc;
          best = q.vendor_id;
        }
      });
      if (best) auto[line.line_id] = best;
    });
    setSelections(auto);
  };

  const confirmOrders = async (groups) => {
    setConfirming(true);
    try {
      for (const g of groups) {
        await createPurchaseOrder(
          projectId,
          {
            vendor_id: g.vendor.vendor_id,
            line_ids: g.lineIds,
            delivery_terms: "CIF",
            payment_terms: "net_30",
          },
          accessToken
        );
      }
      // Refresh
      window.location.reload();
    } catch {}
    setConfirming(false);
  };

  if (loading) return <LoadingState />;
  if (!matrix) return <EmptyState title="No quotes yet" description="Send RFQs first to compare vendor quotes." />;

  const vendors = matrix.vendors || [];
  const lines = matrix.lines || [];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Quote Comparison</h2>
          <p className="text-xs text-white/30 mt-0.5">
            {lines.length} lines × {vendors.length} vendors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConstraintsToggle show={showConstraints} onToggle={() => setShowConstraints(!showConstraints)} />
          <button onClick={autoSelect} className="px-3 py-1.5 bg-indigo-600 text-white text-[11px] rounded-lg hover:bg-indigo-500 font-medium">
            Auto-Select Best
          </button>
        </div>
      </div>

      {matrix.computed_at && <StaleBadge computedAt={matrix.computed_at} />}

      {/* Matrix table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="sticky left-0 z-10 bg-[#0a0a12] px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-white/25 border-r border-white/[0.06] min-w-[180px]">
                Component
              </th>
              {vendors.map((v) => (
                <th key={v.vendor_id} className="px-3 py-2.5 text-center text-[10px] uppercase tracking-wider text-white/30 min-w-[130px]">
                  <div className="text-white/60 normal-case text-xs font-medium">{v.name}</div>
                  <div className="text-white/20">{v.country || ""}</div>
                </th>
              ))}
              <th className="px-3 py-2.5 text-center text-[10px] uppercase tracking-wider text-indigo-300/40 min-w-[120px]">
                PGI Rec.
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {lines.map((line) => {
              const quotes = line.quotes || [];
              const bestVendor = quotes.reduce(
                (best, q) => (!best || (q.tlc_total || q.unit_price || Infinity) < (best.tlc_total || best.unit_price || Infinity) ? q : best),
                null
              );
              return (
                <tr key={line.line_id} className="hover:bg-white/[0.01]">
                  <td className="sticky left-0 z-10 bg-[#0a0a12] px-3 py-2 border-r border-white/[0.06]">
                    <div className="text-white/80 font-medium truncate max-w-[170px]">{line.part_name || line.raw_text}</div>
                    <div className="text-[10px] text-white/25">Qty {line.quantity}</div>
                  </td>
                  {vendors.map((v) => {
                    const cell = quotes.find((q) => q.vendor_id === v.vendor_id);
                    const isBest = cell && bestVendor?.vendor_id === v.vendor_id;
                    const isSelected = selections[line.line_id] === v.vendor_id;
                    return (
                      <MatrixCell
                        key={v.vendor_id}
                        cell={cell}
                        isBest={isBest}
                        isSelected={isSelected}
                        onSelect={() => cell && toggleSelection(line.line_id, v.vendor_id)}
                      />
                    );
                  })}
                  <td className="px-2 py-2 text-center">
                    {line.recommendation && (
                      <div className="text-[10px] text-indigo-300/60">{line.recommendation}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Constraint details */}
      {showConstraints && matrix.constraint_details && (
        <div className="card p-4 space-y-2">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Constraint Breakdown</h3>
          {Object.entries(matrix.constraint_details).map(([key, val]) => (
            <div key={key} className="flex justify-between py-1 border-b border-white/[0.03] text-xs">
              <span className="text-white/40 capitalize">{key.replace(/_/g, " ")}</span>
              <span className="text-white/60">{typeof val === "object" ? JSON.stringify(val) : val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Split BOM */}
      {Object.keys(selections).length > 0 && (
        <SplitBOMSelector
          selections={selections}
          vendors={vendors}
          lines={lines}
          onConfirm={confirmOrders}
          confirming={confirming}
        />
      )}
    </div>
  );
}
