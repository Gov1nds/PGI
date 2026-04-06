import { useAuth } from "../context/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function LoadingState({ message = "Loading..." }) {
  return <div className="flex items-center justify-center py-24"><div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"/><span className="text-zinc-400 text-sm">{message}</span></div></div>;
}
export function ErrorState({ message = "Something went wrong", onRetry }) {
  return <div className="flex flex-col items-center justify-center py-24 gap-3"><div className="text-red-400 text-sm">{message}</div>{onRetry && <button onClick={onRetry} className="px-4 py-1.5 text-xs bg-white/5 border border-white/10 text-zinc-300 rounded-lg hover:bg-white/10">Retry</button>}</div>;
}
export function EmptyState({ title = "Nothing here yet", description, action, actionLabel }) {
  return <div className="flex flex-col items-center justify-center py-20 gap-2 text-center"><div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-2"><svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg></div><div className="text-zinc-400 text-sm font-medium">{title}</div>{description && <div className="text-zinc-500 text-xs max-w-xs">{description}</div>}{action && <button onClick={action} className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500">{actionLabel}</button>}</div>;
}
export function Container({ children, className = "" }) {
  return <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
export function ProtectedRoute({ children, allowGuest = false }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState />;
  if (!user && !allowGuest) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><p className="text-zinc-400">Sign in to continue</p><Link to="/login" className="px-5 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500">Sign In</Link></div>;
  return children;
}

const SC = {
  draft:"bg-zinc-700/60 text-zinc-300",analyzing:"bg-amber-900/40 text-amber-300",analyzed:"bg-blue-900/40 text-blue-300",
  strategy:"bg-indigo-900/40 text-indigo-300",vendor_match:"bg-violet-900/40 text-violet-300",
  rfq_pending:"bg-purple-900/40 text-purple-300",rfq_sent:"bg-purple-900/40 text-purple-300",
  quote_compare:"bg-amber-900/40 text-amber-300",negotiation:"bg-orange-900/40 text-orange-300",
  vendor_selected:"bg-teal-900/40 text-teal-300",po_issued:"bg-green-900/40 text-green-300",
  in_production:"bg-lime-900/40 text-lime-300",qc_inspection:"bg-cyan-900/40 text-cyan-300",
  shipped:"bg-sky-900/40 text-sky-300",in_transit:"bg-sky-900/40 text-sky-300",delivered:"bg-emerald-900/40 text-emerald-300",
  completed:"bg-green-900/40 text-green-300",cancelled:"bg-red-900/40 text-red-300",
  invited:"bg-amber-900/40 text-amber-300",opened:"bg-blue-900/40 text-blue-300",
  partially_quoted:"bg-amber-900/40 text-amber-300",fully_quoted:"bg-green-900/40 text-green-300",
  awarded:"bg-emerald-900/40 text-emerald-300",expired:"bg-red-900/40 text-red-300",
  received:"bg-blue-900/40 text-blue-300",submitted:"bg-blue-900/40 text-blue-300",
  issued:"bg-green-900/40 text-green-300",pending:"bg-amber-900/40 text-amber-300",active:"bg-blue-900/40 text-blue-300",
  created:"bg-zinc-700/60 text-zinc-300",booked:"bg-indigo-900/40 text-indigo-300",customs:"bg-orange-900/40 text-orange-300",
  promoted:"bg-green-900/40 text-green-300",saved:"bg-teal-900/40 text-teal-300",sent:"bg-purple-900/40 text-purple-300",
  quoted:"bg-blue-900/40 text-blue-300",
};
export function StatusBadge({ status }) {
  return <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap ${SC[status]||"bg-zinc-800/60 text-zinc-400"}`}>{(status||"—").replace(/_/g," ")}</span>;
}
export function ScoreBar({ score, label }) {
  const p = Math.round((score||0)*100);
  const c = p>=70?"bg-emerald-500":p>=40?"bg-amber-500":"bg-red-500";
  return <div className="flex items-center gap-2"><span className="text-[11px] text-zinc-500 w-24 shrink-0 capitalize">{label}</span><div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden"><div className={`h-full ${c} rounded-full transition-all`} style={{width:`${p}%`}}/></div><span className="text-[11px] text-zinc-500 w-8 text-right">{p}%</span></div>;
}
export function BOMCategoryGroup({ category, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const rfq = items.filter(c=>c.rfq_required).length;
  const cL = items.reduce((s,c)=>s+(c.cost_estimate?.total_cost_low||0),0);
  const cH = items.reduce((s,c)=>s+(c.cost_estimate?.total_cost_high||0),0);
  const high = items.filter(c=>c.risk_assessment?.risk_level==="high").length;
  return (
    <div className="card overflow-hidden mb-2">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition text-left">
        <div className="flex items-center gap-3"><span className="text-sm font-semibold text-white capitalize">{category}</span><span className="text-[11px] text-zinc-500">{items.length} items</span>{rfq>0&&<span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20">{rfq} RFQ</span>}{high>0&&<span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-md border border-red-500/20">{high} risk</span>}</div>
        <div className="flex items-center gap-4"><span className="text-xs text-zinc-400 font-mono">${cL.toLocaleString()} – ${cH.toLocaleString()}</span><span className="text-zinc-600 text-xs">{open?"▾":"▸"}</span></div>
      </button>
      {open && <div className="border-t border-white/[0.04] divide-y divide-white/[0.03]">{items.map((c,i)=>(
        <div key={i} className="px-5 py-3 flex items-center justify-between text-xs hover:bg-white/[0.015] transition">
          <div className="flex-1 min-w-0"><div className="text-zinc-300 truncate">{c.description||c.raw_text}</div><div className="text-zinc-600 mt-0.5">{c.item_id} · Qty {c.quantity} · {c.procurement_class}</div></div>
          <div className="flex items-center gap-3 shrink-0 ml-4">{c.cost_estimate&&<span className="text-zinc-400 font-mono">${c.cost_estimate.unit_cost_mid}</span>}{c.risk_assessment&&<span className={`px-1.5 py-0.5 rounded text-[10px] ${c.risk_assessment.risk_level==="high"?"bg-red-500/10 text-red-400 border border-red-500/20":c.risk_assessment.risk_level==="medium"?"bg-amber-500/10 text-amber-400 border border-amber-500/20":"bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>{c.risk_assessment.risk_level}</span>}</div>
        </div>
      ))}</div>}
    </div>
  );
}

// ── Public Navbar (used in PublicShell only) ──
const NAV = [{l:"Home",to:"/"},{l:"Analyze",to:"/analyze"},{l:"Marketplace",to:"/marketplace"},{l:"Insights",to:"/insights"},{l:"Contact",to:"/contact"}];
export function PublicNavbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [mo, setMo] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
      <Container><div className="flex items-center justify-between h-14">
        <Link to="/" className="text-lg font-bold text-white tracking-tight">PGI</Link>
        <nav className="hidden md:flex items-center gap-5">{NAV.map(l=><NavLink key={l.to} to={l.to} className={({isActive})=>`text-[13px] font-medium transition ${isActive?"text-white":"text-white/40 hover:text-white/70"}`}>{l.l}</NavLink>)}</nav>
        <div className="hidden md:flex items-center gap-3">{user?<><Link to="/dashboard" className="text-xs text-white/50 hover:text-white">Dashboard</Link><button onClick={()=>{logout();nav("/");}} className="text-xs text-white/30 hover:text-white">Logout</button></>:<><Link to="/login" className="text-xs text-white/50 hover:text-white">Sign In</Link><Link to="/register" className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 font-medium">Get Started</Link></>}</div>
        <button onClick={()=>setMo(!mo)} className="md:hidden text-white/50"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg></button>
      </div></Container>
      {mo&&<div className="md:hidden border-t border-white/[0.04] px-4 pb-4 space-y-1">{NAV.map(l=><NavLink key={l.to} to={l.to} onClick={()=>setMo(false)} className={({isActive})=>`block px-3 py-2 text-sm rounded-lg ${isActive?"bg-white/5 text-white":"text-white/40"}`}>{l.l}</NavLink>)}{user?<button onClick={()=>{logout();nav("/");setMo(false);}} className="block px-3 py-2 text-sm text-white/40">Logout</button>:<Link to="/login" onClick={()=>setMo(false)} className="block px-3 py-2 text-sm text-white/40">Sign In</Link>}</div>}
    </header>
  );
}
export function Footer() {
  return <footer className="border-t border-white/[0.04] py-6 mt-16"><Container><div className="text-center text-[11px] text-zinc-600">© {new Date().getFullYear()} PGI — AI Sourcing Control Tower</div></Container></footer>;
}
