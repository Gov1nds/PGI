import { useState, useCallback, useEffect, useRef } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { globalSearch } from "../lib/api";

const RAIL = [
  { label: "Dashboard", to: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { label: "Sourcing Cases", to: "/sourcing-cases", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Sessions", to: "/sessions", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Projects", to: "/projects", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { label: "RFQs", to: "/rfqs", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "Orders", to: "/orders-list", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  { label: "Shipments", to: "/shipments", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
  { label: "Analytics", to: "/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", perm: "can_view_analytics" },
  { label: "Reports", to: "/reports", icon: "M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z", perm: "can_view_reports" },
];

function I({ d }) {
  return <svg className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d}/></svg>;
}

export default function AppShell() {
  const { user, logout, accessToken } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllRead } = useNotifications();
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const debounceRef = useRef(null);
  const notifRef = useRef(null);

  // Debounced search
  const onSearchChange = useCallback((val) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setSearchResults(null); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await globalSearch(val, accessToken);
        setSearchResults(data.results || data.items || []);
      } catch { setSearchResults([]); }
    }, 300);
  }, [accessToken]);

  // Close notification dropdown on click outside
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter RAIL by permissions
  const visibleRail = RAIL.filter(r => !r.perm || user?.permissions?.[r.perm]);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <aside className="hidden w-64 flex-col border-r border-white/[0.06] bg-[#060712]/80 backdrop-blur-2xl md:flex">
        <div className="flex h-16 items-center border-b border-white/[0.06] px-5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/logo.svg" alt="PGI Hub" className="h-8 w-auto" />
          </Link>
          {user?.organization_name && <span className="ml-2 text-[10px] text-white/30 truncate">{user.organization_name}</span>}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleRail.map((r) => (
            <NavLink key={r.to} to={r.to} className={({ isActive }) => `rail-link ${isActive ? "active" : ""}`}>
              <I d={r.icon} /><span>{r.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/[0.06] p-4">
          <div className="mb-2 truncate text-xs text-muted">{user?.email}</div>
          <button onClick={() => { logout(); nav("/"); }} className="text-[11px] text-white/40 transition hover:text-white">Sign out</button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.06] bg-[#060712]/60 px-4 backdrop-blur-2xl md:px-6">
          <div className="flex-1 relative">
            <div className="max-w-xl">
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search projects, vendors, parts..."
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            {searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1 w-full max-w-xl rounded-xl border border-white/[0.08] bg-[#0d0e1a] shadow-2xl">
                {searchResults.slice(0, 8).map((r, i) => (
                  <button key={i} onClick={() => { nav(r.deep_link || `/project/${r.entity_id}`); setSearchResults(null); setSearchQuery(""); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.04] first:rounded-t-xl last:rounded-b-xl">
                    <span className="text-[10px] uppercase text-zinc-500 w-16">{r.entity_type}</span>
                    <span className="text-sm text-white truncate">{r.title}</span>
                    {r.subtitle && <span className="text-[11px] text-zinc-500 truncate">{r.subtitle}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotif(!showNotif)} className="relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 text-white/50 hover:text-white transition">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/[0.08] bg-[#0d0e1a] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <span className="text-xs font-medium text-white">Notifications</span>
                  {unreadCount > 0 && <button onClick={markAllRead} className="text-[10px] text-indigo-400 hover:text-indigo-300">Mark all read</button>}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? <div className="px-4 py-6 text-center text-xs text-zinc-500">No notifications</div> :
                    notifications.slice(0, 10).map(n => (
                      <button key={n.id} onClick={() => { markAsRead(n.id); if (n.deep_link) nav(n.deep_link); setShowNotif(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-white/[0.03] border-b border-white/[0.03] ${!n.read_at ? "bg-indigo-500/[0.03]" : ""}`}>
                        <div className="text-xs text-white">{n.title}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{n.body}</div>
                      </button>
                    ))
                  }
                </div>
              </div>
            )}
          </div>

          <Link to="/analyze" className="primary-btn rounded-xl px-4 py-2 text-xs font-medium">+ Analyze BOM</Link>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
