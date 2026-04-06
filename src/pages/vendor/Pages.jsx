import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingState, EmptyState, StatusBadge } from "../../components/Shared";
import { vendorLogin, vendorDashboard, vendorRFQs, vendorRFQDetail, vendorSubmitQuote, vendorOrders, vendorPerformance } from "../../lib/api";

export function VendorLogin() {
  const [e,sE]=useState(""); const [p,sP]=useState(""); const [err,sErr]=useState(""); const [l,sL]=useState(false); const n=useNavigate();
  const sub=async ev=>{ev.preventDefault();sErr("");sL(true);try{await vendorLogin(e,p);n("/vendor/dashboard");}catch(x){sErr(x.message);}sL(false);};
  return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]"><div className="w-full max-w-sm p-8"><h1 className="text-2xl font-bold text-white text-center mb-6">Vendor Portal</h1><form onSubmit={sub} className="space-y-4"><input value={e} onChange={x=>sE(x.target.value)} type="email" placeholder="Email" required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/><input value={p} onChange={x=>sP(x.target.value)} type="password" placeholder="Password" required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/>{err&&<p className="text-red-400 text-sm">{err}</p>}<button type="submit" disabled={l} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 disabled:opacity-50 text-sm">{l?"Signing in...":"Sign In"}</button></form></div></div>;
}

export function VendorDashboardPage() {
  const [d,sD]=useState(null); const [l,sL]=useState(true);
  useEffect(()=>{vendorDashboard().then(sD).catch(()=>{}).finally(()=>sL(false));},[]);
  if(l)return<LoadingState/>;
  return <div className="p-6"><h1 className="text-xl font-bold text-white mb-6">Dashboard</h1>{d&&<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"><div className="kpi-card"><div className="text-2xl font-bold">{d.open_rfqs}</div><div className="text-[11px] text-zinc-500">Open RFQs</div></div><div className="kpi-card"><div className="text-2xl font-bold">{d.quotes_submitted}</div><div className="text-[11px] text-zinc-500">Quotes</div></div><div className="kpi-card"><div className="text-2xl font-bold">{d.active_orders}</div><div className="text-[11px] text-zinc-500">Orders</div></div><div className="kpi-card"><div className="text-2xl font-bold">{d.active_shipments||0}</div><div className="text-[11px] text-zinc-500">Shipments</div></div></div>}{d?.recent_rfqs?.length>0&&<div><h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recent Invitations</h2><div className="space-y-1.5">{d.recent_rfqs.map(r=><div key={r.id} className="card flex items-center justify-between p-3.5"><div className="text-sm text-white">RFQ {r.rfq_batch_id?.slice(0,8)}</div><StatusBadge status={r.status}/></div>)}</div></div>}</div>;
}

export function VendorRFQsPage() {
  const [rfqs,sR]=useState([]); const [l,sL]=useState(true); const [detail,sD]=useState(null); const [lines,sLines]=useState([]); const [notes,sN]=useState(""); const [sub,sSub]=useState(false);
  useEffect(()=>{vendorRFQs().then(sR).catch(()=>[]).finally(()=>sL(false));},[]);
  const open=async rid=>{try{const d=await vendorRFQDetail(rid);sD(d);sLines(d.items.map(i=>({rfq_item_id:i.id,part_name:i.part_key,quantity:Number(i.quantity),unit_price:"",lead_time_days:"",moq:"",notes:""})));}catch{}};
  const submit=async()=>{if(!detail)return;sSub(true);try{await vendorSubmitQuote(detail.rfq_id,{lines:lines.map(l=>({...l,unit_price:Number(l.unit_price)||0,lead_time_days:Number(l.lead_time_days)||null,moq:Number(l.moq)||null})),notes});sD(null);sN("");vendorRFQs().then(sR).catch(()=>[]);}catch{}sSub(false);};
  const upd=(i,f,v)=>sLines(p=>p.map((l,j)=>j===i?{...l,[f]:v}:l));
  if(l)return<LoadingState/>;
  if(detail)return(
    <div className="p-6">
      <button onClick={()=>sD(null)} className="text-xs text-indigo-400 mb-4">← Back</button>
      <h2 className="text-xl font-bold text-white mb-2">RFQ {detail.rfq_id?.slice(0,8)}</h2>
      <div className="flex items-center gap-3 mb-4"><StatusBadge status={detail.status}/>{detail.deadline&&<span className="text-[11px] text-zinc-500">Deadline: {detail.deadline}</span>}</div>
      {detail.notes&&<p className="text-sm text-zinc-400 mb-4">{detail.notes}</p>}
      {detail.quote_history?.length>0&&<div className="card p-4 mb-6"><h3 className="text-sm font-semibold text-white mb-2">Previous Quotes</h3>{detail.quote_history.map(q=><div key={q.id} className="flex items-center justify-between py-1"><span className="text-[11px] text-zinc-400">v{q.version}</span><span className="text-xs text-zinc-300 font-mono">{q.total?`$${Number(q.total).toLocaleString()}`:"-"}</span><StatusBadge status={q.status}/></div>)}</div>}
      <h3 className="text-sm font-semibold text-white mb-3">Submit Quote</h3>
      <div className="space-y-2 mb-4">{lines.map((ln,i)=><div key={i} className="card p-3"><div className="text-sm text-zinc-300 mb-2">{ln.part_name} <span className="text-zinc-600">Qty: {ln.quantity}</span></div><div className="grid grid-cols-3 gap-2"><input value={ln.unit_price} onChange={e=>upd(i,"unit_price",e.target.value)} placeholder="Unit price" className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white placeholder:text-zinc-600"/><input value={ln.lead_time_days} onChange={e=>upd(i,"lead_time_days",e.target.value)} placeholder="Lead days" className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white placeholder:text-zinc-600"/><input value={ln.moq} onChange={e=>upd(i,"moq",e.target.value)} placeholder="MOQ" className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white placeholder:text-zinc-600"/></div></div>)}</div>
      <textarea value={notes} onChange={e=>sN(e.target.value)} placeholder="Notes..." rows={2} className="w-full px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 mb-4 resize-none"/>
      <button onClick={submit} disabled={sub} className="px-6 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-500 disabled:opacity-50 font-medium">{sub?"Submitting...":"Submit Quote"}</button>
    </div>
  );
  return <div className="p-6"><h1 className="text-xl font-bold text-white mb-6">RFQ Inbox</h1>{rfqs.length===0?<EmptyState title="No RFQs"/>:<div className="space-y-1.5">{rfqs.map(r=><button key={r.invitation_id} onClick={()=>open(r.rfq_id)} className="w-full text-left card flex items-center justify-between p-4 hover:border-white/10 transition"><div><div className="text-sm text-white">RFQ {r.rfq_id?.slice(0,8)}</div><div className="text-[11px] text-zinc-600">{r.item_count} items · {r.invited_at?.slice(0,10)}</div></div><StatusBadge status={r.status}/></button>)}</div>}</div>;
}

export function VendorOrdersPage() {
  const [o,sO]=useState([]); const [l,sL]=useState(true);
  useEffect(()=>{vendorOrders().then(sO).catch(()=>[]).finally(()=>sL(false));},[]);
  if(l)return<LoadingState/>;
  return <div className="p-6"><h1 className="text-xl font-bold text-white mb-6">Orders</h1>{o.length===0?<EmptyState title="No orders"/>:<div className="space-y-1.5">{o.map(x=><div key={x.id} className="card flex items-center justify-between p-4"><div><div className="text-sm text-white">{x.po_number||x.id.slice(0,8)}</div><div className="text-[11px] text-zinc-600">{x.total?`$${Number(x.total).toLocaleString()}`:""}</div></div><StatusBadge status={x.status}/></div>)}</div>}</div>;
}

export function VendorPerformancePage() {
  const [d,sD]=useState(null); const [l,sL]=useState(true);
  useEffect(()=>{vendorPerformance().then(sD).catch(()=>{}).finally(()=>sL(false));},[]);
  if(l)return<LoadingState/>;
  return <div className="p-6"><h1 className="text-xl font-bold text-white mb-6">Performance</h1>{d?<div className="grid grid-cols-2 md:grid-cols-4 gap-3"><div className="kpi-card"><div className="text-2xl font-bold">{d.total_quotes}</div><div className="text-[11px] text-zinc-500">Quotes</div></div><div className="kpi-card"><div className="text-2xl font-bold">{d.total_orders}</div><div className="text-[11px] text-zinc-500">Orders</div></div><div className="kpi-card"><div className="text-2xl font-bold">{d.completed_orders}</div><div className="text-[11px] text-zinc-500">Completed</div></div><div className="kpi-card"><div className="text-2xl font-bold">{d.completion_rate}%</div><div className="text-[11px] text-zinc-500">Rate</div></div></div>:<EmptyState title="No data"/>}</div>;
}
