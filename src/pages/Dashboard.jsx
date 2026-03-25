// ============================================================
// SECTION 3: Dashboard.jsx (FULL REPLACEMENT)
// FILE: src/pages/Dashboard.jsx
//
// Fixes:
//  1. Removed premature navigate() before loading check
//  2. ProtectedRoute now handles redirect — Dashboard assumes user exists
//  3. Currency shown from project data (not hardcoded $)
//  4. Proper error boundary and retry
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import { listProjects } from "../lib/api";

const STATUS_STYLES = {
  uploaded:      "bg-white/[0.06] text-white/60",
  analyzed:      "bg-sky-500/15 text-sky-400",
  quoting:       "bg-amber-500/15 text-amber-400",
  quoted:        "bg-violet-500/15 text-violet-400",
  approved:      "bg-emerald-500/15 text-emerald-400",
  in_production: "bg-blue-500/15 text-blue-400",
  qc_inspection: "bg-orange-500/15 text-orange-400",
  shipped:       "bg-cyan-500/15 text-cyan-400",
  completed:     "bg-emerald-500/15 text-emerald-400",
};

const fmt = (n) => {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function Dashboard() {
  // NOTE: user is guaranteed non-null here because ProtectedRoute guards this page.
  // Do NOT add a navigate() check here — it creates the race condition.
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message === "Session expired") {
        logout();
        return;
      }
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="min-h-screen bg-[#010409]">
      {/* Header */}
      <section className="border-b border-white/[0.06]">
        <Container className="py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Projects</h1>
              <p className="text-white/50 text-sm mt-1">
                {user?.full_name
                  ? `Welcome, ${user.full_name}`
                  : "Your BOM analyses and manufacturing projects"}
              </p>
            </div>
            <Link
              to="/bom-analyzer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-all shadow-lg shadow-sky-600/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-sky-500/20 border-t-sky-500 animate-spin" />
            <p className="text-white/40 text-sm mt-4">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="max-w-lg mx-auto p-4 bg-red-500/[0.08] border border-red-500/20 rounded-xl text-center">
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={loadProjects}
              className="text-red-400 hover:text-red-300 text-xs mt-2 underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold">No projects yet</h3>
            <p className="text-white/40 text-sm mt-1 mb-6">Upload your first BOM to get started</p>
            <Link
              to="/bom-analyzer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-all"
            >
              Upload BOM
            </Link>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="space-y-3">
            {/* Table header (desktop) */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-2 text-[11px] text-white/30 uppercase tracking-wider font-medium">
              <div className="col-span-4">Project</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Est. Cost</div>
              <div className="col-span-1 text-right">Parts</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1" />
            </div>

            {projects.map((p) => (
              <Link
                key={p.project_id}
                to={`/project/${p.project_id}`}
                className="block rounded-2xl bg-[#0d1117] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.01] transition-all group"
              >
                <div className="p-5 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                  <div className="col-span-4 mb-3 sm:mb-0">
                    <p className="text-white text-sm font-medium group-hover:text-sky-400 transition-colors truncate">
                      {p.name || p.file_name || "Untitled BOM"}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5 font-mono">
                      {p.project_id?.slice(0, 8)}
                    </p>
                  </div>

                  <div className="col-span-2 mb-2 sm:mb-0">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[p.status] || STATUS_STYLES.uploaded}`}>
                      {(p.status || "uploaded").replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="col-span-2 text-right mb-2 sm:mb-0">
                    <p className="text-white/80 text-sm font-mono">
                      {p.cost ? `${p.currency || "USD"} ${fmt(p.cost)}` : "—"}
                    </p>
                    {p.savings_percent > 0 && (
                      <p className="text-emerald-400 text-[10px] mt-0.5">
                        ↓ {p.savings_percent.toFixed(1)}% savings
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 text-right mb-2 sm:mb-0">
                    <p className="text-white/50 text-sm">{p.total_parts}</p>
                  </div>

                  <div className="col-span-2 mb-2 sm:mb-0">
                    <p className="text-white/40 text-xs">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>

                  <div className="col-span-1 text-right">
                    <svg className="w-4 h-4 text-white/20 group-hover:text-sky-400 transition-colors inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
