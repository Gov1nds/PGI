import { Outlet, NavLink, useParams, Link } from "react-router-dom";

const TABS = [
  {l:"Overview",p:""},{l:"Strategy",p:"strategy"},{l:"Vendors",p:"vendors"},{l:"RFQ",p:"rfq"},
  {l:"Compare",p:"compare"},{l:"Chat",p:"chat"},{l:"Orders",p:"orders"},{l:"Tracking",p:"tracking"},
  {l:"Analytics",p:"analytics"},{l:"History",p:"history"},
];

export default function ProjectShell() {
  const { id } = useParams();
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      <aside className="hidden md:flex flex-col w-48 border-r border-white/[0.04] bg-[#0c0c12]">
        <div className="px-4 h-14 flex items-center border-b border-white/[0.04]">
          <Link to="/projects" className="text-sm text-zinc-500 hover:text-white">← Projects</Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {TABS.map(t=>(
            <NavLink key={t.p} to={t.p?`/project/${id}/${t.p}`:`/project/${id}`} end={!t.p}
              className={({isActive})=>`rail-link ${isActive?"active":""}`}>{t.l}</NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-y-auto"><Outlet/></div>
    </div>
  );
}
