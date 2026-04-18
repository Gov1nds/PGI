import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useVendorAuth } from "../context/VendorAuthContext";

const TABS = [
  { l: "Dashboard", to: "/vendor/dashboard" },
  { l: "RFQ Inbox", to: "/vendor/rfqs" },
  { l: "Orders", to: "/vendor/orders" },
  { l: "Performance", to: "/vendor/performance" },
  { l: "Profile", to: "/vendor/profile" },
  { l: "Certifications", to: "/vendor/certifications" },
];

export default function VendorShell() {
  const { vendorUser, vendorLogout } = useVendorAuth();
  const nav = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      <aside className="hidden w-52 flex-col border-r border-[#E5E5E5] bg-white md:flex">
        <div className="flex h-14 items-center border-b border-[#E5E5E5] px-4">
          <img src="/logo.svg" alt="PGI Hub" className="h-7 w-auto" />
          <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">Vendor</span>
        </div>
        {vendorUser && (
          <div className="px-4 py-2 border-b border-[#E5E5E5]">
            <div className="text-xs text-[#6B7280] truncate">{vendorUser.name || vendorUser.email}</div>
          </div>
        )}
        <nav className="space-y-0.5 px-3 py-4">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} className={({ isActive }) => `rail-link ${isActive ? "active" : ""}`}>{t.l}</NavLink>
          ))}
        </nav>
        <div className="border-t border-[#E5E5E5] p-4">
          <button onClick={async () => { await vendorLogout(); nav("/vendor/login"); }} className="text-[11px] text-[#9CA3AF] transition hover:text-[#0A0A0A]">Sign out</button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 overflow-y-auto"><Outlet /></div>
    </div>
  );
}
