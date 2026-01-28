import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-2">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M6 18c5-1 9-5 10-10-5 1-9 5-10 10Z"
            stroke="rgba(var(--brand-500))"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8 16c0-5 4-9 9-9"
            stroke="rgba(var(--text)/0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-wide">Padanilath</div>
        <div className="text-xs text-white/60">Project Management</div>
      </div>
    </Link>
  );
}
