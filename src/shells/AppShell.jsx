import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RAIL = [
  { label:"Dashboard", to:"/dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { label:"Sourcing Cases", to:"/sourcing-cases", icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label:"Projects", to:"/projects", icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { label:"Marketplace", to:"/marketplace", icon:"M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v3M8 6H6a2 2 0 00-2 2v3" },
  { label:"RFQs", to:"/rfqs", icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label:"Orders", to:"/orders-list", icon:"M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  { label:"Shipments", to:"/shipments", icon:"M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
  { label:"Analytics", to:"/analytics", icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label:"Reports", to:"/reports", icon:"M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
];

function I({ d }) { return <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d}/></svg>; }

export default function AppShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Left Rail */}
      <aside className="hidden md:flex flex-col w-56 border-r border-white/[0.04] bg-[#0c0c12]">
        <div className="px-5 h-14 flex items-center border-b border-white/[0.04]">
          <Link to="/dashboard" className="text-lg font-bold text-white tracking-tight">PGI</Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {RAIL.map(r=>(
            <NavLink key={r.to} to={r.to} className={({isActive})=>`rail-link ${isActive?"active":""}`}>
              <I d={r.icon}/><span>{r.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/[0.04]">
          <div className="text-xs text-zinc-500 truncate mb-2">{user?.email}</div>
          <button onClick={()=>{logout();nav("/");}} className="text-[11px] text-zinc-600 hover:text-zinc-400">Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-white/[0.04] bg-[#0c0c12]/80 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
          <div className="flex-1">
            <input placeholder="Search projects, vendors, parts..." className="w-full max-w-md px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/>
          </div>
          <Link to="/analyze" className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 transition shrink-0">+ Analyze BOM</Link>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
