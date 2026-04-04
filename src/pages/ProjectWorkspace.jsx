import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import ProjectWorkflowRail from "../components/ProjectWorkflowRail.jsx";
import { getProject } from "../lib/api";
import {
  getWorkflowSummary,
  normalizeWorkflowStage,
} from "../lib/workflowState";

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError("");

    getProject(id)
      .then((data) => {
        if (!cancelled) {
          setProject(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setProject(null);
          setLoadError(err?.message || "Failed to load project workspace");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const fallbackProject = useMemo(
    () => ({
      project_id: id,
      id,
      workflow_stage: "project_hydrated",
      status: "draft",
      analysis_status: "project_hydrated",
      report_visibility_level: "full",
      unlock_status: "unlocked",
    }),
    [id]
  );

  const railProject = project || fallbackProject;

  const workflowSummary = useMemo(
    () => getWorkflowSummary(railProject, { projectId: id }),
    [railProject, id]
  );

  const workflowStage = useMemo(
    () => normalizeWorkflowStage(railProject),
    [railProject]
  );

  const onNavigateTab = (tab) => {
    if (tab === "vendor-match") {
      navigate(`/project/${id}?tab=vendor-match`);
      return;
    }
    navigate(`/project/${id}?tab=${encodeURIComponent(tab)}`);
  };

  return (
    <div className="min-h-screen bg-[#050816]">
      <section className="border-b border-white/[0.08]">
        <Container className="py-8">
          <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
            <Link to="/dashboard" className="hover:text-white/60 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white/60">Project workspace</span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Workspace shell</h1>
              <p className="text-white/35 mt-2">
                Unified source-to-pay workspace for project {id}. Use this shell to jump between analysis, sourcing, RFQ, collaboration, and fulfillment.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                  Stage: {workflowSummary.stageLabel}
                </span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                  Workflow: {workflowStage}
                </span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                  {workflowSummary.description}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/project/${id}?tab=vendor-match`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                Vendor discovery
              </Link>
              <Link
                to="/analytics"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                Analytics
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#09090b] hover:bg-white/90"
              >
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="mt-6">
            {loadError ? (
              <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {loadError}
              </div>
            ) : null}

            <ProjectWorkflowRail
              project={railProject}
              compact
              onNavigateTab={onNavigateTab}
            />

            {isLoading ? (
              <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/45">
                Loading project workspace…
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <div className="pb-12">
        <ProjectDetail />
      </div>
    </div>
  );
}