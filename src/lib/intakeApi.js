const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || "";

function getStoredToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("pgi_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function getGuestSessionToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("guest_session_token") ||
    localStorage.getItem("pgi_guest_session_token") ||
    localStorage.getItem("pgi_session") ||
    localStorage.getItem("session_token") ||
    ""
  );
}

function persistGuestSessionToken(token) {
  if (typeof window === "undefined" || !token) return;
  localStorage.setItem("guest_session_token", token);
  localStorage.setItem("pgi_guest_session_token", token);
  localStorage.setItem("pgi_session", token);
}

function buildHeaders(extra = {}, token = getStoredToken()) {
  const headers = { ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    token = getStoredToken(),
  } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders(headers, token),
    body,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      payload?.detail ||
      payload?.message ||
      payload?.error ||
      (typeof payload === "string" ? payload : "Request failed");
    throw new Error(message);
  }

  return payload;
}

function appendFormValue(form, key, value) {
  if (value === undefined || value === null || value === "") return;

  if (value instanceof File || value instanceof Blob) {
    form.append(key, value);
    return;
  }

  form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
}

function buildIntakeForm({
  raw_input_text = "",
  input_type = "auto",
  intent = "auto",
  delivery_location = "India",
  target_currency = "USD",
  priority = "cost",
  session_token = getGuestSessionToken(),
  voice_transcript = "",
  source_channel = "web",
  metadata = {},
  async_finalize = true,
  source_file = null,
  audio_file = null,
}) {
  const form = new FormData();

  appendFormValue(form, "raw_input_text", raw_input_text);
  appendFormValue(form, "input_type", input_type);
  appendFormValue(form, "intent", intent);
  appendFormValue(form, "delivery_location", delivery_location);
  appendFormValue(form, "target_currency", target_currency);
  appendFormValue(form, "priority", priority);
  appendFormValue(form, "session_token", session_token);
  appendFormValue(form, "voice_transcript", voice_transcript);
  appendFormValue(form, "source_channel", source_channel);
  appendFormValue(form, "metadata_json", metadata);
  appendFormValue(form, "async_finalize", async_finalize);

  if (source_file) form.append("source_file", source_file);
  if (audio_file) form.append("audio_file", audio_file);

  return form;
}

export async function parseIntake(payload = {}) {
  const form = buildIntakeForm(payload);
  const res = await request("/api/v1/intake/parse", {
    method: "POST",
    body: form,
    token: payload.token || getStoredToken(),
  });

  if (res?.intake_session?.session_token) {
    persistGuestSessionToken(res.intake_session.session_token);
  }

  return res;
}

export async function normalizeIntake(payload = {}) {
  const form = buildIntakeForm(payload);
  const res = await request("/api/v1/intake/normalize", {
    method: "POST",
    body: form,
    token: payload.token || getStoredToken(),
  });

  if (res?.intake_session?.session_token) {
    persistGuestSessionToken(res.intake_session.session_token);
  }

  return res;
}

export async function submitIntake(payload = {}) {
  const form = buildIntakeForm(payload);
  const res = await request("/api/v1/intake/submit", {
    method: "POST",
    body: form,
    token: payload.token || getStoredToken(),
  });

  if (res?.intake_session?.session_token) {
    persistGuestSessionToken(res.intake_session.session_token);
  }

  return res;
}

export async function getIntakeSession(sessionId, token = getStoredToken()) {
  return request(`/api/v1/intake/sessions/${sessionId}`, {
    method: "GET",
    token,
  });
}

export async function listIntakeSessions({
  limit = 20,
  offset = 0,
  session_token = getGuestSessionToken(),
  token = getStoredToken(),
} = {}) {
  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  qs.set("offset", String(offset));
  if (session_token) qs.set("session_token", session_token);

  return request(`/api/v1/intake/sessions?${qs.toString()}`, {
    method: "GET",
    token,
  });
}

export { getGuestSessionToken, persistGuestSessionToken, getStoredToken };

