// =========================
// API BASE
// =========================
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  "";

// =========================
// TOKEN HANDLING (UNCHANGED)
// =========================
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

// =========================
// HEADER BUILDER (UNCHANGED)
// =========================
function buildHeaders(extra = {}, token = getStoredToken()) {
  const headers = { ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// =========================
// CORE REQUEST (UNCHANGED)
// =========================
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

// =========================
// FORM APPENDER (UNCHANGED)
// =========================
function appendFormValue(form, key, value) {
  if (value === undefined || value === null || value === "") return;

  if (value instanceof File || value instanceof Blob) {
    form.append(key, value);
    return;
  }

  form.append(
    key,
    typeof value === "object" ? JSON.stringify(value) : String(value)
  );
}

// =========================
// 🌍 GLOBAL MARKET DETECTION (NEW)
// =========================

function detectMarketContext() {
  try {
    const locale = navigator.language || "en-US";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    // REGION + CURRENCY MAP
    if (locale.includes("IN")) return { location: "India", currency: "INR" };
    if (locale.includes("US")) return { location: "United States", currency: "USD" };
    if (locale.includes("GB")) return { location: "United Kingdom", currency: "GBP" };
    if (locale.includes("AE")) return { location: "UAE", currency: "AED" };
    if (locale.includes("DE") || locale.includes("FR") || locale.includes("EU"))
      return { location: "Europe", currency: "EUR" };

    // TIMEZONE FALLBACK
    if (timezone.includes("Asia/Kolkata")) return { location: "India", currency: "INR" };
    if (timezone.includes("America")) return { location: "United States", currency: "USD" };
    if (timezone.includes("Europe")) return { location: "Europe", currency: "EUR" };

    return { location: "Global", currency: "USD" };
  } catch {
    return { location: "Global", currency: "USD" };
  }
}

// =========================
// 🧠 DYNAMIC INTAKE FORM BUILDER (UPGRADED)
// =========================

function buildIntakeForm({
  raw_input_text = "",
  input_type = "auto",
  intent = "auto",

  // 🔴 NOW OPTIONAL (NOT HARDCODED)
  delivery_location,
  target_currency,

  priority = "cost",
  purchase_mode = "auto",
  project_creation_mode = "auto",

  session_token = getGuestSessionToken(),
  voice_transcript = "",
  source_channel = "web",
  metadata = {},
  async_finalize = true,
  source_file = null,
  audio_file = null,
}) {
  const form = new FormData();

  // 🌍 DYNAMIC MARKET RESOLUTION
  const marketDefaults = detectMarketContext();

  const finalLocation =
    delivery_location ||
    metadata?.delivery_location ||
    marketDefaults.location;

  const finalCurrency =
    target_currency ||
    metadata?.target_currency ||
    marketDefaults.currency;

  // =========================
  // CORE PAYLOAD
  // =========================
  appendFormValue(form, "raw_input_text", raw_input_text);
  appendFormValue(form, "input_type", input_type);
  appendFormValue(form, "intent", intent);

  appendFormValue(form, "delivery_location", finalLocation);
  appendFormValue(form, "target_currency", finalCurrency);

  appendFormValue(form, "priority", priority);
  appendFormValue(form, "purchase_mode", purchase_mode);
  appendFormValue(form, "project_creation_mode", project_creation_mode);

  appendFormValue(form, "session_token", session_token);
  appendFormValue(form, "voice_transcript", voice_transcript);
  appendFormValue(form, "source_channel", source_channel);

  appendFormValue(form, "metadata_json", {
    ...metadata,
    resolved_location: finalLocation,
    resolved_currency: finalCurrency,
  });

  appendFormValue(form, "async_finalize", async_finalize);

  // FILES
  if (source_file) form.append("source_file", source_file);
  if (audio_file) form.append("audio_file", audio_file);

  return form;
}

// =========================
// INTAKE API (UNCHANGED + EXTENDED)
// =========================

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

// =========================
// 🆕 MATERIALIZE PROJECT FROM QUICK FLOW
// =========================
export async function materializeIntakeSession(sessionId, payload = {}) {
  const form = new FormData();

  appendFormValue(
    form,
    "session_token",
    payload.session_token || getGuestSessionToken()
  );

  const res = await request(
    `/api/v1/intake/sessions/${sessionId}/materialize`,
    {
      method: "POST",
      body: form,
      token: payload.token || getStoredToken(),
    }
  );

  if (res?.intake_session?.session_token) {
    persistGuestSessionToken(res.intake_session.session_token);
  }

  return res;
}

// =========================
// SESSION API (UNCHANGED)
// =========================

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

// =========================
// EXPORTS (UNCHANGED)
// =========================
export {
  getGuestSessionToken,
  persistGuestSessionToken,
  getStoredToken,
};