import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img
        src="/images/logo.png"
        alt="PGI Hub"
        className="h-10 w-10 rounded-xl bg-navy-800 p-1.5 object-contain ring-1 ring-white/10 group-hover:ring-sky-500/30 transition-all duration-300"
      />
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-white">
          PGI <span className="gradient-text">Hub</span>
        </div>
        <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">Manufacturing Network</div>
      </div>
    </Link>
  );
}
