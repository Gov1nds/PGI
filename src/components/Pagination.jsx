export default function Pagination({ pagination, onPageChange, currentCount }) {
  if (!pagination) return null;
  const { next_cursor, prev_cursor, total_count } = pagination;
  if (!next_cursor && !prev_cursor) return null;
  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-[11px] text-zinc-500">
        {currentCount != null && total_count != null ? `Showing ${currentCount} of ${total_count}` : ""}
      </span>
      <div className="flex gap-2">
        {prev_cursor && (
          <button onClick={() => onPageChange(prev_cursor)} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-white hover:bg-white/[0.06]">
            Previous
          </button>
        )}
        {next_cursor && (
          <button onClick={() => onPageChange(next_cursor)} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-white hover:bg-white/[0.06]">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
