import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import { getProjectMetrics, getSpendAnalytics, listProjects } from "../lib/api";

const STATUS_CONFIG = {
  draft: { bg: "rgba(255,255,255,0.04)", text: "rgba(255,255,255,0.55)" },
  guest_preview: { bg: "rgba(249,115,22,0.08)", text: "#fb923c" },
  project_hydrated: { bg: "rgba(96,165,250,0.08)", text: "#60a5fa" },
  strategy: { bg: "rgba(167,139,250,0.08)", text: "#a78bfa" },
  vendor_match: { bg: "rgba(34,211,238,0.08)", text: "#22d3ee" },
  rfq_pending: { bg: "rgba(251,191,36,0.08)", text: "#fbbf24" },
  rfq_sent: { bg: "rgba(251,191,36,0.08)", text: "#fbbf24" },
  quote_compare: { bg: "rgba(167,139,250,0.08)", text: "#a78bfa" },
  negotiation: { bg: "rgba(244,114,182,0.08)", text: "#f472b6" },
  vendor_selected: { bg: "rgba(52,211,153,0.08)", text: "#34d399" },
  po_issued: { bg: "rgba(96,165,250,0.08)", text: "#60a5fa" },
  in_production: { bg: "rgba(96,165,250,0.08)", text: "#60a5fa" },
  qc_inspection: { bg: "rgba(251,146,60,0.08)", text: "#fb923c" },
  shipped: { bg: "rgba(34,211,238,0.08)", text: "#22d3ee" },
  delivered: { bg: "rgba(52,211,153,0.08)", text: "#34d399" },
  spend_recorded: { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  completed: { bg: "rgba(52,211,153,0.08)", text: "#34d399" },
  error: { bg: "rgba(239,68,68,0.08)", text: "#ef4444" },
};

function fmt(n, digits = 2) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/* ── Premium KPI Card ──────────────────────────────────── */
function Card({ title, value, hint, accent = false, icon }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5 transition-all duration-300 hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/5">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/[0.04] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-white/40">{title}</p>
        <p className={`mt-2.5 text-2xl font-bold tracking-tight ${accent ? "text-orange-400" : "text-white"}`}>{value}</p>
        {hint && <p className="mt-2 text-[11px] text-white/35 leading-relaxed">{hint}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [spendAnalytics, setSpendAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, metricData, spendData] = await Promise.all([
        listProjects(),
        getProjectMetrics(),
        getSpendAnalytics(),
      ]);
      setProjects(projectData || []);
      setMetrics(metricData || null);
      setSpendAnalytics(spendData || null);
    } catch (err) {
      setError(err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadDashboard();
  }, [authLoading, user]);

  const visibleProjects = useMemo(() => {
    return [...projects]
      .filter((p) => {
        const stage = (p.workflow_stage || p.status || "").toLowerCase();
        if (statusFilter !== "all" && stage !== statusFilter) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          (p.name || "").toLowerCase().includes(q) ||
          (p.file_name || "").toLowerCase().includes(q) ||
          (p.recommended_location || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return new Date(a.created_at || 0) - new Date(b.created_at || 0);
          case "cost_high":
            return (Number(b.cost) || 0) - (Number(a.cost) || 0);
          case "cost_low":
            return (Number(a.cost) || 0) - (Number(b.cost) || 0);
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          default:
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  const uniqueStages = useMemo(() => {
    return [...new Set(projects.map((p) => (p.workflow_stage || p.status || "").toLowerCase()).filter(Boolean))];
  }, [projects]);

  const metricsFallback = {
    total_projects: projects.length,
    pending_approvals: 0,
    active_rfqs: 0,
    delayed_shipments: 0,
    spend_alerts: 0,
    total_spend: projects.reduce((s, p) => s + (Number(p.cost) || 0), 0),
    average_savings_percent:
      projects.filter((p) => Number(p.savings_percent) > 0).length > 0
        ? projects
            .filter((p) => Number(p.savings_percent) > 0)
            .reduce((s, p) => s + Number(p.savings_percent || 0), 0) /
          projects.filter((p) => Number(p.savings_percent) > 0).length
        : 0,
    pending_approval_items: [],
    active_rfq_items: [],
    delayed_shipment_items: [],
    spend_alert_items: [],
    next_actions: [],
  };

  const m = metrics || metricsFallback;
  const statusOf = (stage) => STATUS_CONFIG[stage] || STATUS_CONFIG.draft;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #06060a 0%, #0a0a10 100%)" }}>
      {/* ── Hero Header ────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-orange-500/[0.05] to-transparent rounded-full blur-3xl pointer-events-none" />
        <Container className="relative py-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-400/70">Live</span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Control Tower</h1>
              <p className="mt-1.5 text-white/40 text-sm">
                {user?.full_name ? `Welcome back, ${user.full_name}` : "Operational overview for BOM journeys"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/analytics"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.06] hover:text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                Analytics
              </Link>
              <Link
                to="/bom-analyzer"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                New Analysis
              </Link>
            </div>
          </div>

          {/* ── KPI Cards ────────────────────────────────── */}
          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            <Card title="Pending approvals" value={m.pending_approvals || 0} hint="Quotes / PO / selection tasks" accent />
            <Card title="Active RFQs" value={m.active_rfqs || 0} hint="Open sourcing requests" />
            <Card title="Delayed shipments" value={m.delayed_shipments || 0} hint="Tracking needs attention" />
            <Card title="Spend alerts" value={m.spend_alerts || 0} hint="Budget or savings anomalies" />
            <Card title="Total spend" value={fmt(m.total_spend || 0)} hint={`Avg savings ${fmt(m.average_savings_percent || 0)}%`} />
          </div>

          {/* ── Retention Engine ──────────────────────────── */}
          <div className="mt-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.025] to-transparent p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Retention engine</h2>
              <Link to="/analytics" className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Open analytics →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Card title="Committed spend" value={fmt(spendAnalytics?.totals?.committed_spend || 0)} />
              <Card title="Paid spend" value={fmt(spendAnalytics?.totals?.paid_spend || 0)} />
              <Card title="Savings realized" value={fmt(spendAnalytics?.totals?.savings_realized || 0)} />
              <Card
                title="Vendor on-time rate"
                value={spendAnalytics?.vendor_on_time_rate != null ? `${fmt(spendAnalytics.vendor_on_time_rate * 100, 1)}%` : "—"}
              />
            </div>
          </div>

          {/* ── Next Actions ──────────────────────────────── */}
          {m.next_actions?.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.025] to-transparent p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Next actions</h2>
                <span className="text-[10px] text-white/25 font-medium">{m.next_actions.length} queued</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {m.next_actions.slice(0, 4).map((item) => (
                  <button
                    key={item.project_id}
                    onClick={() => navigate(`/project/${item.project_id}/workspace`)}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all hover:bg-white/[0.04] hover:border-orange-500/15"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{item.name || "Untitled project"}</p>
                      <span className="text-[10px] uppercase tracking-wider text-white/30">
                        {item.workflow_stage || item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-orange-400 font-medium">{item.action}</p>
                    <p className="mt-1 text-[11px] text-white/30">{item.reason}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ── Projects Section ────────────────────────────── */}
      <Container className="py-8">
        {loading && (
          <div className="flex items-center gap-3 text-sm text-white/35">
            <div className="w-4 h-4 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            Loading projects...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-red-300 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* ── Filters ──────────────────────────────────── */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none appearance-none cursor-pointer hover:border-white/[0.12] transition-all"
              >
                <option value="all">All stages</option>
                {uniqueStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none appearance-none cursor-pointer hover:border-white/[0.12] transition-all"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="cost_high">Cost high</option>
                <option value="cost_low">Cost low</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={loadDashboard}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                Refresh
              </button>
            </div>

            {/* ── Main Grid ────────────────────────────────── */}
            <div className="grid gap-6 xl:grid-cols-3">
              {/* ── Projects List ──────────────────────────── */}
              <div className="xl:col-span-2">
                <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.025] to-transparent">
                  <div className="border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Projects</h2>
                    <span className="text-[10px] text-white/25">{visibleProjects.length} total</span>
                  </div>

                  <div className="divide-y divide-white/[0.04]">
                    {visibleProjects.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                          <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
                        </div>
                        <p className="text-sm text-white/35">No projects match your filters.</p>
                      </div>
                    ) : (
                      visibleProjects.map((project) => {
                        const stage = (project.workflow_stage || project.status || "draft").toLowerCase();
                        const style = statusOf(stage);
                        return (
                          <button
                            key={project.project_id}
                            onClick={() => navigate(`/project/${project.project_id}/workspace`)}
                            className="w-full p-5 text-left transition-all hover:bg-white/[0.02] group"
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-[15px] font-semibold text-white group-hover:text-orange-300 transition-colors truncate">
                                    {project.name || project.file_name || "Untitled BOM"}
                                  </h3>
                                  <span
                                    className="shrink-0 rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                                    style={{ background: style.bg, color: style.text }}
                                  >
                                    {stage.replace(/_/g, " ")}
                                  </span>
                                </div>
                                <p className="mt-1.5 text-[11px] text-white/30">
                                  {project.total_parts || 0} parts · {project.recommended_location || "No location"} · {project.rfq_status || "none"}
                                </p>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-right md:min-w-[340px]">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-white/20 mb-0.5">Cost</p>
                                  <p className="text-sm font-medium text-white">{fmt(project.cost || project.average_cost || 0)}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-white/20 mb-0.5">Savings</p>
                                  <p className="text-sm font-medium text-emerald-400">
                                    {project.savings_percent != null ? `${fmt(project.savings_percent)}%` : "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-white/20 mb-0.5">Lead time</p>
                                  <p className="text-sm font-medium text-white">{project.lead_time != null ? `${fmt(project.lead_time)} days` : "—"}</p>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* ── Sidebar Panels ──────────────────────────── */}
              <div className="space-y-5">
                {/* Pending Approvals */}
                <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.025] to-transparent p-5">
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
                    Pending approvals
                  </h2>
                  <div className="space-y-2.5">
                    {(m.pending_approval_items || []).length === 0 ? (
                      <p className="text-sm text-white/30">No approval blockers.</p>
                    ) : (
                      m.pending_approval_items.slice(0, 4).map((item) => (
                        <button
                          key={item.project_id}
                          onClick={() => navigate(`/project/${item.project_id}/workspace`)}
                          className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 text-left transition-all hover:bg-white/[0.04] hover:border-orange-500/15"
                        >
                          <p className="text-sm font-medium text-white">{item.name || "Untitled project"}</p>
                          <p className="mt-1 text-[11px] text-white/30">{item.action}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Delayed Shipments */}
                <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.025] to-transparent p-5">
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                    Delayed shipments
                  </h2>
                  <div className="space-y-2.5">
                    {(m.delayed_shipment_items || []).length === 0 ? (
                      <p className="text-sm text-white/30">No shipment delays.</p>
                    ) : (
                      m.delayed_shipment_items.slice(0, 4).map((item) => (
                        <button
                          key={item.project_id}
                          onClick={() => navigate(`/project/${item.project_id}/workspace`)}
                          className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 text-left transition-all hover:bg-white/[0.04] hover:border-orange-500/15"
                        >
                          <p className="text-sm font-medium text-white">{item.name || "Untitled project"}</p>
                          <p className="mt-1 text-[11px] text-white/30">{item.reason}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Spend Alerts */}
                <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.025] to-transparent p-5">
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                    Spend alerts
                  </h2>
                  <div className="space-y-2.5">
                    {(m.spend_alert_items || []).length === 0 ? (
                      <p className="text-sm text-white/30">No spend alerts.</p>
                    ) : (
                      m.spend_alert_items.slice(0, 4).map((item) => (
                        <button
                          key={item.project_id}
                          onClick={() => navigate(`/project/${item.project_id}/workspace`)}
                          className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 text-left transition-all hover:bg-white/[0.04] hover:border-orange-500/15"
                        >
                          <p className="text-sm font-medium text-white">{item.name || "Untitled project"}</p>
                          <p className="mt-1 text-[11px] text-white/30">{item.reason}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
