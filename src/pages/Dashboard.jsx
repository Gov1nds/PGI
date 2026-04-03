import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import {
  getProjectMetrics,
  getSpendAnalytics,
  getVendorAnalytics,
  getCategoryAnalytics,
  getTrendAnalytics,
  getSavingsAnalytics,
  listProjects,
} from "../lib/api";

const STATUS_CONFIG = {
  draft: { bg: "rgba(255,255,255,0.04)", text: "rgba(255,255,255,0.55)" },
  guest_preview: { bg: "rgba(139,92,246,0.08)", text: "#a78bfa" },
  project_hydrated: { bg: "rgba(96,165,250,0.08)", text: "#60a5fa" },
  strategy: { bg: "rgba(167,139,250,0.08)", text: "#a78bfa" },
  vendor_match: { bg: "rgba(34,211,238,0.08)", text: "#22d3ee" },
  rfq_pending: { bg: "rgba(129,140,248,0.08)", text: "#818cf8" },
  rfq_sent: { bg: "rgba(129,140,248,0.08)", text: "#818cf8" },
  quote_compare: { bg: "rgba(167,139,250,0.08)", text: "#a78bfa" },
  negotiation: { bg: "rgba(244,114,182,0.08)", text: "#f472b6" },
  vendor_selected: { bg: "rgba(52,211,153,0.08)", text: "#34d399" },
  po_issued: { bg: "rgba(96,165,250,0.08)", text: "#60a5fa" },
  in_production: { bg: "rgba(96,165,250,0.08)", text: "#60a5fa" },
  qc_inspection: { bg: "rgba(167,139,250,0.08)", text: "#a78bfa" },
  shipped: { bg: "rgba(34,211,238,0.08)", text: "#22d3ee" },
  delivered: { bg: "rgba(52,211,153,0.08)", text: "#34d399" },
  spend_recorded: { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  completed: { bg: "rgba(52,211,153,0.08)", text: "#34d399" },
  error: { bg: "rgba(239,68,68,0.08)", text: "#ef4444" },
};

const PIE_COLORS = [
  "#8b5cf6",
  "#a78bfa",
  "#60a5fa",
  "#818cf8",
  "#c084fc",
  "#38bdf8",
  "#34d399",
  "#f472b6",
];
const LINE_COLORS = ["#8b5cf6", "#a78bfa", "#60a5fa", "#818cf8"];

function fmt(n, digits = 2) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function Card({ title, value, hint, accent = false }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827] p-5 transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/[0.04]">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-500/[0.03] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-white/40">
          {title}
        </p>
        <p
          className={`mt-2.5 text-2xl font-bold tracking-tight ${accent ? "text-violet-400" : "text-white"}`}
        >
          {value}
        </p>
        {hint && (
          <p className="mt-2 text-[11px] text-white/35 leading-relaxed">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#111827] overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-xs text-white/30">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-white/35">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function progressValue(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function firstArray(source, keys) {
  if (!source || typeof source !== "object") return [];
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function normalizeSeries(input, xKeyOptions, yKeyOptions) {
  const arr = Array.isArray(input) ? input : [];
  return arr.map((item, idx) => {
    if (item == null || typeof item !== "object") {
      return { label: String(idx + 1), value: Number(item) || 0 };
    }
    let label = "";
    for (const key of xKeyOptions) {
      if (item[key] != null && item[key] !== "") {
        label = String(item[key]);
        break;
      }
    }
    if (!label) label = String(idx + 1);

    let value = 0;
    for (const key of yKeyOptions) {
      const raw = item[key];
      if (raw != null && raw !== "") {
        value = Number(raw) || 0;
        break;
      }
    }
    return {
      ...item,
      label,
      value,
    };
  });
}

function getProjectName(project) {
  return (
    project?.name ||
    project?.project_name ||
    project?.file_name ||
    project?.bom_name ||
    "Untitled project"
  );
}

function getProjectId(project) {
  return project?.project_id || project?.id || project?.projectId || null;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [spendAnalytics, setSpendAnalytics] = useState(null);
  const [vendorAnalytics, setVendorAnalytics] = useState(null);
  const [categoryAnalytics, setCategoryAnalytics] = useState(null);
  const [trendAnalytics, setTrendAnalytics] = useState(null);
  const [savingsAnalytics, setSavingsAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    const settled = await Promise.allSettled([
      listProjects(),
      getProjectMetrics(),
      getSpendAnalytics(),
      getVendorAnalytics(),
      getCategoryAnalytics(),
      getTrendAnalytics(),
      getSavingsAnalytics(),
    ]);

    const [
      projectsRes,
      metricsRes,
      spendRes,
      vendorRes,
      categoryRes,
      trendRes,
      savingsRes,
    ] = settled;

    try {
      setProjects(
        projectsRes.status === "fulfilled" ? projectsRes.value || [] : [],
      );
      setMetrics(
        metricsRes.status === "fulfilled" ? metricsRes.value || null : null,
      );
      setSpendAnalytics(
        spendRes.status === "fulfilled" ? spendRes.value || null : null,
      );
      setVendorAnalytics(
        vendorRes.status === "fulfilled" ? vendorRes.value || null : null,
      );
      setCategoryAnalytics(
        categoryRes.status === "fulfilled" ? categoryRes.value || null : null,
      );
      setTrendAnalytics(
        trendRes.status === "fulfilled" ? trendRes.value || null : null,
      );
      setSavingsAnalytics(
        savingsRes.status === "fulfilled" ? savingsRes.value || null : null,
      );

      const failed = settled.filter((s) => s.status === "rejected");
      if (failed.length === 7) {
        throw new Error("Failed to load dashboard");
      }
    } catch (err) {
      setError(err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const visibleProjects = useMemo(() => {
    return [...projects]
      .filter((p) => {
        const stage = (p.workflow_stage || p.status || "").toLowerCase();
        if (statusFilter !== "all" && stage !== statusFilter) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          getProjectName(p).toLowerCase().includes(q) ||
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
            return getProjectName(a).localeCompare(getProjectName(b));
          default:
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  const latestProject = visibleProjects[0] || projects[0] || null;
  const latestProjectId = getProjectId(latestProject);

  const uniqueStages = useMemo(() => {
    return [
      ...new Set(
        projects
          .map((p) => (p.workflow_stage || p.status || "").toLowerCase())
          .filter(Boolean),
      ),
    ];
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
    notifications: [],
    quote_comparison_items: [],
    collaboration_items: [],
    order_items: [],
  };

  const m = metrics || metricsFallback;
  const nextActions = safeArray(m.next_actions);
  const topActions = nextActions.length
    ? nextActions
    : [
        {
          title: "Continue project",
          message: "Open the latest active project",
          project_id: latestProjectId,
          action: "continue",
        },
        {
          title: "Send RFQ",
          message: "Move an active project into sourcing",
          project_id: latestProjectId,
          action: "rfq",
        },
        {
          title: "Review quotes",
          message: "Compare vendor responses",
          project_id: latestProjectId,
          action: "compare",
        },
        {
          title: "Confirm delivery",
          message: "Close the fulfillment loop",
          project_id: latestProjectId,
          action: "tracking",
        },
      ];

  const totalSpend =
    Number(
      spendAnalytics?.totals?.committed_spend ??
        spendAnalytics?.committed_spend ??
        m.total_spend ??
        0,
    ) || 0;
  const paidSpend =
    Number(
      spendAnalytics?.totals?.paid_spend ?? spendAnalytics?.paid_spend ?? 0,
    ) || 0;
  const savingsRealized =
    Number(
      spendAnalytics?.totals?.savings_realized ??
        spendAnalytics?.savings_realized ??
        0,
    ) || 0;
  const monthlySpendSeries = normalizeSeries(
    firstArray(trendAnalytics, ["monthly_spend", "trends", "data", "series"]) ||
      firstArray(spendAnalytics, [
        "monthly_spend",
        "trends",
        "data",
        "series",
      ]) ||
      [],
    ["month", "label", "date", "period", "name"],
    ["spend", "value", "amount", "total", "cost"],
  );

  const categorySeries = normalizeSeries(
    firstArray(categoryAnalytics, [
      "categories",
      "data",
      "series",
      "spend_by_category",
    ]) ||
      firstArray(spendAnalytics, [
        "categories",
        "data",
        "series",
        "spend_by_category",
      ]) ||
      [],
    ["category", "label", "name"],
    ["spend", "value", "amount", "total", "cost"],
  );

  const vendorSeries = normalizeSeries(
    firstArray(vendorAnalytics, [
      "vendors",
      "data",
      "series",
      "top_vendors",
      "spend_by_vendor",
    ]) ||
      firstArray(spendAnalytics, [
        "vendors",
        "data",
        "series",
        "top_vendors",
        "spend_by_vendor",
      ]) ||
      [],
    ["vendor", "vendor_name", "name", "label"],
    ["spend", "value", "amount", "total", "cost"],
  );

  const savingsSeries = normalizeSeries(
    firstArray(savingsAnalytics, ["savings", "data", "series", "trend"]) ||
      firstArray(spendAnalytics, ["savings", "data", "series", "trend"]) ||
      [],
    ["month", "label", "date", "period", "name"],
    ["savings", "value", "amount", "total", "cost"],
  );

  const recentUploads = visibleProjects.slice(0, 5);
  const activeRfqItems = safeArray(m.active_rfq_items).length
    ? safeArray(m.active_rfq_items)
    : projects
        .filter((p) =>
          ["rfq_pending", "rfq_sent", "quote_compare", "negotiation"].includes(
            (p.workflow_stage || p.status || "").toLowerCase(),
          ),
        )
        .slice(0, 4)
        .map((p, idx) => ({
          id: getProjectId(p) || idx,
          name: getProjectName(p),
          progress: progressValue(p.progress_percent || 35),
          deadline: p.rfq_deadline || p.due_date || "—",
          status: p.workflow_stage || p.status,
        }));

  const quoteComparisonRows = safeArray(m.quote_comparison_items).length
    ? safeArray(m.quote_comparison_items)
    : (m.recommended_quote_items || m.quote_items || []).slice(0, 4);

  const collaborationItems = safeArray(m.collaboration_items).length
    ? safeArray(m.collaboration_items)
    : safeArray(m.notifications).slice(0, 4);

  const notificationItems = [
    ...(safeArray(m.notifications) || []),
    ...(safeArray(m.pending_approval_items) || []).map((item) => ({
      title: "Approval needed",
      message: item.action || "Pending approval task",
      type: "warning",
    })),
    ...(safeArray(m.delayed_shipment_items) || []).map((item) => ({
      title: "Shipment delayed",
      message: item.reason || "Tracking exception",
      type: "error",
    })),
    ...(safeArray(m.active_rfq_items) || []).slice(0, 2).map((item) => ({
      title: "RFQ active",
      message: item.name || "Open sourcing request",
      type: "info",
    })),
  ]
    .filter(Boolean)
    .slice(0, 6);

  const quickActions = [
    {
      label: "Start New Project",
      to: "/bom-analyzer",
      primary: true,
    },
    {
      label: "Upload BOM (Excel/CSV)",
      to: "/bom-analyzer",
      primary: false,
    },
    {
      label: "View Analytics",
      to: "/analytics",
      primary: false,
    },
  ];

  const goToWorkspace = (section = "") => {
    if (!latestProjectId) return navigate("/bom-analyzer");
    navigate(`/project/${latestProjectId}/workspace`);
  };

  const sidebarItems = [
    { label: "Dashboard", action: () => navigate("/dashboard") },
    { label: "BOM Management", action: () => navigate("/bom-analyzer") },
    { label: "Vendor Matching", action: goToWorkspace },
    { label: "RFQ Workflow", action: goToWorkspace },
    { label: "Quote Comparison", action: goToWorkspace },
    { label: "Collaboration", action: goToWorkspace },
    { label: "Order Tracking", action: goToWorkspace },
    { label: "Analytics & Insights", action: () => navigate("/analytics") },
  ];

  const statusOf = (stage) => STATUS_CONFIG[stage] || STATUS_CONFIG.draft;

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <div className="flex min-h-screen">
        {/* Left rail */}
        <aside className="hidden xl:flex w-[260px] shrink-0 flex-col border-r border-white/[0.08] bg-[#111827]">
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.08]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 font-bold">
              P
            </div>
            <div>
              <div className="text-sm font-semibold">ProcureFlow AI</div>
              <div className="text-[11px] text-white/30">Control tower</div>
            </div>
          </div>

          <div className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {sidebarItems.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    idx === 0
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-50" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.08] p-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                User
              </p>
              <p className="mt-1 text-sm font-medium">
                {user?.full_name || "Guest user"}
              </p>
              <p className="text-xs text-white/30">
                {user?.email || "Not signed in"}
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#111827]/95 backdrop-blur-md">
            <Container className="py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 font-bold xl:hidden">
                    P
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Dashboard
                    </h1>
                    <p className="text-sm text-white/35">
                      {user?.full_name
                        ? `Welcome back, ${user.full_name}`
                        : "Operational overview for BOM journeys"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-center gap-3 lg:max-w-[720px] lg:justify-center">
                  <div className="relative flex-1">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects, BOMs, vendors..."
                      className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 pl-11 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-500/30 transition"
                    />
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
                      ⌕
                    </span>
                  </div>

                  <button
                    onClick={loadDashboard}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.08]"
                  >
                    Refresh
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <div className="relative">
                    <button
                      onClick={() => setNotificationsOpen((s) => !s)}
                      className="relative rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.07]"
                    >
                      Notifications
                      {notificationItems.length > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                          {notificationItems.length}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="absolute right-0 mt-3 w-[320px] rounded-2xl border border-white/[0.08] bg-[#111827] p-3 shadow-2xl shadow-black/40">
                        <div className="mb-3 flex items-center justify-between px-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                            Notifications
                          </p>
                          <button
                            onClick={() => setNotificationsOpen(false)}
                            className="text-xs text-white/30 hover:text-white/60"
                          >
                            Close
                          </button>
                        </div>
                        <div className="space-y-2 max-h-[380px] overflow-auto pr-1">
                          {notificationItems.length === 0 ? (
                            <p className="px-2 py-4 text-sm text-white/35">
                              No notifications.
                            </p>
                          ) : (
                            notificationItems.map((item, idx) => (
                              <div
                                key={`${item.title || item.message || idx}`}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-3"
                              >
                                <div className="flex items-start gap-2">
                                  <span
                                    className={`mt-1 h-2.5 w-2.5 rounded-full ${item.type === "error" ? "bg-red-400" : item.type === "warning" ? "bg-indigo-400" : "bg-emerald-400"}`}
                                  />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-white">
                                      {item.title || item.name || "Alert"}
                                    </p>
                                    <p className="mt-1 text-xs text-white/35">
                                      {item.message ||
                                        item.reason ||
                                        item.action ||
                                        "Update available"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-10 w-10 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.04]">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/80">
                        {user?.full_name
                          ? user.full_name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.to)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      action.primary
                        ? "bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20"
                        : "border border-white/[0.08] bg-white/[0.05] text-white/70 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </Container>
          </header>

          <Container className="py-8">
            {loading && (
              <div className="flex items-center gap-3 text-sm text-white/35">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />
                Loading dashboard...
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-red-300 text-sm">
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Summary strip */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                  <Card
                    title="Pending approvals"
                    value={m.pending_approvals || 0}
                    hint="Quotes / PO / selection tasks"
                    accent
                  />
                  <Card
                    title="Active RFQs"
                    value={m.active_rfqs || 0}
                    hint="Open sourcing requests"
                  />
                  <Card
                    title="Delayed shipments"
                    value={m.delayed_shipments || 0}
                    hint="Tracking needs attention"
                  />
                  <Card
                    title="Spend alerts"
                    value={m.spend_alerts || 0}
                    hint="Budget or savings anomalies"
                  />
                  <Card
                    title="Total spend"
                    value={fmt(totalSpend)}
                    hint={`Avg savings ${fmt(m.average_savings_percent || 0)}%`}
                  />
                </div>

                <div className="mt-6">
                  <Panel
                    title="Action queue"
                    subtitle="What needs attention first"
                    className="mb-6"
                  >
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {topActions.slice(0, 4).map((item, idx) => (
                        <button
                          key={item.project_id || item.id || item.name || idx}
                          onClick={() => {
                            if (item.project_id) {
                              navigate(
                                `/project/${item.project_id}${item.action === "tracking" ? "/workspace" : ""}`,
                              );
                              return;
                            }
                            navigate("/bom-analyzer");
                          }}
                          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-left hover:bg-white/[0.07] transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {item.title || item.name || "Next action"}
                              </p>
                              <p className="mt-1 text-xs text-white/35">
                                {item.message ||
                                  item.reason ||
                                  item.action ||
                                  "Proceed with the workflow"}
                              </p>
                            </div>
                            <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                              {item.action || item.workflow_stage || "open"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Panel>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_0.95fr]">
                  {/* Left: core control tower */}
                  <div className="space-y-6">
                    {/* Recent uploads + vendor shortlist */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                      <Panel
                        title="Recent BOM uploads"
                        subtitle="Normalized, analyzed, and ready for sourcing"
                        action={
                          <button
                            onClick={() => navigate("/bom-analyzer")}
                            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.08]"
                          >
                            Upload BOM
                          </button>
                        }
                      >
                        <div className="space-y-3">
                          {recentUploads.length === 0 ? (
                            <p className="text-sm text-white/35">
                              No projects yet.
                            </p>
                          ) : (
                            recentUploads.map((project) => {
                              const stage = (
                                project.workflow_stage ||
                                project.status ||
                                "draft"
                              ).toLowerCase();
                              const style = statusOf(stage);
                              return (
                                <button
                                  key={getProjectId(project)}
                                  onClick={() =>
                                    navigate(
                                      `/project/${getProjectId(project)}/workspace`,
                                    )
                                  }
                                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] p-4 text-left transition hover:bg-white/[0.05] hover:border-violet-500/15"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-medium text-white">
                                        {getProjectName(project)}
                                      </p>
                                      <p className="mt-1 text-xs text-white/35">
                                        {project.analysis_status ||
                                          "Normalized"}{" "}
                                        ·{" "}
                                        {project.recommended_location ||
                                          "No location"}{" "}
                                        · {project.total_parts || 0} parts
                                      </p>
                                    </div>
                                    <span
                                      className="rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                                      style={{
                                        background: style.bg,
                                        color: style.text,
                                      }}
                                    >
                                      {(
                                        project.workflow_stage ||
                                        project.status ||
                                        "draft"
                                      ).replace(/_/g, " ")}
                                    </span>
                                  </div>
                                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                                      style={{
                                        width: `${Math.min(100, Math.max(20, Number(project.progress_percent || 35)))}%`,
                                      }}
                                    />
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </Panel>

                      <Panel
                        title="AI-driven vendor matching"
                        subtitle="Recommended vendor shortlist for the active project"
                        action={
                          <button
                            onClick={goToWorkspace}
                            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.08]"
                          >
                            Open project
                          </button>
                        }
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/45">
                              {latestProject
                                ? getProjectName(latestProject)
                                : "All projects"}
                            </div>
                            <div className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/45">
                              {vendorSeries.length} vendors
                            </div>
                          </div>

                          {vendorSeries.length === 0 ? (
                            <p className="text-sm text-white/35">
                              No vendor analytics available yet.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {vendorSeries.slice(0, 4).map((vendor, idx) => (
                                <div
                                  key={`${vendor.label}-${idx}`}
                                  className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-medium text-white">
                                        {vendor.label}
                                      </p>
                                      <p className="mt-1 text-xs text-white/35">
                                        Match score{" "}
                                        {fmt(
                                          vendor.score ||
                                            vendor.value ||
                                            vendor.match_score ||
                                            0,
                                          0,
                                        )}{" "}
                                        · supplier fit
                                      </p>
                                    </div>
                                    <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">
                                      Preferred
                                    </span>
                                  </div>
                                  <div className="mt-3 h-1.5 rounded-full bg-white/[0.04]">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                                      style={{
                                        width: `${Math.max(10, Math.min(100, Number(vendor.value || vendor.score || 0)))}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Panel>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                      <Panel
                        title="BOM smart report summary"
                        subtitle="Spend by category and obsolescence risk"
                      >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={
                                    categorySeries.length
                                      ? categorySeries
                                      : [{ label: "No data", value: 1 }]
                                  }
                                  dataKey="value"
                                  nameKey="label"
                                  innerRadius={58}
                                  outerRadius={85}
                                  paddingAngle={3}
                                >
                                  {(categorySeries.length
                                    ? categorySeries
                                    : [{ label: "No data", value: 1 }]
                                  ).map((entry, idx) => (
                                    <Cell
                                      key={`cell-${idx}`}
                                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={normalizeSeries(
                                  firstArray(spendAnalytics, [
                                    "obsolescence_risks",
                                    "risk_items",
                                    "flags",
                                    "series",
                                  ]) || [],
                                  ["label", "name", "category"],
                                  ["value", "risk", "count", "score"],
                                )}
                              >
                                <CartesianGrid
                                  stroke="rgba(255,255,255,0.06)"
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="label"
                                  tick={{
                                    fill: "rgba(255,255,255,0.35)",
                                    fontSize: 11,
                                  }}
                                />
                                <YAxis
                                  tick={{
                                    fill: "rgba(255,255,255,0.35)",
                                    fontSize: 11,
                                  }}
                                />
                                <Tooltip />
                                <Bar
                                  dataKey="value"
                                  radius={[8, 8, 0, 0]}
                                  fill="#8b5cf6"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </Panel>

                      <Panel
                        title="Estimated costing & spend insights"
                        subtitle="Monthly spend and savings trend"
                      >
                        <div className="h-[260px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={
                                monthlySpendSeries.length
                                  ? monthlySpendSeries
                                  : [{ label: "Jan", value: 0 }]
                              }
                            >
                              <CartesianGrid
                                stroke="rgba(255,255,255,0.06)"
                                vertical={false}
                              />
                              <XAxis
                                dataKey="label"
                                tick={{
                                  fill: "rgba(255,255,255,0.35)",
                                  fontSize: 11,
                                }}
                              />
                              <YAxis
                                tick={{
                                  fill: "rgba(255,255,255,0.35)",
                                  fontSize: 11,
                                }}
                              />
                              <Tooltip />
                              <Bar
                                dataKey="value"
                                radius={[8, 8, 0, 0]}
                                fill="#60a5fa"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <Card
                            title="Committed spend"
                            value={fmt(totalSpend)}
                          />
                          <Card title="Paid spend" value={fmt(paidSpend)} />
                        </div>
                      </Panel>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                      <Panel
                        title="Quote comparison"
                        subtitle="Side-by-side line item view"
                      >
                        {quoteComparisonRows.length === 0 ? (
                          <p className="text-sm text-white/35">
                            No comparison data yet.
                          </p>
                        ) : (
                          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                            <div className="grid grid-cols-5 bg-white/[0.05] px-4 py-3 text-[10px] uppercase tracking-wider text-white/35">
                              <div className="col-span-2">Line item</div>
                              <div>Vendor 1</div>
                              <div>Vendor 2</div>
                              <div>Vendor 3</div>
                            </div>
                            <div className="divide-y divide-white/[0.05]">
                              {quoteComparisonRows
                                .slice(0, 4)
                                .map((row, idx) => (
                                  <div
                                    key={`${row.line_item || row.item || idx}`}
                                    className="grid grid-cols-5 gap-3 px-4 py-4 text-sm"
                                  >
                                    <div className="col-span-2">
                                      <div className="font-medium text-white">
                                        {row.line_item ||
                                          row.item ||
                                          row.name ||
                                          `Item ${idx + 1}`}
                                      </div>
                                      <div className="mt-1 text-xs text-white/35">
                                        {row.lead_time || row.leadTime || "—"}{" "}
                                        lead time
                                      </div>
                                    </div>
                                    <div className="text-white/70">
                                      {row.vendor_1 ||
                                        row.vendor1 ||
                                        row.price_1 ||
                                        row.cost_1 ||
                                        "—"}
                                    </div>
                                    <div className="text-white/70">
                                      {row.vendor_2 ||
                                        row.vendor2 ||
                                        row.price_2 ||
                                        row.cost_2 ||
                                        "—"}
                                    </div>
                                    <div className="text-white/70">
                                      {row.vendor_3 ||
                                        row.vendor3 ||
                                        row.price_3 ||
                                        row.cost_3 ||
                                        "—"}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </Panel>

                      <Panel
                        title="RFQ workflow"
                        subtitle="Open sourcing requests, deadlines, and progress"
                      >
                        <div className="space-y-4">
                          {activeRfqItems.length === 0 ? (
                            <p className="text-sm text-white/35">
                              No active RFQs yet.
                            </p>
                          ) : (
                            activeRfqItems.map((item) => (
                              <div
                                key={item.id || item.name}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-4"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-medium text-white">
                                      {item.name || item.title || "Active RFQ"}
                                    </p>
                                    <p className="mt-1 text-xs text-white/35">
                                      Deadline {item.deadline || "—"}
                                    </p>
                                  </div>
                                  <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[10px] text-indigo-300">
                                    {item.status || "Open"}
                                  </span>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-white/[0.04]">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                                    style={{
                                      width: `${progressValue(item.progress || 0)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </Panel>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
                      <Panel
                        title="Order center & logistics tracking"
                        subtitle="PO, shipment, customs, delivery confirmation"
                      >
                        <div className="space-y-4">
                          {safeArray(m.order_items).length > 0 ? (
                            safeArray(m.order_items)
                              .slice(0, 4)
                              .map((order, idx) => (
                                <div
                                  key={order.id || idx}
                                  className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-4"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-medium text-white">
                                        {order.po_number ||
                                          order.name ||
                                          `PO ${idx + 1}`}
                                      </p>
                                      <p className="mt-1 text-xs text-white/35">
                                        {order.vendor_name ||
                                          order.vendor ||
                                          "Vendor"}{" "}
                                        ·{" "}
                                        {order.status || "Awaiting production"}
                                      </p>
                                    </div>
                                    <button
                                      onClick={goToWorkspace}
                                      className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-400"
                                    >
                                      Open
                                    </button>
                                  </div>
                                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/60">
                                    <div className="rounded-lg bg-white/[0.05] px-2 py-2">
                                      PO Sent
                                    </div>
                                    <div className="rounded-lg bg-white/[0.05] px-2 py-2">
                                      In transit
                                    </div>
                                    <div className="rounded-lg bg-white/[0.05] px-2 py-2">
                                      Delivered
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <>
                              {safeArray(m.delayed_shipment_items).length ===
                              0 ? (
                                <p className="text-sm text-white/35">
                                  No shipment issues.
                                </p>
                              ) : (
                                safeArray(m.delayed_shipment_items)
                                  .slice(0, 3)
                                  .map((item) => (
                                    <div
                                      key={item.project_id || item.id}
                                      className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-4"
                                    >
                                      <p className="text-sm font-medium text-white">
                                        {item.name || "Shipment"}
                                      </p>
                                      <p className="mt-1 text-xs text-white/35">
                                        {item.reason ||
                                          "Tracking update required"}
                                      </p>
                                    </div>
                                  ))
                              )}
                              <div className="rounded-2xl border border-white/[0.08] bg-[#06060a] p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-medium text-white">
                                      Carrier milestones
                                    </p>
                                    <p className="mt-1 text-xs text-white/35">
                                      Pickup · Customs · In transit · Delivered
                                    </p>
                                  </div>
                                  <div className="rounded-xl bg-white/[0.05] px-3 py-2 text-xs text-white/50">
                                    Live
                                  </div>
                                </div>
                                <div className="mt-4 h-2 rounded-full bg-white/[0.04]">
                                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-emerald-400" />
                                </div>
                                <p className="mt-3 text-xs text-white/35">
                                  Delivery confirmation triggers spend recording
                                  and analytics rollup.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </Panel>

                      <Panel
                        title="Collaboration hub"
                        subtitle="Notifications, approvals, and negotiation updates"
                      >
                        <div className="space-y-3">
                          {collaborationItems.length === 0 ? (
                            <p className="text-sm text-white/35">
                              No collaboration activity yet.
                            </p>
                          ) : (
                            collaborationItems.slice(0, 4).map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-1 h-8 w-8 rounded-full bg-white/[0.07] flex items-center justify-center text-xs font-semibold text-white/70">
                                    {String(item.user_name || item.user || "A")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-white">
                                      {item.title ||
                                        item.subject ||
                                        item.message ||
                                        "Update"}
                                    </p>
                                    <p className="mt-1 text-xs text-white/35">
                                      {item.message ||
                                        item.reason ||
                                        item.summary ||
                                        "Procurement update"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </Panel>
                    </div>
                  </div>

                  {/* Right rail */}
                  <div className="space-y-6">
                    <Panel title="Notifications" subtitle="Critical updates">
                      <div className="space-y-3">
                        {notificationItems.length === 0 ? (
                          <p className="text-sm text-white/35">No alerts.</p>
                        ) : (
                          notificationItems.map((item, idx) => (
                            <div
                              key={`${item.title || item.message || idx}`}
                              className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3"
                            >
                              <div className="flex items-start gap-2">
                                <span
                                  className={`mt-1 h-2.5 w-2.5 rounded-full ${item.type === "error" ? "bg-red-400" : item.type === "warning" ? "bg-indigo-400" : "bg-emerald-400"}`}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white">
                                    {item.title || item.name || "Alert"}
                                  </p>
                                  <p className="mt-1 text-xs text-white/35">
                                    {item.message ||
                                      item.reason ||
                                      item.action ||
                                      "Update available"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Panel>

                    <Panel
                      title="Analytics & insights"
                      subtitle="Retention and savings"
                    >
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">
                            Negotiated savings realized (MTD)
                          </p>
                          <p className="mt-2 text-3xl font-bold text-emerald-400">
                            ${fmt(savingsRealized, 0)}
                          </p>
                          <p className="mt-1 text-xs text-emerald-300/70">
                            +{fmt(m.average_savings_percent || 0)}% vs baseline
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Card title="Total spend" value={fmt(totalSpend)} />
                          <Card title="Paid spend" value={fmt(paidSpend)} />
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">
                            AI prompt
                          </p>
                          <p className="mt-2 text-sm text-white/80 leading-relaxed">
                            How much did we spend on capacitors this quarter?
                          </p>
                        </div>

                        <Link
                          to="/analytics"
                          className="inline-flex w-full items-center justify-center rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-400"
                        >
                          Detailed live dashboards
                        </Link>
                      </div>
                    </Panel>

                    <Panel
                      title="Spend by vendor"
                      subtitle="Top supplier concentration"
                    >
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={
                                vendorSeries.length
                                  ? vendorSeries
                                  : [{ label: "No data", value: 1 }]
                              }
                              dataKey="value"
                              nameKey="label"
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={4}
                            >
                              {(vendorSeries.length
                                ? vendorSeries
                                : [{ label: "No data", value: 1 }]
                              ).map((entry, idx) => (
                                <Cell
                                  key={`vendor-${idx}`}
                                  fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Panel>

                    <Panel
                      title="Monthly spend trend"
                      subtitle="Last 12 months"
                    >
                      <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={
                              monthlySpendSeries.length
                                ? monthlySpendSeries
                                : [{ label: "Jan", value: 0 }]
                            }
                          >
                            <defs>
                              <linearGradient
                                id="dashboardArea"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#8b5cf6"
                                  stopOpacity={0.45}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#8b5cf6"
                                  stopOpacity={0.02}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              stroke="rgba(255,255,255,0.06)"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="label"
                              tick={{
                                fill: "rgba(255,255,255,0.35)",
                                fontSize: 11,
                              }}
                            />
                            <YAxis
                              tick={{
                                fill: "rgba(255,255,255,0.35)",
                                fontSize: 11,
                              }}
                            />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#8b5cf6"
                              fill="url(#dashboardArea)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Panel>

                    <Panel
                      title="Savings trend"
                      subtitle="Negotiated savings by period"
                    >
                      <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={
                              savingsSeries.length
                                ? savingsSeries
                                : [{ label: "Jan", value: 0 }]
                            }
                          >
                            <CartesianGrid
                              stroke="rgba(255,255,255,0.06)"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="label"
                              tick={{
                                fill: "rgba(255,255,255,0.35)",
                                fontSize: 11,
                              }}
                            />
                            <YAxis
                              tick={{
                                fill: "rgba(255,255,255,0.35)",
                                fontSize: 11,
                              }}
                            />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#34d399"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Panel>
                  </div>
                </div>

                {/* Lower strip */}
                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <Panel
                    title="Quote comparison matrix"
                    subtitle="Quick read of vendor pricing and timing"
                  >
                    <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                      <div className="grid grid-cols-5 bg-white/[0.05] px-4 py-3 text-[10px] uppercase tracking-wider text-white/35">
                        <div className="col-span-2">Line item</div>
                        <div>Vendor 1</div>
                        <div>Vendor 2</div>
                        <div>Vendor 3</div>
                      </div>
                      <div className="divide-y divide-white/[0.05]">
                        {(quoteComparisonRows.length
                          ? quoteComparisonRows
                          : [
                              {
                                line_item: "1kΩ resistor",
                                vendor_1: "$12.00",
                                vendor_2: "$12.00",
                                vendor_3: "$13.00",
                                lead_time: "12m",
                              },
                            ]
                        )
                          .slice(0, 4)
                          .map((row, idx) => (
                            <div
                              key={`${row.line_item || row.item || idx}`}
                              className="grid grid-cols-5 gap-3 px-4 py-4 text-sm"
                            >
                              <div className="col-span-2">
                                <div className="font-medium text-white">
                                  {row.line_item ||
                                    row.item ||
                                    row.name ||
                                    `Item ${idx + 1}`}
                                </div>
                                <div className="mt-1 text-xs text-white/35">
                                  {row.lead_time || row.leadTime || "—"} lead
                                  time
                                </div>
                              </div>
                              <div className="text-white/70">
                                {row.vendor_1 ||
                                  row.vendor1 ||
                                  row.price_1 ||
                                  row.cost_1 ||
                                  "—"}
                              </div>
                              <div className="text-white/70">
                                {row.vendor_2 ||
                                  row.vendor2 ||
                                  row.price_2 ||
                                  row.cost_2 ||
                                  "—"}
                              </div>
                              <div className="text-white/70">
                                {row.vendor_3 ||
                                  row.vendor3 ||
                                  row.price_3 ||
                                  row.cost_3 ||
                                  "—"}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Panel>

                  <Panel
                    title="Action queue"
                    subtitle="What needs attention now"
                  >
                    <div className="space-y-3">
                      {topActions.length === 0 ? (
                        <p className="text-sm text-white/35">No queue items.</p>
                      ) : (
                        topActions.slice(0, 5).map((item) => (
                          <button
                            key={item.project_id || item.id || item.name}
                            onClick={() =>
                              navigate(`/project/${item.project_id}/workspace`)
                            }
                            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] p-4 text-left hover:bg-white/[0.05]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {item.name || "Project"}
                                </p>
                                <p className="mt-1 text-xs text-white/35">
                                  {item.reason ||
                                    item.action ||
                                    "Action needed"}
                                </p>
                              </div>
                              <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-[10px] text-violet-300">
                                {item.workflow_stage || item.status || "open"}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </Panel>
                </div>
              </>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
}
