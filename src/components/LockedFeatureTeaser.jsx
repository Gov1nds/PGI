import { Link } from "react-router-dom";

export default function LockedFeatureTeaser({ feature: f }) {
  return (
    <div className="card p-4 flex items-start gap-3 hover:border-[#D4D4D4] transition group">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#0A0A0A] transition">{f.feature}</div>
        <p className="text-[11px] text-[#9CA3AF] leading-4 mt-0.5">{f.description}</p>
        <Link to="/register" className="inline-block mt-1.5 text-[11px] text-[#0A0A0A] font-semibold hover:underline transition">Sign up to unlock →</Link>
      </div>
    </div>
  );
}
