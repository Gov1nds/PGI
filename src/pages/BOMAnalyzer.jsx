import React, { useState, useEffect, useRef } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { uploadBOM, unlockBOM } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/* ── Constants ──────────────────────────────────────────── */

const CURRENCIES = ["USD", "EUR", "INR", "CNY", "JPY", "GBP", "KRW", "MXN", "THB", "VND"];

const LOCATION_DATA = {
  India: {
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Delhi NCR": ["New Delhi", "Noida", "Gurgaon", "Faridabad"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Agra"],
    Haryana: ["Gurgaon", "Faridabad", "Panipat"],
    Punjab: ["Ludhiana", "Amritsar", "Jalandhar"],
  },
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
    Texas: ["Houston", "Dallas", "Austin", "San Antonio"],
    "New York": ["New York City", "Buffalo", "Rochester"],
    Florida: ["Miami", "Orlando", "Tampa"],
    Illinois: ["Chicago", "Aurora", "Naperville"],
  },
  China: {
    Guangdong: ["Shenzhen", "Guangzhou", "Dongguan", "Foshan"],
    Shanghai: ["Shanghai"],
    Beijing: ["Beijing"],
    Jiangsu: ["Suzhou", "Nanjing", "Wuxi"],
  },
  Germany: {
    Bavaria: ["Munich", "Nuremberg", "Augsburg"],
    "North Rhine-Westphalia": ["Cologne", "Dusseldorf", "Dortmund"],
    "Baden-Wurttemberg": ["Stuttgart", "Mannheim", "Karlsruhe"],
  },
  Mexico: {
    "Nuevo Leon": ["Monterrey", "Guadalupe"],
    Jalisco: ["Guadalajara", "Zapopan"],
  },
  Vietnam: {
    "Ho Chi Minh": ["Ho Chi Minh City"],
    Hanoi: ["Hanoi"],
    "Da Nang": ["Da Nang"],
  },
  Japan: {
    Tokyo: ["Tokyo"],
    Osaka: ["Osaka"],
    Aichi: ["Nagoya"],
  },
  "South Korea": {
    Seoul: ["Seoul"],
    Gyeonggi: ["Suwon", "Seongnam"],
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Mississauga"],
    Quebec: ["Montreal", "Quebec City"],
    "British Columbia": ["Vancouver", "Surrey"],
  },
};

/* ── Helpers ─────────────────────────────────────────────── */
const fmt = (n, d = 2) => {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};
const pct = (n) => (n != null ? `${Number(n).toFixed(1)}%` : "—");
const regionLabel = (r) => {
  const m = { CN: "China", IN: "India", US: "USA", EU: "Europe", VN: "Vietnam", JP: "Japan", KR: "S.Korea", TW: "Taiwan", TH: "Thailand", MX: "Mexico", local: "Local" };
  return m[r] || r;
};
const modeColor = (m) => {
  if (m === "exploration") return "text-amber-400";
  if (m === "thompson_sampling") return "text-sky-400";
  return "text-emerald-400";
};
const modeLabel = (m) => {
  if (m === "exploration") return "Explore";
  if (m === "thompson_sampling") return "Thompson";
  return "Exploit";
};
const riskColor = (s) => {
  if (s >= 0.7) return "text-red-400";
  if (s >= 0.4) return "text-amber-400";
  return "text-emerald-400";
};
const riskBg = (level) => {
  if (level === "HIGH") return "bg-red-500/15 text-red-400 border-red-500/20";
  if (level === "LOW") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
  return "bg-amber-500/15 text-amber-400 border-amber-500/20";
};

/* ── Animated counter ────────────────────────────────────── */
function AnimNum({ value, prefix = "", suffix = "", duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const target = Number(value) || 0;
    const start = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (target - start) * ease);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <>{prefix}{fmt(display)}{suffix}</>;
}

/* ══════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                           */
/* ══════════════════════════════════════════════════════════ */

export default function BOMAnalyzer() {
  const { user } = useAuth();

  /* ── State ─────────────────────────────────────────── */
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [city, setCity] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState(null);

  // Full report state (authenticated users)
  const [report, setReport] = useState(null);
  const [strategy, setStrategy] = useState(null);

  // Preview state (guest users)
  const [previewData, setPreviewData] = useState(null);
  const [bomId, setBomId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  // UI state
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const states_list = country ? Object.keys(LOCATION_DATA[country] || {}) : [];
  const cities_list = country && stateRegion ? (LOCATION_DATA[country]?.[stateRegion] || []) : [];

  /* ── File handler ────────────────────────────────────── */
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const ext = f.name.toLowerCase();
    if (![".csv", ".xlsx", ".xls"].some((x) => ext.endsWith(x))) {
      setError("Please upload a CSV or Excel file"); setFile(null); return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB limit"); setFile(null); return;
    }
    setFile(f); setError(null);
  };

  /* ── API call — goes to Platform API, NOT BOM analyzer ─ */
  const startAnalysis = async () => {
    if (!file) { setError("Upload a BOM file first"); setStep(1); return; }
    if (!country || !stateRegion || !city) { setError("Complete the location fields"); return; }

    setStep(3); setIsProcessing(true); setError(null);
    setProgress("Uploading BOM file...");

    try {
      const location = `${city}, ${stateRegion}, ${country}`;
      setProgress("Running intelligence pipeline...");

      const data = await uploadBOM(file, location, currency);

      setProgress("Building report...");
      setBomId(data.bom_id);
      setProjectId(data.preview?.project_id || data.bom_id);

      if (data.preview?.is_preview) {
        // ── Guest user: show limited preview ──
        setPreviewData(data.preview);
        setSessionToken(data.session_token);
        setIsProcessing(false);
        setStep(4); // preview step
      } else {
        // ── Authenticated user: show full report ──
        const fullData = data.preview;
        setReport(fullData.analyzer_report);
        setStrategy(fullData.strategy);
        setIsProcessing(false);
        setStep(5); // full report step
      }
    } catch (err) {
      setError(err.message || "Analysis failed");
      setIsProcessing(false);
      setStep(2);
    }
  };

  /* ── Unlock full report (guest → registers → unlocks) ── */
  const handleUnlock = async () => {
    if (!bomId) return;
    try {
      const data = await unlockBOM(bomId, sessionToken);
      // data.full_report has the analyzer output, data.strategy has strategy
      setReport(data.full_report?.analyzer || data.full_report || {});
      setStrategy(data.strategy || {});
      setPreviewData(null);
      setStep(5);
    } catch (err) {
      setError(err.message || "Unlock failed — please login first");
    }
  };

  const reset = () => {
    setStep(1); setFile(null); setReport(null); setStrategy(null);
    setPreviewData(null); setBomId(null); setProjectId(null); setSessionToken(null);
    setError(null); setCountry(""); setStateRegion(""); setCity("");
    setExpandedItem(null); setActiveTab("overview");
  };

  /* ── Derived data (from full report) ─────────────────── */
  const s1 = report?.section_1_executive_summary || {};
  const s2 = report?.section_2_component_breakdown || [];
  const s3 = report?.section_3_sourcing_strategy || {};
  const s5 = report?.section_5_recommendation || {};
  const s6 = report?.section_6_learning_snapshot || {};
  const meta = report?._meta || {};

  const bd = s1.cost_breakdown || {};
  const lt = s1.lead_time || {};
  const dd = s1.decision_distribution || {};

  /* ── Shared styles ───────────────────────────────────── */
  const card = "rounded-2xl bg-[#0d1117] border border-white/[0.06] overflow-hidden";
  const cardInner = "p-6 sm:p-8";
  const selectCls = `w-full px-4 py-3 bg-[#161b22] border border-white/[0.08] rounded-xl text-white/90 
    focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50
    appearance-none cursor-pointer transition-all text-sm
    bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.4)%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22/%3e%3c/svg%3e')]
    bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

  /* ── Step names adapt to auth state ──────────────────── */
  const isGuest = !user;
  const stepNames = isGuest
    ? ["Upload", "Location", "Analyze", "Preview", "Report"]
    : ["Upload", "Location", "Analyze", "—", "Report"];

  return (
    <div className="min-h-screen bg-[#010409]">
      {/* ── Header ─────────────────────────────────────── */}
      <section className="relative border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
        <Container className="relative py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium tracking-wider uppercase">Intelligence Engine v2.0</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              BOM Analyzer
            </h1>
            <p className="mt-4 text-white/80 text-base leading-relaxed max-w-lg mx-auto">
              Upload your Bill of Materials. Get AI-powered sourcing decisions
              with reinforcement learning optimization across 11 global regions.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        {/* ── Error ────────────────────────────────────── */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/[0.06] border border-red-500/20 rounded-xl flex items-start gap-3">
            <span className="text-red-400 text-sm mt-0.5">●</span>
            <p className="text-red-300 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-white/50 hover:text-white/60 text-sm">✕</button>
          </div>
        )}

        {/* ── Progress steps ───────────────────────────── */}
        {step < 5 && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-between">
              {stepNames.filter((_, i) => !(isGuest ? false : i === 3)).map((name, i) => {
                const s = i + 1;
                const active = step >= s;
                return (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
                        active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : "bg-white/[0.04] text-white/50 border border-white/[0.06]"
                      }`}>{step > s ? "✓" : s}</div>
                      <span className={`text-[10px] transition-colors ${active ? "text-white/60" : "text-white/20"}`}>{name}</span>
                    </div>
                    {s < stepNames.length && <div className={`flex-1 h-px mx-2 mt-[-12px] transition-colors duration-500 ${step > s ? "bg-emerald-500/40" : "bg-white/[0.06]"}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* STEP 1 — File Upload                            */}
        {/* ════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-5 animate-[fadeIn_0.3s_ease]">
            <div className={card}>
              <div className={cardInner}>
                <h2 className="text-xl text-white font-semibold mb-1">Upload BOM File</h2>
                <p className="text-white/70 text-sm mb-6">CSV or Excel — up to 10 MB</p>

                <label className={`relative flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all
                  ${file ? "border-emerald-500/40 bg-emerald-500/[0.04]" : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"}`}>
                  <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {file ? (
                    <div className="text-center">
                      <div className="text-3xl mb-2">📄</div>
                      <p className="text-emerald-400 font-medium text-sm">{file.name}</p>
                      <p className="text-white/50 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2 opacity-40">⬆</div>
                      <p className="text-white/80 text-sm">Drop file here or click to browse</p>
                      <p className="text-white/50 text-xs mt-1">.csv .xlsx .xls</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <PrimaryButton onClick={() => { if (!file) { setError("Select a file"); return; } setError(null); setStep(2); }} disabled={!file}>
              Continue →
            </PrimaryButton>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* STEP 2 — Location + Currency                    */}
        {/* ════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-5 animate-[fadeIn_0.3s_ease]">
            <div className={card}>
              <div className={cardInner + " space-y-5"}>
                <h2 className="text-xl text-white font-semibold">Delivery Location</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5 font-medium">Country</label>
                    <select value={country} onChange={(e) => { setCountry(e.target.value); setStateRegion(""); setCity(""); }} className={selectCls}>
                      <option value="" className="bg-[#161b22]">Select</option>
                      {Object.keys(LOCATION_DATA).map((c) => <option key={c} value={c} className="bg-[#161b22]">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5 font-medium">State / Region</label>
                    <select value={stateRegion} onChange={(e) => { setStateRegion(e.target.value); setCity(""); }} disabled={!country} className={selectCls + " disabled:opacity-40"}>
                      <option value="" className="bg-[#161b22]">{country ? "Select" : "—"}</option>
                      {states_list.map((s) => <option key={s} value={s} className="bg-[#161b22]">{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5 font-medium">City</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!stateRegion} className={selectCls + " disabled:opacity-40"}>
                      <option value="" className="bg-[#161b22]">{stateRegion ? "Select" : "—"}</option>
                      {cities_list.map((c) => <option key={c} value={c} className="bg-[#161b22]">{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-xs mb-1.5 font-medium">Target Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectCls + " max-w-[200px]"}>
                    {CURRENCIES.map((c) => <option key={c} value={c} className="bg-[#161b22]">{c}</option>)}
                  </select>
                </div>

                {country && stateRegion && city && (
                  <div className="p-3 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg">
                    <p className="text-emerald-400 text-xs font-medium">✓ {city}, {stateRegion}, {country} · {currency}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 text-sm font-medium transition-all">← Back</button>
              <PrimaryButton onClick={startAnalysis} disabled={!country || !stateRegion || !city}>
                Start Analysis →
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* STEP 3 — Processing                             */}
        {/* ════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="text-center py-20 animate-[fadeIn_0.3s_ease]">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-full border-[3px] border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-[3px] border-transparent border-b-emerald-500/30 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
            </div>
            <p className="mt-8 text-white text-lg font-medium">{progress}</p>
            <p className="mt-2 text-white/50 text-sm">{city}, {stateRegion}, {country}</p>
            <div className="mt-6 flex items-center justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* STEP 4 — Guest Preview (rich data + CTA)        */}
        {/* ════════════════════════════════════════════════ */}
        {step === 4 && previewData && (
          <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease]">

            {/* Success header */}
            <div className="text-center mb-2">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl text-white font-bold">Analysis Complete</h2>
              <p className="text-white/50 text-sm mt-1">{previewData.total_parts} parts analyzed across {Object.keys(previewData.categories || {}).filter(k => (previewData.categories||{})[k] > 0).length} categories</p>
            </div>

            {/* KPI cards — 4 columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={card}>
                <div className="p-4">
                  <p className="text-white/40 text-[10px] font-medium mb-1.5 uppercase tracking-wider">Est. Cost</p>
                  <p className="text-lg text-white font-bold">{currency} {fmt(previewData.total_cost)}</p>
                  {(previewData.cost_range?.[0] || previewData.cost_range?.min) && (
                    <p className="text-white/40 text-[10px] mt-1">{currency} {fmt(previewData.cost_range?.[0] || previewData.cost_range?.min)} – {fmt(previewData.cost_range?.[1] || previewData.cost_range?.max)}</p>
                  )}
                </div>
              </div>
              <div className={card}>
                <div className="p-4">
                  <p className="text-white/40 text-[10px] font-medium mb-1.5 uppercase tracking-wider">Lead Time</p>
                  <p className="text-lg text-white font-bold">{previewData.lead_time?.min_days || previewData.lead_time?.avg_days || "—"}–{previewData.lead_time?.max_days || "—"} <span className="text-sm font-normal text-white/50">days</span></p>
                </div>
              </div>
              <div className={card}>
                <div className="p-4">
                  <p className="text-white/40 text-[10px] font-medium mb-1.5 uppercase tracking-wider">Savings</p>
                  <p className="text-lg text-emerald-400 font-bold">{previewData.savings_percent ? `${previewData.savings_percent}%` : "—"}</p>
                  <p className="text-white/40 text-[10px] mt-1">vs all-local sourcing</p>
                </div>
              </div>
              <div className={card}>
                <div className="p-4">
                  <p className="text-white/40 text-[10px] font-medium mb-1.5 uppercase tracking-wider">Risk</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border ${riskBg(previewData.risk_level)}`}>
                    {previewData.risk_level || "MEDIUM"}
                  </span>
                </div>
              </div>
            </div>

            {/* Category breakdown pills */}
            {previewData.categories && Object.keys(previewData.categories).length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/30 text-xs">Categories:</span>
                {Object.entries(previewData.categories).filter(([,v]) => v > 0).map(([cat, count]) => (
                  <span key={cat} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                    cat === "standard" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                    cat === "custom" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                    cat === "raw_material" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                    "bg-white/[0.04] border-white/[0.08] text-white/50"
                  }`}>
                    {cat.replace("_", " ")} ({count})
                  </span>
                ))}
              </div>
            )}

            {/* ── VISIBLE Component Breakdown (first 3 real items) ── */}
            {previewData.visible_parts?.length > 0 && (
              <div className={card}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Component Breakdown</p>
                    <span className="text-white/30 text-[10px]">{previewData.visible_parts.length} of {previewData.total_parts} shown</span>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-2 px-3 pb-2 border-b border-white/[0.06] text-[10px] text-white/30 uppercase tracking-wider">
                    <span className="col-span-4">Part</span>
                    <span className="col-span-2">Category</span>
                    <span className="col-span-1 text-right">Qty</span>
                    <span className="col-span-2">Region</span>
                    <span className="col-span-1">Process</span>
                    <span className="col-span-2 text-right">Est. Cost</span>
                  </div>

                  {/* Visible rows */}
                  {previewData.visible_parts.map((part, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 px-3 py-3 border-b border-white/[0.04] items-center hover:bg-white/[0.02] transition-colors">
                      <span className="col-span-4 text-white/80 text-sm truncate" title={part.part_name}>{part.part_name}</span>
                      <span className={`col-span-2 text-[11px] font-medium ${
                        part.category === "standard" ? "text-blue-400" :
                        part.category === "custom" ? "text-amber-400" :
                        part.category === "raw_material" ? "text-purple-400" : "text-white/40"
                      }`}>{part.category?.replace("_", " ")}</span>
                      <span className="col-span-1 text-white/50 text-sm text-right font-mono">{part.quantity}</span>
                      <span className="col-span-2 text-white/50 text-sm">{part.best_region}</span>
                      <span className="col-span-1 text-white/40 text-[11px]">{part.process}</span>
                      <span className="col-span-2 text-white font-mono text-sm text-right">{currency} {fmt(part.best_cost)}</span>
                    </div>
                  ))}

                  {/* Locked rows */}
                  {previewData.locked_parts_count > 0 && (
                    <div className="relative mt-1">
                      {[1, 2].map(i => (
                        <div key={i} className="grid grid-cols-12 gap-2 px-3 py-3 border-b border-white/[0.04] opacity-20 blur-[3px] select-none pointer-events-none">
                          <span className="col-span-4 text-white/50 text-sm">████████ ██████</span>
                          <span className="col-span-2 text-white/50 text-[11px]">██████</span>
                          <span className="col-span-1 text-white/50 text-sm text-right">███</span>
                          <span className="col-span-2 text-white/50 text-sm">█████</span>
                          <span className="col-span-1 text-white/50 text-[11px]">███</span>
                          <span className="col-span-2 text-white/50 text-sm text-right">███.██</span>
                        </div>
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117]/90 rounded-full border border-white/[0.1]">
                          <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          <span className="text-white/60 text-xs font-medium">+{previewData.locked_parts_count} more parts — sign up to unlock</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key insights */}
            {previewData.basic_processes?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={card}>
                  <div className="p-5">
                    <p className="text-white/40 text-xs font-medium mb-3 uppercase tracking-wider">Strategy Insights</p>
                    <div className="space-y-2">
                      {previewData.basic_processes.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5">▸</span>
                          <p className="text-white/70 text-sm leading-relaxed">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Region distribution */}
                {previewData.region_distribution && Object.keys(previewData.region_distribution).length > 0 && (
                  <div className={card}>
                    <div className="p-5">
                      <p className="text-white/40 text-xs font-medium mb-3 uppercase tracking-wider">Sourcing Regions</p>
                      <div className="space-y-2">
                        {Object.entries(previewData.region_distribution).sort((a, b) => b[1] - a[1]).map(([region, pct]) => (
                          <div key={region} className="flex items-center gap-3">
                            <span className="text-white/70 text-sm w-20 truncate">{region}</span>
                            <div className="flex-1 bg-white/[0.06] rounded-full h-2 overflow-hidden">
                              <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <span className="text-white/40 text-xs font-mono w-10 text-right">{typeof pct === "number" ? pct.toFixed(0) : pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Decision summary */}
            {previewData.decision_summary && (
              <div className={card}>
                <div className="p-5">
                  <p className="text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">AI Recommendation</p>
                  <p className="text-white/70 text-sm leading-relaxed">{previewData.decision_summary}</p>
                </div>
              </div>
            )}

            {/* ── Unlock CTA ─────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-violet-600/20" />
              <div className="absolute inset-0 bg-[#0d1117]/80" />
              <div className="relative p-8 sm:p-10 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Get the Full Report
                </h3>
                <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                  Unlock detailed per-component sourcing, vendor selection,
                  procurement plan, and downloadable cost optimization report.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {user ? (
                    <button onClick={handleUnlock}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/25">
                      Unlock Full Report
                    </button>
                  ) : (
                    <>
                      <a href="/register"
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/25 inline-block">
                        Create Free Account
                      </a>
                      <a href="/login" className="text-white/50 hover:text-white/70 text-sm transition-colors">
                        Already have an account? Login
                      </a>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[11px] text-white/30">
                  <span>✓ All {previewData.total_parts} components</span>
                  <span>✓ Vendor selection</span>
                  <span>✓ Procurement plan</span>
                  <span>✓ Cost optimization</span>
                  <span>✓ RFQ generation</span>
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="flex justify-center">
              <button onClick={reset} className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white/60 text-sm font-medium transition-all">
                ← Analyze Another BOM
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* STEP 5 — Full Report (authenticated users)      */}
        {/* ════════════════════════════════════════════════ */}
        {step === 5 && report && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease]">

            {/* ── Report header with project info ──────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                <p className="text-white/50 text-sm mt-1">
                  {meta.items} items · {meta.candidates} candidates · {meta.total_time_s}s
                  {bomId && <span className="text-white/30 ml-2">ID: {bomId.slice(0, 8)}</span>}
                </p>
              </div>
              <div className="flex gap-2">
                {bomId && user && (
                  <a href={`/project/${projectId || bomId}`}
                    className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-medium transition-all">
                    View Project →
                  </a>
                )}
                <button onClick={reset} className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-white/60 text-xs font-medium transition-all">
                  New Analysis
                </button>
              </div>
            </div>

            {/* ── Tabs ─────────────────────────────────── */}
            <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] max-w-fit">
              {[
                ["overview", "Overview"],
                ["components", "Components"],
                ["strategy", "Strategy"],
                ["learning", "Learning"],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-white/70 hover:text-white/70"}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── TAB: Overview ────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Cost", value: <AnimNum value={s1.total_cost} prefix={currency + " "} />, sub: `${pct(s1.optimization?.cost_savings_pct)} savings` },
                    { label: "Lead Time", value: `${lt.min_days}–${lt.max_days}d`, sub: `Expected ${lt.expected_days} days` },
                    { label: "Risk Score", value: <span className={riskColor(s1.risk_score)}>{fmt(s1.risk_score, 3)}</span>, sub: `${s2.length} items analyzed` },
                    { label: "Engine", value: `${meta.total_time_s || 0}s`, sub: `${meta.candidates || 0} candidates` },
                  ].map((kpi, i) => (
                    <div key={i} className={card}>
                      <div className="p-5">
                        <p className="text-white/35 text-xs font-medium mb-2">{kpi.label}</p>
                        <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
                        <p className="text-white/50 text-xs mt-1">{kpi.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost breakdown */}
                <div className={card}>
                  <div className={cardInner}>
                    <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Cost Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Manufacturing", value: bd.manufacturing, color: "bg-emerald-500" },
                        { label: "Logistics", value: bd.logistics, color: "bg-sky-500" },
                        { label: "Tariffs & Duties", value: bd.tariffs, color: "bg-amber-500" },
                        { label: "NRE / Tooling", value: bd.nre, color: "bg-violet-500" },
                        { label: "Material", value: bd.material, color: "bg-rose-500" },
                      ].map((row, i) => {
                        const total = s1.total_cost || 1;
                        const w = Math.max(2, ((row.value || 0) / total) * 100);
                        return (
                          <div key={i} className="flex items-center gap-4">
                            <span className="text-white/80 text-xs w-28 shrink-0">{row.label}</span>
                            <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${row.color}`} style={{ width: `${w}%`, transition: "width 1s ease" }} />
                            </div>
                            <span className="text-white/70 text-xs font-mono w-24 text-right">{currency} {fmt(row.value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Decision distribution + recommendation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={card}>
                    <div className="p-5">
                      <p className="text-white/35 text-xs font-medium mb-3">Decision Distribution</p>
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <div className="flex h-3 rounded-full overflow-hidden bg-white/[0.04]">
                            <div className="bg-emerald-500 rounded-l-full" style={{ width: `${dd.exploitation_pct || 0}%` }} />
                            <div className="bg-amber-500 rounded-r-full" style={{ width: `${dd.exploration_pct || 0}%` }} />
                          </div>
                          <div className="flex justify-between mt-2 text-[10px]">
                            <span className="text-emerald-400">Exploit {pct(dd.exploitation_pct)}</span>
                            <span className="text-amber-400">Explore {pct(dd.exploration_pct)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={card}>
                    <div className="p-5">
                      <p className="text-white/35 text-xs font-medium mb-3">Recommendation</p>
                      <p className="text-white/70 text-xs leading-relaxed">{s5.plan || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Components ──────────────────────── */}
            {activeTab === "components" && (
              <div className="space-y-3">
                {/* Component count badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/40 text-xs">{s2.length} components</span>
                  <span className="text-white/20">·</span>
                  <span className="text-emerald-400/60 text-xs">{s2.filter(i => i.category === "standard").length} standard</span>
                  <span className="text-violet-400/60 text-xs">{s2.filter(i => i.category === "custom").length} custom</span>
                  <span className="text-amber-400/60 text-xs">{s2.filter(i => i.category === "raw_material").length} raw material</span>
                </div>

                {s2.map((item, i) => {
                  const v = item.selected_vendor || {};
                  const tlcB = v.tlc_breakdown || {};
                  const exp = item.explanation || {};
                  const alts = item.alternatives || [];
                  const open = expandedItem === i;
                  return (
                    <div key={i} className={card + " transition-all"}>
                      <button onClick={() => setExpandedItem(open ? null : i)} className="w-full text-left p-4 sm:p-5 flex items-center gap-4 hover:bg-white/[0.01] transition-colors">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          item.category === "custom" ? "bg-violet-500/15 text-violet-400" :
                          item.category === "raw_material" ? "bg-amber-500/15 text-amber-400" :
                          "bg-emerald-500/15 text-emerald-400"
                        }`}>
                          {item.category === "custom" ? "C" : item.category === "raw_material" ? "R" : "S"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.description}</p>
                          <p className="text-white/50 text-xs">Q: {item.quantity} · {regionLabel(v.region)} · {v.transport_mode}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-white font-mono text-sm">{currency} {fmt(v.simulated_tlc)}</p>
                          <p className={`text-xs font-medium ${modeColor(item.decision_mode)}`}>{modeLabel(item.decision_mode)}</p>
                        </div>
                        <span className={`text-white/20 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
                      </button>

                      {open && (
                        <div className="border-t border-white/[0.04] p-4 sm:p-5 space-y-4 bg-white/[0.01]">
                          {/* TLC Breakdown */}
                          <div>
                            <p className="text-white/70 text-xs font-medium mb-2">TLC Breakdown</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              {[
                                ["Mfg", `${fmt(tlcB.c_mfg, 2)} × ${tlcB.quantity}`],
                                ["Logistics", fmt(tlcB.c_log)],
                                ["Tariff", fmt(tlcB.c_tariff)],
                                ["NRE", fmt(tlcB.c_nre)],
                                ["Inventory", fmt(tlcB.c_inventory)],
                                ["Risk", fmt(tlcB.c_risk)],
                                ["Compliance", fmt(tlcB.c_compliance)],
                                ["Industrial TLC", fmt(tlcB.industrial_tlc)],
                              ].map(([l, val], j) => (
                                <div key={j} className="p-2 bg-white/[0.02] rounded-lg">
                                  <p className="text-white/50 mb-0.5">{l}</p>
                                  <p className="text-white/80 font-mono">{val}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Decision math */}
                          <div>
                            <p className="text-white/70 text-xs font-medium mb-2">Decision Logic</p>
                            <div className="p-3 bg-[#161b22] rounded-lg text-xs font-mono text-white/80 space-y-1 overflow-x-auto">
                              <p>{exp.math?.ucb || "—"}</p>
                              <p className="text-white/50">{exp.math?.tlc || "—"}</p>
                            </div>
                          </div>

                          {/* Risk */}
                          <div className="flex flex-wrap gap-3">
                            {[
                              ["Supply", exp.risk?.supply],
                              ["Logistics", exp.risk?.logistics],
                              ["Cost Vol.", exp.risk?.cost_volatility],
                              ["Quality", exp.risk?.quality],
                            ].map(([l, val], j) => (
                              <div key={j} className="px-3 py-1.5 bg-white/[0.03] rounded-lg text-xs">
                                <span className="text-white/50">{l} </span>
                                <span className={riskColor(val || 0)}>{fmt(val, 3)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Alternatives */}
                          {alts.length > 0 && (
                            <div>
                              <p className="text-white/70 text-xs font-medium mb-2">Alternatives</p>
                              <div className="space-y-1.5">
                                {alts.map((a, j) => (
                                  <div key={j} className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg text-xs">
                                    <span className="text-white/80">{a.supplier_name} · {regionLabel(a.region)}</span>
                                    <span className="text-white/70 font-mono">{currency} {fmt(a.simulated_tlc)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Process chain */}
                          {v.process_chain && v.process_chain.length > 0 && (
                            <div>
                              <p className="text-white/70 text-xs font-medium mb-2">Process Chain</p>
                              <div className="flex flex-wrap gap-1.5">
                                {v.process_chain.map((p, j) => (
                                  <span key={j} className="px-2 py-1 bg-violet-500/10 text-violet-300 text-[10px] rounded-md font-medium">{p}</span>
                                ))}
                              </div>
                              {v.machining_time_hrs > 0 && (
                                <p className="text-white/50 text-xs mt-2">Machining: {fmt(v.machining_time_hrs)}h · Labor: {fmt(v.labor_hours)}h</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TAB: Strategy ────────────────────────── */}
            {activeTab === "strategy" && (
              <div className="space-y-6">
                {/* Volume strategy */}
                <div className={card}>
                  <div className={cardInner}>
                    <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Volume Strategy</h3>
                    <div className="space-y-2">
                      {(s3.volume_strategy || []).map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg text-xs">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              v.type === "high" ? "bg-emerald-500/15 text-emerald-400" :
                              v.type === "medium" ? "bg-sky-500/15 text-sky-400" :
                              "bg-white/[0.06] text-white/80"
                            }`}>{v.type}</span>
                            <span className="text-white/70 truncate max-w-[200px]">{v.item}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-white/50">Q: {v.qty}</span>
                            <span className="text-white/80">{regionLabel(v.region)}</span>
                            <span className="text-white font-mono">{currency} {fmt(v.tlc)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Process summary */}
                {(s3.process_summary || []).length > 0 && (
                  <div className={card}>
                    <div className={cardInner}>
                      <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Custom Manufacturing</h3>
                      {(s3.process_summary || []).map((p, i) => (
                        <div key={i} className="p-4 bg-white/[0.02] rounded-lg mb-3 last:mb-0">
                          <p className="text-white text-sm font-medium mb-2">{p.item}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-white/70">
                            <span>Form: <span className="text-white/70">{p.material_form}</span></span>
                            <span>Machining: <span className="text-white/70">{fmt(p.machining_hrs)}h</span></span>
                            <span>Labor: <span className="text-white/70">{fmt(p.labor_hrs)}h</span></span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(p.process_chain || []).map((proc, j) => (
                              <span key={j} className="px-2 py-0.5 bg-violet-500/10 text-violet-300 text-[10px] rounded font-medium">{proc}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk insights */}
                {(s3.risk_insights || []).length > 0 && (
                  <div className={card}>
                    <div className={cardInner}>
                      <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Risk Alerts</h3>
                      {(s3.risk_insights || []).map((r, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-red-500/[0.04] border border-red-500/10 rounded-lg mb-2 last:mb-0 text-xs">
                          <span className="text-red-400">⚠</span>
                          <span className="text-white/60">{r.item}</span>
                          <span className="text-white/50">·</span>
                          <span className="text-white/70">{r.supplier}</span>
                          <span className="ml-auto text-red-300 font-mono">var: {fmt(r.variance, 3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Learning ────────────────────────── */}
            {activeTab === "learning" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "System Confidence", value: fmt(s6.system_confidence, 3) },
                    { label: "Exploration Rate", value: fmt(s6.exploration_rate, 4) },
                    { label: "Total Iterations", value: s6.total_iterations },
                  ].map((kpi, i) => (
                    <div key={i} className={card}>
                      <div className="p-5">
                        <p className="text-white/35 text-xs font-medium mb-1">{kpi.label}</p>
                        <p className="text-xl font-bold text-white">{kpi.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {(s6.exploration_decisions || []).length > 0 && (
                  <div className={card}>
                    <div className={cardInner}>
                      <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Exploration Decisions</h3>
                      {s6.exploration_decisions.map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-amber-500/[0.04] rounded-lg mb-2 text-xs">
                          <span className="text-white/60">{d.item}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-white/50">{d.supplier}</span>
                            <span className="text-amber-400 font-mono">gain: {fmt(d.info_gain, 3)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(s6.high_uncertainty || []).length > 0 && (
                  <div className={card}>
                    <div className={cardInner}>
                      <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">High Uncertainty Items</h3>
                      {s6.high_uncertainty.map((h, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg mb-2 text-xs">
                          <span className="text-white/80">{h.item}</span>
                          <span className={`font-mono ${riskColor(h.uncertainty)}`}>{fmt(h.uncertainty, 3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={card}>
                  <div className="p-5">
                    <p className="text-white/50 text-xs">{s6.note}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Bottom actions ───────────────────────── */}
            <div className="flex justify-center pt-4">
              <button onClick={reset} className="px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white/70 text-sm font-medium transition-all">
                ← Analyze Another BOM
              </button>
            </div>
          </div>
        )}
      </Container>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}