import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <img
        src="/images/logo.png"
        alt="PGI Hub"
        className="h-10 w-10 rounded-xl bg-white/[0.04] p-1.5 object-contain ring-1 ring-white/[0.08] group-hover:ring-white/[0.15] transition-all duration-300"
      />
      <div>
        <div className="text-sm font-semibold text-white">PGI <span className="text-white/50">Hub</span></div>
        <div className="text-[9px] uppercase tracking-[0.12em] text-white/30">Manufacturing</div>
      </div>
    </Link>
  );
}
