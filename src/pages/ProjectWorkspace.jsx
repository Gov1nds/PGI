import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import ProjectWorkflowRail from "../components/ProjectWorkflowRail.jsx";
import { getProject } from "../lib/api";

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getProject(id)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [id]);

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
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
              >
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <ProjectWorkflowRail
              project={project || { project_id: id, workflow_stage: "project_hydrated", status: "draft" }}
              compact
              onNavigateTab={(tab) => {
                if (tab === "vendor-match") {
                  navigate(`/project/${id}?tab=vendor-match`);
                  return;
                }
                navigate(`/project/${id}?tab=${encodeURIComponent(tab)}`);
              }}
            />
          </div>
        </Container>
      </section>

      <ProjectDetail />
    </div>
  );
}