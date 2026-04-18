import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDashboardAnalytics, listReports, requestReport, exportReport } from "../../lib/api";
import { LoadingState, EmptyState, StatusBadge } from "../../components/Shared";
import StaleBadge from "../../components/StaleBadge";

const REPORT_TABS = [
  { key: "spend", label: "Spend Analysis", icon: "💰" },
  { key: "savings", label: "Savings", icon: "📉" },
  { key: "supplier_performance", label: "Supplier Performance", icon: "⭐" },
  { key: "operational_status", label: "Operational Status", icon: "🔧" },
  { key: "lead_time", label: "Lead Time", icon: "⏱" },
  { key: "risk", label: "Risk Dashboard", icon: "⚠" },
  { key: "quote_intelligence", label: "Quote Intelligence", icon: "💬" },
  { key: "category_insights", label: "Category Insights", icon: "📊" },
];

function AIInsightCard({ insight }) {
  if (!insight) return null;
  return (
    <div className="card p-5 border-l-2 border-indigo-500/30 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">🤖</span>
        <span className="text-xs font-semibold text-indigo-300/70 uppercase tracking-wider">AI Insight</span>
      </div>
      <p className="text-sm text-white/70 leading-6">{insight}</p>
    </div>
  );
}

function KPISummary({ data }) {
  if (!data) return null;
  const kpis = Object.entries(data).filter(([k]) => !["computed_at", "ai_insight_summary", "chart_data", "drill_down"].includes(k));
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {kpis.slice(0, 4).map(([key, val]) => (
        <div key={key} className="kpi-card">
          <div className="text-xl font-bold text-white">
            {typeof val === "number" ? (val > 1000 ? `$${(val / 1000).toFixed(1)}K` : val.toLocaleString()) : val || "—"}
          </div>
          <div className="text-[11px] text-zinc-500 capitalize mt-0.5">{key.replace(/_/g, " ")}</div>
        </div>
      ))}
    </div>
  );
}

function DrillDownTable({ data }) {
  if (!data?.length) return null;
  const keys = Object.keys(data[0]).filter((k) => !k.endsWith("_id"));
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-white/25 border-b border-white/[0.04]">
            {keys.map((k) => <th key={k} className="pb-2 pr-3 capitalize">{k.replace(/_/g, " ")}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {data.slice(0, 20).map((row, i) => (
            <tr key={i} className="hover:bg-white/[0.015]">
              {keys.map((k) => (
                <td key={k} className="py-2 pr-3 text-white/60">
                  {typeof row[k] === "number" ? row[k].toLocaleString() : row[k] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleBarChart({ data, labelKey, valueKey }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d[valueKey] || 0));
  return (
    <div className="space-y-2 mt-4">
      {data.slice(0, 10).map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[11px] text-white/40 w-28 truncate capitalize">{d[labelKey]}</span>
          <div className="flex-1 h-5 bg-white/[0.03] rounded-md overflow-hidden">
            <div
              className="h-full bg-indigo-500/30 rounded-md flex items-center pl-2 transition-all"
              style={{ width: `${max > 0 ? (d[valueKey] / max) * 100 : 0}%` }}
            >
              <span className="text-[10px] text-indigo-300 font-medium whitespace-nowrap">
                {typeof d[valueKey] === "number" ? d[valueKey].toLocaleString() : d[valueKey]}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportContent({ type, accessToken }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setLoading(true);
    requestReport(type, {}, accessToken)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [type, accessToken]);

  const handleExport = async (format) => {
    if (!data?.report_id && !data?.id) return;
    try {
      const r = await exportReport(data.report_id || data.id, format, accessToken);
      if (r.download_url) window.open(r.download_url, "_blank");
    } catch {}
  };

  if (loading) return <div className="py-8 text-center text-xs text-white/30">Generating report…</div>;
  if (!data) return <EmptyState title="No data available" description="Not enough data to generate this report yet." />;

  return (
    <div>
      {data.computed_at && <StaleBadge computedAt={data.computed_at} />}
      <AIInsightCard insight={data.ai_insight_summary} />
      <KPISummary data={data.summary || data.kpis} />
      {data.chart_data && <SimpleBarChart data={data.chart_data} labelKey={Object.keys(data.chart_data[0] || {})[0]} valueKey={Object.keys(data.chart_data[0] || {})[1]} />}
      {data.drill_down && <DrillDownTable data={data.drill_down} />}
      <div className="flex gap-2 mt-6">
        <button onClick={() => handleExport("pdf")} className="px-4 py-2 bg-white/[0.04] text-white/60 text-xs rounded-lg border border-white/[0.06] hover:bg-white/[0.07]">
          Export PDF
        </button>
        <button onClick={() => handleExport("xlsx")} className="px-4 py-2 bg-white/[0.04] text-white/60 text-xs rounded-lg border border-white/[0.06] hover:bg-white/[0.07]">
          Export XLSX
        </button>
      </div>
    </div>
  );
}

export default function ReportsHub() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("spend");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Reports</h1>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {REPORT_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`tab-chip flex items-center gap-1.5 whitespace-nowrap ${activeTab === t.key ? "active" : ""}`}
          >
            <span className="text-xs">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <ReportContent type={activeTab} accessToken={accessToken} />
    </div>
  );
}
