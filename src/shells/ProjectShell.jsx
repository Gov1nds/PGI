import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Outlet, NavLink, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRealTimeCtx } from "../context/RealTimeContext";
import { getProject } from "../lib/api";
import { LoadingState, ErrorState, StatusBadge } from "../components/Shared";

const ProjectCtx = createContext(null);
export function useProjectContext() { return useContext(ProjectCtx); }

const TABS = [
  { l: "Overview", p: "", always: true },
  { l: "Strategy", p: "strategy", always: true },
  { l: "Vendors", p: "vendors", always: true },
  { l: "RFQ", p: "rfq", always: true },
  { l: "Compare", p: "compare", minStatus: "SOURCING_ACTIVE" },
  { l: "Chat", p: "chat", always: true },
  { l: "Orders", p: "orders", minStatus: "ORDERING_IN_PROGRESS", perm: "can_create_po" },
  { l: "Tracking", p: "tracking", minStatus: "EXECUTION_ACTIVE" },
  { l: "Analytics", p: "analytics", always: true },
  { l: "History", p: "history", always: true },
];

const STATUS_ORDER = [
  "DRAFT","INTAKE_COMPLETE","ANALYSIS_IN_PROGRESS","ANALYSIS_COMPLETE",
  "SOURCING_ACTIVE","ORDERING_IN_PROGRESS","EXECUTION_ACTIVE",
  "PARTIALLY_DELIVERED","FULLY_DELIVERED","CLOSED","CANCELLED","ARCHIVED"
];

function statusAtLeast(current, min) {
  if (!min || !current) return true;
  const ci = STATUS_ORDER.indexOf(current.toUpperCase());
  const mi = STATUS_ORDER.indexOf(min);
  return ci >= mi;
}

export default function ProjectShell() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const { subscribe, unsubscribe } = useRealTimeCtx();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    try { const data = await getProject(id, accessToken); setProject(data); setError(null); } catch (e) { setError(e); } finally { setLoading(false); }
  }, [id, accessToken]);
  useEffect(() => { fetchProject(); }, [fetchProject]);

  useEffect(() => {
    const handler = (data) => { if (data.project_id === id || data.entity_id === id) fetchProject(); };
    subscribe("project.status_changed", handler);
    subscribe("bom_line.status_changed", handler);
    return () => { unsubscribe("project.status_changed", handler); unsubscribe("bom_line.status_changed", handler); };
  }, [id, subscribe, unsubscribe, fetchProject]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} message="Failed to load project" onRetry={fetchProject} />;
  if (!project) return <ErrorState message="Project not found" />;

  const visibleTabs = TABS.filter(t => {
    if (t.always) return true;
    if (t.perm && !project.permissions?.[t.perm]) return true;
    return statusAtLeast(project.status, t.minStatus);
  });

  return (
    <ProjectCtx.Provider value={{ project, refetchProject: fetchProject }}>
      <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
        <aside className="hidden w-52 flex-col border-r border-[#E5E5E5] bg-white md:flex">
          <div className="flex h-14 items-center border-b border-[#E5E5E5] px-4">
            <Link to="/projects" className="text-sm text-[#6B7280] transition hover:text-[#0A0A0A]">← Projects</Link>
          </div>
          <div className="px-4 py-3 border-b border-[#E5E5E5]">
            <div className="text-sm font-medium text-[#0A0A0A] truncate">{project.name}</div>
            <div className="mt-1"><StatusBadge status={project.status} /></div>
          </div>
          <nav className="space-y-0.5 px-3 py-4">
            {visibleTabs.map((t) => (
              <NavLink key={t.p} to={t.p ? `/project/${id}/${t.p}` : `/project/${id}`} end={!t.p} className={({ isActive }) => `rail-link ${isActive ? "active" : ""}`}>{t.l}</NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 overflow-y-auto"><Outlet /></div>
      </div>
    </ProjectCtx.Provider>
  );
}
