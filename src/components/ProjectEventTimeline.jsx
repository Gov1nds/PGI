import React from "react";

function formatTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function labelForEvent(event) {
  const oldStatus = event.old_status ? event.old_status.replace(/_/g, " ") : "";
  const newStatus = event.new_status ? event.new_status.replace(/_/g, " ") : "";
  if (oldStatus && newStatus) return `${oldStatus} → ${newStatus}`;
  if (newStatus) return newStatus;
  return event.event_type.replace(/_/g, " ");
}

export default function ProjectEventTimeline({ events = [], title = "Event timeline", emptyText = "No events yet." }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">{title}</h3>
      </div>

      <div className="p-5">
        {!events.length ? (
          <p className="text-sm text-white/35">{emptyText}</p>
        ) : (
          <div className="space-y-4">
            {events.map((event, idx) => (
              <div key={event.id || `${event.event_type}-${idx}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-sky-400 mt-1" />
                  {idx < events.length - 1 && <div className="w-px flex-1 bg-white/[0.08] mt-1" />}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white/90">{labelForEvent(event)}</p>
                    <span className="text-[11px] text-white/30">{formatTime(event.created_at)}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">{event.event_type.replace(/_/g, " ")}</p>

                  {event.payload && Object.keys(event.payload).length > 0 && (
                    <div className="mt-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-xs text-white/55">
                      <pre className="whitespace-pre-wrap break-words">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}