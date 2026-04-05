/**
 * F-1/UX-1: Canonical intake controller.
 *
 * Both BOM file upload and text/item intake produce responses in different
 * shapes. This module normalizes them into one canonical WorkflowEnvelope
 * so the frontend can handle continuation, preview, and project promotion
 * uniformly regardless of entry path.
 */

import { saveGuestWorkflowState } from "./workflowState";
import { writeGuestSessionToken } from "./guestSession";

/**
 * Normalize a BOM upload response into canonical workflow state.
 */
export function normalizeUploadResponse(res) {
  return {
    sessionToken: res.session_token || "",
    bomId: res.bom_id || res.guest_bom_id || null,
    projectId: res.project_id || null,
    analysisStatus: res.analysis_status || "guest_preview",
    reportVisibilityLevel: res.report_visibility_level || "preview",
    unlockStatus: res.unlock_status || "locked",
    workspaceRoute: res.workspace_route || null,
    recommendedFlow: "project",
    shouldCreateProject: true,
    purchaseMode: "bom_project",
    itemCount: res.total_parts || 0,
    analysisLifecycle: res.analysis_lifecycle || {},
  };
}

/**
 * Normalize an intake parse/submit response into canonical workflow state.
 */
export function normalizeIntakeResponse(res) {
  const session = res.intake_session || {};
  return {
    sessionToken: res.session_token || session.session_token || "",
    bomId: res.bom_id || session.bom_id || null,
    projectId: res.project_id || session.project_id || null,
    analysisStatus: res.analysis_status || "pending",
    reportVisibilityLevel: res.report_visibility_level || "preview",
    unlockStatus: res.unlock_status || "locked",
    workspaceRoute: res.workspace_route || null,
    recommendedFlow: res.recommended_flow || session.recommended_flow || "project",
    shouldCreateProject: res.should_create_project !== false,
    purchaseMode: res.purchase_mode || session.purchase_mode || "auto",
    itemCount: res.item_count || session.item_count || 0,
    analysisLifecycle: res.analysis_lifecycle || {},
  };
}

/**
 * Persist canonical workflow state to localStorage.
 * Call this after normalizeUploadResponse or normalizeIntakeResponse.
 */
export function persistCanonicalState(state) {
  if (state.sessionToken) {
    writeGuestSessionToken(state.sessionToken);
  }

  saveGuestWorkflowState({
    sessionToken: state.sessionToken,
    bomId: state.bomId,
    projectId: state.projectId,
    analysisStatus: state.analysisStatus,
    reportVisibilityLevel: state.reportVisibilityLevel,
    unlockStatus: state.unlockStatus,
    workspaceRoute: state.workspaceRoute,
    recommendedFlow: state.recommendedFlow,
    shouldCreateProject: state.shouldCreateProject,
    purchaseMode: state.purchaseMode,
    itemCount: state.itemCount,
    postAuthRoute: state.workspaceRoute || (state.projectId ? `/project/${state.projectId}` : "/dashboard"),
  });

  return state;
}

/**
 * Build the continuation route for post-auth redirect.
 */
export function getContinuationRoute(state) {
  if (state.workspaceRoute) return state.workspaceRoute;
  if (state.projectId) return `/project/${state.projectId}`;
  return "/dashboard";
}
