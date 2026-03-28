import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import { listProjects } from "../lib/api";

/* ── Status config ───────────────────────────────────────── */
const STATUS_CONFIG = {
  uploaded:      { bg: "rgba(255,255,255,0.04)", text: "rgba(255,255,255,0.5)",  border: "rgba(255,255,255,0.06)", dot: "rgba(255,255,255,0.3)" },
  analyzed:      { bg: "rgba(56,189,248,0.08)",  text: "#38bdf8",               border: "rgba(56,189,248,0.15)",  dot: "#38bdf8" },
  quoting:       { bg: "rgba(251,191,36,0.08)",  text: "#fbbf24",               border: "rgba(251,191,36,0.15)",  dot: "#fbbf24" },
  quoted:        { bg: "rgba(167,139,250,0.08)", text: "#a78bfa",               border: "rgba(167,139,250,0.15)", dot: "#a78bfa" },
  approved:      { bg: "rgba(52,211,153,0.08)",  text: "#34d399",               border: "rgba(52,211,153,0.15)",  dot: "#34d399" },
  in_production: { bg: "rgba(96,165,250,0.08)",  text: "#60a5fa",               border: "rgba(96,165,250,0.15)",  dot: "#60a5fa" },
  qc_inspection: { bg: "rgba(251,146,60,0.08)",  text: "#fb923c",               border: "rgba(251,146,60,0.15)",  dot: "#fb923c" },
  shipped:       { bg: "rgba(34,211,238,0.08)",  text: "#22d3ee",               border: "rgba(34,211,238,0.15)",  dot: "#22d3ee" },
  completed:     { bg: "rgba(52,211,153,0.08)",  text: "#34d399",               border: "rgba(52,211,153,0.15)",  dot: "#34d399" },
};

const fmt = (n) => {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/* ── Fade-in wrapper (matches BOM Analyzer) ──────────────── */
function FadeIn({ children, delay = 0, className = "" }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Skeleton shimmer ────────────────────────────────────── */
function Skeleton({ w = "100%", h = 14, r = 6 }) {
  return <div className="db-shimmer" style={{ width: w, height: h, borderRadius: r }} />;
}

/* ══════════════════════════════════════════════════════════ */
/*  DASHBOARD COMPONENT                                      */
/* ══════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, cost_high, cost_low, name

  useEffect(() => {
    if (authLoading) return;
    loadProjects();
  }, [user, authLoading]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived stats ─────────────────────────────────────── */
  const totalCost = projects.reduce((s, p) => s + (p.cost || 0), 0);
  const totalParts = projects.reduce((s, p) => s + (p.total_parts || 0), 0);
  const avgSavings = projects.filter(p => p.savings_percent > 0).length > 0
    ? projects.filter(p => p.savings_percent > 0).reduce((s, p) => s + p.savings_percent, 0) / projects.filter(p => p.savings_percent > 0).length
    : 0;
  const activeCount = projects.filter(p => p.status && !["completed", "uploaded"].includes(p.status)).length;

  const statusOf = (s) => STATUS_CONFIG[s] || STATUS_CONFIG.uploaded;

  // ── Search, filter, sort ──
  const filteredProjects = projects
    .filter(p => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const name = (p.name || "").toLowerCase();
        const file = (p.file_name || "").toLowerCase();
        const loc = (p.recommended_location || "").toLowerCase();
        if (!name.includes(q) && !file.includes(q) && !loc.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest": return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case "cost_high": return (b.cost || 0) - (a.cost || 0);
        case "cost_low": return (a.cost || 0) - (b.cost || 0);
        case "name": return (a.name || "").localeCompare(b.name || "");
        default: return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

  const uniqueStatuses = [...new Set(projects.map(p => p.status).filter(Boolean))];

  return (
    <div className="db-root">
      {/* ── Hero / Header ────────────────────────────────── */}
      <section className="db-hero">
        <div className="db-hero-glow" />
        <div className="db-hero-grid" />
        <Container className="db-hero-inner">
          <FadeIn delay={0}>
            <div className="db-hero-row">
              <div className="db-hero-text">
                <h1 className="db-title">Projects</h1>
                <p className="db-subtitle">
                  {user?.full_name ? `Welcome back, ${user.full_name}` : "Your BOM analyses and manufacturing projects"}
                </p>
              </div>
              <Link to="/bom-analyzer" className="db-new-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="4" x2="12" y2="20" /><line x1="4" y1="12" x2="20" y2="12" /></svg>
                New Analysis
              </Link>
            </div>
          </FadeIn>

          {/* ── Stat cards (only when loaded with data) ──── */}
          {!loading && !error && projects.length > 0 && (
            <FadeIn delay={120}>
              <div className="db-stats">
                {[
                  { label: "Total Projects", value: projects.length, icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/><path d="M12 2L2 7L12 12L22 7L12 2Z"/></svg>
                  )},
                  { label: "Active", value: activeCount, icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12H18L15 21L9 3L6 12H2"/></svg>
                  )},
                  { label: "Total Parts", value: totalParts.toLocaleString(), icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                  )},
                  { label: "Avg. Savings", value: avgSavings > 0 ? `${avgSavings.toFixed(1)}%` : "—", accent: avgSavings > 0, icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  )},
                ].map((stat, i) => (
                  <div key={i} className="db-stat-card">
                    <div className="db-stat-icon">{stat.icon}</div>
                    <div>
                      <p className="db-stat-label">{stat.label}</p>
                      <p className={`db-stat-value ${stat.accent ? "accent" : ""}`}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </Container>
      </section>

      {/* ── Content ──────────────────────────────────────── */}
      <Container className="db-body">

        {/* Loading skeleton */}
        {loading && (
          <FadeIn delay={0}>
            <div className="db-skeleton-wrap">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="db-skeleton-row" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="db-skeleton-left">
                    <Skeleton w="60%" h={14} />
                    <Skeleton w="30%" h={10} />
                  </div>
                  <Skeleton w={64} h={24} r={8} />
                  <Skeleton w={80} h={14} />
                  <Skeleton w={28} h={14} />
                  <Skeleton w={72} h={12} />
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Error */}
        {error && (
          <FadeIn delay={0}>
            <div className="db-error">
              <div className="db-error-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <p className="db-error-text">{error}</p>
              <button onClick={loadProjects} className="db-error-retry">Retry</button>
            </div>
          </FadeIn>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <FadeIn delay={0}>
            <div className="db-empty">
              <div className="db-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="12" x2="12" y2="18" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <h3 className="db-empty-title">No projects yet</h3>
              <p className="db-empty-desc">Upload your first BOM to get started with AI-powered sourcing analysis</p>
              <Link to="/bom-analyzer" className="db-new-btn" style={{ marginTop: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="4" x2="12" y2="20" /><line x1="4" y1="12" x2="20" y2="12" /></svg>
                Upload BOM
              </Link>
            </div>
          </FadeIn>
        )}

        {/* Project list */}
        {!loading && projects.length > 0 && (
          <div className="db-project-list">
            {/* Search / Filter / Sort controls */}
            <FadeIn delay={160}>
              <div className="db-controls">
                <div className="db-search-wrap">
                  <svg className="db-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input
                    type="text"
                    className="db-search"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="db-search-clear" onClick={() => setSearchQuery("")}>✕</button>
                  )}
                </div>
                <select className="db-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All statuses</option>
                  {uniqueStatuses.map(s => (
                    <option key={s} value={s}>{(s || "").replace(/_/g, " ")}</option>
                  ))}
                </select>
                <select className="db-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="cost_high">Cost: high → low</option>
                  <option value="cost_low">Cost: low → high</option>
                  <option value="name">Name A → Z</option>
                </select>
                <span className="db-result-count">{filteredProjects.length} of {projects.length}</span>
              </div>
            </FadeIn>

            {/* Table header */}
            <FadeIn delay={180}>
              <div className="db-list-head">
                <span className="db-lh" style={{ flex: 3 }}>Project</span>
                <span className="db-lh" style={{ flex: 1.5 }}>Status</span>
                <span className="db-lh db-lh-right" style={{ flex: 2 }}>Est. Cost</span>
                <span className="db-lh db-lh-right" style={{ flex: 0.8 }}>Parts</span>
                <span className="db-lh" style={{ flex: 1.5 }}>Date</span>
                <span className="db-lh" style={{ flex: 0.5 }}></span>
              </div>
            </FadeIn>

            {/* No results message */}
            {filteredProjects.length === 0 && (
              <FadeIn delay={200}>
                <div className="db-no-results">
                  <p>No projects match your filters</p>
                  <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} className="db-error-retry">Clear filters</button>
                </div>
              </FadeIn>
            )}

            {/* Rows */}
            {filteredProjects.map((p, i) => {
              const sc = statusOf(p.status);
              return (
                <FadeIn key={p.project_id} delay={220 + i * 50}>
                  <Link to={`/project/${p.project_id}`} className="db-project-row">
                    {/* Project name */}
                    <div className="db-pr-name" style={{ flex: 3 }}>
                      <div className="db-pr-avatar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div className="db-pr-name-inner">
                        <p className="db-pr-title">{p.name || p.file_name || "Untitled BOM"}</p>
                        <p className="db-pr-id">{p.project_id?.slice(0, 8)}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{ flex: 1.5 }}>
                      <span
                        className="db-status-badge"
                        style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
                      >
                        <span className="db-status-dot" style={{ background: sc.dot }} />
                        {(p.status || "uploaded").replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Cost */}
                    <div className="db-pr-cost" style={{ flex: 2 }}>
                      <p className="db-pr-cost-val">{p.cost ? `${p.currency || "USD"} ${fmt(p.cost)}` : "—"}</p>
                      {p.savings_percent > 0 && (
                        <p className="db-pr-savings">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
                          {p.savings_percent.toFixed(1)}% savings
                        </p>
                      )}
                      {p.lead_time > 0 && (
                        <p className="db-pr-lead">{Math.round(p.lead_time)}d lead</p>
                      )}
                    </div>

                    {/* Parts */}
                    <div className="db-pr-parts" style={{ flex: 0.8 }}>
                      <span>{p.total_parts}</span>
                    </div>

                    {/* Date */}
                    <div className="db-pr-date" style={{ flex: 1.5 }}>
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </div>

                    {/* Arrow */}
                    <div className="db-pr-arrow" style={{ flex: 0.5 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        )}
      </Container>

      {/* ═══════════════════════════════════════════════════ */}
      {/* STYLES                                             */}
      {/* ═══════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');

        .db-root {
          --bg: #050a0e;
          --surface: #0a1019;
          --surface-2: #0f1720;
          --surface-3: #141d29;
          --border: rgba(255,255,255,0.06);
          --border-2: rgba(255,255,255,0.09);
          --border-3: rgba(255,255,255,0.14);
          --accent: #34d399;
          --accent-dim: rgba(52,211,153,0.10);
          --text: rgba(255,255,255,0.92);
          --text-2: rgba(255,255,255,0.55);
          --text-3: rgba(255,255,255,0.30);
          --text-4: rgba(255,255,255,0.14);
          --radius: 14px;
          --radius-sm: 10px;
          --radius-xs: 7px;
          --font: 'DM Sans', -apple-system, sans-serif;
          --mono: 'JetBrains Mono', 'SF Mono', monospace;
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
        }

        /* ── Hero ────────────────────────────────────── */
        .db-hero {
          position: relative;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .db-hero-glow {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(52,211,153,0.04) 0%, transparent 65%);
          pointer-events: none;
        }
        .db-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 50% 70% at 50% 50%, black, transparent);
          pointer-events: none;
        }
        .db-hero-inner {
          position: relative;
          padding: 44px 0 40px;
        }

        .db-hero-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .db-hero-text {}
        .db-title {
          font-size: clamp(26px, 4vw, 34px);
          font-weight: 700;
          color: white;
          letter-spacing: -0.025em;
        }
        .db-subtitle {
          font-size: 14px;
          color: var(--text-3);
          margin-top: 4px;
        }

        /* ── New analysis button ─────────────────────── */
        .db-new-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          background: var(--accent);
          border: none;
          border-radius: var(--radius-sm);
          color: #050a0e;
          font-family: var(--font);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 2px 16px rgba(52,211,153,0.2);
        }
        .db-new-btn:hover {
          background: #4ade80;
          transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(52,211,153,0.3);
        }
        .db-new-btn:active { transform: translateY(0); }

        /* ── Stat cards ──────────────────────────────── */
        .db-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 28px;
        }
        @media (max-width: 720px) {
          .db-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .db-stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: border-color 0.25s, transform 0.25s;
        }
        .db-stat-card:hover {
          border-color: var(--border-2);
          transform: translateY(-1px);
        }
        .db-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--accent-dim);
          border: 1px solid rgba(52,211,153,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }
        .db-stat-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-3);
          margin-bottom: 2px;
        }
        .db-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }
        .db-stat-value.accent { color: var(--accent); }

        /* ── Body ────────────────────────────────────── */
        .db-body { padding: 32px 0 60px; }

        /* ── Skeleton loading ────────────────────────── */
        .db-skeleton-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .db-skeleton-row {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          animation: db-skeletonIn 0.5s ease both;
        }
        .db-skeleton-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .db-shimmer {
          background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%);
          background-size: 200% 100%;
          animation: db-shimmer 1.5s ease infinite;
        }

        /* ── Error ───────────────────────────────────── */
        .db-error {
          max-width: 480px;
          margin: 48px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 32px;
          background: rgba(248,113,113,0.04);
          border: 1px solid rgba(248,113,113,0.12);
          border-radius: var(--radius);
          text-align: center;
        }
        .db-error-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(248,113,113,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f87171;
        }
        .db-error-text { font-size: 13px; color: #fca5a5; line-height: 1.5; }
        .db-error-retry {
          padding: 6px 16px;
          border-radius: var(--radius-xs);
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.15);
          color: #f87171;
          font-family: var(--font);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .db-error-retry:hover { background: rgba(248,113,113,0.14); }

        /* ── Empty state ─────────────────────────────── */
        .db-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 72px 24px;
          text-align: center;
        }
        .db-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-3);
          margin-bottom: 20px;
        }
        .db-empty-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.01em;
        }
        .db-empty-desc {
          font-size: 13px;
          color: var(--text-3);
          margin-top: 6px;
          margin-bottom: 24px;
          max-width: 320px;
          line-height: 1.5;
        }

        /* ── Project list ────────────────────────────── */
        .db-project-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Controls — search, filter, sort */
        .db-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .db-search-wrap {
          position: relative;
          flex: 1;
          min-width: 180px;
        }
        .db-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-4);
          pointer-events: none;
        }
        .db-search {
          width: 100%;
          padding: 9px 32px 9px 34px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-family: var(--font);
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s;
        }
        .db-search:focus { border-color: rgba(52,211,153,0.3); }
        .db-search::placeholder { color: var(--text-4); }
        .db-search-clear {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-3);
          cursor: pointer;
          font-size: 12px;
          padding: 4px;
        }
        .db-filter {
          padding: 9px 30px 9px 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-2);
          font-family: var(--font);
          font-size: 11px;
          cursor: pointer;
          appearance: none;
          background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.25)%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22/%3e%3c/svg%3e');
          background-size: 12px;
          background-position: right 8px center;
          background-repeat: no-repeat;
          outline: none;
        }
        .db-filter:focus { border-color: rgba(52,211,153,0.3); }
        .db-filter option { background: var(--surface); }
        .db-result-count {
          font-size: 10px;
          color: var(--text-4);
          white-space: nowrap;
          padding: 0 4px;
        }
        .db-no-results {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-3);
          font-size: 13px;
        }
        .db-no-results button { margin-top: 12px; }

        /* List header */
        .db-list-head {
          display: none;
          align-items: center;
          padding: 0 24px 8px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-4);
        }
        @media (min-width: 640px) {
          .db-list-head { display: flex; }
        }
        .db-lh { min-width: 0; }
        .db-lh-right { text-align: right; }

        /* Project row */
        .db-project-row {
          display: flex;
          align-items: center;
          padding: 18px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          gap: 12px;
          cursor: pointer;
        }
        .db-project-row:hover {
          border-color: var(--border-3);
          background: rgba(255,255,255,0.012);
          transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.2);
        }

        /* Responsive stacking */
        @media (max-width: 639px) {
          .db-project-row {
            flex-wrap: wrap;
            gap: 8px;
          }
          .db-project-row > * { flex: unset !important; }
          .db-pr-name { width: 100%; }
          .db-pr-arrow { display: none !important; }
        }

        /* Name cell */
        .db-pr-name {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .db-pr-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-3);
          flex-shrink: 0;
          transition: all 0.25s;
        }
        .db-project-row:hover .db-pr-avatar {
          background: var(--accent-dim);
          border-color: rgba(52,211,153,0.15);
          color: var(--accent);
        }
        .db-pr-name-inner { min-width: 0; }
        .db-pr-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .db-project-row:hover .db-pr-title { color: var(--accent); }
        .db-pr-id {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text-4);
          margin-top: 2px;
        }

        /* Status badge */
        .db-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          border: 1px solid;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .db-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Cost cell */
        .db-pr-cost { text-align: right; }
        .db-pr-cost-val {
          font-family: var(--mono);
          font-size: 13px;
          color: var(--text);
          font-weight: 500;
        }
        .db-pr-savings {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          color: var(--accent);
          font-weight: 600;
          margin-top: 2px;
        }
        .db-pr-lead {
          font-size: 10px;
          color: var(--text-4);
          margin-top: 1px;
        }

        /* Parts */
        .db-pr-parts {
          text-align: right;
          font-size: 13px;
          color: var(--text-2);
          font-family: var(--mono);
        }

        /* Date */
        .db-pr-date {
          font-size: 12px;
          color: var(--text-3);
        }

        /* Arrow */
        .db-pr-arrow {
          display: flex;
          justify-content: flex-end;
          color: var(--text-4);
          transition: all 0.25s;
        }
        .db-project-row:hover .db-pr-arrow {
          color: var(--accent);
          transform: translateX(3px);
        }

        /* ── Keyframes ───────────────────────────────── */
        @keyframes db-shimmer {
          to { background-position: -200% 0; }
        }
        @keyframes db-skeletonIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}