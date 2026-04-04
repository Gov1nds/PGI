import { Link } from "react-router-dom";
import { getWorkflowSummary } from "../lib/workflowState";

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/[0.05] text-white/50 border-white/[0.08]",
    blue: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tones[tone] || tones.neutral}`}>{children}</span>;
}

export default function ProjectWorkflowRail({ project, onNavigateTab, className = "", compact = false, onSignUpContinue }) {
  const summary = getWorkflowSummary(project);
  const routeProjectId = summary.projectId;
  const showCTA = !!summary.ctaRoute;
  const nextTab = summary.tab;

  const navigateTab = () => {
    if (typeof onNavigateTab === "function") {
      onNavigateTab(nextTab, summary);
    }
  };

  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-[#111827] ${className}`}>
      <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">{summary.stageLabel}</Badge>
            <Badge tone="neutral">Step {summary.stepIndex + 1} of {summary.stepCount}</Badge>
            {project?.rfq_status && <Badge tone="amber">RFQ {project.rfq_status}</Badge>}
          </div>
          <h3 className="text-base font-semibold text-white">{summary.description}</h3>
          <p className="text-sm text-white/40">
            {summary.breadcrumbs.join(" → ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {summary.isGuestPreview && typeof onSignUpContinue === "function" && (
            <button
              onClick={onSignUpContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400"
            >
              Continue in your project
            </button>
          )}
          {showCTA && nextTab && routeProjectId && (
            <button
              onClick={navigateTab}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
            >
              {summary.actionLabel}
            </button>
          )}
          {routeProjectId && (
            <Link
              to={`/project/${routeProjectId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
            >
              Open project
            </Link>
          )}
        </div>
      </div>

      {!compact && (
        <div className="px-5 py-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {summary.breadcrumbs.map((label, idx) => {
              const active = idx === summary.stepIndex;
              const done = idx < summary.stepIndex;
              return (
                <div
                  key={`${label}-${idx}`}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium ${active ? "border-violet-500/30 bg-violet-500/10 text-violet-300" : done ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-white/[0.06] bg-white/[0.03] text-white/35"}`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
