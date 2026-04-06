import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoadingState, EmptyState, ErrorState, StatusBadge } from "../../components/Shared";
import { listProjects, getDashboardAnalytics, listVendors, listRFQs, listPOs, listSourcingCases } from "../../lib/api";

// ═══ KPI Card matching reference image ═══
function KPI({ label, value, sub, trend }) {
  const bars = [40,65,45,80,55,70,90,60]; // mini-chart data
  return (
    <div className="kpi-card group">
      <div className="flex items-start justify-between mb-3">
        <div><div className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{label}</div><div className="text-2xl font-bold text-white mt-1">{value}</div>{sub&&<div className="text-[11px] text-zinc-500 mt-0.5">{sub}</div>}</div>
        <div className="mini-chart w-16 opacity-60 group-hover:opacity-100 transition">{bars.map((h,i)=><span key={i} style={{height:`${h}%`}}/>)}</div>
      </div>
    </div>
  );
}

// ═══ DASHBOARD — premium operational control tower ═══
export function Dashboard() {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardAnalytics().catch(()=>null),
      listProjects().catch(()=>({items:[]})),
      listSourcingCases().catch(()=>[]),
    ]).then(([a,p,c])=>{setData(a);setProjects(p.items||[]);setCases(c);setLoading(false);});
  }, []);

  if (loading) return <LoadingState/>;

  const d = data || {};
  return (
    <div className="p-6 space-y-6">
      {/* Hero analyze bar */}
      <div className="card p-5 flex items-center gap-4">
        <div className="flex-1"><h1 className="text-lg font-semibold text-white">Analyze a component or BOM</h1><p className="text-xs text-zinc-500 mt-0.5">Upload a file, paste text, or search for a part number</p></div>
        <Link to="/analyze" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-500 transition shrink-0">Start Analysis</Link>
      </div>

      {/* KPI strip — matching reference image layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI label="Active Projects" value={d.active_projects||0}/>
        <KPI label="Open RFQs" value={d.pending_rfqs||0}/>
        <KPI label="Quotes Waiting" value={d.total_rfqs||0} sub="total submitted"/>
        <KPI label="Delayed Shipments" value={d.active_shipments||0}/>
        <KPI label="Spend to Date" value={`$${(d.total_spend||0).toLocaleString()}`}/>
        <KPI label="Total Projects" value={d.total_projects||0}/>
      </div>

      {/* Charts row — spend trend and pipeline */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-white">Category Spend</h3></div>
          <div className="space-y-2">{Object.entries(d.category_breakdown||{}).map(([k,v])=>{
            const max = Math.max(...Object.values(d.category_breakdown||{1:1}));
            return <div key={k} className="flex items-center gap-3"><span className="text-[11px] text-zinc-500 w-24 truncate capitalize">{k}</span><div className="flex-1 h-5 bg-zinc-800/50 rounded-md overflow-hidden"><div className="h-full bg-indigo-500/30 rounded-md flex items-center pl-2" style={{width:`${(v/max)*100}%`}}><span className="text-[10px] text-indigo-300 font-medium">{v}</span></div></div></div>;
          })}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-white">Project Pipeline</h3></div>
          <div className="space-y-2">{Object.entries(d.status_breakdown||{}).map(([k,v])=>(
            <div key={k} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0"><StatusBadge status={k}/><span className="text-sm text-white font-medium">{v}</span></div>
          ))}</div>
        </div>
      </div>

      {/* Continue where you left off — action-oriented */}
      {d.continue_where_left_off?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Continue where you left off</h2>
          <div className="grid md:grid-cols-3 gap-3">{d.continue_where_left_off.map(p=>(
            <Link key={p.id} to={`/project/${p.id}`} className="card p-4 hover:border-indigo-500/20 transition group">
              <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition">{p.name}</div>
              <div className="flex items-center gap-2 mt-2"><StatusBadge status={p.status}/><span className="text-[11px] text-zinc-600">{p.updated_at?.slice(0,10)}</span></div>
            </Link>
          ))}</div>
        </div>
      )}

      {/* Two-column work area */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3"><h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent Projects</h2><Link to="/projects" className="text-[11px] text-indigo-400 hover:text-indigo-300">View all →</Link></div>
          {projects.length===0 ? <EmptyState title="No projects yet" actionLabel="Analyze a BOM" action={()=>{}}/> :
            <div className="space-y-1.5">{projects.slice(0,8).map(p=>(
              <Link key={p.id} to={`/project/${p.id}`} className="card flex items-center justify-between p-3.5 hover:border-white/10 transition">
                <div><div className="text-sm font-medium text-white">{p.name}</div><div className="text-[11px] text-zinc-600 mt-0.5">{p.total_parts} parts</div></div>
                <StatusBadge status={p.status}/>
              </Link>
            ))}</div>
          }
        </div>
        <div>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Saved Sourcing Cases</h2>
          {cases.length===0 ? <EmptyState title="No saved searches"/> :
            <div className="space-y-1.5">{cases.slice(0,8).map(c=>(
              <div key={c.id} className="card p-3.5">
                <div className="text-sm text-white">{c.name}</div>
                <div className="flex items-center gap-2 mt-1"><StatusBadge status={c.status}/><span className="text-[11px] text-zinc-600 truncate">{c.query_text?.slice(0,40)}</span></div>
              </div>
            ))}</div>
          }
        </div>
      </div>
    </div>
  );
}

// ═══ PROJECTS LIST ═══
export function ProjectsList() {
  const [projects,setProjects]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{listProjects().then(d=>{setProjects(d.items||[]);setLoading(false);}).catch(()=>setLoading(false));},[]);
  if (loading) return <LoadingState/>;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><h1 className="text-xl font-bold text-white">Projects</h1><Link to="/analyze" className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 font-medium">+ New Analysis</Link></div>
      {projects.length===0?<EmptyState title="No projects yet" description="Upload a BOM to create your first project"/>:
        <div className="space-y-1.5">{projects.map(p=>(
          <Link key={p.id} to={`/project/${p.id}`} className="card flex items-center justify-between p-4 hover:border-white/10 transition">
            <div><div className="text-sm font-medium text-white">{p.name}</div><div className="text-[11px] text-zinc-600 mt-0.5">{p.total_parts} parts · {p.created_at?new Date(p.created_at).toLocaleDateString():""}</div></div>
            <StatusBadge status={p.status}/>
          </Link>
        ))}</div>
      }
    </div>
  );
}

// ═══ SOURCING CASES ═══
export function SourcingCasesList() {
  const [cases,setCases]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{listSourcingCases().then(setCases).catch(()=>[]).finally(()=>setLoading(false));},[]);
  if (loading) return <LoadingState/>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Sourcing Cases</h1>
      {cases.length===0?<EmptyState title="No sourcing cases" description="Save a search to create a sourcing case"/>:
        <div className="space-y-1.5">{cases.map(c=>(
          <div key={c.id} className="card p-4"><div className="text-sm text-white">{c.name}</div><div className="flex items-center gap-2 mt-1"><StatusBadge status={c.status}/><span className="text-[11px] text-zinc-600">{c.query_text?.slice(0,60)}</span></div></div>
        ))}</div>
      }
    </div>
  );
}

// ═══ MARKETPLACE ═══
export function Marketplace() {
  const [vendors,setVendors]=useState([]); const [search,setSearch]=useState(""); const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);listVendors(search).then(setVendors).catch(()=>[]).finally(()=>setLoading(false));},[search]);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Marketplace</h1>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vendors..." className="w-full max-w-md px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 mb-6"/>
      {loading?<LoadingState/>:vendors.length===0?<EmptyState title="No vendors found"/>:
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{vendors.map(v=>(
          <div key={v.id} className="card p-5">
            <div className="text-sm font-semibold text-white mb-1">{v.name}</div>
            <div className="text-[11px] text-zinc-500 mb-3">{v.country||"—"} · {v.region||"—"}</div>
            <div className="flex flex-wrap gap-1 mb-3">{(v.certifications||[]).slice(0,3).map((c,i)=><span key={i} className="px-1.5 py-0.5 text-[10px] bg-white/[0.03] text-zinc-500 rounded border border-white/[0.06]">{c}</span>)}</div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500"><span>Reliability: {((v.reliability_score||0)*100).toFixed(0)}%</span><span>Lead: {v.avg_lead_time_days||"—"}d</span></div>
          </div>
        ))}</div>
      }
    </div>
  );
}

// ═══ ANALYTICS ═══
export function Analytics() {
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{getDashboardAnalytics().then(setData).catch(()=>{}).finally(()=>setLoading(false));},[]);
  if (loading) return <LoadingState/>; if (!data) return <EmptyState title="No analytics data"/>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Analytics</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5"><h3 className="text-sm font-semibold text-white mb-3">Categories</h3>{Object.entries(data.category_breakdown||{}).map(([k,v])=><div key={k} className="flex justify-between py-1.5 border-b border-white/[0.03]"><span className="text-xs text-zinc-400 capitalize">{k}</span><span className="text-xs text-white font-medium">{v}</span></div>)}</div>
        <div className="card p-5"><h3 className="text-sm font-semibold text-white mb-3">Pipeline</h3>{Object.entries(data.status_breakdown||{}).map(([k,v])=><div key={k} className="flex justify-between py-1.5 border-b border-white/[0.03]"><StatusBadge status={k}/><span className="text-xs text-white font-medium">{v}</span></div>)}</div>
      </div>
    </div>
  );
}

// ═══ RFQs LIST ═══
export function RFQsList() {
  const [rfqs,setRFQs]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{listRFQs().then(setRFQs).catch(()=>[]).finally(()=>setLoading(false));},[]);
  if (loading) return <LoadingState/>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">RFQs</h1>
      {rfqs.length===0?<EmptyState title="No RFQs yet"/>:
        <div className="space-y-1.5">{rfqs.map(r=>(
          <div key={r.id} className="card flex items-center justify-between p-4"><div><div className="text-sm text-white">RFQ {r.id.slice(0,8)}</div><div className="text-[11px] text-zinc-600">{r.created_at?new Date(r.created_at).toLocaleDateString():""}</div></div><StatusBadge status={r.status}/></div>
        ))}</div>
      }
    </div>
  );
}

// ═══ ORDERS LIST ═══
export function OrdersList() {
  const [pos,setPOs]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{listPOs().then(setPOs).catch(()=>[]).finally(()=>setLoading(false));},[]);
  if (loading) return <LoadingState/>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Purchase Orders</h1>
      {pos.length===0?<EmptyState title="No purchase orders yet"/>:
        <div className="space-y-1.5">{pos.map(p=>(
          <div key={p.id} className="card flex items-center justify-between p-4"><div><div className="text-sm text-white">{p.po_number||p.id.slice(0,8)}</div><div className="text-[11px] text-zinc-600">{p.total?`$${Number(p.total).toLocaleString()}`:""}</div></div><StatusBadge status={p.status}/></div>
        ))}</div>
      }
    </div>
  );
}

// ═══ SHIPMENTS placeholder (app-level) ═══
export function ShipmentsList() { return <div className="p-6"><h1 className="text-xl font-bold text-white mb-6">Shipments</h1><EmptyState title="No active shipments"/></div>; }

// ═══ REPORTS placeholder ═══
export function Reports() { return <div className="p-6"><h1 className="text-xl font-bold text-white mb-6">Reports</h1><EmptyState title="Generate reports from Analytics"/></div>; }
