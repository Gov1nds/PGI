const STALE_MS = 300000;

export default function StaleBadge({ computedAt, onRefresh, variant = "banner" }) {
  if (!computedAt) return null;
  const ageMs = Date.now() - new Date(computedAt).getTime();
  const isStale = ageMs > STALE_MS;

  if (variant === "inline") {
    const ageText = ageMs < 60000 ? "just now" : ageMs < 3600000 ? `${Math.floor(ageMs / 60000)} min ago` : ageMs < 86400000 ? `${Math.floor(ageMs / 3600000)}h ago` : `${Math.floor(ageMs / 86400000)}d ago`;
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] ${isStale ? "text-amber-600" : "text-[#9CA3AF]"}`}>
        {isStale && "⚠ "}Based on data from {ageText}
        {isStale && onRefresh && (<button onClick={onRefresh} className="text-amber-700 underline underline-offset-2 hover:text-amber-600 ml-1">Refresh</button>)}
      </span>
    );
  }
  if (variant === "footer") {
    return (
      <div className={`flex items-center gap-2 text-[10px] pt-2 border-t border-[#F0F0F0] ${isStale ? "text-amber-600" : "text-[#9CA3AF]"}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{isStale ? `⚠ Based on data from ${Math.floor(ageMs / 60000)} min ago` : `Updated ${new Date(computedAt).toLocaleTimeString()}`}</span>
        {isStale && onRefresh && (<button onClick={onRefresh} className="text-amber-700 underline underline-offset-2 hover:text-amber-600">Refresh</button>)}
      </div>
    );
  }
  if (!isStale) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
      <span>⚠ Based on data from {Math.floor(ageMs / 60000)} min ago</span>
      {onRefresh && (<button onClick={onRefresh} className="font-medium underline underline-offset-2 hover:text-amber-600">Refresh</button>)}
    </div>
  );
}
