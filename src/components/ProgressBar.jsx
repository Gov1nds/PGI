export default function ProgressBar({ progressPct = 0, label, status = "processing" }) {
  const colors = {
    processing: "bg-indigo-500",
    complete: "bg-emerald-500",
    error: "bg-red-500",
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        {label && <span className="text-[11px] text-zinc-400">{label}</span>}
        <span className="text-[11px] text-zinc-500">{Math.round(progressPct)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[status] || colors.processing}`}
          style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
        />
      </div>
    </div>
  );
}
