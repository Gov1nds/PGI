import { useState } from "react";
import { useLocation, CURRENCIES } from "../context/LocationContext";

function LocationEditor({ onSave, onCancel, initial }) {
  const [country, setCountry] = useState(initial.country || "");
  const [city, setCity] = useState(initial.city || "");
  const [currency, setCurrency] = useState(initial.currency || "USD");
  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="px-2 py-1 bg-white border border-[#E5E5E5] rounded-lg text-xs text-[#0A0A0A] w-24 focus:outline-none focus:border-[#0A0A0A]" />
      <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="px-2 py-1 bg-white border border-[#E5E5E5] rounded-lg text-xs text-[#0A0A0A] w-28 focus:outline-none focus:border-[#0A0A0A]" />
      <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="px-2 py-1 bg-white border border-[#E5E5E5] rounded-lg text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]">
        {CURRENCIES.map((c) => (<option key={c} value={c}>{c}</option>))}
      </select>
      <button onClick={() => onSave({ country, city, currency })} className="px-2 py-1 bg-[#0A0A0A] text-white text-[10px] rounded-lg hover:bg-[#1A1A1A] font-medium">Save</button>
      <button onClick={onCancel} className="text-[10px] text-[#9CA3AF] hover:text-[#6B7280]">Cancel</button>
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
    <div className="border-b border-[#F0F0F0] bg-[#FAFAFA] text-xs py-2 px-4 flex items-center gap-3 flex-wrap">
      <span className="text-[#6B7280]">📍 Detected: <strong className="text-[#0A0A0A]">{[loc.city, loc.country].filter(Boolean).join(", ")}</strong> · Currency: <strong className="text-[#0A0A0A]">{loc.currency}</strong></span>
      {!edit && (<button onClick={() => setEdit(true)} className="text-[#0A0A0A] font-medium hover:underline transition">Change</button>)}
      {!edit && (<button onClick={() => setDismissed(true)} className="text-[#9CA3AF] hover:text-[#6B7280] transition ml-auto" aria-label="Dismiss location banner">✕</button>)}
      {edit && (<LocationEditor initial={loc} onSave={(v) => { setLoc({ ...loc, ...v }); setEdit(false); }} onCancel={() => setEdit(false)} />)}
    </div>
  );
}
