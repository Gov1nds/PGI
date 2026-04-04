const CANONICAL_GUEST_SESSION_KEY = "pgi_guest_session_token";
const LEGACY_GUEST_SESSION_KEYS = [
  "guest_session_token",
  "pgi_guest_session_token",
  "pgi_session",
  "session_token",
];

function safeStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function readGuestSessionToken() {
  const storage = safeStorage();
  if (!storage) return "";
  for (const key of LEGACY_GUEST_SESSION_KEYS) {
    const token = storage.getItem(key);
    if (token) return token;
  }
  return "";
}

export function writeGuestSessionToken(token) {
  const storage = safeStorage();
  if (!storage || !token) return token || "";
  storage.setItem(CANONICAL_GUEST_SESSION_KEY, token);
  for (const key of LEGACY_GUEST_SESSION_KEYS) {
    storage.setItem(key, token);
  }
  return token;
}

export function clearGuestSessionToken() {
  const storage = safeStorage();
  if (!storage) return;
  for (const key of LEGACY_GUEST_SESSION_KEYS) {
    storage.removeItem(key);
  }
  storage.removeItem(CANONICAL_GUEST_SESSION_KEY);
}

export function ensureGuestSessionToken() {
  const existing = readGuestSessionToken();
  if (existing) return existing;

  let token;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    token = crypto.randomUUID();
  } else {
    token = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  return writeGuestSessionToken(token);
}