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
 */
export async function apiCall(path, options = {}) {
  const cleanPath = path.trim();

  const token = localStorage.getItem("pgi_token");
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${cleanPath}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("pgi_token");
    window.location.href = "/login";
    throw new Error("Session expired");
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
  fd.append("session_token", getSessionToken()); // 🔥 FIX

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
      session_token: getSessionToken(), // 🔥 FIX
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }

  const data = await res.json();

  // 🔥 STORE TOKEN (CRITICAL)
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
      session_token: getSessionToken(), // 🔥 FIX
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }

  const data = await res.json();

  // 🔥 STORE TOKEN (IMPORTANT)
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