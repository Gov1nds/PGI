import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import { getProject, createRFQ } from "../lib/api";

const STATUS_STYLES = {
  uploaded:       "bg-white/[0.06] text-white/60",
  analyzed:       "bg-sky-500/15 text-sky-400",
  quoting:        "bg-amber-500/15 text-amber-400",
  quoted:         "bg-violet-500/15 text-violet-400",
  approved:       "bg-emerald-500/15 text-emerald-400",
  in_production:  "bg-blue-500/15 text-blue-400",
  qc_inspection:  "bg-orange-500/15 text-orange-400",
  shipped:        "bg-cyan-500/15 text-cyan-400",
  completed:      "bg-emerald-500/15 text-emerald-400",
};

const fmt = (n, d = 2) => {
  if (n == null || isNaN(n)) return "\u2014";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};

// FIXED: dynamic currency formatting — no more hardcoded $
const CURRENCY_SYMBOLS = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", INR: "\u20B9", CNY: "\u00A5", JPY: "\u00A5", MXN: "$", CAD: "C$", AUD: "A$" };
const fmtCost = (cost, currency) => {
  if (cost == null || isNaN(cost)) return "\u2014";
  const sym = CURRENCY_SYMBOLS[currency] || currency || "$";
  return `${sym} ${fmt(cost)}`;
};

const STAGES = ["uploaded", "analyzed", "quoting", "quoted", "approved", "in_production", "qc_inspection", "shipped", "completed"];

// FIXED: Category badge helper for expanded taxonomy
const CATEGORY_STYLES = {
  custom_mechanical: { bg: "bg-violet-500/15", text: "text-violet-400", label: "C" },
  sheet_metal:       { bg: "bg-fuchsia-500/15", text: "text-fuchsia-400", label: "SM" },
  custom:            { bg: "bg-violet-500/15", text: "text-violet-400", label: "C" },
  raw_material:      { bg: "bg-amber-500/15", text: "text-amber-400", label: "R" },
  electrical:        { bg: "bg-sky-500/15", text: "text-sky-400", label: "E" },
  electronics:       { bg: "bg-blue-500/15", text: "text-blue-400", label: "IC" },
  fastener:          { bg: "bg-teal-500/15", text: "text-teal-400", label: "F" },
  standard:          { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "S" },
  unknown:           { bg: "bg-red-500/15", text: "text-red-400", label: "?" },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  // FIXED: No more "if (!user) navigate('/login')" — ProtectedRoute handles it

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [rfqLoading, setRfqLoading] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const data = await getProject(id);
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestQuote = async () => {
    if (rfqLoading) return;
    setRfqLoading(true);
    try {
      await createRFQ(id);
      setRfqSuccess(true);
      await loadProject();
    } catch (err) {
      setError(err.message);
    } finally {
      setRfqLoading(false);
    }
  };

  const card = "rounded-2xl bg-[#0d1117] border border-white/[0.06] overflow-hidden";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-sky-500/20 border-t-sky-500 animate-spin" />
          <p className="text-white/40 text-sm mt-4">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error || "Project not found"}</p>
          <Link to="/dashboard" className="text-sky-400 hover:text-sky-300 text-sm">{"\u2190"} Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const stageIdx = STAGES.indexOf(project.status);
  const report = project.analyzer_report || {};
  const strat = project.strategy || {};
  const s1 = report.section_1_executive_summary || {};
  const s2 = report.section_2_component_breakdown || [];
  const bd = s1.cost_breakdown || {};
  // FIXED: get currency from report/project
  const projectCurrency = s1.currency || project.currency || "USD";

  return (
    <div className="min-h-screen bg-[#010409]">

      {/* Header */}
      <section className="border-b border-white/[0.06]">
        <Container className="py-8">
          <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
            <Link to="/dashboard" className="hover:text-white/60 transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-white/60">{project.name || "Project"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{project.name || project.file_name || "Untitled BOM"}</h1>
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[project.status] || STATUS_STYLES.uploaded}`}>
                  {(project.status || "uploaded").replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-white/40">
                <span>{project.total_parts} parts</span>
                {project.file_name && <span>{project.file_name}</span>}
                {project.created_at && (
                  <span>{new Date(project.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                )}
                <span className="font-mono text-white/25">{project.project_id?.slice(0, 12)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {project.status === "analyzed" && !rfqSuccess && (
                <button onClick={handleRequestQuote} disabled={rfqLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20">
                  {rfqLoading ? "Requesting..." : "Request Quote"}
                </button>
              )}
              {rfqSuccess && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  {"\u2713"} Quote Requested
                </span>
              )}
              <Link to="/bom-analyzer" className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/60 text-sm font-medium transition-all">
                New Analysis
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Progress tracker */}
      <section className="border-b border-white/[0.06]">
        <Container className="py-5">
          <div className="flex items-center gap-1 overflow-x-auto">
            {STAGES.map((stage, i) => {
              const done = i <= stageIdx;
              const current = i === stageIdx;
              return (
                <div key={stage} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                    current ? "bg-sky-500/15 text-sky-400 border border-sky-500/20" :
                    done ? "text-emerald-400/70" :
                    "text-white/20"
                  }`}>
                    {done && !current && <span className="text-emerald-400">{"\u2713"}</span>}
                    {stage.replace(/_/g, " ")}
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className={`w-4 h-px mx-0.5 ${i < stageIdx ? "bg-emerald-500/40" : "bg-white/[0.06]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Content */}
      <Container className="py-8">

        {/* KPI row — FIXED: uses fmtCost with dynamic currency */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={card}>
            <div className="p-5">
              <p className="text-white/35 text-xs font-medium mb-1">Estimated Cost</p>
              <p className="text-xl font-bold text-white">{fmtCost(project.average_cost, projectCurrency)}</p>
              {project.cost_range_low > 0 && (
                <p className="text-white/40 text-xs mt-1">{fmtCost(project.cost_range_low, projectCurrency)} {"\u2014"} {fmtCost(project.cost_range_high, projectCurrency)}</p>
              )}
            </div>
          </div>
          <div className={card}>
            <div className="p-5">
              <p className="text-white/35 text-xs font-medium mb-1">Savings</p>
              <p className="text-xl font-bold text-emerald-400">{project.savings_percent ? `${project.savings_percent.toFixed(1)}%` : "\u2014"}</p>
              <p className="text-white/40 text-xs mt-1">vs baseline</p>
            </div>
          </div>
          <div className={card}>
            <div className="p-5">
              <p className="text-white/35 text-xs font-medium mb-1">Lead Time</p>
              <p className="text-xl font-bold text-white">{project.lead_time ? `${Math.round(project.lead_time)}d` : "\u2014"}</p>
              <p className="text-white/40 text-xs mt-1">estimated</p>
            </div>
          </div>
          <div className={card}>
            <div className="p-5">
              <p className="text-white/35 text-xs font-medium mb-1">Location</p>
              <p className="text-lg font-bold text-white">{project.recommended_location || "\u2014"}</p>
              <p className="text-white/40 text-xs mt-1">recommended</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {(s2.length > 0 || project.decision_summary) && (
          <>
            <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] max-w-fit mb-6">
              {[
                ["overview", "Overview"],
                ["components", "Components"],
                ["strategy", "Strategy"],
              ].map(([tid, label]) => (
                <button key={tid} onClick={() => setActiveTab(tid)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tid ? "bg-sky-500 text-white" : "text-white/60 hover:text-white/80"}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {project.decision_summary && (
                  <div className={card}><div className="p-6">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Decision Summary</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{project.decision_summary}</p>
                  </div></div>
                )}

                {Object.keys(bd).length > 0 && (
                  <div className={card}><div className="p-6">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Cost Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Manufacturing", value: bd.manufacturing, color: "bg-emerald-500" },
                        { label: "Logistics", value: bd.logistics, color: "bg-sky-500" },
                        { label: "Tariffs", value: bd.tariffs, color: "bg-amber-500" },
                        { label: "NRE / Tooling", value: bd.nre, color: "bg-violet-500" },
                      ].filter(r => r.value > 0).map((row, i) => {
                        const total = bd.total || s1.total_cost || 1;
                        const w = Math.max(2, ((row.value || 0) / total) * 100);
                        return (
                          <div key={i} className="flex items-center gap-4">
                            <span className="text-white/70 text-xs w-28 shrink-0">{row.label}</span>
                            <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${row.color}`} style={{ width: `${w}%`, transition: "width 1s ease" }} />
                            </div>
                            {/* FIXED: dynamic currency */}
                            <span className="text-white/60 text-xs font-mono w-24 text-right">{fmtCost(row.value, projectCurrency)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div></div>
                )}
              </div>
            )}

            {/* Components — FIXED: uses expanded category taxonomy */}
            {activeTab === "components" && s2.length > 0 && (
              <div className="space-y-2">
                {s2.map((item, i) => {
                  const v = item.selected_vendor || {};
                  const cat = item.category || "standard";
                  const catStyle = CATEGORY_STYLES[cat] || CATEGORY_STYLES.standard;
                  return (
                    <div key={i} className={card}>
                      <div className="p-4 flex items-center gap-4">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${catStyle.bg} ${catStyle.text}`}>
                          {catStyle.label}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.description || item.part_name}</p>
                          <p className="text-white/40 text-xs">
                            Q: {item.quantity} {"\u00B7"} {cat.replace(/_/g, " ")} {"\u00B7"} {v.region || v.supplier_name || "\u2014"}
                            {item.rfq_required && <span className="ml-2 text-amber-400">[RFQ Required]</span>}
                            {item.drawing_required && <span className="ml-1 text-violet-400">[Drawing]</span>}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          {/* FIXED: dynamic currency */}
                          <p className="text-white font-mono text-sm">{fmtCost(v.simulated_tlc || item.best_cost, projectCurrency)}</p>
                          <p className="text-white/40 text-xs">{v.expected_lead_days || item.lead_days || "\u2014"}d</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Strategy */}
            {activeTab === "strategy" && (
              <div className="space-y-6">
                {strat.region_distribution && Object.keys(strat.region_distribution).length > 0 && (
                  <div className={card}><div className="p-6">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Region Distribution</h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(strat.region_distribution).map(([region, pct]) => (
                        <div key={region} className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center min-w-[100px]">
                          <p className="text-white font-semibold text-lg">{typeof pct === "number" ? `${pct}%` : pct}</p>
                          <p className="text-white/40 text-xs mt-0.5">{region}</p>
                        </div>
                      ))}
                    </div>
                  </div></div>
                )}

                {strat.decision_summary && (
                  <div className={card}><div className="p-6">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Strategy Summary</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{strat.decision_summary}</p>
                  </div></div>
                )}

                {project.procurement_plan && (
                  <div className={card}><div className="p-6">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Procurement Plan</h3>
                    <p className="text-white/50 text-xs">Full procurement plan with supplier allocation and timeline is available in this project.</p>
                  </div></div>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}