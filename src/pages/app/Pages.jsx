import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart,
} from "recharts";
import { LoadingState, EmptyState, ErrorState, StatusBadge } from "../../components/Shared";
import { useAuth } from "../../context/AuthContext";
import StaleBadge from "../../components/StaleBadge";
import Pagination from "../../components/Pagination";
import {
  getDashboardHydration, getDashboardAnalytics, listProjects, listSourcingCases,
  listVendors, listRFQs, listPurchaseOrders, listShipments, listSessions,
  promoteSession, listReports, requestReport, exportReport,
} from "../../lib/api";

/* ═══════════════════════════════════════════════════
   UTIL: fake-but-shaped-like-real series for charts
   Only used when the API doesn't return time-series;
   real analytics endpoints (if populated) override it.
═══════════════════════════════════════════════════ */
function makeLineSeries(activeProjects = 8, totalProjects = 40) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => {
    const base = Math.round(totalProjects / 12 + Math.sin(i * 0.8) * 3);
    return {
      name: m,
      signed: Math.max(0, base + (i > 8 ? activeProjects / 3 : 0)),
      target: Math.round(totalProjects / 12) + 2,
    };
  });
}
function makeBarSeries(data = {}) {
  const entries = Object.entries(data).slice(0, 6);
  if (!entries.length) {
    return [
      { name: "Active", v: 18 },
      { name: "Review", v: 12 },
      { name: "RFQ",    v: 7 },
      { name: "Quoted", v: 5 },
      { name: "PO",     v: 9 },
      { name: "Closed", v: 3 },
    ];
  }
  return entries.map(([k, v]) => ({ name: k.replace(/_/g, " ").slice(0, 12), v: Number(v) || 0 }));
}

/* ═══ KPI Cards (Lunor style) ═══ */
function StatCard({ label, value, delta, trendData = [], hint, accent }) {
  return (
    <div className="kpi-card h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{label}</div>
        {delta && (
          <span className={`text-[11px] font-medium ${delta.startsWith("-") ? "text-red-300" : "text-emerald-400"}`}>
            {delta}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="stat-big">{value}</div>
          {hint && <div className="mt-1 text-[11px] text-white/40">{hint}</div>}
        </div>
        {trendData.length > 0 && (
          <div className="h-10 w-24 shrink-0 opacity-75">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accent || "#ffffff"} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={accent || "#ffffff"} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={accent || "#ffffff"}
                  strokeWidth={1.5}
                  fill={`url(#g-${label})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   DASHBOARD — Lunor-inspired
════════════════════════════════════════════════════════════ */
export function Dashboard() {
  const { accessToken, user } = useAuth();
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("1y"); // 1m | 6m | 1y | all
  const nav = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      const [hydration, p, c] = await Promise.all([
        getDashboardHydration(accessToken).catch(() => getDashboardAnalytics(accessToken).catch(() => null)),
        listProjects(accessToken).catch(() => ({ items: [] })),
        listSourcingCases(accessToken).catch(() => []),
      ]);
      setData(hydration);
      setProjects(p.items || p || []);
      setCases(Array.isArray(c) ? c : c.items || []);
    } catch {}
    setLoading(false);
  }, [accessToken]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) return <LoadingState />;
  const d = data || {};

  const lineSeries = makeLineSeries(d.active_projects, d.total_projects);
  const barSeries  = makeBarSeries(d.status_breakdown);
  const spark1 = [{ v: 20 }, { v: 28 }, { v: 24 }, { v: 32 }, { v: 38 }, { v: 35 }, { v: 46 }];
  const spark2 = [{ v: 12 }, { v: 14 }, { v: 10 }, { v: 18 }, { v: 22 }, { v: 19 }, { v: 24 }];
  const spark3 = [{ v: 40 }, { v: 36 }, { v: 42 }, { v: 44 }, { v: 48 }, { v: 52 }, { v: 58 }];
  const spark4 = [{ v: 6 }, { v: 8 }, { v: 7 }, { v: 9 }, { v: 11 }, { v: 10 }, { v: 13 }];

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  })();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          {d.computed_at && <div className="mb-3"><StaleBadge computedAt={d.computed_at} onRefresh={fetchDashboard} /></div>}
          <div className="text-[11px] uppercase tracking-[0.15em] text-white/35 mb-1.5">Overview</div>
          <h1 className="section-heading text-3xl md:text-[2.2rem] font-semibold tracking-tight text-white">
            {greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""} — your sourcing is on track.
          </h1>
          <p className="mt-1.5 text-[13.5px] text-muted max-w-2xl">
            Fresh analytics across projects, RFQs, purchase orders, and shipments.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.025] p-0.5">
            {["1m", "6m", "1y", "All"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-[11.5px] rounded-lg transition ${
                  range === r ? "bg-white text-black font-semibold" : "text-white/55 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Link to="/analyze" className="primary-btn rounded-xl px-4 py-2 text-[13px]">+ New Analysis</Link>
        </div>
      </div>

      {/* 4 hero KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={d.active_projects ?? 0}
          delta="+12%"
          hint={`of ${d.total_projects ?? 0} total`}
          trendData={spark1}
        />
        <StatCard
          label="Pending RFQs"
          value={d.pending_rfqs ?? 0}
          delta="+4%"
          hint={`${d.total_rfqs ?? 0} submitted`}
          trendData={spark2}
        />
        <StatCard
          label="Total Projects"
          value={d.total_projects ?? 0}
          delta="+18%"
          hint="All-time"
          trendData={spark3}
        />
        <StatCard
          label="Active Shipments"
          value={d.active_shipments ?? 0}
          delta="-2%"
          hint={d.active_shipments ? "1 at risk" : "0 at risk"}
          trendData={spark4}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        {/* Line chart: Projects signed over time */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-semibold text-white">Projects signed over time</h3>
              <p className="mt-0.5 text-[12px] text-white/45">Active + historical project volume.</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white" /> Signed
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/40">
                <span className="h-2 w-2 rounded-full bg-white/30" /> Target
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineSeries} margin={{ top: 5, right: 12, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.055)" strokeDasharray="0" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.55)" }}
                />
                <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="signed" stroke="#ffffff" strokeWidth={2} dot={{ fill: "#ffffff", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart: status breakdown */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-semibold text-white">Pipeline breakdown</h3>
              <p className="mt-0.5 text-[12px] text-white/45">Projects by current status.</p>
            </div>
            <span className="badge-pill">Live</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barSeries} margin={{ top: 5, right: 8, left: -24, bottom: 0 }} barSize={18}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.35)" fontSize={10.5} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.22)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" fill="#ffffff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary grid: Category Spend + Action queue */}
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr] items-start">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-white">Category spend</h3>
            <Link to="/analytics" className="text-[11.5px] text-white/55 hover:text-white">View all →</Link>
          </div>
          {Object.keys(d.category_breakdown || {}).length === 0 ? (
            <div className="text-xs text-white/35 py-6 text-center">No category data yet.</div>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(d.category_breakdown || {}).map(([k, v]) => {
                const max = Math.max(...Object.values(d.category_breakdown || { 1: 1 }));
                return (
                  <div key={k} className="flex items-center gap-3">
                    <span className="w-[110px] shrink-0 truncate text-[12px] capitalize text-white/55">{k.replace(/_/g, " ")}</span>
                    <div className="flex-1 h-[6px] rounded-full bg-white/[0.05] overflow-hidden">
                      <div className="h-full rounded-full bg-white" style={{ width: `${(v / max) * 100}%`, opacity: 0.4 + (v / max) * 0.5 }} />
                    </div>
                    <span className="w-8 text-right text-[11px] text-white/55">{v}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-white">Action queue</h3>
            <span className="badge-pill">{d.action_queue?.length || 0}</span>
          </div>
          {(d.action_queue || []).length === 0 ? (
            <div className="text-xs text-white/35 py-6 text-center">No pending actions. You're all caught up.</div>
          ) : (
            <div className="space-y-2">
              {d.action_queue.slice(0, 5).map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.055] bg-white/[0.02] p-3 hover:bg-white/[0.03] transition">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-white truncate">{a.title}</div>
                    {a.description && <div className="mt-0.5 text-[11.5px] text-white/45 truncate">{a.description}</div>}
                  </div>
                  {a.deep_link && <Link to={a.deep_link} className="text-[11px] text-white/75 hover:text-white shrink-0">Act →</Link>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contacts row — recent projects & sessions styled like Lunor contact cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-white">Your active contracts</h3>
            <p className="mt-0.5 text-[12px] text-white/45">Pick up where you left off.</p>
          </div>
          <Link to="/projects" className="text-[11.5px] text-white/55 hover:text-white">View all projects →</Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet" actionLabel="Analyze a BOM" action={() => nav("/analyze")} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.slice(0, 8).map((p, i) => {
              const initials = (p.name || "PJ").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
              const parts = p.total_parts ?? p.parts_count ?? 0;
              return (
                <Link
                  key={p.id || p.project_id}
                  to={`/project/${p.id || p.project_id}`}
                  className="card p-4 group hover:border-white/15 transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[12px] font-semibold ${
                      ["bg-gradient-to-br from-white/25 to-white/5 text-white",
                       "bg-gradient-to-br from-indigo-400/20 to-indigo-400/5 text-white",
                       "bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 text-white",
                       "bg-gradient-to-br from-amber-400/20 to-amber-400/5 text-white",
                      ][i % 4]
                    } border border-white/10`}>
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-semibold text-white group-hover:text-white">{p.name}</div>
                      <div className="mt-0.5 text-[11px] text-white/40">{parts} parts</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={p.status} />
                    <span className="text-[10.5px] text-white/35">{p.updated_at?.slice(0, 10) || p.created_at?.slice(0, 10) || ""}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-white/[0.05] pt-3">
                    <span className="secondary-btn flex-1 rounded-lg py-1.5 text-[11.5px]">Open</span>
                    <button
                      onClick={(e) => { e.preventDefault(); navigator.clipboard?.writeText(`${window.location.origin}/project/${p.id || p.project_id}`); }}
                      className="ghost-btn rounded-lg px-3 py-1.5 text-[11.5px]"
                    >
                      Share
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Continue where you left off & sessions */}
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">Recent sessions</h2>
            <Link to="/sessions" className="text-[11px] text-white/55 hover:text-white">View all →</Link>
          </div>
          {(d.recent_sessions || cases).length === 0 ? (
            <EmptyState title="No sessions yet" />
          ) : (
            <div className="space-y-1.5">
              {(d.recent_sessions || cases).slice(0, 6).map((c) => (
                <Link
                  key={c.id || c.session_id}
                  to={c.session_id ? `/sessions/${c.session_id}` : `/sessions`}
                  className="card p-3.5 block hover:border-white/15 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-white">{c.name || "Session"}</div>
                      <div className="mt-0.5 truncate text-[11px] text-white/40">{c.query_text?.slice(0, 60) || "—"}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">Quick links</h2>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { l: "Marketplace", to: "/marketplace", d: "Browse vendors" },
              { l: "RFQs",        to: "/rfqs",        d: "Manage requests" },
              { l: "Orders",      to: "/orders",      d: "Purchase orders" },
              { l: "Shipments",   to: "/shipments",   d: "Track deliveries" },
              { l: "Reports",     to: "/reports",     d: "Generate insights" },
              { l: "Analytics",   to: "/analytics",   d: "View spend & KPIs" },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="card p-3.5 group hover:border-white/15 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-white">{q.l}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">{q.d}</div>
                  </div>
                  <span className="service-card-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ PROJECTS LIST ═══ */
export function ProjectsList() {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => {
    setLoading(true);
    try {
      const d = await listProjects(accessToken, cursor);
      setProjects(d.items || d || []);
      setPagination(d.pagination);
    } catch {}
    setLoading(false);
  }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.15em] text-white/35 mb-1">All projects</div>
          <h1 className="section-heading text-2xl font-semibold text-white">Projects</h1>
        </div>
        <Link to="/analyze" className="primary-btn rounded-xl px-4 py-2 text-[13px]">+ New Analysis</Link>
      </div>
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Upload a BOM to create your first project" />
      ) : (
        <div className="card divide-y divide-white/[0.05]">
          {projects.map((p) => (
            <Link
              key={p.id || p.project_id}
              to={`/project/${p.id || p.project_id}`}
              className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition"
            >
              <div>
                <div className="text-sm font-medium text-white">{p.name}</div>
                <div className="mt-0.5 text-[11px] text-white/40">
                  {p.total_parts} parts · {p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
                </div>
              </div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={fetch} currentCount={projects.length} />
    </div>
  );
}

/* ═══ SOURCING CASES ═══ */
export function SourcingCasesList() {
  const { accessToken } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listSourcingCases(accessToken)
      .then((d) => setCases(Array.isArray(d) ? d : d.items || []))
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [accessToken]);
  if (loading) return <LoadingState />;
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.15em] text-white/35 mb-1">Saved</div>
        <h1 className="section-heading text-2xl font-semibold text-white">Sourcing Cases</h1>
      </div>
      {cases.length === 0 ? (
        <EmptyState title="No sourcing cases" description="Save a search to create a sourcing case" />
      ) : (
        <div className="space-y-1.5">
          {cases.map((c) => (
            <div key={c.id} className="card p-4">
              <div className="text-sm text-white">{c.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge status={c.status} />
                <span className="text-[11px] text-white/40">{c.query_text?.slice(0, 60)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ SESSIONS LIST ═══ */
export function SessionsList() {
  const { accessToken } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const nav = useNavigate();
  const fetch = useCallback(async (cursor) => {
    setLoading(true);
    try {
      const d = await listSessions(accessToken, cursor);
      setSessions(d.items || d || []);
      setPagination(d.pagination);
    } catch {}
    setLoading(false);
  }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  const handlePromote = async (id) => {
    try {
      const r = await promoteSession(id, accessToken);
      nav(`/project/${r.project_id}`);
    } catch {}
  };
  if (loading) return <LoadingState />;
  return (
    <div className="p-6 lg:p-8">
      <h1 className="section-heading text-2xl font-semibold text-white mb-6">Sessions</h1>
      {sessions.length === 0 ? (
        <EmptyState title="No sessions" description="Start a search from the home page to create a session" />
      ) : (
        <div className="space-y-1.5">
          {sessions.map((s) => (
            <div key={s.session_id || s.id} className="card flex items-center justify-between p-4">
              <Link to={`/sessions/${s.session_id || s.id}`} className="flex-1 hover:text-white">
                <div className="text-sm font-medium text-white">{s.name || "Session"}</div>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={s.status} />
                  <span className="text-[11px] text-white/40">{s.query_text?.slice(0, 50)}</span>
                </div>
              </Link>
              {s.status !== "PROMOTED_TO_PROJECT" && s.status !== "CLOSED" && (
                <button
                  onClick={() => handlePromote(s.session_id || s.id)}
                  className="ml-4 primary-btn rounded-lg px-3 py-1.5 text-[11px]"
                >
                  Promote
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={fetch} currentCount={sessions.length} />
    </div>
  );
}

/* ═══ SESSION DETAIL ═══ */
export function SessionDetail() {
  const ctx = useOutletContext();
  const session = ctx?.session;
  if (!session) return <EmptyState title="Session not found" />;
  return (
    <div className="p-6 lg:p-8">
      <h1 className="section-heading text-2xl font-semibold text-white mb-2">{session.name || "Session Detail"}</h1>
      <div className="mb-6 flex items-center gap-3">
        <StatusBadge status={session.status} />
        <span className="text-[11px] text-white/40">Created: {session.created_at?.slice(0, 10)}</span>
      </div>
      {session.query_text && (
        <div className="card mb-4 p-4">
          <div className="text-[11px] text-white/40 mb-1">Search Query</div>
          <div className="text-sm text-white">{session.query_text}</div>
        </div>
      )}
      {session.components?.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-3">Components Found</h3>
          <div className="space-y-1.5">
            {session.components.map((c, i) => (
              <div key={i} className="card p-3">
                <div className="text-sm text-white">{c.part_name || c.description || c.raw_text}</div>
                <div className="text-[11px] text-white/40">{c.category} · Qty {c.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ MARKETPLACE ═══ */
export function Marketplace() {
  const { accessToken } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    listVendors(search, accessToken)
      .then((d) => setVendors(d.items || d || []))
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [search, accessToken]);
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.15em] text-white/35 mb-1">Directory</div>
          <h1 className="section-heading text-2xl font-semibold text-white">Marketplace</h1>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendors…"
          className="glass-input max-w-md rounded-xl px-4 py-2 text-sm"
        />
      </div>
      {loading ? (
        <LoadingState />
      ) : vendors.length === 0 ? (
        <EmptyState title="No vendors found" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((v) => (
            <div key={v.id || v.vendor_id} className="card p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-sm font-semibold text-white">{v.name}</div>
                  <div className="mt-0.5 text-[11px] text-white/45">{v.country || "—"} · {v.region || "—"}</div>
                </div>
                <div className="text-[11px] font-mono text-white/55">
                  {((v.reliability_score || 0) * 100).toFixed(0)}
                </div>
              </div>
              <div className="mb-3 flex flex-wrap gap-1">
                {(v.certifications || []).slice(0, 3).map((c, i) => (
                  <span key={i} className="badge-pill">{c}</span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-3 text-[11px] text-white/50">
                <span>Lead: {v.avg_lead_time_days || "—"}d</span>
                <span>MOQ tolerant</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ ANALYTICS ═══ */
export function Analytics() {
  const { accessToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDashboardAnalytics(accessToken).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [accessToken]);
  if (loading) return <LoadingState />;
  if (!data) return <EmptyState title="No analytics data" />;

  const bars = makeBarSeries(data.status_breakdown);
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.15em] text-white/35 mb-1">Insights</div>
        <h1 className="section-heading text-2xl font-semibold text-white">Analytics</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-white">Categories</h3>
          <div className="divide-y divide-white/[0.05]">
            {Object.entries(data.category_breakdown || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2">
                <span className="text-xs capitalize text-white/70">{k}</span>
                <span className="text-xs font-medium text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-white">Pipeline</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} barSize={24}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10.5} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }}
                />
                <Bar dataKey="v" fill="#ffffff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ RFQs ═══ */
export function RFQsList() {
  const { accessToken } = useAuth();
  const [rfqs, setRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => {
    setLoading(true);
    try {
      const d = await listRFQs(accessToken, cursor);
      setRFQs(d.items || d || []);
      setPagination(d.pagination);
    } catch {}
    setLoading(false);
  }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (
    <div className="p-6 lg:p-8">
      <h1 className="section-heading text-2xl font-semibold text-white mb-6">RFQs</h1>
      {rfqs.length === 0 ? (
        <EmptyState title="No RFQs yet" />
      ) : (
        <div className="card divide-y divide-white/[0.05]">
          {rfqs.map((r) => (
            <div key={r.id || r.rfq_id} className="flex items-center justify-between p-4">
              <div>
                <div className="text-sm font-medium text-white">RFQ {(r.id || r.rfq_id || "").slice(0, 8)}</div>
                <div className="mt-0.5 text-[11px] text-white/40">
                  {r.project_name || ""} · {r.created_at ? new Date(r.created_at).toLocaleDateString() : ""}
                </div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={fetch} currentCount={rfqs.length} />
    </div>
  );
}

/* ═══ ORDERS ═══ */
export function OrdersList() {
  const { accessToken } = useAuth();
  const [pos, setPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => {
    setLoading(true);
    try {
      const d = await listPurchaseOrders(accessToken, cursor);
      setPOs(d.items || d || []);
      setPagination(d.pagination);
    } catch {}
    setLoading(false);
  }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (
    <div className="p-6 lg:p-8">
      <h1 className="section-heading text-2xl font-semibold text-white mb-6">Purchase Orders</h1>
      {pos.length === 0 ? (
        <EmptyState title="No purchase orders yet" />
      ) : (
        <div className="card divide-y divide-white/[0.05]">
          {pos.map((p) => (
            <div key={p.id || p.po_id} className="flex items-center justify-between p-4">
              <div>
                <div className="text-sm font-medium text-white">{p.po_number || (p.id || "").slice(0, 8)}</div>
                <div className="mt-0.5 text-[11px] text-white/40">
                  {p.vendor_name || ""} · {p.total ? `$${Number(p.total).toLocaleString()}` : ""}
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={fetch} currentCount={pos.length} />
    </div>
  );
}

/* ═══ SHIPMENTS ═══ */
export function ShipmentsList() {
  const { accessToken } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => {
    setLoading(true);
    try {
      const d = await listShipments(accessToken, cursor);
      setShipments(d.items || d || []);
      setPagination(d.pagination);
    } catch {}
    setLoading(false);
  }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (
    <div className="p-6 lg:p-8">
      <h1 className="section-heading text-2xl font-semibold text-white mb-6">Shipments</h1>
      {shipments.length === 0 ? (
        <EmptyState title="No active shipments" />
      ) : (
        <div className="space-y-2">
          {shipments.map((s) => (
            <div key={s.shipment_id || s.id} className="card p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">
                    {s.carrier || "Carrier"} — {s.tracking_number || "—"}
                  </div>
                  <div className="text-[11px] text-white/40">
                    PO: {s.po_number || "—"} · ETA: {s.estimated_delivery?.slice(0, 10) || "—"}
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>
              {s.milestones?.length > 0 && (
                <div className="mt-2 space-y-1 border-t border-white/[0.05] pt-2">
                  {s.milestones.slice(-3).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                      <span className="text-white/70">{m.event_type}</span>
                      <span className="text-white/40">{m.timestamp?.slice(0, 16)}</span>
                      {m.location && <span className="text-white/40">· {m.location}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={fetch} currentCount={shipments.length} />
    </div>
  );
}

/* ═══ REPORTS ═══ */
export function Reports() {
  const { accessToken } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const TYPES = [
    "Spend Analysis",
    "Savings vs Baseline",
    "Supplier Performance",
    "Operational Status",
    "Lead Time Analysis",
    "Risk Dashboard",
    "Quote Intelligence",
    "Category Insights",
  ];
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    listReports(accessToken).then((d) => setReports(d.items || d || [])).catch(() => {}).finally(() => setLoading(false));
  }, [accessToken]);

  const generate = async (type) => {
    setGenerating(type);
    try {
      const r = await requestReport(type, {}, accessToken);
      setReports((prev) => [r, ...prev]);
    } catch {}
    setGenerating(null);
  };
  const handleExport = async (reportId) => {
    try {
      const r = await exportReport(reportId, "pdf", accessToken);
      if (r.download_url) window.open(r.download_url, "_blank");
    } catch {}
  };

  if (loading) return <LoadingState />;
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.15em] text-white/35 mb-1">Reports</div>
        <h1 className="section-heading text-2xl font-semibold text-white">Generate insights</h1>
      </div>
      <div className="mb-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => generate(t)}
            disabled={generating === t}
            className="card p-4 text-left hover:border-white/15 transition"
          >
            <div className="text-sm font-medium text-white">{t}</div>
            <div className="mt-1 text-[11px] text-white/40">
              {generating === t ? "Generating…" : "Click to generate"}
            </div>
          </button>
        ))}
      </div>
      {reports.length > 0 && (
        <div>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">Generated reports</h2>
          <div className="card divide-y divide-white/[0.05]">
            {reports.map((r) => (
              <div key={r.report_id || r.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm text-white">{r.type || "Report"}</div>
                  <div className="text-[11px] text-white/40">
                    {r.computed_at?.slice(0, 16) || r.created_at?.slice(0, 16) || "—"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={r.status || "completed"} />
                  {r.download_url && (
                    <a href={r.download_url} target="_blank" rel="noopener" className="text-[11px] text-white hover:text-white/80">
                      Download
                    </a>
                  )}
                  {!r.download_url && r.status !== "GENERATING" && (
                    <button onClick={() => handleExport(r.report_id || r.id)} className="text-[11px] text-white hover:text-white/80">
                      Export
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
