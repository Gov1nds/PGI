import { createApiError } from "./apiErrors";
const API = import.meta.env.VITE_API_BASE_URL || "";
let _correlationId = null;
export function setCorrelationId(id) { _correlationId = id; }
export function getCorrelationId() { return _correlationId; }

const MIGRATION_KEY = "pgi_v4_migrated";
export function runLocalStorageMigration() {
  try {
    if (localStorage.getItem(MIGRATION_KEY)) return;
    ["pgi_buyer_token","pgi_vendor_token","pgi_guest_session","pgi_user"].forEach(k=>localStorage.removeItem(k));
    localStorage.setItem(MIGRATION_KEY,"1");
  } catch {}
}

export async function apiCall(path, opts = {}, token = null) {
  const headers = { ...opts.headers, "X-Request-ID": crypto.randomUUID() };
  if (_correlationId) headers["X-Correlation-ID"] = _correlationId;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers, credentials: "include" });
  if (!res.ok) { const body = await res.json().catch(()=>({})); throw createApiError(res.status, body); }
  return res.json();
}

export async function apiCallIdempotent(path, opts = {}, token = null) {
  return apiCall(path, { ...opts, headers: { ...opts.headers, "Idempotency-Key": crypto.randomUUID() } }, token);
}

function jget(p, t) { return apiCall(p, {}, t); }
function jpost(p, b, t) { return apiCall(p, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(b) }, t); }
function jput(p, b, t) { return apiCall(p, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(b) }, t); }
function jpatch(p, b, t) { return apiCall(p, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: b ? JSON.stringify(b) : undefined }, t); }
function jpostIdem(p, b, t) { return apiCallIdempotent(p, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(b) }, t); }
function fpost(p, fd, t) { return apiCall(p, { method:"POST", body:fd }, t); }

// OAuth (Task 1)
export function oauthLogin(provider) {
  const redirect = encodeURIComponent(window.location.origin + `/auth/oauth/${provider}/callback`);
  window.location.href = `${API}/api/v1/auth/oauth/${provider}/login?redirect=${redirect}`;
}
export function oauthCallback(provider, code, state) {
  return jpost(`/api/v1/auth/oauth/${provider}/callback`, { code, state });
}

// Location detection (Task 2)
export function detectLocation() { return jget("/api/v1/guest/detect-location"); }

// Guest intelligence report (Task 3)
export function getGuestIntelligenceReport(body) { return jpost("/api/v1/guest/intelligence-report", body); }

// Guest → auth convert (Task 4)
export function convertGuest(sessionToken) { return jpost("/api/v1/auth/convert-guest", { session_token: sessionToken }); }

// Auth - Buyer
export function loginUser(e, pw) { return jpost("/api/v1/auth/login",{email:e,password:pw}); }
export function registerUser(e, pw, n) { return jpost("/api/v1/auth/register",{email:e,password:pw,full_name:n}); }
export function refreshToken() { return apiCall("/api/v1/auth/refresh",{method:"POST"},null); }
export function logoutUser() { return apiCall("/api/v1/auth/logout",{method:"POST"},null); }
export function getMe(t) { return jget("/api/v1/auth/me",t); }
export function getDashboardHydration(t) { return jget("/api/v1/auth/dashboard",t); }

// Auth - Vendor
export function vendorLoginApi(e, pw) { return jpost("/api/v1/auth/vendor/login",{email:e,password:pw}); }
export function vendorRefreshToken() { return apiCall("/api/v1/auth/vendor/refresh",{method:"POST"},null); }
export function vendorLogoutApi() { return apiCall("/api/v1/auth/vendor/logout",{method:"POST"},null); }

// BOM / Intake
export function analyzeBOM(file, loc, cur, pri, t) { const fd=new FormData(); fd.append("file",file); fd.append("delivery_location",loc); fd.append("target_currency",cur); fd.append("priority",pri||"balanced"); return fpost("/api/v1/bom_uploads",fd,t); }
export function createSearch(q, qt="component", t) { return jpost("/api/v1/intake/search",{query_text:q,query_type:qt},t); }
export function getSearchSession(id, t) { return jget(`/api/v1/intake/search/${id}`,t); }
export function saveAsSourcingCase(sid, name="Saved", t) { return jpost(`/api/v1/intake/search/${sid}/save`,{name},t); }
export function promoteCaseToProject(cid, t) { return jpost(`/api/v1/intake/sourcing-case/${cid}/promote`,{},t); }
export function listSourcingCases(t) { return jget("/api/v1/intake/sourcing-cases",t); }

// Sessions (SM-003)
export function listSessions(t, cursor, limit=20) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); return jget(`/api/v1/sessions?${p}`,t); }
export function getSession(id, t) { return jget(`/api/v1/sessions/${id}`,t); }
export function promoteSession(id, t) { return jpostIdem(`/api/v1/sessions/${id}/promote`,{},t); }

// Projects
export function listProjects(t, cursor, limit=20) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); return jget(`/api/v1/projects?${p}`,t); }
export function getProject(id, t) { return jget(`/api/v1/projects/${id}`,t); }
export function promoteToProject(sid, t) { return jpostIdem("/api/v1/bom/promote-to-project",{search_session_id:sid},t); }

// BOM Lines (SM-001)
export function getBOMLines(pid, t, cursor, limit=50, sf) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); if(sf)p.set("status",sf); return jget(`/api/v1/projects/${pid}/bom-lines?${p}`,t); }
export function getBOMLineDetail(pid, lid, t) { return jget(`/api/v1/projects/${pid}/bom-lines/${lid}`,t); }
export function getBOMLineNormalization(pid, lid, t) { return jget(`/api/v1/projects/${pid}/bom-lines/${lid}/normalization`,t); }
export function getBOMLineEnrichment(pid, lid, t) { return jget(`/api/v1/projects/${pid}/bom-lines/${lid}/enrichment`,t); }
export function getBOMLineScores(pid, lid, t) { return jget(`/api/v1/projects/${pid}/bom-lines/${lid}/scores`,t); }
export function getBOMLineRecommendations(pid, lid, t) { return jget(`/api/v1/projects/${pid}/bom-lines/${lid}/recommendations`,t); }

// Vendors
export function listVendors(s="", t) { return jget(`/api/v1/vendors?search=${encodeURIComponent(s)}`,t); }
export function matchVendors(pid, t) { return jget(`/api/v1/vendors/match/run?project_id=${pid}`,t); }
export function getVendorById(id, t) { return jget(`/api/v1/vendors/${id}`,t); }
export function getVendorIntelligence(id, t) { return jget(`/api/v1/vendors/${id}/intelligence`,t); }
export function getVendorScoreHistory(id, t) { return jget(`/api/v1/vendors/${id}/score-history`,t); }
export function getBOMLineVendors(pid, lid, t) { return jget(`/api/v1/projects/${pid}/bom-lines/${lid}/vendors`,t); }

// BOM Bulk Actions (Task 5)
export function bulkBOMAction(pid, lineIds, action, payload, t) { return jpost(`/api/v1/projects/${pid}/bom-lines/bulk-action`, { line_ids: lineIds, action, ...payload }, t); }
export function getBOMAttentionQueue(pid, t) { return jget(`/api/v1/projects/${pid}/bom-lines?priority=attention&limit=20`,t); }

// RFQ (SM-004)
export function createRFQ(pid, payload, t) { return jpostIdem(`/api/v1/projects/${pid}/rfqs`,payload,t); }
export function listProjectRFQs(pid, t) { return jget(`/api/v1/projects/${pid}/rfqs`,t); }
export function listRFQs(t, cursor, limit=20) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); return jget(`/api/v1/rfqs?${p}`,t); }
export function getComparisonMatrix(pid, rid, t) { return jget(`/api/v1/projects/${pid}/rfqs/${rid}/comparison`,t); }

// Quotes (SM-005)
export function acceptQuote(qid, t) { return jpostIdem(`/api/v1/quotes/${qid}/accept`,{},t); }
export function rejectQuote(qid, reason, t) { return jpost(`/api/v1/quotes/${qid}/reject`,{reason},t); }

// Purchase Orders (SM-006)
export function createPurchaseOrder(pid, payload, t) { return jpostIdem(`/api/v1/projects/${pid}/purchase-orders`,payload,t); }
export function listProjectPOs(pid, t) { return jget(`/api/v1/projects/${pid}/purchase-orders`,t); }
export function listPurchaseOrders(t, cursor, limit=20) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); return jget(`/api/v1/purchase-orders?${p}`,t); }
export function decideApproval(aid, decision, t) { return jpost(`/api/v1/approvals/${aid}/decide`,decision,t); }
export function getPOTimeline(poId, t) { return jget(`/api/v1/orders/po/${poId}/timeline`,t); }
export function bookLogistics(poId, carrier, t) { return jpost(`/api/v1/orders/po/${poId}/book-logistics`,{ carrier },t); }
export function confirmGR(poId, t) { return jpost(`/api/v1/orders/po/${poId}/confirm-gr`,{},t); }

// Shipments (SM-007)
export function getProjectShipments(pid, poid, t) { return jget(`/api/v1/projects/${pid}/purchase-orders/${poid}/shipments`,t); }
export function listShipments(t, cursor, limit=20) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); return jget(`/api/v1/shipments?${p}`,t); }

// Events
export function getProjectEvents(pid, t, cursor, limit=50) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); return jget(`/api/v1/projects/${pid}/events?${p}`,t); }

// Weight Profile
export function getWeightProfile(pid, t) { return jget(`/api/v1/projects/${pid}/weight-profile`,t); }
export function setWeightProfile(pid, profile, t) { return jput(`/api/v1/projects/${pid}/weight-profile`,profile,t); }

// Analytics
export function getDashboardAnalytics(t) { return jget("/api/v1/analytics/dashboard",t); }
export function getProjectAnalytics(pid, t) { return jget(`/api/v1/analytics/project/${pid}`,t); }
export function listReports(t, cursor, limit=20) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); return jget(`/api/v1/analytics/reports?${p}`,t); }
export function requestReport(type, filters, t) { return jpost("/api/v1/analytics/reports",{type,...filters},t); }
export function exportReport(rid, format, t) { return jpost(`/api/v1/analytics/reports/${rid}/export`,{format},t); }
export function sendTelemetry(events) { return apiCall("/api/v1/analytics/telemetry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({events})},null).catch(()=>{}); }

// Chat
export function getChatThreads(ct, ci, t) { return jget(`/api/v1/chat/threads?context_type=${ct}&context_id=${ci}`,t); }
export function createChatThread(p, t) { return jpost("/api/v1/chat/threads",p,t); }
export function getChatMessages(tid, t) { return jget(`/api/v1/chat/threads/${tid}/messages`,t); }
export function sendChatMessage(p, t) { return jpostIdem("/api/v1/chat/messages",p,t); }
export function acceptOffer(threadId, msgId, t) { return jpost(`/api/v1/chat/threads/${threadId}/offers/${msgId}/accept`,{},t); }
export function rejectOffer(threadId, msgId, reason, t) { return jpost(`/api/v1/chat/threads/${threadId}/offers/${msgId}/reject`,{ reason },t); }

// Notifications
export function getNotifications(t, cursor, limit=20, status) { const p=new URLSearchParams({limit}); if(cursor)p.set("cursor",cursor); if(status)p.set("status",status); return jget(`/api/v1/notifications?${p}`,t); }
export function markNotificationRead(id, t) { return jpatch(`/api/v1/notifications/${id}/read`,null,t); }
export function markAllNotificationsRead(t) { return jpost("/api/v1/notifications/mark-all-read",{},t); }

// Search
export function globalSearch(q, t) { return jget(`/api/v1/search?q=${encodeURIComponent(q)}`,t); }

// Vendor Portal
export function vendorDashboard(t) { return jget("/api/v1/vendor-portal/dashboard",t); }
export function vendorRFQs(t) { return jget("/api/v1/vendor-portal/rfqs",t); }
export function vendorRFQDetail(id, t) { return jget(`/api/v1/vendor-portal/rfqs/${id}`,t); }
export function vendorSubmitQuote(rid, p, t) { return jpostIdem(`/api/v1/vendor-portal/rfqs/${rid}/quote`,p,t); }
export function vendorOrders(t) { return jget("/api/v1/vendor-portal/orders",t); }
export function vendorPerformance(t) { return jget("/api/v1/vendor-portal/performance",t); }
export function getVendorProfile(t) { return jget("/api/v1/vendor/profile",t); }
export function updateVendorProfile(p, t) { return jput("/api/v1/vendor/profile",p,t); }
export function getVendorProfileCompletion(t) { return jget("/api/v1/vendor/profile-completion",t); }
export function vendorProductionUpdate(poId, data, t) { return jpost(`/api/v1/vendor-portal/orders/${poId}/production-update`, data, t); }
export function listVendorCertifications(t) { return jget("/api/v1/vendor/certifications",t); }
export function uploadVendorCertification(file, t) { const fd=new FormData(); fd.append("file",file); return fpost("/api/v1/vendor/certifications",fd,t); }
