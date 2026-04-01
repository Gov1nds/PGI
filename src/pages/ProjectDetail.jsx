import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import {
  createRFQ,
  getProject,
  getProjectEvents,
  getProjectSnapshots,
  getRFQ,
  getStrategyRuns,
  getTracking,
  uploadDrawing,
} from "../lib/api";
import ProjectEventTimeline from "../components/ProjectEventTimeline.jsx";
import RFQComparisonMatrix from "../components/RFQComparisonMatrix.jsx";
import {
  getRFQQuotes,
  getRFQComparison,
  selectRFQVendor,
  rejectRFQVendor,
  sendRFQ,
} from "../lib/api";

const STATUS_STYLES = {
  draft: "bg-white/[0.06] text-white/60",
  guest_preview: "bg-sky-500/15 text-sky-400",
  project_hydrated: "bg-blue-500/15 text-blue-400",
  strategy: "bg-violet-500/15 text-violet-400",
  vendor_match: "bg-cyan-500/15 text-cyan-400",
  rfq_pending: "bg-amber-500/15 text-amber-400",
  rfq_sent: "bg-amber-500/15 text-amber-400",
  quote_compare: "bg-violet-500/15 text-violet-400",
  negotiation: "bg-pink-500/15 text-pink-400",
  vendor_selected: "bg-emerald-500/15 text-emerald-400",
  po_issued: "bg-blue-500/15 text-blue-400",
  in_production: "bg-blue-500/15 text-blue-400",
  qc_inspection: "bg-orange-500/15 text-orange-400",
  shipped: "bg-cyan-500/15 text-cyan-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  spend_recorded: "bg-emerald-500/15 text-emerald-400",
  completed: "bg-emerald-500/15 text-emerald-400",
  error: "bg-red-500/15 text-red-400",
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "strategy", label: "Strategy" },
  { id: "vendor-match", label: "Vendor match" },
  { id: "rfq", label: "RFQ" },
  { id: "comparison", label: "Comparison" },
  { id: "chat", label: "Chat" },
  { id: "order", label: "Order" },
  { id: "tracking", label: "Tracking" },
  { id: "analytics", label: "Analytics" },
  { id: "history", label: "History" },
];

const fmt = (n, d = 2) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="text-[10px] uppercase tracking-wider text-white/25">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/35">{hint}</p>}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [events, setEvents] = useState([]);
  const [trackingData, setTrackingData] = useState([]);
  const [rfqData, setRfqData] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [strategyRuns, setStrategyRuns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [rfqLoading, setRfqLoading] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);
  const [drawingFile, setDrawingFile] = useState(null);
  const [drawingUploading, setDrawingUploading] = useState(false);
  const [rfqQuotes, setRfqQuotes] = useState(null);
  const [rfqComparison, setRfqComparison] = useState(null);
  const [comparisonSortBy, setComparisonSortBy] = useState("total_cost");
  const [comparisonFilters, setComparisonFilters] = useState({ minVendorScore: "", maxCost: "", maxLeadTime: "", maxMoq: "",maxRisk: "",});                 
  const [comparisonLoading, setComparisonLoading] = useState(false);
   
  useEffect(() => {
  if (activeTab !== "comparison") return;
  if (!project?.current_rfq_id) return;

  const loadComparison = async () => {
    setComparisonLoading(true);
    try {
      const filters = {
        sort_by: comparisonSortBy,
        min_vendor_score: comparisonFilters.minVendorScore,
        max_cost: comparisonFilters.maxCost,
        max_lead_time: comparisonFilters.maxLeadTime,
        max_moq: comparisonFilters.maxMoq,
        max_risk: comparisonFilters.maxRisk,
      };
      const [quotes, comparison] = await Promise.all([
        getRFQQuotes(project.current_rfq_id),
        getRFQComparison(project.current_rfq_id, filters),
      ]);
      setRfqQuotes(quotes);
      setRfqComparison(comparison);
    } catch (err) {
      setError(err.message || "Failed to load RFQ comparison");
    } finally {
      setComparisonLoading(false);
    }
  };

  loadComparison();
}, [
  activeTab,
  project?.current_rfq_id,
  comparisonSortBy,
  comparisonFilters, // ✅ ADD THIS
]);
  useEffect(() => {
    if (authLoading) return;
    loadProject();
  }, [id, authLoading, user]);

  useEffect(() => {
    if (!project) return;
    loadOperationalData(project.current_rfq_id);
  }, [project?.current_rfq_id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const data = await getProject(id);
      setProject(data);
    } catch (err) {
      setError(err.message || "Project not found");
    } finally {
      setLoading(false);
    }
  };

  const loadOperationalData = async (rfqId) => {
    try {
      const next = await getProjectEvents(id);
      setEvents(next || []);

      if (rfqId) {
        try {
          const rfq = await getRFQ(rfqId);
          setRfqData(rfq);
        } catch {
          setRfqData(null);
        }

        try {
          const tracking = await getTracking(rfqId);
          setTrackingData(tracking || []);
        } catch {
          setTrackingData([]);
        }
      }
    } catch {
      setEvents([]);
    }
  };

  const handleRequestQuote = async () => {
    if (rfqLoading) return;
    setRfqLoading(true);
    try {
      await createRFQ(id);
      setRfqSuccess(true);
      await loadProject();
      await loadOperationalData(project?.current_rfq_id || id);
      setActiveTab("rfq");
    } catch (err) {
      setError(err.message || "Failed to create RFQ");
    } finally {
      setRfqLoading(false);
    }
  };

  const handleUploadDrawing = async () => {
    if (!drawingFile || !project?.current_rfq_id) return;
    setDrawingUploading(true);
    try {
      await uploadDrawing(project.current_rfq_id, drawingFile, "", "", null);
      setDrawingFile(null);
      await loadOperationalData(project.current_rfq_id);
    } catch (err) {
      setError(err.message || "Drawing upload failed");
    } finally {
      setDrawingUploading(false);
    }
  };

  const loadHistory = async () => {
    if (historyLoading) return;
    setHistoryLoading(true);
    try {
      const [snaps, runs] = await Promise.all([
        getProjectSnapshots(id),
        getStrategyRuns(id),
      ]);
      setSnapshots(snaps || []);
      setStrategyRuns(runs || []);
    } catch (err) {
      setError(err.message || "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const cardClass = "rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden";

  const stage = (project?.workflow_stage || project?.status || "draft").toLowerCase();
  const report = project?.analyzer_report || {};
  const strategy = project?.strategy || {};
  const s1 = report.section_1_executive_summary || {};
  const s2 = report.section_2_component_breakdown || [];
  const currency = s1.currency || strategy.currency || (project?.metadata || {}).currency || "USD";

  const groupedComponents = useMemo(() => {
    const groups = {};
    for (const item of s2) {
      const cat = item.category || "unknown";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return groups;
  }, [s2]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading project...</div>
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

  const nextAction = project.next_action || project?.metadata?.next_action || "Review project";

  const renderTab = () => {
    if (activeTab === "overview") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Stat label="Workflow stage" value={(project.workflow_stage || project.status || "draft").replace(/_/g, " ")} hint={nextAction} />
            <Stat label="Visibility" value={(project.visibility_level || project.visibility || "private").replace(/_/g, " ")} hint="Access control for the workspace" />
            <Stat label="RFQ status" value={(project.rfq_status || "none").replace(/_/g, " ")} hint={project.current_rfq_id ? "RFQ linked" : "No RFQ yet"} />
            <Stat label="Tracking" value={(project.tracking_stage || "init").replace(/_/g, " ")} hint={project.current_shipment_id ? "Shipment linked" : "No shipment yet"} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className={`${cardClass} xl:col-span-2`}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Project summary</h3>
              </div>
              <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Stat label="Estimated cost" value={`${currency} ${fmt(project.cost || project.average_cost || 0)}`} />
                <Stat label="Savings" value={project.savings_percent != null ? `${fmt(project.savings_percent)}%` : "—"} />
                <Stat label="Lead time" value={project.lead_time != null ? `${fmt(project.lead_time)} days` : "—"} />
                <Stat label="Recommended region" value={project.recommended_location || "—"} />
              </div>
              <div className="px-5 pb-5">
                <p className="text-sm text-white/55">{project.decision_summary || "No decision summary available yet."}</p>
              </div>
            </div>

            <div className={cardClass}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Next action</h3>
              </div>
              <div className="p-5">
                <p className="text-white text-lg font-semibold">{nextAction}</p>
                <p className="mt-2 text-sm text-white/35">
                  {project.workflow_stage === "rfq_pending" || project.workflow_stage === "rfq_sent"
                    ? "Send RFQs and collect vendor responses."
                    : project.workflow_stage === "quote_compare"
                      ? "Compare quotes and short-list vendors."
                      : project.workflow_stage === "in_production" || project.workflow_stage === "shipped"
                        ? "Track the current shipment and production milestones."
                        : "Review the project and continue the procurement flow."}
                </p>
                {project.workflow_stage === "project_hydrated" && (
                  <button
                    onClick={handleRequestQuote}
                    disabled={rfqLoading}
                    className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {rfqLoading ? "Creating RFQ..." : "Create RFQ"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <ProjectEventTimeline events={events} title="Project timeline" />
        </div>
      );
    }

    if (activeTab === "strategy") {
      const recommended = strategy.recommended_strategy || {};
      const partDecisions = strategy.part_level_decisions || [];
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Stat label="Best location" value={recommended.location || project.recommended_location || "—"} />
            <Stat label="Global optimization" value={strategy.global_optimization?.best_strategy_name || "—"} />
            <Stat label="Confidence" value={strategy.system_confidence != null ? `${fmt(strategy.system_confidence * 100, 1)}%` : "—"} />
          </div>

          <div className={cardClass}>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Strategy summary</h3>
            </div>
            <div className="p-5">
              <p className="text-white/70">{strategy.decision_summary || project.decision_summary || "No strategy summary yet."}</p>
              {recommended.reasons?.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-white/45">
                  {recommended.reasons.map((reason, idx) => (
                    <li key={idx}>• {reason}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={cardClass}>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Per-part decisions</h3>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {partDecisions.length === 0 ? (
                <div className="p-5 text-sm text-white/35">No part-level decisions available.</div>
              ) : (
                partDecisions.map((item, idx) => (
                  <div key={idx} className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{item.part_name || item.description || item.item_id || "Part"}</p>
                        <p className="text-xs text-white/35 mt-1">{item.category || "unknown"} · {item.best_region || "—"}</p>
                      </div>
                      <p className="text-sm text-white/70">{item.best_cost != null ? `${currency} ${fmt(item.best_cost)}` : "—"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "vendor-match") {
      return (
        <div className="space-y-6">
          <div className={cardClass}>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Vendor match state</h3>
            </div>
            <div className="p-5">
              <p className="text-white/70">
                The backend currently stores the canonical project record and RFQ state. Vendor shortlist scoring can be attached here next.
              </p>
              <p className="mt-3 text-sm text-white/40">
                Recommended region: {project.recommended_location || "—"}
              </p>
              <p className="text-sm text-white/40">
                Workflow stage: {(project.workflow_stage || project.status || "draft").replace(/_/g, " ")}
              </p>
            </div>
          </div>

          <div className={cardClass}>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Matching signals</h3>
            </div>
            <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Stat label="Category summary" value={Object.keys((project.categories || {})).length || 0} hint="From canonical BOM analysis" />
              <Stat label="Current vendor match" value={project.current_vendor_match_id || "—"} hint="Will populate after vendor ranking" />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "rfq") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">RFQ workspace</h3>
              <p className="text-sm text-white/35">Create or inspect the sourcing request from this project.</p>
            </div>
            <button
              onClick={handleRequestQuote}
              disabled={rfqLoading}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {rfqLoading ? "Creating..." : "Create RFQ"}
            </button>
          </div>

          <div className={cardClass}>
            <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Stat label="RFQ status" value={(project.rfq_status || "none").replace(/_/g, " ")} />
              <Stat label="Current RFQ" value={project.current_rfq_id || "—"} />
              <Stat label="Drawing files" value={drawingFile ? drawingFile.name : "No drawing selected"} />
            </div>
          </div>

          {rfqData ? (
            <div className={cardClass}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">RFQ summary</h3>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-white/45">RFQ ID: {rfqData.id}</p>
                <p className="text-sm text-white/45">Status: {rfqData.status}</p>
                <p className="text-sm text-white/45">Currency: {rfqData.currency || "USD"}</p>
                <p className="text-sm text-white/45">Final cost: {rfqData.total_final_cost ? `${currency} ${fmt(rfqData.total_final_cost)}` : "—"}</p>
              </div>
            </div>
          ) : (
            <div className={cardClass}>
              <div className="p-5 text-sm text-white/35">No RFQ loaded yet.</div>
            </div>
          )}

          <div className={cardClass}>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Drawings</h3>
            </div>
            <div className="p-5 space-y-3">
              <input
                type="file"
                onChange={(e) => setDrawingFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-white/55"
              />
              <button
                onClick={handleUploadDrawing}
                disabled={!drawingFile || drawingUploading || !project.current_rfq_id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50"
              >
                {drawingUploading ? "Uploading..." : "Upload drawing"}
              </button>
            </div>
          </div>
        </div>
      );
    }
if (activeTab === "comparison") {
  return (
    <div className="space-y-6">
      {!project?.current_rfq_id ? (
        <div className={cardClass}>
          <div className="p-5 text-sm text-white/35">
            No RFQ is attached to this project yet. Create and send an RFQ first.
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={async () => {
  await sendRFQ(project.current_rfq_id, {
    vendor_response_deadline_days: 7,
  });

  // Force reload comparison
  setComparisonLoading(true);
  try {
    const filters = {
      sort_by: comparisonSortBy,
      min_vendor_score: comparisonFilters.minVendorScore,
      max_cost: comparisonFilters.maxCost,
      max_lead_time: comparisonFilters.maxLeadTime,
      max_moq: comparisonFilters.maxMoq,
      max_risk: comparisonFilters.maxRisk,
    };

    const [quotes, comparison] = await Promise.all([
      getRFQQuotes(project.current_rfq_id),
      getRFQComparison(project.current_rfq_id, filters),
    ]);

    setRfqQuotes(quotes);
    setRfqComparison(comparison);
  } catch (err) {
    setError(err.message || "Failed to refresh RFQ");
  } finally {
    setComparisonLoading(false);
  }
}}
              className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Send / refresh RFQ
            </button>

            <span className="text-xs text-white/35">
              Quotes loaded: {rfqQuotes?.quote_history?.length || 0}
            </span>
          </div>

          {comparisonLoading ? (
            <div className="text-sm text-white/35">
              Loading quote comparison...
            </div>
          ) : (
            <RFQComparisonMatrix
              comparison={rfqComparison}
              sortBy={comparisonSortBy}
              setSortBy={setComparisonSortBy}
              filters={comparisonFilters}
              setFilters={setComparisonFilters}
              selectedVendorId={project.current_quote_id}
              onSelectVendor={async (payload) => {
                await selectRFQVendor(project.current_rfq_id, payload);
                await loadProject();
              }}
              onRejectVendor={async (payload) => {
                await rejectRFQVendor(project.current_rfq_id, payload);
                await loadProject();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

    if (activeTab === "chat") {
      return (
        <div className="space-y-6">
          <div className={cardClass}>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Negotiation thread</h3>
            </div>
            <div className="p-5 text-sm text-white/40">
              Chat and threaded negotiation history are not yet backed by a dedicated message model. This tab should connect to a future thread service.
            </div>
          </div>

          <ProjectEventTimeline events={events} title="Audit trail" />
        </div>
      );
    }

    if (activeTab === "order") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Stat label="PO" value={project.current_po_id || "—"} />
            <Stat label="Shipment" value={project.current_shipment_id || "—"} />
            <Stat label="Invoice" value={project.current_invoice_id || "—"} />
            <Stat label="Delivery" value={(project.workflow_stage || "draft").replace(/_/g, " ")} />
          </div>

          <div className={cardClass}>
            <div className="p-5 text-sm text-white/40">
              Purchase order placement should attach the PO record, vendor acceptance, and shipment booking to this project.
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "tracking") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Stat label="Production stage" value={(project.tracking_stage || "init").replace(/_/g, " ")} />
            <Stat label="Current RFQ" value={project.current_rfq_id || "—"} />
            <Stat label="Current shipment" value={project.current_shipment_id || "—"} />
          </div>

          <div className={cardClass}>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Tracking timeline</h3>
            </div>
            <div className="p-5">
              {trackingData.length === 0 ? (
                <p className="text-sm text-white/35">No tracking entries yet.</p>
              ) : (
                <div className="space-y-3">
                  {trackingData.map((item, idx) => (
                    <div key={`${item.rfq_id}-${item.stage}-${idx}`} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white">{item.stage}</p>
                        <p className="text-xs text-white/35">{item.progress_percent}%</p>
                      </div>
                      <p className="mt-1 text-xs text-white/40">{item.status_message || "No note"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "analytics") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Stat label="Cost" value={`${currency} ${fmt(project.cost || project.average_cost || 0)}`} />
            <Stat label="Savings" value={project.savings_percent != null ? `${fmt(project.savings_percent)}%` : "—"} />
            <Stat label="Lead time" value={project.lead_time != null ? `${fmt(project.lead_time)} days` : "—"} />
            <Stat label="Total parts" value={project.total_parts || 0} />
          </div>

          <ProjectEventTimeline events={events} title="Learning / event log" />
        </div>
      );
    }

    if (activeTab === "history") {
      return (
        <div className="space-y-6">
          {!historyLoading && snapshots.length === 0 && strategyRuns.length === 0 && (
            <div className="text-center">
              <button
                onClick={loadHistory}
                className="rounded-xl bg-sky-500/10 border border-sky-500/20 px-5 py-2.5 text-sm font-semibold text-sky-400 hover:bg-sky-500/20"
              >
                Load version history
              </button>
            </div>
          )}

          {historyLoading && <div className="text-sm text-white/35">Loading version history...</div>}

          {snapshots.length > 0 && (
            <div className={cardClass}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Report versions</h3>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {snapshots.map((snap) => (
                  <div key={snap.id} className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white">Version {snap.version}</p>
                        <p className="text-xs text-white/35">{snap.total_parts} parts · {snap.priority} priority</p>
                      </div>
                      <p className="text-xs text-white/35">{snap.created_at ? new Date(snap.created_at).toLocaleString() : "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {strategyRuns.length > 0 && (
            <div className={cardClass}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">Strategy runs</h3>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {strategyRuns.map((run) => (
                  <div key={run.id} className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white">Run v{run.version}</p>
                        <p className="text-xs text-white/35">{run.recommended_location || "—"} · {run.total_parts} parts</p>
                      </div>
                      <p className="text-xs text-white/35">{run.created_at ? new Date(run.created_at).toLocaleString() : "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ProjectEventTimeline events={events} title="Project events" />
        </div>
      );
    }

    return <div className="text-sm text-white/35">Tab not found.</div>;
  };

 return (
  <div className="min-h-screen bg-[#010409]">
    <section className="border-b border-white/[0.06]">
      <Container className="py-8">
        <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
          <Link to="/dashboard" className="hover:text-white/60 transition-colors">Control tower</Link>
          <span>/</span>
          <span className="text-white/60">{project.name || "Project"}</span>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{project.name || project.file_name || "Untitled BOM"}</h1>
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[stage] || STATUS_STYLES.draft}`}>
                {stage.replace(/_/g, " ")}
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

          <div className="flex flex-wrap gap-2">
            {project.workflow_stage === "project_hydrated" && !rfqSuccess && (
              <button
                onClick={handleRequestQuote}
                disabled={rfqLoading}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                {rfqLoading ? "Creating RFQ..." : "Create RFQ"}
              </button>
            )}

            <Link
              to="/bom-analyzer"
              className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
            >
              New Analysis
            </Link>

            {/* ✅ 13.1 Vendor Discovery Button (UNCHANGED, CORRECT) */}
            <Link
              to={`/project/${id}/vendors`}
              className="px-4 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/15 border border-sky-500/20 text-sky-400 text-sm font-semibold transition-all"
            >
              Discover Vendors
            </Link>
          </div>
        </div>
      </Container>
    </section>

    <section className="border-b border-white/[0.06]">
      <Container className="py-4">
        <div className="flex gap-2 overflow-x-auto">
          {[
            ...TABS,
            { id: "vendors", label: "Vendors" } // ✅ 13.2 Add Vendors tab
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                  : "bg-white/[0.03] text-white/45 border border-white/[0.06] hover:bg-white/[0.05]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Container>
    </section>

    <Container className="py-8">

      {/* ✅ EXISTING TAB RENDER */}
      {renderTab()}

      {/* ✅ 13.3 Vendor Tab Body (NEW — NON-DESTRUCTIVE) */}
      {activeTab === "vendors" && (
        <div className={cardClass}>
          <div className="p-6">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
              Vendor discovery
            </h3>

            <p className="text-white/60 text-sm leading-relaxed">
              Open the ranked shortlist, vendor profile drawer, match reasons, and filters for geography, certifications, MOQ, lead time, and price.
            </p>

            <div className="mt-5">
              <Link
                to={`/project/${id}/vendors`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 transition-all"
              >
                Open vendor discovery
              </Link>
            </div>
          </div>
        </div>
      )}

    </Container>
  </div>
 );
}