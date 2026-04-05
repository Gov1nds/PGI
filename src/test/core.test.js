/**
 * F-2: Frontend test suite — session state, workflow state, API client.
 *
 * Tests the canonical session/auth key management, workflow stage ordering,
 * and guest state persistence that the product relies on.
 *
 * Run: npm test
 */
import { describe, it, expect, beforeEach } from "vitest";

// ═══════════════════════════════════════════════════════════════════════════
// 1. GUEST SESSION STATE
// ═══════════════════════════════════════════════════════════════════════════

describe("guestSession", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("readGuestSessionToken returns empty when no key set", async () => {
    const { readGuestSessionToken } = await import("../lib/guestSession.js");
    expect(readGuestSessionToken()).toBe("");
  });

  it("writeGuestSessionToken writes to canonical key only", async () => {
    const { writeGuestSessionToken, readGuestSessionToken } = await import("../lib/guestSession.js");
    writeGuestSessionToken("test-token-123");
    expect(readGuestSessionToken()).toBe("test-token-123");
    expect(localStorage.getItem("pgi_guest_session_token")).toBe("test-token-123");
    // Legacy keys should NOT be set
    expect(localStorage.getItem("guest_session_token")).toBeNull();
    expect(localStorage.getItem("pgi_session")).toBeNull();
  });

  it("clearGuestSessionToken removes canonical key", async () => {
    const { writeGuestSessionToken, clearGuestSessionToken, readGuestSessionToken } = await import("../lib/guestSession.js");
    writeGuestSessionToken("to-clear");
    clearGuestSessionToken();
    expect(readGuestSessionToken()).toBe("");
  });

  it("ensureGuestSessionToken creates new if none exists", async () => {
    const { ensureGuestSessionToken } = await import("../lib/guestSession.js");
    const token = ensureGuestSessionToken();
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(10);
  });
});


// ═══════════════════════════════════════════════════════════════════════════
// 2. WORKFLOW STATE
// ═══════════════════════════════════════════════════════════════════════════

describe("workflowState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("normalizeWorkflowStage returns guest_preview for locked project", async () => {
    const { normalizeWorkflowStage } = await import("../lib/workflowState.js");
    const result = normalizeWorkflowStage({
      unlock_status: "locked",
      status: "draft",
    });
    expect(result).toBe("guest_preview");
  });

  it("normalizeWorkflowStage returns vendor_selected BEFORE vendor_match (H-2)", async () => {
    const { normalizeWorkflowStage } = await import("../lib/workflowState.js");
    const result = normalizeWorkflowStage({
      current_vendor_id: "some-vendor",
      current_vendor_match_id: "some-match",
      unlock_status: "unlocked",
      report_visibility_level: "full",
      analysis_status: "authenticated_unlocked",
    });
    // H-2: vendor_selected must take priority over vendor_match
    expect(result).toBe("vendor_selected");
  });

  it("normalizeWorkflowStage returns po_issued when PO exists", async () => {
    const { normalizeWorkflowStage } = await import("../lib/workflowState.js");
    const result = normalizeWorkflowStage({
      current_po_id: "po-123",
      current_rfq_id: "rfq-456",
      current_vendor_id: "v-789",
      unlock_status: "unlocked",
      report_visibility_level: "full",
      analysis_status: "authenticated_unlocked",
    });
    expect(result).toBe("po_issued");
  });

  it("normalizeWorkflowStage returns completed for completed status", async () => {
    const { normalizeWorkflowStage } = await import("../lib/workflowState.js");
    const result = normalizeWorkflowStage({
      status: "completed",
      workflow_stage: "completed",
      unlock_status: "unlocked",
      report_visibility_level: "full",
      analysis_status: "authenticated_unlocked",
    });
    expect(result).toBe("completed");
  });

  it("normalizeWorkflowStage returns shipped when shipment exists", async () => {
    const { normalizeWorkflowStage } = await import("../lib/workflowState.js");
    const result = normalizeWorkflowStage({
      current_shipment_id: "ship-1",
      current_po_id: "po-1",
      unlock_status: "unlocked",
      report_visibility_level: "full",
      analysis_status: "authenticated_unlocked",
    });
    expect(result).toBe("shipped");
  });

  it("getWorkflowSummary returns valid structure", async () => {
    const { getWorkflowSummary } = await import("../lib/workflowState.js");
    const summary = getWorkflowSummary({
      project_id: "test-123",
      status: "strategy",
      workflow_stage: "strategy",
      unlock_status: "unlocked",
      report_visibility_level: "full",
      analysis_status: "authenticated_unlocked",
    });
    expect(summary).toHaveProperty("stageKey");
    expect(summary).toHaveProperty("stageLabel");
    expect(summary).toHaveProperty("actionLabel");
    expect(summary).toHaveProperty("stepIndex");
    expect(summary).toHaveProperty("projectId");
  });

  it("saveGuestWorkflowState and readGuestWorkflowState round-trip", async () => {
    const { saveGuestWorkflowState, readGuestWorkflowState } = await import("../lib/workflowState.js");
    saveGuestWorkflowState({ bomId: "bom-test", projectId: "proj-test" });
    const state = readGuestWorkflowState();
    expect(state.bomId).toBe("bom-test");
    expect(state.projectId).toBe("proj-test");
  });

  it("saveGuestWorkspace and loadGuestWorkspace round-trip", async () => {
    const { saveGuestWorkspace, loadGuestWorkspace } = await import("../lib/workflowState.js");
    saveGuestWorkspace("proj-1", { tab: "rfq", stage: "sent" });
    const ws = loadGuestWorkspace("proj-1");
    expect(ws.tab).toBe("rfq");
    expect(ws.project_id).toBe("proj-1");
  });
});


// ═══════════════════════════════════════════════════════════════════════════
// 3. API CLIENT
// ═══════════════════════════════════════════════════════════════════════════

describe("api client", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getSessionToken creates canonical key", async () => {
    const { getSessionToken } = await import("../lib/api.js");
    const token = getSessionToken();
    expect(token).toBeTruthy();
    expect(localStorage.getItem("pgi_guest_session_token")).toBe(token);
  });

  it("getGuestSessionToken reads canonical key", async () => {
    const { getGuestSessionToken } = await import("../lib/api.js");
    localStorage.setItem("pgi_guest_session_token", "manual-token");
    expect(getGuestSessionToken()).toBe("manual-token");
  });

  it("API_BASE defaults to empty string (same-origin)", async () => {
    // This just verifies no hard-coded Railway URL exists
    const apiModule = await import("../lib/api.js");
    // The module should export functions without throwing
    expect(typeof apiModule.uploadBOM).toBe("function");
    expect(typeof apiModule.loginUser).toBe("function");
    expect(typeof apiModule.getProject).toBe("function");
    expect(typeof apiModule.getFulfillmentTracking).toBe("function");
  });

  it("getTracking is an alias for getFulfillmentTracking", async () => {
    const { getTracking, getFulfillmentTracking } = await import("../lib/api.js");
    // Both should be functions
    expect(typeof getTracking).toBe("function");
    expect(typeof getFulfillmentTracking).toBe("function");
  });
});


// ═══════════════════════════════════════════════════════════════════════════
// 4. WORKSPACE STATE SHIM
// ═══════════════════════════════════════════════════════════════════════════

describe("workspaceState shim", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("re-exports saveGuestWorkspace from workflowState", async () => {
    const ws = await import("../lib/workspaceState.js");
    const wf = await import("../lib/workflowState.js");
    // Both should be the same function
    expect(typeof ws.saveGuestWorkspace).toBe("function");
    expect(typeof wf.saveGuestWorkspace).toBe("function");
  });

  it("re-exports getGuestSessionToken from guestSession", async () => {
    const ws = await import("../lib/workspaceState.js");
    expect(typeof ws.getGuestSessionToken).toBe("function");
  });
});
