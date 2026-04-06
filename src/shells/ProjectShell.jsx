import { Outlet, NavLink, useParams, Link } from "react-router-dom";

const TABS = [
  { l: "Overview", p: "" },
  { l: "Strategy", p: "strategy" },
  { l: "Vendors", p: "vendors" },
  { l: "RFQ", p: "rfq" },
  { l: "Compare", p: "compare" },
  { l: "Chat", p: "chat" },
  { l: "Orders", p: "orders" },
  { l: "Tracking", p: "tracking" },
  { l: "Analytics", p: "analytics" },
  { l: "History", p: "history" },
];

export default function ProjectShell() {
  const { id } = useParams();

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <aside className="hidden w-52 flex-col border-r border-white/[0.06] bg-[#060712]/80 backdrop-blur-2xl md:flex">
        <div className="flex h-16 items-center border-b border-white/[0.06] px-4">
          <Link to="/projects" className="text-sm text-white/55 transition hover:text-white">← Projects</Link>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {TABS.map((t) => (
            <NavLink
              key={t.p}
              to={t.p ? `/project/${id}/${t.p}` : `/project/${id}`}
              end={!t.p}
              className={({ isActive }) => `rail-link ${isActive ? "active" : ""}`}
            >
              {t.l}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
