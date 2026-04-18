import { useState, useMemo } from "react";

const BOM_TABS = [
  { label: "All", value: null, icon: "⊞" },
  { label: "Needs Review", value: "NEEDS_REVIEW", icon: "👁" },
  { label: "Ready to RFQ", value: "RFQ_PENDING", icon: "📋" },
  { label: "RFQ Sent", value: "RFQ_SENT", icon: "📤" },
  { label: "Quoted", value: "QUOTED", icon: "💬" },
  { label: "Ordered", value: "ORDERED", icon: "✓" },
  { label: "At Risk", value: "ERROR", icon: "⚠" },
  { label: "Completed", value: "DELIVERED,CLOSED", icon: "✅" },
];

export function BOMStatusTabs({ activeFilter, onChange, counts = {} }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {BOM_TABS.map((t) => {
        const count = t.value ? t.value.split(",").reduce((s, v) => s + (counts[v] || 0), 0) : Object.values(counts).reduce((s, v) => s + v, 0);
        const isActive = activeFilter === t.value;
        return (<button key={t.label} onClick={() => onChange(t.value)} className={`tab-chip flex items-center gap-1.5 whitespace-nowrap ${isActive ? "active" : ""}`}><span className="text-xs">{t.icon}</span><span>{t.label}</span>{count > 0 && (<span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${isActive ? "bg-white/20 text-white" : "bg-[#F5F5F5] text-[#9CA3AF]"}`}>{count}</span>)}</button>);
      })}
    </div>
  );
}

const GROUP_OPTIONS = [
  { value: "none", label: "No Grouping" },
  { value: "category", label: "Category" },
  { value: "vendor", label: "Vendor" },
  { value: "lead_time_risk", label: "Lead Time Risk" },
  { value: "tag", label: "Tag" },
];

export function BOMGroupBy({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-[#9CA3AF]">Group by:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="px-2 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]">
        {GROUP_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
}

export function BOMBulkBar({ selectedCount, onAction, totalInTab }) {
  if (selectedCount === 0) return null;
  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-xl border border-[#0A0A0A] bg-[#0A0A0A] px-4 py-2.5 animate-fade-in">
      <div className="text-xs text-white"><strong>{selectedCount}</strong> of {totalInTab} selected</div>
      <div className="flex gap-2">
        <button onClick={() => onAction("send_rfq")} className="px-3 py-1.5 bg-white text-[#0A0A0A] text-[11px] rounded-lg hover:bg-[#F5F5F5] font-medium">Send RFQ</button>
        <button onClick={() => onAction("assign_vendor")} className="px-3 py-1.5 bg-white/10 text-white text-[11px] rounded-lg border border-white/20 hover:bg-white/20">Assign Vendor</button>
        <button onClick={() => onAction("tag")} className="px-3 py-1.5 bg-white/10 text-white text-[11px] rounded-lg border border-white/20 hover:bg-white/20">Tag</button>
        <button onClick={() => onAction("export")} className="px-3 py-1.5 bg-white/10 text-white/60 text-[11px] rounded-lg border border-white/10 hover:bg-white/20">Export</button>
      </div>
    </div>
  );
}

export function AttentionQueue({ items = [], onItemClick }) {
  if (items.length === 0) return null;
  const PRIORITY_COLORS = { critical: "border-l-red-400", high: "border-l-amber-400", medium: "border-l-sky-400", low: "border-l-[#E5E5E5]" };
  return (
    <div className="card p-4">
      <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Attention Queue <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px]">{items.length}</span></h3>
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {items.slice(0, 20).map((item, i) => (
          <button key={item.id || i} onClick={() => onItemClick?.(item)} className={`w-full text-left p-2.5 rounded-lg border-l-2 ${PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.medium} bg-[#FAFAFA] hover:bg-[#F5F5F5] transition text-xs`}>
            <div className="text-[#0A0A0A] font-medium truncate">{item.title || item.part_name}</div>
            <div className="text-[#9CA3AF] mt-0.5 truncate">{item.reason || item.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
