const API = import.meta.env.VITE_API_BASE_URL || "";
const BT = "pgi_buyer_token", VT = "pgi_vendor_token", SK = "pgi_guest_session";

export function getSessionToken() {
  let s = localStorage.getItem(SK);
  if (!s) { s = crypto.randomUUID(); localStorage.setItem(SK, s); }
  return s;
}

export async function apiCall(path, opts = {}) {
  const t = localStorage.getItem(BT) || localStorage.getItem(VT) || "";
  const h = { ...opts.headers };
  if (t) h["Authorization"] = `Bearer ${t}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers: h });
  if (res.status === 401) { localStorage.removeItem(BT); localStorage.removeItem(VT); window.dispatchEvent(new Event("pgi_auth_expired")); throw new Error("Session expired"); }
  return res;
}

async function jget(p) { const r = await apiCall(p); if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.detail||`Failed (${r.status})`); } return r.json(); }
async function jpost(p, b) { return jget_raw(p, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(b) }); }
async function jget_raw(p, o) { const r = await apiCall(p, o); if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.detail||`Failed (${r.status})`); } return r.json(); }
function fpost(p, fd) { return jget_raw(p, { method:"POST", body:fd }); }

// Auth
export async function loginUser(e, pw) { const d = await jpost("/api/v1/auth/login",{email:e,password:pw,session_token:getSessionToken()}); localStorage.setItem(BT,d.access_token); return d; }
export async function registerUser(e, pw, n) { const d = await jpost("/api/v1/auth/register",{email:e,password:pw,full_name:n,session_token:getSessionToken()}); localStorage.setItem(BT,d.access_token); return d; }
export async function vendorLogin(e, pw) { const d = await jpost("/api/v1/auth/vendor/login",{email:e,password:pw}); localStorage.setItem(VT,d.access_token); return d; }
export function logoutBuyer() { localStorage.removeItem(BT); localStorage.removeItem("pgi_user"); }
export function logoutVendor() { localStorage.removeItem(VT); }

// BOM
export function analyzeBOM(file, loc, cur, pri) { const fd = new FormData(); fd.append("file",file); fd.append("delivery_location",loc); fd.append("target_currency",cur); fd.append("priority",pri||"balanced"); fd.append("session_token",getSessionToken()); return fpost("/api/v1/bom/analyze",fd); }
export function promoteToProject(sid) { const fd = new FormData(); fd.append("search_session_id",sid); fd.append("session_token",getSessionToken()); return fpost("/api/v1/bom/promote-to-project",fd); }

// Intake
export function createSearch(q, qt="component") { const fd = new FormData(); fd.append("query_text",q); fd.append("query_type",qt); fd.append("session_token",getSessionToken()); return fpost("/api/v1/intake/search",fd); }
export function getSearchSession(id) { return jget(`/api/v1/intake/search/${id}`); }
export function saveAsSourcingCase(sid, name="Saved") { const fd = new FormData(); fd.append("name",name); fd.append("session_token",getSessionToken()); return fpost(`/api/v1/intake/search/${sid}/save`,fd); }
export function promoteCaseToProject(cid) { const fd = new FormData(); fd.append("session_token",getSessionToken()); return fpost(`/api/v1/intake/sourcing-case/${cid}/promote`,fd); }
export function listSourcingCases() { return jget(`/api/v1/intake/sourcing-cases?session_token=${getSessionToken()}`); }
export function listSearchSessions() { return jget(`/api/v1/intake/sessions?session_token=${getSessionToken()}`); }

// Projects
export function listProjects() { return jget("/api/v1/projects"); }
export function getProject(id) { return jget(`/api/v1/projects/${id}?session_token=${getSessionToken()}`); }

// Vendors
export function listVendors(s="") { return jget(`/api/v1/vendors?search=${encodeURIComponent(s)}`); }
export function matchVendors(pid) { return jget(`/api/v1/vendors/match/run?project_id=${pid}`); }

// RFQ
export function createRFQ(p) { return jpost("/api/v1/rfq/create",p); }
export function listRFQs(pid) { return jget(`/api/v1/rfq?project_id=${pid||""}`); }
export function getRFQQuotes(rid) { return jget(`/api/v1/rfq/${rid}/quotes`); }

// Orders
export function createPO(p) { return jpost("/api/v1/orders/po",p); }
export function listPOs(pid) { return jget(`/api/v1/orders/po?project_id=${pid||""}`); }

// Chat
export function getChatThreads(t, id) { return jget(`/api/v1/chat/threads?context_type=${t}&context_id=${id}`); }
export function createChatThread(p) { return jpost("/api/v1/chat/threads",p); }
export function getChatMessages(tid) { return jget(`/api/v1/chat/threads/${tid}/messages`); }
export function sendChatMessage(p) { return jpost("/api/v1/chat/messages",p); }

// Analytics
export function getDashboardAnalytics() { return jget("/api/v1/analytics/dashboard"); }
export function generateReport(p) { return jpost("/api/v1/analytics/reports",p); }

// Vendor portal
export function vendorDashboard() { return jget("/api/v1/vendor-portal/dashboard"); }
export function vendorRFQs() { return jget("/api/v1/vendor-portal/rfqs"); }
export function vendorRFQDetail(id) { return jget(`/api/v1/vendor-portal/rfqs/${id}`); }
export function vendorSubmitQuote(rid, p) { return jpost(`/api/v1/vendor-portal/rfqs/${rid}/quote`,p); }
export function vendorOrders() { return jget("/api/v1/vendor-portal/orders"); }
export function vendorPerformance() { return jget("/api/v1/vendor-portal/performance"); }
