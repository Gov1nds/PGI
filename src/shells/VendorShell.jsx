import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { logoutVendor } from "../lib/api";

const TABS = [{l:"Dashboard",to:"/vendor/dashboard"},{l:"RFQ Inbox",to:"/vendor/rfqs"},{l:"Orders",to:"/vendor/orders"},{l:"Performance",to:"/vendor/performance"}];

export default function VendorShell() {
  const nav = useNavigate();
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      <aside className="hidden md:flex flex-col w-48 border-r border-white/[0.04] bg-[#0c0c12]">
        <div className="px-4 h-14 flex items-center border-b border-white/[0.04]"><span className="text-sm font-bold text-white">PGI <span className="text-[10px] text-indigo-400 ml-1">Vendor</span></span></div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">{TABS.map(t=><NavLink key={t.to} to={t.to} className={({isActive})=>`rail-link ${isActive?"active":""}`}>{t.l}</NavLink>)}</nav>
        <div className="px-4 py-4 border-t border-white/[0.04]"><button onClick={()=>{logoutVendor();nav("/vendor/login");}} className="text-[11px] text-zinc-600 hover:text-zinc-400">Sign out</button></div>
      </aside>
      <div className="flex-1 overflow-y-auto"><Outlet/></div>
    </div>
  );
}
