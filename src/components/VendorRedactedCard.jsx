export default function VendorRedactedCard({ vendor: v, rank }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] hover:border-[#D4D4D4] transition">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] text-xs font-bold text-[#0A0A0A] shrink-0">{rank}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#0A0A0A] truncate">{v.name}</div>
        <div className="text-[11px] text-[#9CA3AF]">{v.country || "—"}{v.key_strength && ` · ${v.key_strength}`}</div>
      </div>
      <div className="shrink-0 text-right">
        {v.overall_score != null && (<div className="text-sm font-semibold text-[#0A0A0A]">{Math.round(v.overall_score * 100)}<span className="text-[10px] text-[#9CA3AF] font-normal ml-0.5">pts</span></div>)}
        <div className="text-[10px] text-[#D4D4D4] mt-0.5 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>Contact hidden</div>
      </div>
    </div>
  );
}
