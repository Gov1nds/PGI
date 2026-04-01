/**
 * PGI HUB — Centralized API Client
 */

function getSessionToken() {
  let session = localStorage.getItem("pgi_session");

  if (!session) {
    session = crypto.randomUUID();
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