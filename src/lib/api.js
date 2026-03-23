/**
 * PGI HUB — Centralized API Client
 * All frontend requests go through here. Never call BOM analyzer directly.
 *
 * API_BASE must be the PUBLIC Railway URL (browser cannot access .railway.internal)
 * Set via Vercel env var: VITE_API_BASE=https://platform-api-production-d66b.up.railway.app
 */

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://platform-api-production-d66b.up.railway.app";

/**
 * Base fetch wrapper — injects auth token, handles 401 redirects.
 */
export async function apiCall(path, options = {}) {
  const token = localStorage.getItem("pgi_token");
  const headers = { ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("pgi_token");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return res;
}

// ═══════════════════════════════════════════════════
// BOM endpoints
// ═══════════════════════════════════════════════════

/**
 * Upload BOM file → Platform API → BOM Analyzer.
 * Returns preview (guest) or full report (authenticated).
 */
export async function uploadBOM(file, deliveryLocation, targetCurrency, priority = "cost") {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("delivery_location", deliveryLocation);
  fd.append("target_currency", targetCurrency);
  fd.append("priority", priority);

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

/**
 * Unlock full report for a guest BOM using session token.
 */
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

// ═══════════════════════════════════════════════════
// Auth endpoints
// ═══════════════════════════════════════════════════

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
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
    body: JSON.stringify({ email, password, full_name: fullName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  return res.json();
}

// ═══════════════════════════════════════════════════
// Project endpoints
// ═══════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════
// RFQ endpoints
// ═══════════════════════════════════════════════════

export async function createRFQ(bomId, notes = "") {
  const res = await apiCall("/api/v1/rfq/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bom_id: bomId, notes }),
  });
  if (!res.ok) throw new Error("Failed to create RFQ");
  return res.json();
}