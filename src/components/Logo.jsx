import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="relative">
        <img
          src="/images/logo.png"
          alt="PGI Hub"
          className="h-10 w-10 rounded-xl bg-white/[0.04] p-1.5 object-contain ring-1 ring-white/[0.08] group-hover:ring-sky-500/25 transition-all duration-300"
        />
        <div className="absolute -inset-1 rounded-xl bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-white">
          PGI <span className="gradient-text">Hub</span>
        </div>
        <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/50">Manufacturing Network</div>
      </div>
    </Link>
  );
}
