import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiCall } from "../../lib/api";
import StaleBadge from "../StaleBadge";

const PO_STATES = [
  { key: "PO_APPROVED", label: "Approved", icon: "✓" },
  { key: "PO_SENT", label: "PO Sent", icon: "📤" },
  { key: "VENDOR_ACCEPTED", label: "Accepted", icon: "🤝" },
  { key: "PRODUCTION_STARTED", label: "Production", icon: "🏭" },
  { key: "QUALITY_CHECK", label: "QC", icon: "🔍" },
  { key: "PACKED", label: "Packed", icon: "📦" },
  { key: "SHIPPED", label: "Shipped", icon: "🚢" },
  { key: "CUSTOMS", label: "Customs", icon: "🛃" },
  { key: "IN_TRANSIT", label: "In Transit", icon: "🚛" },
  { key: "DELIVERED", label: "Delivered", icon: "📬" },
  { key: "GR_CONFIRMED", label: "GR Confirmed", icon: "✅" },
  { key: "CLOSED", label: "Closed", icon: "🔒" },
];

const SLA_HOURS = {
  PO_APPROVED: 24, PO_SENT: 48, VENDOR_ACCEPTED: 72,
  PRODUCTION_STARTED: 168, QUALITY_CHECK: 48, PACKED: 24,
  SHIPPED: 24, CUSTOMS: 120, IN_TRANSIT: 240, DELIVERED: 24,
};

function StuckBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-400/15 text-[10px] text-red-300 animate-pulse">
      ⚠ Stuck
    </span>
  );
}

function MilestoneRow({ state, isActive, isCompleted, isStuck, timestamp, isMobile }) {
  const stateColor = isActive
    ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
    : isCompleted
    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
    : "border-white/10 bg-white/[0.02] text-white/25";

  if (isMobile) {
    return (
      <div className="flex items-start gap-3 relative">
        <div className="flex flex-col items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm shrink-0 ${stateColor}`}>
            {state.icon}
          </div>
          <div className={`w-0.5 h-6 ${isCompleted ? "bg-emerald-500/30" : "bg-white/[0.06]"}`} />
        </div>
        <div className="pb-4">
          <div className={`text-xs font-medium ${isCompleted || isActive ? "text-white" : "text-white/30"}`}>
            {state.label}
          </div>
          {timestamp && (
            <div className="text-[10px] text-white/25 mt-0.5">
              {new Date(timestamp).toLocaleString()}
            </div>
          )}
          {isStuck && <StuckBadge />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 min-w-[72px]">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm transition ${stateColor}`}>
        {state.icon}
      </div>
      <div className={`text-[10px] text-center leading-tight ${isCompleted || isActive ? "text-white/60" : "text-white/20"}`}>
        {state.label}
      </div>
      {timestamp && (
        <div className="text-[9px] text-white/20">{new Date(timestamp).toLocaleDateString()}</div>
      )}
      {isStuck && <StuckBadge />}
    </div>
  );
}

function LogisticsPicker({ poId, accessToken, onBooked }) {
  const [carrier, setCarrier] = useState("");
  const [booking, setBooking] = useState(false);
  const carriers = ["DHL Express", "FedEx", "UPS", "Maersk", "SF Express", "Local Courier"];

  const book = async () => {
    setBooking(true);
    try {
      await apiCall(`/api/v1/orders/po/${poId}/book-logistics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrier }),
      }, accessToken);
      onBooked?.();
    } catch {}
    setBooking(false);
  };

  return (
    <div className="card p-4 mt-3 border-sky-500/15">
      <h4 className="text-xs font-semibold text-white mb-2">Book Logistics</h4>
      <div className="flex gap-2">
        <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-white">
          <option value="">Select carrier…</option>
          {carriers.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={book} disabled={!carrier || booking} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg disabled:opacity-40">
          {booking ? "Booking…" : "Book"}
        </button>
      </div>
    </div>
  );
}

function PODAcknowledge({ poId, accessToken, onConfirmed }) {
  const [confirming, setConfirming] = useState(false);
  const confirm = async () => {
    setConfirming(true);
    try {
      await apiCall(`/api/v1/orders/po/${poId}/confirm-gr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }, accessToken);
      onConfirmed?.();
    } catch {}
    setConfirming(false);
  };

  return (
    <button onClick={confirm} disabled={confirming} className="px-4 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-500 disabled:opacity-50 font-medium">
      {confirming ? "Confirming…" : "Confirm Goods Received"}
    </button>
  );
}

export default function POTimeline({ poId, timeline: propTimeline, onRefresh }) {
  const { accessToken } = useAuth();
  const [timeline, setTimeline] = useState(propTimeline || null);
  const [loading, setLoading] = useState(!propTimeline);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (propTimeline) { setTimeline(propTimeline); return; }
    if (!poId) return;
    apiCall(`/api/v1/orders/po/${poId}/timeline`, {}, accessToken)
      .then(setTimeline)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [poId, accessToken, propTimeline]);

  if (loading) return <div className="py-4 text-center text-xs text-white/30">Loading timeline…</div>;
  if (!timeline) return null;

  const currentState = timeline.current_state || timeline.status;
  const milestones = timeline.milestones || [];
  const currentIdx = PO_STATES.findIndex((s) => s.key === currentState);

  // Check if stuck
  const lastMilestoneTime = milestones.length > 0 ? new Date(milestones[milestones.length - 1].timestamp).getTime() : 0;
  const hoursInState = lastMilestoneTime ? (Date.now() - lastMilestoneTime) / (1000 * 60 * 60) : 0;
  const slaHours = SLA_HOURS[currentState] || 48;
  const isStuck = hoursInState > slaHours;

  return (
    <div className="space-y-3">
      {/* Carrier info */}
      {timeline.carrier && (
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white/40">Carrier:</span>
          <span className="text-white/70">{timeline.carrier}</span>
          {timeline.tracking_number && (
            <a
              href={timeline.tracking_url || `https://track.aftership.com/${timeline.tracking_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200"
            >
              Track: {timeline.tracking_number}
            </a>
          )}
        </div>
      )}

      {/* Timeline stepper */}
      {isMobile ? (
        <div className="pl-1">
          {PO_STATES.map((state, i) => {
            const milestone = milestones.find((m) => m.state === state.key);
            return (
              <MilestoneRow
                key={state.key}
                state={state}
                isActive={i === currentIdx}
                isCompleted={i < currentIdx}
                isStuck={i === currentIdx && isStuck}
                timestamp={milestone?.timestamp}
                isMobile
              />
            );
          })}
        </div>
      ) : (
        <div className="flex items-start gap-1 overflow-x-auto pb-2">
          {PO_STATES.map((state, i) => {
            const milestone = milestones.find((m) => m.state === state.key);
            return (
              <div key={state.key} className="flex items-center">
                <MilestoneRow
                  state={state}
                  isActive={i === currentIdx}
                  isCompleted={i < currentIdx}
                  isStuck={i === currentIdx && isStuck}
                  timestamp={milestone?.timestamp}
                  isMobile={false}
                />
                {i < PO_STATES.length - 1 && (
                  <div className={`w-6 h-0.5 mt-[-18px] ${i < currentIdx ? "bg-emerald-500/30" : "bg-white/[0.06]"}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {timeline.computed_at && <StaleBadge computedAt={timeline.computed_at} variant="inline" />}

      {/* Actions */}
      <div className="flex gap-2">
        {currentState === "PO_APPROVED" && (
          <LogisticsPicker poId={poId} accessToken={accessToken} onBooked={onRefresh} />
        )}
        {currentState === "DELIVERED" && (
          <PODAcknowledge poId={poId} accessToken={accessToken} onConfirmed={onRefresh} />
        )}
      </div>
    </div>
  );
}

export { StuckBadge, LogisticsPicker, PODAcknowledge };
