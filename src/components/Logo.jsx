import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img
        src="/images/logo.png"
        alt="PGI Hub"
        className="h-10 w-10 rounded-xl bg-white/5 p-1.5 object-contain ring-1 ring-white/10 group-hover:ring-orange-500/30 transition-all duration-300"
      />
      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-tight text-white">
          PGI <span className="text-orange-400">Hub</span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/70">Manufacturing Network</div>
      </div>
    </Link>
  );
}
