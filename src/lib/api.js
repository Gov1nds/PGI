/**
 * PGI HUB — Centralized API Client
 */

function getSessionToken() {
  let session = localStorage.getItem("pgi_session");

  if (!session) {
    // Fallback for browsers without crypto.randomUUID
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      session = crypto.randomUUID();
    } else {
      session = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    }
    localStorage.setItem("pgi_session", session);
  }

  return session;
}

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://platform-api-production-d66b.up.railway.app";

/**
 * Base fetch wrapper
 * FIXED: No longer destroys session on transient 401.
 * Only clears auth on confirmed, non-retryable 401 from auth-sensitive endpoints.
 */
export async function apiCall(path, options = {}) {
  const cleanPath = path.trim();

  const token = localStorage.getItem("pgi_token");
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${cleanPath}`, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    // Network failure — do NOT clear auth, just throw
    throw new Error("Network error — please check your connection");
  }

  if (res.status === 401) {
    // Verify the token is truly invalid by hitting /auth/me
    // before destroying the session
    try {
      const verify = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (verify.status === 401) {
        // Confirmed: token is invalid
        localStorage.removeItem("pgi_token");
        localStorage.removeItem("pgi_user");
        window.dispatchEvent(new Event("pgi_auth_expired"));
        throw new Error("Session expired — please log in again");
      }
    } catch (verifyErr) {
      // /auth/me itself failed (network) — don't destroy session
      if (verifyErr.message === "Session expired — please log in again") throw verifyErr;
    }
    // If verify passed or errored out, return the original 401 response
    // so the caller can decide what to do
  }

  return res;
}

// ═══════════════════════════════════════════════════
// BOM
// ═══════════════════════════════════════════════════

export async function uploadBOM(
  file,
  deliveryLocation,
  targetCurrency,
  priority = "cost"
) {
  const fd = new FormData();

  fd.append("file", file);
  fd.append("delivery_location", deliveryLocation);
  fd.append("target_currency", targetCurrency);
  fd.append("priority", priority);
  fd.append("session_token", getSessionToken());

  const res = await apiCall("/api/v1/bom/upload", {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Upload failed (${res.status})`);
  }

  return res.json();
}

export async function unlockBOM(bomId, sessionToken) {
  const res = await apiCall("/api/v1/bom/unlock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bom_id: bomId,
      session_token: sessionToken,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Unlock failed");
  }

  return res.json();
}

// ═══════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim(),
      password: password,
      session_token: getSessionToken(),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }

  const data = await res.json();

  localStorage.setItem("pgi_token", data.access_token);

  return data;
}

export async function registerUser(email, password, fullName) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim(),
      password: password,
      full_name: fullName.trim(),
      session_token: getSessionToken(),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }

  const data = await res.json();

  localStorage.setItem("pgi_token", data.access_token);

  return data;
}

// ═══════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════

export async function listProjects() {
  const res = await apiCall("/api/v1/projects");

  if (!res.ok) {
    throw new Error("Failed to load projects");
  }

  return res.json();
}

export async function getProject(projectId) {
  const res = await apiCall(`/api/v1/projects/${projectId}`);

  if (!res.ok) {
    throw new Error("Project not found");
  }

  return res.json();
}

export async function getVendorMatch(projectId, filters = {}) {
  const params = new URLSearchParams();
  params.set("project_id", projectId);

  if (filters.regions) params.set("regions", filters.regions);
  if (filters.certifications) params.set("certifications", filters.certifications);
  if (filters.max_moq !== undefined && filters.max_moq !== null && filters.max_moq !== "") params.set("max_moq", String(filters.max_moq));
  if (filters.max_lead_time !== undefined && filters.max_lead_time !== null && filters.max_lead_time !== "") params.set("max_lead_time", String(filters.max_lead_time));
  if (filters.max_price !== undefined && filters.max_price !== null && filters.max_price !== "") params.set("max_price", String(filters.max_price));
  if (filters.search) params.set("search", filters.search);
  if (filters.limit !== undefined && filters.limit !== null && filters.limit !== "") params.set("limit", String(filters.limit));

  const res = await apiCall(`/api/v1/vendors/match?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load vendor shortlist");
  return res.json();
}

export async function getVendor(vendorId) {
  const res = await apiCall(`/api/v1/vendors/${vendorId}`);
  if (!res.ok) throw new Error("Failed to load vendor");
  return res.json();
}

export async function getVendorScorecard(vendorId, projectId = null) {
  const params = new URLSearchParams();
  if (projectId) params.set("project_id", projectId);

  const suffix = params.toString() ? `?${params.toString()}` : "";
  const res = await apiCall(`/api/v1/vendors/${vendorId}/scorecard${suffix}`);
  if (!res.ok) throw new Error("Failed to load vendor scorecard");
  return res.json();
}

export async function submitVendorFeedback(vendorId, payload) {
  const res = await apiCall(`/api/v1/vendors/${vendorId}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Vendor feedback failed");
  }
  return res.json();
}

export async function getChatThreads(projectId) {
  const res = await apiCall(`/api/v1/chat/threads?project_id=${encodeURIComponent(projectId)}`);
  if (!res.ok) throw new Error("Failed to load chat threads");
  return res.json();
}

export async function createChatThread(payload) {
  const res = await apiCall("/api/v1/chat/threads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create thread");
  }
  return res.json();
}

export async function getChatMessages(threadId) {
  const res = await apiCall(`/api/v1/chat/threads/${threadId}/messages`);
  if (!res.ok) throw new Error("Failed to load messages");
  return res.json();
}

export async function postChatMessage(formData) {
  const res = await apiCall("/api/v1/chat/messages", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to send message");
  }
  return res.json();
}

export async function getApprovals(projectId) {
  const res = await apiCall(`/api/v1/approvals?project_id=${encodeURIComponent(projectId)}`);
  if (!res.ok) throw new Error("Failed to load approvals");
  return res.json();
}

export async function getApproval(approvalId) {
  const res = await apiCall(`/api/v1/approvals/${approvalId}`);
  if (!res.ok) throw new Error("Failed to load approval");
  return res.json();
}

export async function createApproval(payload) {
  const res = await apiCall("/api/v1/approvals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create approval");
  }
  return res.json();
}

export async function approveApproval(approvalId, payload = {}) {
  const res = await apiCall(`/api/v1/approvals/${approvalId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to approve");
  }
  return res.json();
}

export async function rejectApproval(approvalId, payload = {}) {
  const res = await apiCall(`/api/v1/approvals/${approvalId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to reject");
  }
  return res.json();
}

// ═══════════════════════════════════════════════════
// RFQ
// ═══════════════════════════════════════════════════

export async function createRFQ(bomId, notes = "") {
  const res = await apiCall("/api/v1/rfq/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bom_id: bomId,
      notes,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create RFQ");
  }

  return res.json();
}

export async function getRFQ(rfqId) {
  const res = await apiCall(`/api/v1/rfq/${rfqId}`);
  if (!res.ok) throw new Error("RFQ not found");
  return res.json();
}

// ═══════════════════════════════════════════════════
// TRACKING
// ═══════════════════════════════════════════════════

export async function getTracking(rfqId) {
  const res = await apiCall(`/api/v1/tracking/rfq/${rfqId}`);
  if (!res.ok) throw new Error("Tracking not found");
  return res.json();
}

// ═══════════════════════════════════════════════════
// DRAWINGS
// ═══════════════════════════════════════════════════

export async function uploadDrawing(rfqId, file, partName = "", partNotes = "", rfqItemId = null) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("rfq_id", rfqId);
  fd.append("part_name", partName);
  fd.append("part_notes", partNotes);
  if (rfqItemId) fd.append("rfq_item_id", rfqItemId);

  const res = await apiCall("/api/v1/drawings/upload", {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Drawing upload failed");
  }
  return res.json();
}

export async function listDrawings(rfqId) {
  const res = await apiCall(`/api/v1/drawings/${rfqId}`);
  if (!res.ok) throw new Error("Failed to load drawings");
  return res.json();
}

// ═══════════════════════════════════════════════════
// REPORT SNAPSHOTS
// ═══════════════════════════════════════════════════

export async function getProjectSnapshots(projectId) {
  const res = await apiCall(`/api/v1/projects/${projectId}/snapshots`);
  if (!res.ok) throw new Error("Failed to load snapshots");
  return res.json();
}

export async function getProjectSnapshot(projectId, version) {
  const res = await apiCall(`/api/v1/projects/${projectId}/snapshots/${version}`);
  if (!res.ok) throw new Error("Snapshot not found");
  return res.json();
}

// ═══════════════════════════════════════════════════
// STRATEGY RUNS
// ═══════════════════════════════════════════════════

export async function getStrategyRuns(projectId) {
  const res = await apiCall(`/api/v1/projects/${projectId}/strategy-runs`);
  if (!res.ok) throw new Error("Failed to load strategy runs");
  return res.json();
}

export async function getStrategyRun(projectId, runId) {
  const res = await apiCall(`/api/v1/projects/${projectId}/strategy-runs/${runId}`);
  if (!res.ok) throw new Error("Strategy run not found");
  return res.json();
}
export async function getProjectMetrics() {
  const res = await apiCall("/api/v1/projects/metrics");
  if (!res.ok) throw new Error("Failed to load project metrics");
  return res.json();
}

export async function getProjectEvents(projectId) {
  const res = await apiCall(`/api/v1/projects/${projectId}/events`);
  if (!res.ok) throw new Error("Failed to load project events");
  return res.json();
}

export async function updateProjectStatus(projectId, status, notes = "") {
  const res = await apiCall(`/api/v1/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Project update failed");
  }

  return res.json();
}
export async function sendRFQ(rfqId, payload = {}) {
  const res = await apiCall(`/api/v1/rfq/${rfqId}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to send RFQ");
  }
  return res.json();
}

export async function getRFQQuotes(rfqId) {
  const res = await apiCall(`/api/v1/rfq/${rfqId}/quotes`);
  if (!res.ok) throw new Error("Failed to load RFQ quotes");
  return res.json();
}

export async function getRFQComparison(rfqId, filters = {}) {
  const params = new URLSearchParams();
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.min_vendor_score !== undefined && filters.min_vendor_score !== null && filters.min_vendor_score !== "") params.set("min_vendor_score", String(filters.min_vendor_score));
  if (filters.max_cost !== undefined && filters.max_cost !== null && filters.max_cost !== "") params.set("max_cost", String(filters.max_cost));
  if (filters.max_lead_time !== undefined && filters.max_lead_time !== null && filters.max_lead_time !== "") params.set("max_lead_time", String(filters.max_lead_time));
  if (filters.max_moq !== undefined && filters.max_moq !== null && filters.max_moq !== "") params.set("max_moq", String(filters.max_moq));
  if (filters.max_risk !== undefined && filters.max_risk !== null && filters.max_risk !== "") params.set("max_risk", String(filters.max_risk));

  const suffix = params.toString() ? `?${params.toString()}` : "";
  const res = await apiCall(`/api/v1/rfq/${rfqId}/compare${suffix}`);
  if (!res.ok) throw new Error("Failed to load RFQ comparison");
  return res.json();
}

export async function selectRFQVendor(rfqId, payload) {
  const res = await apiCall(`/api/v1/rfq/${rfqId}/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to select vendor");
  }
  return res.json();
}

export async function rejectRFQVendor(rfqId, payload) {
  const res = await apiCall(`/api/v1/rfq/${rfqId}/reject-vendor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to reject vendor");
  }
  return res.json();
}
export async function getFulfillmentTracking(rfqId) {
  const res = await apiCall(`/api/v1/tracking/rfq/${rfqId}`);
  if (!res.ok) throw new Error("Failed to load fulfillment context");
  return res.json();
}

export async function createPurchaseOrder(rfqId, payload) {
  const res = await apiCall(`/api/v1/tracking/rfq/${rfqId}/purchase-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create purchase order");
  }
  return res.json();
}

export async function confirmPurchaseOrder(poId, payload) {
  const res = await apiCall(`/api/v1/tracking/purchase-orders/${poId}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to confirm purchase order");
  }
  return res.json();
}

export async function createShipment(poId, payload) {
  const res = await apiCall(`/api/v1/tracking/purchase-orders/${poId}/shipments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create shipment");
  }
  return res.json();
}

export async function addShipmentEvent(shipmentId, payload) {
  const res = await apiCall(`/api/v1/tracking/shipments/${shipmentId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to add shipment event");
  }
  return res.json();
}

export async function addCarrierMilestone(shipmentId, payload) {
  const res = await apiCall(`/api/v1/tracking/shipments/${shipmentId}/milestones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to add carrier milestone");
  }
  return res.json();
}

export async function addCustomsEvent(shipmentId, payload) {
  const res = await apiCall(`/api/v1/tracking/shipments/${shipmentId}/customs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to add customs event");
  }
  return res.json();
}

export async function confirmGoodsReceipt(poId, payload) {
  const res = await apiCall(`/api/v1/tracking/purchase-orders/${poId}/receipts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to confirm goods receipt");
  }
  return res.json();
}

export async function createInvoice(poId, payload) {
  const res = await apiCall(`/api/v1/tracking/purchase-orders/${poId}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create invoice");
  }
  return res.json();
}

export async function updatePaymentState(invoiceId, payload) {
  const res = await apiCall(`/api/v1/tracking/invoices/${invoiceId}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update payment state");
  }
  return res.json();
}
export async function getSpendAnalytics(filters = {}) {
  const params = new URLSearchParams();
  if (filters.projectId) params.set("project_id", filters.projectId);
  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);

  const res = await apiCall(`/api/v1/analytics/spend?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load spend analytics");
  return res.json();
}

export async function getVendorAnalytics(filters = {}) {
  const params = new URLSearchParams();
  if (filters.projectId) params.set("project_id", filters.projectId);
  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);

  const res = await apiCall(`/api/v1/analytics/vendors?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load vendor analytics");
  return res.json();
}

export async function getCategoryAnalytics(filters = {}) {
  const params = new URLSearchParams();
  if (filters.projectId) params.set("project_id", filters.projectId);
  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);

  const res = await apiCall(`/api/v1/analytics/categories?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load category analytics");
  return res.json();
}

export async function getTrendAnalytics(filters = {}) {
  const params = new URLSearchParams();
  if (filters.projectId) params.set("project_id", filters.projectId);
  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);

  const res = await apiCall(`/api/v1/analytics/trends?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load trend analytics");
  return res.json();
}

export async function getSavingsAnalytics(filters = {}) {
  const params = new URLSearchParams();
  if (filters.projectId) params.set("project_id", filters.projectId);
  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);

  const res = await apiCall(`/api/v1/analytics/savings?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load savings analytics");
  return res.json();
}

export async function scheduleReport(payload) {
  const res = await apiCall("/api/v1/reports/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to schedule report");
  }
  return res.json();
}