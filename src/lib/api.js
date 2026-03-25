// ============================================================
// SECTION 1+2: Frontend API Library + Protected Route
// FILE: src/lib/api.js  (FULL REPLACEMENT)
// ============================================================

/**
 * PGI HUB — Centralized API Client (Fixed)
 *
 * Fixes:
 *  1. Added fetchCurrentUser() for server-side token validation
 *  2. 401 handling no longer hard-redirects — it throws, letting callers decide
 *  3. Token read from localStorage consistently (not duplicated in context)
 *  4. uploadBOM passes project_id back in response correctly
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

// ─── Base fetch wrapper ──────────────────────────────────────
export async function apiCall(path, options = {}, skipAuthRedirect = false) {
  const token = localStorage.getItem("pgi_token");
  const headers = { ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path.trim()}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && !skipAuthRedirect) {
    // Clear stale token and let the caller / route guard handle redirect
    localStorage.removeItem("pgi_token");
    localStorage.removeItem("pgi_user");
    // Dispatch a custom event so AuthContext can react
    window.dispatchEvent(new CustomEvent("pgi:session_expired"));
    throw new Error("Session expired");
  }

  return res;
}

// ─── AUTH ────────────────────────────────────────────────────

/**
 * Validates the stored token against the server.
 * Called once on app mount by AuthContext.
 */
export async function fetchCurrentUser(token) {
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Invalid token");
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim(),
      password,
      session_token: getSessionToken(),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }
  return res.json();
}

export async function registerUser(email, password, fullName) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim(),
      password,
      full_name: fullName?.trim() || "",
      session_token: getSessionToken(),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  return res.json();
}

// ─── BOM ─────────────────────────────────────────────────────

export async function uploadBOM(file, deliveryLocation, targetCurrency, priority = "cost") {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("delivery_location", deliveryLocation);
  fd.append("target_currency", targetCurrency);
  fd.append("priority", priority);
  fd.append("session_token", getSessionToken());

  const res = await apiCall("/api/v1/bom/upload", { method: "POST", body: fd });
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
    body: JSON.stringify({ bom_id: bomId, session_token: sessionToken }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Unlock failed");
  }
  return res.json();
}

// ─── PROJECTS ────────────────────────────────────────────────

export async function listProjects() {
  const res = await apiCall("/api/v1/projects");
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export async function getProject(projectId) {
  const res = await apiCall(`/api/v1/projects/${projectId}`);
  if (!res.ok) throw new Error("Project not found");
  return res.json();
}

// ─── RFQ ─────────────────────────────────────────────────────

export async function createRFQ(bomOrProjectId, notes = "") {
  const res = await apiCall("/api/v1/rfq/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bom_id: bomOrProjectId, notes }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create RFQ");
  }
  return res.json();
}

// ─── DRAWINGS ────────────────────────────────────────────────

export async function uploadDrawing(rfqId, partName, file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("rfq_id", rfqId);
  fd.append("part_name", partName);

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

export async function getDrawings(rfqId) {
  const res = await apiCall(`/api/v1/drawings/${rfqId}`);
  if (!res.ok) throw new Error("Failed to load drawings");
  return res.json();
}
