import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import { getProject, createRFQ, uploadDrawing, getRFQ, getTracking } from "../lib/api";

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
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};

const STAGES = ["uploaded", "analyzed", "quoting", "quoted", "approved", "in_production", "qc_inspection", "shipped", "completed"];

export default function ProjectDetail() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [rfqLoading, setRfqLoading] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);
  const [drawingFile, setDrawingFile] = useState(null);
  const [drawingUploading, setDrawingUploading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [rfqData, setRfqData] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    loadProject();
  }, [id, user, authLoading]);

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
      // Reload to get updated status
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
          <Link to="/dashboard" className="text-sky-400 hover:text-sky-300 text-sm">← Back to Dashboard</Link>
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
  const lt = s1.lead_time || {};
  const cur = s1.currency || strat.currency || (project.metadata || {}).currency || "USD";

  // Group components by category for section-wise display
  const CATEGORY_ORDER = ["standard", "electrical", "electronics", "fastener", "custom_mechanical", "sheet_metal", "raw_material", "unknown"];
  const CAT_LABELS = { standard: "Standard / Catalog", electrical: "Electrical", electronics: "Electronics", fastener: "Fasteners", custom_mechanical: "Custom Mechanical", sheet_metal: "Sheet Metal", raw_material: "Raw Material", unknown: "Needs Review" };
  const CAT_COLORS = { standard: "emerald", electrical: "sky", electronics: "blue", fastener: "cyan", custom_mechanical: "violet", sheet_metal: "amber", raw_material: "purple", unknown: "white" };
  const groupedComponents = {};
  for (const item of s2) {
    const cat = item.category || "unknown";
    if (!groupedComponents[cat]) groupedComponents[cat] = [];
    groupedComponents[cat].push(item);
  }

  return (
    <div className="min-h-screen bg-[#010409]">

      {/* ── Header ────────────────────────────────────── */}
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

            {/* Actions */}
            <div className="flex gap-2">
              {project.status === "analyzed" && !rfqSuccess && (
                <button
                  onClick={handleRequestQuote}
                  disabled={rfqLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20"
                >
                  {rfqLoading ? "Requesting..." : "Request Quote"}
                </button>
              )}
              {rfqSuccess && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  ✓ Quote Requested
                </span>
              )}
              <Link to="/bom-analyzer"
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/60 text-sm font-medium transition-all"
              >
                New Analysis
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Progress tracker ──────────────────────────── */}
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
                    {done && !current && <span className="text-emerald-400">✓</span>}
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

      {/* ── Content ───────────────────────────────────── */}
      <Container className="py-8">

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={card}>
            <div className="p-5">
              <p className="text-white/35 text-xs font-medium mb-1">Estimated Cost</p>
              <p className="text-xl font-bold text-white">{cur} {fmt(project.average_cost)}</p>
              {project.cost_range_low > 0 && (
                <p className="text-white/40 text-xs mt-1">{fmt(project.cost_range_low)} — {fmt(project.cost_range_high)}</p>
              )}
            </div>
          </div>
          <div className={card}>
            <div className="p-5">
              <p className="text-white/35 text-xs font-medium mb-1">Savings</p>
              <p className="text-xl font-bold text-emerald-400">{project.savings_percent ? `${project.savings_percent.toFixed(1)}%` : "—"}</p>
              <p className="text-white/40 text-xs mt-1">vs baseline</p>
            </div>
          </div>
          <div className={card}>
            <div className="p-5">
              <p className="text-white/35 text-xs font-medium mb-1">Lead Time</p>
              <p className="text-xl font-bold text-white">{project.lead_time ? `${Math.round(project.lead_time)}d` : "—"}</p>
              <p className="text-white/40 text-xs mt-1">estimated</p>
            </div>
          </div>
          <div className={card}>
            <div className="p-5">
              <p className="text-white/35 text-xs font-medium mb-1">Location</p>
              <p className="text-lg font-bold text-white">{project.recommended_location || "—"}</p>
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
                ["rfq", "RFQ & Drawings"],
                ["tracking", "Tracking"],
              ].map(([tid, label]) => (
                <button key={tid} onClick={() => setActiveTab(tid)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tid ? "bg-sky-500 text-white" : "text-white/60 hover:text-white/80"}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {project.decision_summary && (
                  <div className={card}>
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Decision Summary</h3>
                      <p className="text-white/70 text-sm leading-relaxed">{project.decision_summary}</p>
                    </div>
                  </div>
                )}

                {Object.keys(bd).length > 0 && (
                  <div className={card}>
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Cost Breakdown</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Manufacturing", value: bd.manufacturing, color: "bg-emerald-500" },
                          { label: "Logistics", value: bd.logistics, color: "bg-sky-500" },
                          { label: "Tariffs", value: bd.tariffs, color: "bg-amber-500" },
                          { label: "NRE / Tooling", value: bd.nre, color: "bg-violet-500" },
                        ].filter(r => r.value > 0).map((row, i) => {
                          const total = s1.total_cost || 1;
                          const w = Math.max(2, ((row.value || 0) / total) * 100);
                          return (
                            <div key={i} className="flex items-center gap-4">
                              <span className="text-white/70 text-xs w-28 shrink-0">{row.label}</span>
                              <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${row.color}`} style={{ width: `${w}%`, transition: "width 1s ease" }} />
                              </div>
                              <span className="text-white/60 text-xs font-mono w-20 text-right">{cur} {fmt(row.value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Components tab — grouped by category */}
            {activeTab === "components" && s2.length > 0 && (
              <div className="space-y-6">
                {CATEGORY_ORDER.filter(cat => groupedComponents[cat]?.length > 0).map(cat => (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full bg-${CAT_COLORS[cat] || "white"}-400`} />
                      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{CAT_LABELS[cat] || cat}</h3>
                      <span className="text-white/30 text-xs">({groupedComponents[cat].length})</span>
                    </div>
                    <div className="space-y-2">
                      {groupedComponents[cat].map((item, i) => {
                        const v = item.selected_vendor || {};
                        return (
                          <div key={`${cat}-${i}`} className={card}>
                            <div className="p-4 flex items-center gap-4">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                cat.includes("custom") || cat === "sheet_metal" ? "bg-violet-500/15 text-violet-400" :
                                cat === "raw_material" ? "bg-amber-500/15 text-amber-400" :
                                cat === "electrical" || cat === "electronics" ? "bg-sky-500/15 text-sky-400" :
                                cat === "fastener" ? "bg-cyan-500/15 text-cyan-400" :
                                "bg-emerald-500/15 text-emerald-400"
                              }`}>
                                {cat.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{item.description}</p>
                                <p className="text-white/40 text-xs">Q: {item.quantity} · {v.region || "—"}{item.process ? ` · ${item.process}` : ""}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-white font-mono text-sm">{v.simulated_tlc ? `${cur} ${fmt(v.simulated_tlc)}` : "RFQ"}</p>
                                {item.price_source && <p className="text-white/30 text-[10px]">{item.price_source}</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Strategy tab */}
            {activeTab === "strategy" && (
              <div className="space-y-6">
                {strat.region_distribution && Object.keys(strat.region_distribution).length > 0 && (
                  <div className={card}>
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Region Distribution</h3>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(strat.region_distribution).map(([region, count]) => (
                          <div key={region} className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center min-w-[100px]">
                            <p className="text-white font-semibold text-lg">{count}</p>
                            <p className="text-white/40 text-xs mt-0.5">{region}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {strat.decision_summary && (
                  <div className={card}>
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Strategy Summary</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{strat.decision_summary}</p>
                    </div>
                  </div>
                )}

                {/* Procurement plan preview */}
                {project.procurement_plan && (
                  <div className={card}>
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Procurement Plan</h3>
                      <p className="text-white/50 text-xs">Full procurement plan with supplier allocation and timeline is available in this project.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RFQ & Drawings tab */}
            {activeTab === "rfq" && (
              <div className="space-y-6">
                {/* RFQ Status */}
                <div className={card}>
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">RFQ Status</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
                        project.rfq_status === "quoted" ? "bg-violet-500/15 text-violet-400" :
                        project.rfq_status === "approved" ? "bg-emerald-500/15 text-emerald-400" :
                        project.rfq_status === "sent" || project.rfq_status === "draft" ? "bg-amber-500/15 text-amber-400" :
                        "bg-white/[0.06] text-white/50"
                      }`}>
                        {(project.rfq_status || "none").replace(/_/g, " ")}
                      </span>
                      {project.status === "analyzed" && project.rfq_status === "none" && !rfqSuccess && (
                        <button onClick={handleRequestQuote} disabled={rfqLoading}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-all">
                          {rfqLoading ? "Requesting..." : "Request Quote"}
                        </button>
                      )}
                      {rfqSuccess && <span className="text-emerald-400 text-xs font-medium">✓ Quote Requested</span>}
                    </div>

                    {/* Custom parts requiring RFQ */}
                    {s2.filter(item => item.category === "custom_mechanical" || item.category === "sheet_metal").length > 0 && (
                      <div className="mt-4">
                        <p className="text-white/40 text-xs mb-2">Custom parts requiring quotes:</p>
                        <div className="space-y-2">
                          {s2.filter(item => item.category === "custom_mechanical" || item.category === "sheet_metal").map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                              <div>
                                <p className="text-white text-xs font-medium">{item.description}</p>
                                <p className="text-white/30 text-[10px]">{item.material || "—"} · {item.process || "—"}</p>
                              </div>
                              <span className="text-violet-400 text-[10px] font-semibold uppercase">RFQ Required</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drawing Upload */}
                <div className={card}>
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Upload Drawing</h3>
                    <p className="text-white/40 text-xs mb-4">Upload technical drawings for custom parts to get accurate quotes within 24 hours.</p>
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all">
                      <input type="file" accept=".pdf,.dxf,.dwg,.step,.stp,.iges,.igs,.png,.jpg"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setDrawingUploading(true);
                          try {
                            // Use the project's bom_id to upload
                            await uploadDrawing(id, f, f.name);
                            setDrawingFile(f.name);
                            setDrawingUploading(false);
                          } catch (err) {
                            setError(err.message);
                            setDrawingUploading(false);
                          }
                        }}
                      />
                      {drawingUploading ? (
                        <div className="text-center">
                          <div className="w-6 h-6 mx-auto rounded-full border-2 border-sky-500/20 border-t-sky-500 animate-spin mb-2" />
                          <p className="text-white/40 text-xs">Uploading...</p>
                        </div>
                      ) : drawingFile ? (
                        <div className="text-center">
                          <svg className="w-6 h-6 mx-auto text-emerald-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <p className="text-emerald-400 text-xs font-medium">{drawingFile}</p>
                          <p className="text-white/30 text-[10px] mt-1">Click to upload another</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="w-6 h-6 mx-auto text-white/30 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <p className="text-white/40 text-xs">PDF, DXF, DWG, STEP, IGES, or images</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking tab */}
            {activeTab === "tracking" && (
              <div className="space-y-6">
                <div className={card}>
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Production Timeline</h3>
                    <div className="space-y-0">
                      {[
                        { stage: "T0", label: "Order Placed", icon: "📋" },
                        { stage: "T1", label: "Material Procurement", icon: "🔧" },
                        { stage: "T2", label: "Manufacturing Started", icon: "⚙" },
                        { stage: "T3", label: "QC / Inspection", icon: "🔍" },
                        { stage: "T4", label: "Shipped / Delivered", icon: "📦" },
                      ].map((step, i) => {
                        const currentStage = project.tracking_stage || "init";
                        const stageOrder = { init: -1, T0: 0, T1: 1, T2: 2, T3: 3, T4: 4 };
                        const stepIdx = stageOrder[step.stage] ?? i;
                        const currentIdx = stageOrder[currentStage] ?? -1;
                        const done = stepIdx <= currentIdx;
                        const active = stepIdx === currentIdx;

                        return (
                          <div key={step.stage} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                                active ? "bg-sky-500/20 border-2 border-sky-500 text-sky-400" :
                                done ? "bg-emerald-500/15 text-emerald-400" :
                                "bg-white/[0.04] text-white/20"
                              }`}>
                                {done && !active ? "✓" : step.icon}
                              </div>
                              {i < 4 && <div className={`w-px h-8 ${done ? "bg-emerald-500/30" : "bg-white/[0.06]"}`} />}
                            </div>
                            <div className="pb-6">
                              <p className={`text-sm font-medium ${active ? "text-sky-400" : done ? "text-white/70" : "text-white/30"}`}>
                                {step.label}
                              </p>
                              <p className="text-white/25 text-xs">{step.stage}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Status info */}
                {(project.tracking_stage === "init" || !project.tracking_stage) && (
                  <div className={card}>
                    <div className="p-6 text-center">
                      <p className="text-white/40 text-sm">Production tracking will be available once an RFQ is approved and manufacturing begins.</p>
                      {project.rfq_status === "none" && (
                        <button onClick={handleRequestQuote} disabled={rfqLoading}
                          className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold transition-all">
                          {rfqLoading ? "Requesting..." : "Request Quote to Start"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}