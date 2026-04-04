import { readGuestSessionToken, writeGuestSessionToken, clearGuestSessionToken } from "./guestSession";

const GUEST_WORKSPACE_PREFIX = "pgi_guest_workspace:";

function safeJSONParse(value, fallback = null) {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function storageKey(projectId) {
  if (!projectId) return null;
  return `${GUEST_WORKSPACE_PREFIX}${projectId}`;
}

export function saveGuestWorkspace(projectId, payload) {
  try {
    if (typeof window === "undefined") return null;
    const key = storageKey(projectId);
    if (!key) return null;
    const existing = loadGuestWorkspace(projectId) || {};
    const next = {
      ...existing,
      ...payload,
      project_id: projectId,
      saved_at: new Date().toISOString(),
    };
    window.localStorage.setItem(key, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function loadGuestWorkspace(projectId) {
  try {
    if (typeof window === "undefined") return null;
    const key = storageKey(projectId);
    if (!key) return null;
    const raw = window.localStorage.getItem(key);
    return safeJSONParse(raw, null);
  } catch {
    return null;
  }
}

export function clearGuestWorkspace(projectId) {
  try {
    if (typeof window === "undefined") return;
    const key = storageKey(projectId);
    if (!key) return;
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage failures
  }
}

export function getGuestSessionToken() {
  return readGuestSessionToken();
}

export function setGuestSessionToken(token) {
  return writeGuestSessionToken(token);
}

export function clearGuestSessionState() {
  clearGuestSessionToken();
}

export { readGuestSessionToken, writeGuestSessionToken };