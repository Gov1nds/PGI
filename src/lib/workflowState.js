const GUEST_WORKFLOW_STORAGE_KEY = "pgi_guest_workflow_state";
const POST_AUTH_ROUTE_KEY = "pgi_post_auth_route";

const WORKFLOW_STEPS = [
  { key: "guest_preview", label: "Preview", shortLabel: "Preview" },
  { key: "project_hydrated", label: "Project", shortLabel: "Project" },
  { key: "strategy", label: "Strategy", shortLabel: "Strategy" },
  { key: "vendor_match", label: "Vendor Match", shortLabel: "Vendors" },
  { key: "rfq_pending", label: "RFQ", shortLabel: "RFQ" },
  { key: "quote_compare", label: "Comparison", shortLabel: "Compare" },
  { key: "negotiation", label: "Chat", shortLabel: "Chat" },
  { key: "vendor_selected", label: "Vendor Selected", shortLabel: "Select" },
  { key: "po_issued", label: "PO / Order", shortLabel: "Order" },
  { key: "in_production", label: "Production", shortLabel: "Build" },
  { key: "shipped", label: "Shipping", shortLabel: "Ship" },
  { key: "delivered", label: "Delivered", shortLabel: "Deliver" },
  { key: "spend_recorded", label: "Spend", shortLabel: "Spend" },
  { key: "completed", label: "Complete", shortLabel: "Done" },
];

const WORKFLOW_ROUTE_HINTS = {
  guest_preview: { tab: "overview", label: "Continue this analysis", action: "Sign up to continue", description: "Preserve the same BOM snapshot, preview, and unlock state after auth." },
  project_hydrated: { tab: "strategy", label: "Review strategy", action: "Open strategy", description: "Move from BOM analysis into sourcing decisions and supplier ranking." },
  strategy: { tab: "vendor-match", label: "Shortlist vendors", action: "Open vendor discovery", description: "Move into ranked supplier selection with reasons and filters." },
  vendor_match: { tab: "rfq", label: "Send RFQ", action: "Open RFQ", description: "Convert the shortlist into a structured quotation request." },
  rfq_pending: { tab: "comparison", label: "Compare quotes", action: "Open comparison", description: "Normalize vendor responses into a side-by-side view." },
  quote_compare: { tab: "chat", label: "Negotiate terms", action: "Open chat", description: "Move quote differences into collaboration and negotiation." },
  negotiation: { tab: "order", label: "Select vendor", action: "Open order", description: "Finalize vendor selection and prepare the purchase order." },
  vendor_selected: { tab: "order", label: "Place order", action: "Open order", description: "Issue the PO and start fulfillment tracking." },
  po_issued: { tab: "tracking", label: "Track fulfillment", action: "Open tracking", description: "Follow manufacturing, shipping, and delivery progress." },
  in_production: { tab: "tracking", label: "Track shipment", action: "Open tracking", description: "Follow the current shipment, customs, and delivery states." },
  shipped: { tab: "tracking", label: "Confirm delivery", action: "Open tracking", description: "Close the loop with goods receipt and delivery confirmation." },
  delivered: { tab: "analytics", label: "Review analytics", action: "Open analytics", description: "Review spend and supplier outcomes after delivery." },
  spend_recorded: { tab: "analytics", label: "Review analytics", action: "Open analytics", description: "Use spend and savings history to drive the next cycle." },
  completed: { tab: "analytics", label: "Review analytics", action: "Open analytics", description: "Use the completed project as a learning loop." },
};

function safeParse(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function readGuestWorkflowState() {
  if (typeof window === "undefined") return null;
  return safeParse(window.localStorage.getItem(GUEST_WORKFLOW_STORAGE_KEY));
}

export function saveGuestWorkflowState(partial = {}) {
  if (typeof window === "undefined") return partial;
  const current = readGuestWorkflowState() || {};
  const next = {
    ...current,
    ...partial,
    updated_at: new Date().toISOString(),
  };

  window.localStorage.setItem(GUEST_WORKFLOW_STORAGE_KEY, JSON.stringify(next));

  if (next.postAuthRoute) {
    window.localStorage.setItem(POST_AUTH_ROUTE_KEY, next.postAuthRoute);
  }

  if (next.sessionToken) {
    window.localStorage.setItem("guest_session_token", next.sessionToken);
    window.localStorage.setItem("pgi_guest_session_token", next.sessionToken);
    window.localStorage.setItem("pgi_session", next.sessionToken);
  }

  if (next.projectId) {
    window.localStorage.setItem("pgi_last_guest_project_id", String(next.projectId));
  }

  return next;
}

export function clearGuestWorkflowState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_WORKFLOW_STORAGE_KEY);
  window.localStorage.removeItem(POST_AUTH_ROUTE_KEY);
}

export function getPostAuthRoute(fallback = "/dashboard") {
  if (typeof window === "undefined") return fallback;
  const state = readGuestWorkflowState();
  return (
    state?.postAuthRoute ||
    window.localStorage.getItem(POST_AUTH_ROUTE_KEY) ||
    fallback
  );
}

function normalizeString(value) {
  return String(value || "").trim().toLowerCase();
}

export function normalizeWorkflowStage(project = {}) {
  const direct = normalizeString(
    project.workflow_stage ||
      project.tracking_stage ||
      project.rfq_status ||
      project.status ||
      project.analysis_status ||
      project.unlock_status ||
      project.report_visibility_level ||
      "draft"
  );

  if (!project) return "guest_preview";

  if (normalizeString(project.analysis_status).includes("guest")) return "guest_preview";
  if (normalizeString(project.report_visibility_level) === "preview") return "guest_preview";
  if (normalizeString(project.unlock_status) === "locked") return "guest_preview";

  if (project.current_invoice_id || normalizeString(project.payment_state).includes("paid")) return "spend_recorded";
  if (project.current_shipment_id || normalizeString(project.tracking_stage).includes("ship") || normalizeString(project.tracking_stage).includes("customs") || normalizeString(project.tracking_stage).includes("transit")) return "shipped";
  if (project.current_po_id || normalizeString(project.tracking_stage).includes("po")) return "po_issued";
  if (project.current_quote_id || normalizeString(project.rfq_status).includes("quote") || normalizeString(project.workflow_stage).includes("comparison")) return "quote_compare";
  if (project.current_rfq_id || normalizeString(project.rfq_status).includes("rfq")) {
    if (normalizeString(project.rfq_status).includes("sent") || normalizeString(project.rfq_status).includes("open")) return "rfq_pending";
    return "rfq_pending";
  }
  if (project.current_vendor_match_id || normalizeString(project.workflow_stage).includes("vendor")) return "vendor_match";
  if (project.current_vendor_id || normalizeString(direct).includes("selected")) return "vendor_selected";
  if (normalizeString(project.workflow_stage).includes("negoti") || normalizeString(project.status).includes("negoti")) return "negotiation";
  if (normalizeString(project.workflow_stage).includes("strategy") || normalizeString(project.status).includes("strategy") || project.latest_strategy_version) return "strategy";
  if (normalizeString(project.status).includes("complete") || normalizeString(project.workflow_stage).includes("complete")) return "completed";
  if (normalizeString(project.status).includes("deliver") || normalizeString(project.workflow_stage).includes("deliver")) return "delivered";
  if (normalizeString(project.workflow_stage).includes("production") || normalizeString(project.status).includes("production")) return "in_production";
  if (normalizeString(project.status).includes("draft") && !project.analysis_status) return "project_hydrated";

  return direct || "project_hydrated";
}

export function getWorkflowStepIndex(stageKey) {
  const idx = WORKFLOW_STEPS.findIndex((step) => step.key === stageKey);
  return idx >= 0 ? idx : 1;
}

export function getWorkflowSummary(project = {}, options = {}) {
  const stageKey = options.stageKey || normalizeWorkflowStage(project);
  const routeProjectId = options.projectId || project.project_id || project.id || project.current_project_id || null;
  const stageMeta = WORKFLOW_ROUTE_HINTS[stageKey] || WORKFLOW_ROUTE_HINTS.project_hydrated;
  const stepIndex = getWorkflowStepIndex(stageKey);
  const breadcrumbs = WORKFLOW_STEPS.slice(0, Math.min(stepIndex + 1, WORKFLOW_STEPS.length)).map((step) => step.label);

  const ctaRoute = stageKey === "guest_preview"
    ? "/register"
    : stageMeta.tab && routeProjectId
      ? `/project/${routeProjectId}?tab=${encodeURIComponent(stageMeta.tab)}`
      : routeProjectId
        ? `/project/${routeProjectId}`
        : null;

  return {
    stageKey,
    stageLabel: stageMeta.label,
    actionLabel: stageMeta.action,
    description: stageMeta.description,
    tab: stageMeta.tab,
    ctaRoute,
    breadcrumbs,
    stepIndex,
    isGuestPreview: stageKey === "guest_preview",
    projectId: routeProjectId,
    stepCount: WORKFLOW_STEPS.length,
  };
}

export function buildContinueRoute(projectId = null, fallback = "/dashboard") {
  if (!projectId) return fallback;
  return `/project/${projectId}`;
}

export function buildAuthContinuationPayload(overrides = {}) {
  const state = readGuestWorkflowState() || {};
  return {
    ...state,
    ...overrides,
    postAuthRoute: overrides.postAuthRoute || state.postAuthRoute || getPostAuthRoute(),
  };
}

export { WORKFLOW_STEPS, WORKFLOW_ROUTE_HINTS };
