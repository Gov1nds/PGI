import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { LoadingState, EmptyState, ErrorState, StatusBadge } from "../../components/Shared";
import { useAuth } from "../../context/AuthContext";
import StaleBadge from "../../components/StaleBadge";
import Pagination from "../../components/Pagination";
import {
  getDashboardHydration, getDashboardAnalytics, listProjects, listSourcingCases,
  listVendors, listRFQs, listPurchaseOrders, listShipments, listSessions,
  getSession, promoteSession, listReports, requestReport, exportReport
} from "../../lib/api";

function KPI({ label, value, sub }) {
  const bars = [40,65,45,80,55,70,90,60];
  return (
    <div className="kpi-card group">
      <div className="flex items-start justify-between mb-3">
        <div><div className="text-[11px] text-[#6B7280] font-medium uppercase tracking-wider">{label}</div><div className="text-2xl font-bold text-[#0A0A0A] mt-1">{value}</div>{sub&&<div className="text-[11px] text-[#6B7280] mt-0.5">{sub}</div>}</div>
        <div className="mini-chart w-16 opacity-60 group-hover:opacity-100 transition">{bars.map((h,i)=><span key={i} style={{height:`${h}%`}}/>)}</div>
      </div>
    </div>
  );
}

/* ═══ DASHBOARD ═══ */
export function Dashboard() {
  const { accessToken } = useAuth();
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      const [hydration, p, c] = await Promise.all([
        getDashboardHydration(accessToken).catch(() => getDashboardAnalytics(accessToken).catch(() => null)),
        listProjects(accessToken).catch(() => ({ items: [] })),
        listSourcingCases(accessToken).catch(() => []),
      ]);
      setData(hydration);
      setProjects(p.items || p || []);
      setCases(Array.isArray(c) ? c : c.items || []);
    } catch {}
    setLoading(false);
  }, [accessToken]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) return <LoadingState />;
  const d = data || {};

  return (
    <div className="p-6 space-y-6">
      {d.computed_at && <StaleBadge computedAt={d.computed_at} onRefresh={fetchDashboard} />}
      <div className="card p-5 flex items-center gap-4">
        <div className="flex-1"><h1 className="text-lg font-semibold text-[#0A0A0A]">Analyze a component or BOM</h1><p className="text-xs text-[#6B7280] mt-0.5">Upload a file, paste text, or search for a part number</p></div>
        <Link to="/analyze" className="px-5 py-2.5 bg-[#0A0A0A] text-white text-sm font-medium rounded-xl hover:bg-[#1A1A1A] transition shrink-0">Start Analysis</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI label="Active Projects" value={d.active_projects||0} />
        <KPI label="Open RFQs" value={d.pending_rfqs||0} />
        <KPI label="Quotes Waiting" value={d.total_rfqs||0} sub="total submitted" />
        <KPI label="Delayed Shipments" value={d.active_shipments||0} />
        <KPI label="Spend to Date" value={`$${(d.total_spend||0).toLocaleString()}`} />
        <KPI label="Total Projects" value={d.total_projects||0} />
      </div>

      {/* Action queue */}
      {d.action_queue?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Action Queue</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{d.action_queue.map((a, i) => (
            <div key={i} className="card p-4 border-l-2 border-amber-300">
              <div className="text-sm font-medium text-[#0A0A0A]">{a.title}</div>
              <div className="text-[11px] text-[#6B7280] mt-1">{a.description}</div>
              {a.deep_link && <Link to={a.deep_link} className="text-[11px] text-[#0A0A0A] mt-2 inline-block">Take action →</Link>}
            </div>
          ))}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-[#0A0A0A]">Category Spend</h3></div>
          <div className="space-y-2">{Object.entries(d.category_breakdown||{}).map(([k,v])=>{const max=Math.max(...Object.values(d.category_breakdown||{1:1}));return <div key={k} className="flex items-center gap-3"><span className="text-[11px] text-[#6B7280] w-24 truncate capitalize">{k}</span><div className="flex-1 h-5 bg-[#F5F5F5] rounded-md overflow-hidden"><div className="h-full bg-[#F5F5F5] rounded-md flex items-center pl-2" style={{width:`${(v/max)*100}%`}}><span className="text-[10px] text-[#374151] font-medium">{v}</span></div></div></div>})}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-[#0A0A0A]">Project Pipeline</h3></div>
          <div className="space-y-2">{Object.entries(d.status_breakdown||{}).map(([k,v])=>(<div key={k} className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0] last:border-0"><StatusBadge status={k}/><span className="text-sm text-[#0A0A0A] font-medium">{v}</span></div>))}</div>
        </div>
      </div>

      {d.continue_where_left_off?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Continue where you left off</h2>
          <div className="grid md:grid-cols-3 gap-3">{d.continue_where_left_off.map(p=>(<Link key={p.id} to={`/project/${p.id}`} className="card p-4 hover:border-[#D4D4D4] transition group"><div className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#374151] transition">{p.name}</div><div className="flex items-center gap-2 mt-2"><StatusBadge status={p.status}/><span className="text-[11px] text-[#9CA3AF]">{p.updated_at?.slice(0,10)}</span></div></Link>))}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3"><h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Recent Projects</h2><Link to="/projects" className="text-[11px] text-[#0A0A0A] hover:text-[#374151]">View all →</Link></div>
          {projects.length===0 ? <EmptyState title="No projects yet" actionLabel="Analyze a BOM" action={()=>nav("/analyze")} /> :
            <div className="space-y-1.5">{projects.slice(0,8).map(p=>(<Link key={p.id||p.project_id} to={`/project/${p.id||p.project_id}`} className="card flex items-center justify-between p-3.5 hover:border-[#E5E5E5] transition"><div><div className="text-sm font-medium text-[#0A0A0A]">{p.name}</div><div className="text-[11px] text-[#9CA3AF] mt-0.5">{p.total_parts} parts</div></div><StatusBadge status={p.status}/></Link>))}</div>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-3"><h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Recent Sessions</h2><Link to="/sessions" className="text-[11px] text-[#0A0A0A] hover:text-[#374151]">View all →</Link></div>
          {(d.recent_sessions || cases).length === 0 ? <EmptyState title="No sessions yet" /> :
            <div className="space-y-1.5">{(d.recent_sessions || cases).slice(0,8).map(c=>(<Link key={c.id||c.session_id} to={c.session_id ? `/sessions/${c.session_id}` : `/sessions`} className="card p-3.5 block hover:border-[#E5E5E5] transition"><div className="text-sm text-[#0A0A0A]">{c.name}</div><div className="flex items-center gap-2 mt-1"><StatusBadge status={c.status}/><span className="text-[11px] text-[#9CA3AF] truncate">{c.query_text?.slice(0,40)}</span></div></Link>))}</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══ PROJECTS LIST ═══ */
export function ProjectsList() {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState([]); const [loading, setLoading] = useState(true); const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => { setLoading(true); try { const d = await listProjects(accessToken, cursor); setProjects(d.items||d||[]); setPagination(d.pagination); } catch{} setLoading(false); }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (<div className="p-6"><div className="flex items-center justify-between mb-6"><h1 className="text-xl font-bold text-[#0A0A0A]">Projects</h1><Link to="/analyze" className="px-4 py-2 bg-[#0A0A0A] text-white text-xs rounded-lg hover:bg-[#1A1A1A] font-medium">+ New Analysis</Link></div>{projects.length===0?<EmptyState title="No projects yet" description="Upload a BOM to create your first project"/>:<div className="space-y-1.5">{projects.map(p=>(<Link key={p.id||p.project_id} to={`/project/${p.id||p.project_id}`} className="card flex items-center justify-between p-4 hover:border-[#E5E5E5] transition"><div><div className="text-sm font-medium text-[#0A0A0A]">{p.name}</div><div className="text-[11px] text-[#9CA3AF] mt-0.5">{p.total_parts} parts · {p.created_at?new Date(p.created_at).toLocaleDateString():""}</div></div><StatusBadge status={p.status}/></Link>))}</div>}<Pagination pagination={pagination} onPageChange={fetch} currentCount={projects.length} /></div>);
}

/* ═══ SOURCING CASES ═══ */
export function SourcingCasesList() {
  const { accessToken } = useAuth();
  const [cases, setCases] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { listSourcingCases(accessToken).then(d => setCases(Array.isArray(d)?d:d.items||[])).catch(()=>[]).finally(()=>setLoading(false)); }, [accessToken]);
  if (loading) return <LoadingState />;
  return (<div className="p-6"><h1 className="text-xl font-bold text-[#0A0A0A] mb-6">Sourcing Cases</h1>{cases.length===0?<EmptyState title="No sourcing cases" description="Save a search to create a sourcing case"/>:<div className="space-y-1.5">{cases.map(c=>(<div key={c.id} className="card p-4"><div className="text-sm text-[#0A0A0A]">{c.name}</div><div className="flex items-center gap-2 mt-1"><StatusBadge status={c.status}/><span className="text-[11px] text-[#9CA3AF]">{c.query_text?.slice(0,60)}</span></div></div>))}</div>}</div>);
}

/* ═══ SESSIONS LIST (NEW) ═══ */
export function SessionsList() {
  const { accessToken } = useAuth();
  const [sessions, setSessions] = useState([]); const [loading, setLoading] = useState(true); const [pagination, setPagination] = useState(null);
  const nav = useNavigate();
  const fetch = useCallback(async (cursor) => { setLoading(true); try { const d = await listSessions(accessToken, cursor); setSessions(d.items||d||[]); setPagination(d.pagination); } catch{} setLoading(false); }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  const handlePromote = async (id) => { try { const r = await promoteSession(id, accessToken); nav(`/project/${r.project_id}`); } catch {} };
  if (loading) return <LoadingState />;
  return (<div className="p-6"><h1 className="text-xl font-bold text-[#0A0A0A] mb-6">Sessions</h1>{sessions.length===0?<EmptyState title="No sessions" description="Start a search from the home page to create a session"/>:<div className="space-y-1.5">{sessions.map(s=>(<div key={s.session_id||s.id} className="card flex items-center justify-between p-4"><Link to={`/sessions/${s.session_id||s.id}`} className="flex-1 hover:text-[#374151]"><div className="text-sm font-medium text-[#0A0A0A]">{s.name||"Session"}</div><div className="flex items-center gap-2 mt-1"><StatusBadge status={s.status}/><span className="text-[11px] text-[#9CA3AF]">{s.query_text?.slice(0,50)}</span></div></Link>{s.status !== "PROMOTED_TO_PROJECT" && s.status !== "CLOSED" && <button onClick={()=>handlePromote(s.session_id||s.id)} className="ml-4 px-3 py-1.5 text-[11px] bg-[#0A0A0A] text-white rounded-lg hover:bg-[#1A1A1A]">Promote</button>}</div>))}</div>}<Pagination pagination={pagination} onPageChange={fetch} currentCount={sessions.length} /></div>);
}

/* ═══ SESSION DETAIL (for SessionShell outlet) ═══ */
export function SessionDetail() {
  const ctx = useOutletContext();
  const session = ctx?.session;
  if (!session) return <EmptyState title="Session not found" />;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#0A0A0A] mb-2">{session.name || "Session Detail"}</h1>
      <div className="flex items-center gap-3 mb-6"><StatusBadge status={session.status} /><span className="text-[11px] text-[#6B7280]">Created: {session.created_at?.slice(0,10)}</span></div>
      {session.query_text && <div className="card p-4 mb-4"><div className="text-[11px] text-[#6B7280] mb-1">Search Query</div><div className="text-sm text-[#0A0A0A]">{session.query_text}</div></div>}
      {session.components?.length > 0 && (<div><h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Components Found</h3><div className="space-y-1.5">{session.components.map((c,i) => (<div key={i} className="card p-3"><div className="text-sm text-[#0A0A0A]">{c.part_name || c.description || c.raw_text}</div><div className="text-[11px] text-[#6B7280]">{c.category} · Qty {c.quantity}</div></div>))}</div></div>)}
    </div>
  );
}

/* ═══ MARKETPLACE ═══ */
export function Marketplace() {
  const { accessToken } = useAuth();
  const [vendors, setVendors] = useState([]); const [search, setSearch] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); listVendors(search, accessToken).then(d => setVendors(d.items||d||[])).catch(()=>[]).finally(()=>setLoading(false)); }, [search, accessToken]);
  return (<div className="p-6"><h1 className="text-xl font-bold text-[#0A0A0A] mb-6">Marketplace</h1><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vendors..." className="w-full max-w-md px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg text-sm text-[#0A0A0A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0A0A0A] mb-6"/>{loading?<LoadingState/>:vendors.length===0?<EmptyState title="No vendors found"/>:<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{vendors.map(v=>(<div key={v.id||v.vendor_id} className="card p-5"><div className="text-sm font-semibold text-[#0A0A0A] mb-1">{v.name}</div><div className="text-[11px] text-[#6B7280] mb-3">{v.country||"—"} · {v.region||"—"}</div><div className="flex flex-wrap gap-1 mb-3">{(v.certifications||[]).slice(0,3).map((c,i)=><span key={i} className="px-1.5 py-0.5 text-[10px] bg-[#FAFAFA] text-[#6B7280] rounded border border-[#E5E5E5]">{c}</span>)}</div><div className="flex items-center justify-between text-[11px] text-[#6B7280]"><span>Reliability: {((v.reliability_score||0)*100).toFixed(0)}%</span><span>Lead: {v.avg_lead_time_days||"—"}d</span></div></div>))}</div>}</div>);
}

/* ═══ ANALYTICS ═══ */
export function Analytics() {
  const { accessToken } = useAuth();
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { getDashboardAnalytics(accessToken).then(setData).catch(()=>{}).finally(()=>setLoading(false)); }, [accessToken]);
  if (loading) return <LoadingState />; if (!data) return <EmptyState title="No analytics data" />;
  return (<div className="p-6"><h1 className="text-xl font-bold text-[#0A0A0A] mb-6">Analytics</h1><div className="grid md:grid-cols-2 gap-4"><div className="card p-5"><h3 className="text-sm font-semibold text-[#0A0A0A] mb-3">Categories</h3>{Object.entries(data.category_breakdown||{}).map(([k,v])=><div key={k} className="flex justify-between py-1.5 border-b border-[#F0F0F0]"><span className="text-xs text-[#9CA3AF] capitalize">{k}</span><span className="text-xs text-[#0A0A0A] font-medium">{v}</span></div>)}</div><div className="card p-5"><h3 className="text-sm font-semibold text-[#0A0A0A] mb-3">Pipeline</h3>{Object.entries(data.status_breakdown||{}).map(([k,v])=><div key={k} className="flex justify-between py-1.5 border-b border-[#F0F0F0]"><StatusBadge status={k}/><span className="text-xs text-[#0A0A0A] font-medium">{v}</span></div>)}</div></div></div>);
}

/* ═══ RFQs LIST ═══ */
export function RFQsList() {
  const { accessToken } = useAuth();
  const [rfqs, setRFQs] = useState([]); const [loading, setLoading] = useState(true); const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => { setLoading(true); try { const d = await listRFQs(accessToken, cursor); setRFQs(d.items||d||[]); setPagination(d.pagination); } catch{} setLoading(false); }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (<div className="p-6"><h1 className="text-xl font-bold text-[#0A0A0A] mb-6">RFQs</h1>{rfqs.length===0?<EmptyState title="No RFQs yet"/>:<div className="space-y-1.5">{rfqs.map(r=>(<div key={r.id||r.rfq_id} className="card flex items-center justify-between p-4"><div><div className="text-sm text-[#0A0A0A]">RFQ {(r.id||r.rfq_id||"").slice(0,8)}</div><div className="text-[11px] text-[#9CA3AF]">{r.project_name || ""} · {r.created_at?new Date(r.created_at).toLocaleDateString():""}</div></div><StatusBadge status={r.status}/></div>))}</div>}<Pagination pagination={pagination} onPageChange={fetch} currentCount={rfqs.length} /></div>);
}

/* ═══ ORDERS LIST ═══ */
export function OrdersList() {
  const { accessToken } = useAuth();
  const [pos, setPOs] = useState([]); const [loading, setLoading] = useState(true); const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => { setLoading(true); try { const d = await listPurchaseOrders(accessToken, cursor); setPOs(d.items||d||[]); setPagination(d.pagination); } catch{} setLoading(false); }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (<div className="p-6"><h1 className="text-xl font-bold text-[#0A0A0A] mb-6">Purchase Orders</h1>{pos.length===0?<EmptyState title="No purchase orders yet"/>:<div className="space-y-1.5">{pos.map(p=>(<div key={p.id||p.po_id} className="card flex items-center justify-between p-4"><div><div className="text-sm text-[#0A0A0A]">{p.po_number||(p.id||"").slice(0,8)}</div><div className="text-[11px] text-[#9CA3AF]">{p.vendor_name||""} · {p.total?`$${Number(p.total).toLocaleString()}`:""}</div></div><StatusBadge status={p.status}/></div>))}</div>}<Pagination pagination={pagination} onPageChange={fetch} currentCount={pos.length} /></div>);
}

/* ═══ SHIPMENTS (functional) ═══ */
export function ShipmentsList() {
  const { accessToken } = useAuth();
  const [shipments, setShipments] = useState([]); const [loading, setLoading] = useState(true); const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => { setLoading(true); try { const d = await listShipments(accessToken, cursor); setShipments(d.items||d||[]); setPagination(d.pagination); } catch{} setLoading(false); }, [accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (<div className="p-6"><h1 className="text-xl font-bold text-[#0A0A0A] mb-6">Shipments</h1>{shipments.length===0?<EmptyState title="No active shipments"/>:<div className="space-y-2">{shipments.map(s=>(<div key={s.shipment_id||s.id} className="card p-4"><div className="flex items-center justify-between mb-2"><div><div className="text-sm font-medium text-[#0A0A0A]">{s.carrier||"Carrier"} — {s.tracking_number||"—"}</div><div className="text-[11px] text-[#6B7280]">PO: {s.po_number||"—"} · ETA: {s.estimated_delivery?.slice(0,10)||"—"}</div></div><StatusBadge status={s.status}/></div>{s.milestones?.length>0&&<div className="border-t border-[#F0F0F0] pt-2 mt-2 space-y-1">{s.milestones.slice(-3).map((m,i)=>(<div key={i} className="flex items-center gap-2 text-[11px]"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"/><span className="text-[#9CA3AF]">{m.event_type}</span><span className="text-[#9CA3AF]">{m.timestamp?.slice(0,16)}</span>{m.location&&<span className="text-[#9CA3AF]">· {m.location}</span>}</div>))}</div>}</div>))}</div>}<Pagination pagination={pagination} onPageChange={fetch} currentCount={shipments.length} /></div>);
}

/* ═══ REPORTS (functional) ═══ */
export function Reports() {
  const { accessToken } = useAuth();
  const [reports, setReports] = useState([]); const [loading, setLoading] = useState(true);
  const TYPES = ["Spend Analysis","Savings vs Baseline","Supplier Performance","Operational Status","Lead Time Analysis","Risk Dashboard","Quote Intelligence","Category Insights"];
  const [generating, setGenerating] = useState(null);

  useEffect(() => { listReports(accessToken).then(d => setReports(d.items||d||[])).catch(()=>{}).finally(()=>setLoading(false)); }, [accessToken]);

  const generate = async (type) => {
    setGenerating(type);
    try {
      const r = await requestReport(type, {}, accessToken);
      // Poll if async
      if (r.status === "GENERATING") {
        // For now add placeholder
        setReports(prev => [r, ...prev]);
      } else {
        setReports(prev => [r, ...prev]);
      }
    } catch {}
    setGenerating(null);
  };

  const handleExport = async (reportId) => {
    try {
      const r = await exportReport(reportId, "pdf", accessToken);
      if (r.download_url) window.open(r.download_url, "_blank");
    } catch {}
  };

  if (loading) return <LoadingState />;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#0A0A0A] mb-6">Reports</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {TYPES.map(t => (
          <button key={t} onClick={() => generate(t)} disabled={generating === t} className="card p-4 text-left hover:border-[#D4D4D4] transition">
            <div className="text-sm font-medium text-[#0A0A0A]">{t}</div>
            <div className="text-[11px] text-[#6B7280] mt-1">{generating === t ? "Generating..." : "Click to generate"}</div>
          </button>
        ))}
      </div>
      {reports.length > 0 && (
        <div><h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Generated Reports</h2>
          <div className="space-y-1.5">{reports.map(r => (
            <div key={r.report_id||r.id} className="card flex items-center justify-between p-4">
              <div><div className="text-sm text-[#0A0A0A]">{r.type||"Report"}</div><div className="text-[11px] text-[#6B7280]">{r.computed_at?.slice(0,16)||r.created_at?.slice(0,16)||"—"}</div></div>
              <div className="flex items-center gap-2">
                <StatusBadge status={r.status||"completed"} />
                {r.download_url && <a href={r.download_url} target="_blank" rel="noopener" className="text-[11px] text-[#0A0A0A]">Download</a>}
                {!r.download_url && r.status !== "GENERATING" && <button onClick={() => handleExport(r.report_id||r.id)} className="text-[11px] text-[#0A0A0A]">Export</button>}
              </div>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}
