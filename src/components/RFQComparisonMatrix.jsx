import React, { useMemo } from "react";

function fmt(value, digits = 2) {
  if (value === null || value === undefined || value === "" || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function Pill({ children, tone = "neutral" }) {
  const styles = {
    neutral: "bg-white/[0.04] text-white/55 border-white/[0.06]",
    good: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    bad: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${styles[tone] || styles.neutral}`}>
      {children}
    </span>
  );
}

function scoreTone(score) {
  if (score == null) return "neutral";
  const v = Number(score);
  if (v >= 0.8) return "good";
  if (v >= 0.6) return "info";
  if (v >= 0.4) return "warn";
  return "bad";
}

export default function RFQComparisonMatrix({
  comparison,
  sortBy,
  setSortBy,
  filters,
  setFilters,
  onSelectVendor,
  onRejectVendor,
  selectedVendorId,
}) {
  const data = comparison?.comparison_json || comparison || {};
  const vendors = useMemo(() => {
    const list = [...(data.vendors || [])];
    switch (sortBy) {
      case "lead_time":
        return list.sort((a, b) => (a.avg_lead_time ?? 99999) - (b.avg_lead_time ?? 99999));
      case "vendor_score":
        return list.sort((a, b) => (Number(b.vendor_score || 0) - Number(a.vendor_score || 0)));
      case "moq":
        return list.sort((a, b) => (a.moq ?? 99999) - (b.moq ?? 99999));
      case "risk":
        return list.sort((a, b) => (a.risk_score ?? 99999) - (b.risk_score ?? 99999));
      default:
        return list.sort((a, b) => (Number(a.total_cost || 0) - Number(b.total_cost || 0)));
    }
  }, [data.vendors, sortBy]);

  const rows = data.rows || [];

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (filters.minVendorScore && Number(v.vendor_score || 0) < Number(filters.minVendorScore)) return false;
      if (filters.maxCost && Number(v.total_cost || 0) > Number(filters.maxCost)) return false;
      if (filters.maxLeadTime && Number(v.avg_lead_time || 0) > Number(filters.maxLeadTime)) return false;
      if (filters.maxMoq && Number(v.moq || 0) > Number(filters.maxMoq)) return false;
      if (filters.maxRisk && Number(v.risk_score || 0) > Number(filters.maxRisk)) return false;
      return true;
    });
  }, [vendors, filters]);

  const visibleVendorIds = filteredVendors.map((v) => String(v.vendor_id));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-white/[0.06] bg-[#010409] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="total_cost">Sort: total cost</option>
            <option value="lead_time">Sort: lead time</option>
            <option value="vendor_score">Sort: vendor score</option>
            <option value="moq">Sort: MOQ</option>
            <option value="risk">Sort: risk</option>
          </select>
          <input
            value={filters.minVendorScore || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, minVendorScore: e.target.value }))}
            placeholder="Min vendor score"
            type="number"
            step="0.01"
            className="rounded-xl border border-white/[0.06] bg-[#010409] px-4 py-3 text-sm text-white outline-none"
          />
          <input
            value={filters.maxCost || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxCost: e.target.value }))}
            placeholder="Max total cost"
            type="number"
            step="0.01"
            className="rounded-xl border border-white/[0.06] bg-[#010409] px-4 py-3 text-sm text-white outline-none"
          />
          <input
            value={filters.maxLeadTime || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxLeadTime: e.target.value }))}
            placeholder="Max lead time"
            type="number"
            step="0.01"
            className="rounded-xl border border-white/[0.06] bg-[#010409] px-4 py-3 text-sm text-white outline-none"
          />
          <input
            value={filters.maxMoq || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxMoq: e.target.value }))}
            placeholder="Max MOQ"
            type="number"
            step="0.01"
            className="rounded-xl border border-white/[0.06] bg-[#010409] px-4 py-3 text-sm text-white outline-none"
          />
          <input
            value={filters.maxRisk || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxRisk: e.target.value }))}
            placeholder="Max risk"
            type="number"
            step="0.01"
            className="rounded-xl border border-white/[0.06] bg-[#010409] px-4 py-3 text-sm text-white outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
        <div className="border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Vendor matrix</h3>
          <p className="text-xs text-white/30">{rows.length} BOM lines · {filteredVendors.length} vendors shown</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="sticky left-0 bg-[#0d1117] z-10 text-left px-4 py-3 text-xs uppercase tracking-wider text-white/30 min-w-[280px]">
                  BOM line
                </th>
                {filteredVendors.map((vendor) => (
                  <th key={vendor.vendor_id} className="px-4 py-3 text-left align-top min-w-[240px]">
                    <div className={`rounded-xl border p-3 ${String(selectedVendorId) === String(vendor.vendor_id) ? "border-sky-500/30 bg-sky-500/10" : "border-white/[0.06] bg-white/[0.03]"}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{vendor.vendor_name}</p>
                          <p className="text-xs text-white/35">{vendor.quote_status || "received"} · {vendor.response_status || "received"}</p>
                        </div>
                        <Pill tone={scoreTone(vendor.vendor_score)}>{fmt((vendor.vendor_score || 0) * 100, 1)}%</Pill>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/50">
                        <div>Total cost: <span className="text-white">{fmt(vendor.total_cost)}</span></div>
                        <div>Lead time: <span className="text-white">{fmt(vendor.avg_lead_time)}</span></div>
                        <div>MOQ: <span className="text-white">{fmt(vendor.moq)}</span></div>
                        <div>Risk: <span className="text-white">{fmt(vendor.risk_score)}</span></div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => onSelectVendor?.({ vendor_id: vendor.vendor_id })}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-500"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => onRejectVendor?.({ vendor_id: vendor.vendor_id })}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-300 hover:bg-red-500/20"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.rfq_item_id} className="border-b border-white/[0.04]">
                  <td className="sticky left-0 bg-[#0d1117] z-10 px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{row.part_name}</p>
                      <p className="text-xs text-white/35">
                        Qty {fmt(row.quantity, 0)} · {row.material || "—"} · {row.process || "—"}
                      </p>
                      {row.best_vendor_name && (
                        <Pill tone="info">Best: {row.best_vendor_name}</Pill>
                      )}
                    </div>
                  </td>

                  {filteredVendors.map((vendor) => {
                    const cell = row.cells?.[String(vendor.vendor_id)];
                    const has = !!cell;
                    return (
                      <td key={`${row.rfq_item_id}-${vendor.vendor_id}`} className="px-4 py-4 align-top">
                        {has ? (
                          <div className={`rounded-xl border p-3 ${String(selectedVendorId) === String(vendor.vendor_id) ? "border-sky-500/30 bg-sky-500/5" : "border-white/[0.06] bg-white/[0.03]"}`}>
                            <div className="flex items-center justify-between gap-2">
                              <Pill tone={cell.availability_status === "available" ? "good" : cell.availability_status === "unknown" ? "neutral" : "warn"}>
                                {cell.availability_status}
                              </Pill>
                              <Pill tone={cell.compliance_status === "compliant" ? "good" : cell.compliance_status === "unknown" ? "neutral" : "warn"}>
                                {cell.compliance_status}
                              </Pill>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/50">
                              <div>Price: <span className="text-white">{fmt(cell.price)}</span></div>
                              <div>Lead: <span className="text-white">{fmt(cell.lead_time)} d</span></div>
                              <div>MOQ: <span className="text-white">{fmt(cell.moq)}</span></div>
                              <div>Risk: <span className="text-white">{fmt(cell.risk_score)}</span></div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {(cell.quote_status || cell.response_status) && (
                                <Pill tone="info">
                                  {(cell.quote_status || cell.response_status).replace(/_/g, " ")}
                                </Pill>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-white/[0.05] bg-white/[0.015] p-3 text-xs text-white/25">
                            No quote
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {comparison?.summary_json && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
            <p className="text-xs uppercase tracking-wider text-white/25">Best total cost vendor</p>
            <p className="mt-2 text-lg font-semibold text-white">{comparison.summary_json.best_total_cost_vendor_id || "—"}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
            <p className="text-xs uppercase tracking-wider text-white/25">Best total cost</p>
            <p className="mt-2 text-lg font-semibold text-white">{fmt(comparison.summary_json.best_total_cost)}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
            <p className="text-xs uppercase tracking-wider text-white/25">Vendors shown</p>
            <p className="mt-2 text-lg font-semibold text-white">{filteredVendors.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}