import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { LoadingState, ErrorState, EmptyState, StatusBadge, ScoreBar, BOMCategoryGroup } from "../../components/Shared";
import { getProject, matchVendors, listRFQs, getRFQQuotes, getChatThreads, createChatThread, getChatMessages, sendChatMessage, listPOs } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export function ProjectOverview() {
  const { id } = useParams(); const [p,sP]=useState(null); const [l,sL]=useState(true); const [e,sE]=useState("");
  useEffect(()=>{getProject(id).then(sP).catch(x=>sE(x.message)).finally(()=>sL(false));},[id]);
  if (l) return <LoadingState/>; if (e) return <ErrorState message={e}/>; if (!p) return <ErrorState message="Not found"/>;
  const r = p.analyzer_report||{}, s = r.summary||{}, comps = r.components||[];
  const grouped = {}; comps.forEach(c=>{const cat=c.category||"unknown";if(!grouped[cat])grouped[cat]=[];grouped[cat].push(c);});
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-white">{p.name}</h1><div className="flex items-center gap-2 mt-1"><StatusBadge status={p.status}/><span className="text-[11px] text-zinc-500">{p.total_parts} parts</span></div></div><div className="flex gap-2"><Link to={`/project/${id}/vendors`} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 font-medium">Match Vendors</Link><Link to={`/project/${id}/rfq`} className="px-4 py-2 bg-white/[0.03] text-white text-xs rounded-lg border border-white/[0.06] hover:bg-white/[0.06]">Send RFQ</Link></div></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="kpi-card"><div className="text-xl font-bold">{s.total_items||p.total_parts}</div><div className="text-[11px] text-zinc-500">Parts</div></div>
        <div className="kpi-card"><div className="text-xl font-bold">{Object.keys(grouped).length}</div><div className="text-[11px] text-zinc-500">Categories</div></div>
        <div className="kpi-card"><div className="text-xl font-bold">{s.rfq_required_count||0}</div><div className="text-[11px] text-zinc-500">RFQ Required</div></div>
        {s.total_cost_range&&<div className="kpi-card"><div className="text-lg font-bold font-mono">${s.total_cost_range.low?.toLocaleString()}</div><div className="text-[11px] text-zinc-500">Cost Low</div></div>}
        {s.total_cost_range&&<div className="kpi-card"><div className="text-lg font-bold font-mono">${s.total_cost_range.high?.toLocaleString()}</div><div className="text-[11px] text-zinc-500">Cost High</div></div>}
      </div>
      <div><h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Components by Category</h2>{Object.entries(grouped).sort((a,b)=>b[1].length-a[1].length).map(([cat,items])=><BOMCategoryGroup key={cat} category={cat} items={items} defaultOpen={Object.keys(grouped).length<=3}/>)}</div>
    </div>
  );
}

export function ProjectStrategy() { const {id}=useParams(); const [p,sP]=useState(null); useEffect(()=>{getProject(id).then(sP).catch(()=>{});},[id]); return <div className="p-6"><h2 className="text-xl font-bold text-white mb-6">Sourcing Strategy</h2>{p?.strategy&&Object.keys(p.strategy).length?<div className="card p-5"><pre className="text-xs text-zinc-300 whitespace-pre-wrap">{JSON.stringify(p.strategy,null,2)}</pre></div>:<EmptyState title="No strategy yet" description="Run vendor matching to generate a strategy"/>}</div>; }

export function ProjectVendors() {
  const {id}=useParams(); const [m,sM]=useState(null); const [l,sL]=useState(false); const [e,sE]=useState("");
  const run=async()=>{sL(true);sE("");try{sM(await matchVendors(id));}catch(x){sE(x.message);}sL(false);};
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white">Vendor Matching</h2><button onClick={run} disabled={l} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 disabled:opacity-50 font-medium">{l?"Matching...":"Run Match"}</button></div>
      {e&&<ErrorState message={e} onRetry={run}/>}
      {m&&<div className="space-y-3"><p className="text-[11px] text-zinc-500">{m.total_considered} vendors evaluated</p>{m.matches.map(v=>(
        <div key={v.vendor_id} className="card p-5"><div className="flex items-center justify-between mb-3"><div><span className="text-xs text-indigo-400 font-bold mr-2">#{v.rank}</span><span className="text-sm font-semibold text-white">{v.vendor_name}</span></div><div className="text-right"><span className="text-lg font-bold text-white">{(v.total_score*100).toFixed(0)}%</span>{v.market_freshness&&<div className="text-[10px] text-zinc-600">{v.market_freshness}</div>}</div></div><div className="space-y-1.5">{Object.entries(v.breakdown||{}).map(([k,s])=><ScoreBar key={k} label={k.replace(/_/g," ")} score={s}/>)}</div><p className="text-[11px] text-zinc-500 mt-3">{v.explanation}</p></div>
      ))}</div>}
      {!m&&!l&&<EmptyState title="Run vendor match to find suppliers"/>}
    </div>
  );
}

export function ProjectRFQ() { const {id}=useParams(); const [r,sR]=useState([]); const [l,sL]=useState(true); useEffect(()=>{listRFQs(id).then(sR).catch(()=>[]).finally(()=>sL(false));},[id]); if(l)return<LoadingState/>; return <div className="p-6"><h2 className="text-xl font-bold text-white mb-6">RFQs</h2>{r.length===0?<EmptyState title="No RFQs yet" description="Match vendors first"/>:<div className="space-y-2">{r.map(x=><div key={x.id} className="card p-4"><div className="flex items-center justify-between"><div><div className="text-sm text-white">RFQ {x.id.slice(0,8)}</div><div className="text-[11px] text-zinc-600">{x.items?.length||0} items · {x.invitations?.length||0} vendors</div></div><StatusBadge status={x.status}/></div>{x.quotes?.length>0&&<div className="mt-2 text-[11px] text-zinc-500">{x.quotes.length} quote(s)</div>}</div>)}</div>}</div>; }

export function ProjectCompare() {
  const {id}=useParams(); const [quotes,sQ]=useState([]); const [l,sL]=useState(true);
  useEffect(()=>{listRFQs(id).then(async rs=>{const qs=[];for(const r of rs){if(r.quotes?.length)try{qs.push(...(await getRFQQuotes(r.id)));}catch{}}sQ(qs);sL(false);}).catch(()=>sL(false));},[id]);
  if(l)return<LoadingState/>;
  return <div className="p-6"><h2 className="text-xl font-bold text-white mb-6">Quote Comparison</h2>{quotes.length===0?<EmptyState title="No quotes to compare"/>:<div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-left text-zinc-500 border-b border-white/[0.04]"><th className="pb-2 pr-4">Vendor</th><th className="pb-2 pr-4">Ver</th><th className="pb-2 pr-4">Total</th><th className="pb-2 pr-4">Status</th><th className="pb-2">Lines</th></tr></thead><tbody>{quotes.map(q=><tr key={q.id} className="border-b border-white/[0.03]"><td className="py-2.5 pr-4 text-zinc-300">{q.vendor_id?.slice(0,8)||"—"}</td><td className="py-2.5 pr-4 text-zinc-400">v{q.quote_version}</td><td className="py-2.5 pr-4 text-white font-medium font-mono">{q.total?`$${Number(q.total).toLocaleString()}`:"-"}</td><td className="py-2.5 pr-4"><StatusBadge status={q.quote_status}/></td><td className="py-2.5 text-zinc-400">{q.lines?.length||0}</td></tr>)}</tbody></table></div>}</div>;
}

export function ProjectChat() {
  const {id}=useParams(); const {user}=useAuth();
  const [threads,sT]=useState([]); const [active,sA]=useState(null); const [msgs,sM]=useState([]); const [msg,sMg]=useState(""); const [vis,sV]=useState("internal");
  useEffect(()=>{getChatThreads("project",id).then(sT).catch(()=>[]);},[id]);
  const load=async tid=>{sA(tid);try{sM(await getChatMessages(tid));}catch{}};
  const send=async()=>{if(!msg.trim()||!active)return;try{await sendChatMessage({thread_id:active,content:msg,visibility:vis});sMg("");load(active);}catch{}};
  const make=async()=>{try{const t=await createChatThread({context_type:"project",context_id:id,title:"Discussion"});sT(p=>[t,...p]);sA(t.id);}catch{}};
  return (
    <div className="p-6"><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white">Chat</h2><button onClick={make} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg font-medium">New Thread</button></div>
    <div className="grid md:grid-cols-3 gap-4">
      <div className="space-y-1.5">{threads.map(t=><button key={t.id} onClick={()=>load(t.id)} className={`w-full text-left p-3 rounded-xl border transition ${active===t.id?"bg-indigo-900/10 border-indigo-500/20":"card hover:border-white/10"}`}><div className="text-sm text-white">{t.title||"Thread"}</div><div className="text-[11px] text-zinc-600">{t.context_type}</div></button>)}</div>
      <div className="md:col-span-2">{active?<><div className="space-y-2 mb-4 max-h-72 overflow-y-auto">{msgs.map(m=><div key={m.id} className={`p-3 rounded-lg text-sm ${m.visibility==="vendor_visible"?"bg-purple-500/5 border border-purple-500/10":"card"}`}><div className="flex items-center gap-2 mb-1"><span className="text-[10px] text-zinc-600">{m.sender_user_id?.slice(0,8)||"System"}</span><span className={`text-[9px] px-1.5 py-0.5 rounded ${m.visibility==="internal"?"bg-zinc-800 text-zinc-500":"bg-purple-500/10 text-purple-400"}`}>{m.visibility}</span></div><div className="text-zinc-300">{m.content}</div></div>)}</div><div className="flex gap-2"><select value={vis} onChange={e=>sV(e.target.value)} className="px-2 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-white"><option value="internal">Internal</option><option value="vendor_visible">Vendor</option></select><input value={msg} onChange={e=>sMg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}} placeholder="Message..." className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none"/><button onClick={send} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg">Send</button></div></>:<EmptyState title="Select or create a thread"/>}</div>
    </div></div>
  );
}

export function ProjectOrders() { const {id}=useParams(); const [pos,sP]=useState([]); const [l,sL]=useState(true); useEffect(()=>{listPOs(id).then(sP).catch(()=>[]).finally(()=>sL(false));},[id]); if(l)return<LoadingState/>; return <div className="p-6"><h2 className="text-xl font-bold text-white mb-6">Purchase Orders</h2>{pos.length===0?<EmptyState title="No POs yet"/>:<div className="space-y-2">{pos.map(p=><div key={p.id} className="card flex items-center justify-between p-4"><div><div className="text-sm text-white">{p.po_number||p.id.slice(0,8)}</div><div className="text-[11px] text-zinc-600">{p.total?`$${Number(p.total).toLocaleString()}`:""}</div></div><StatusBadge status={p.status}/></div>)}</div>}</div>; }
export function ProjectTracking() { return <div className="p-6"><h2 className="text-xl font-bold text-white mb-6">Tracking</h2><EmptyState title="No shipments yet" description="Tracking appears when orders ship"/></div>; }
export function ProjectAnalytics() { const {id}=useParams(); const [p,sP]=useState(null); useEffect(()=>{getProject(id).then(sP).catch(()=>{});},[id]); const s=p?.analyzer_report?.summary||{}; return <div className="p-6"><h2 className="text-xl font-bold text-white mb-6">Project Analytics</h2>{s.categories?<div className="grid md:grid-cols-2 gap-4"><div className="card p-5"><h3 className="text-sm font-semibold text-white mb-3">Categories</h3>{Object.entries(s.categories).map(([k,v])=><div key={k} className="flex justify-between py-1.5 border-b border-white/[0.03]"><span className="text-xs text-zinc-400 capitalize">{k}</span><span className="text-xs text-white">{v}</span></div>)}</div>{s.total_cost_range&&<div className="card p-5"><h3 className="text-sm font-semibold text-white mb-3">Cost</h3><div className="flex justify-between py-1.5"><span className="text-xs text-zinc-400">Low</span><span className="text-xs text-white font-mono">${s.total_cost_range.low?.toLocaleString()}</span></div><div className="flex justify-between py-1.5"><span className="text-xs text-zinc-400">High</span><span className="text-xs text-white font-mono">${s.total_cost_range.high?.toLocaleString()}</span></div></div>}</div>:<EmptyState title="No data"/>}</div>; }
export function ProjectHistory() { const {id}=useParams(); const [p,sP]=useState(null); useEffect(()=>{getProject(id).then(sP).catch(()=>{});},[id]); const ev=p?.events||[]; return <div className="p-6"><h2 className="text-xl font-bold text-white mb-6">History</h2>{ev.length===0?<EmptyState title="No events"/>:<div className="space-y-2">{ev.map((e,i)=><div key={i} className="card flex items-center gap-4 p-3.5"><div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"/><div className="flex-1"><div className="text-sm text-white">{e.event_type}</div>{e.old_status&&<div className="text-[11px] text-zinc-600">{e.old_status} → {e.new_status}</div>}</div><div className="text-[11px] text-zinc-600">{e.created_at?.slice(0,10)}</div></div>)}</div>}</div>; }
