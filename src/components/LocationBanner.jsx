import { useState } from "react";
import { useLocation, CURRENCIES } from "../context/LocationContext";

function LocationEditor({ onSave, onCancel, initial }) {
  const [country, setCountry] = useState(initial.country || "");
  const [city, setCity] = useState(initial.city || "");
  const [currency, setCurrency] = useState(initial.currency || "USD");

  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        className="px-2 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white w-24 focus:outline-none focus:border-indigo-500/40"
      />
      <input
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Country"
        className="px-2 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white w-28 focus:outline-none focus:border-indigo-500/40"
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="px-2 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/40"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button
        onClick={() => onSave({ country, city, currency })}
        className="px-2 py-1 bg-indigo-600 text-white text-[10px] rounded-lg hover:bg-indigo-500 font-medium"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="text-[10px] text-white/40 hover:text-white/70"
      >
        Cancel
      </button>
    </div>
  );
}

export default function LocationBanner() {
  const { loc, setLoc } = useLocation();
  const [edit, setEdit] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!loc.detected || dismissed) return null;
  if (!loc.city && !loc.country) return null;

  return (
    <div className="border-b border-white/[0.04] bg-white/[0.015] text-xs py-2 px-4 flex items-center gap-3 flex-wrap">
      <span className="text-white/50">
        📍 Detected:{" "}
        <strong className="text-white/70">
          {[loc.city, loc.country].filter(Boolean).join(", ")}
        </strong>
        {" · "}Currency:{" "}
        <strong className="text-white/70">{loc.currency}</strong>
      </span>
      {!edit && (
        <button
          onClick={() => setEdit(true)}
          className="text-indigo-300 hover:text-indigo-200 transition"
        >
          Change
        </button>
      )}
      {!edit && (
        <button
          onClick={() => setDismissed(true)}
          className="text-white/25 hover:text-white/50 transition ml-auto"
          aria-label="Dismiss location banner"
        >
          ✕
        </button>
      )}
      {edit && (
        <LocationEditor
          initial={loc}
          onSave={(v) => {
            setLoc({ ...loc, ...v });
            setEdit(false);
          }}
          onCancel={() => setEdit(false)}
        />
      )}
    </div>
  );
}
