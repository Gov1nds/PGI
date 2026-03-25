import React, { useState, useEffect, useRef } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { uploadBOM, unlockBOM, uploadDrawing } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/* ── Constants ──────────────────────────────────────────────────────────── */

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

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const fmt = (n, d = 2) => {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
};

const pct = (n) => (n != null ? `${Number(n).toFixed(1)}%` : "—");

const regionLabel = (r) => {
  const m = {
    CN: "China", IN: "India", US: "USA", EU: "Europe",
    VN: "Vietnam", JP: "Japan", KR: "S.Korea", TW: "Taiwan",
    TH: "Thailand", MX: "Mexico", local: "Local",
  };
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

// FIX: Dynamic category color — replaces hardcoded 3-way switch throughout
const categoryColor = (cat) => {
  const MAP = {
    standard:          "text-blue-400",
    electronics:       "text-cyan-400",
    electrical:        "text-indigo-400",
    fastener:          "text-slate-400",
    custom_mechanical: "text-orange-400",
    sheet_metal:       "text-yellow-400",
    custom:            "text-amber-400",
    raw_material:      "text-purple-400",
    unknown:           "text-white/40",
  };
  return MAP[cat] || "text-white/40";
};

const categoryBadge = (cat) => {
  const MAP = {
    standard:          "bg-blue-500/10 border-blue-500/20 text-blue-400",
    electronics:       "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    electrical:        "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    fastener:          "bg-slate-500/10 border-slate-500/20 text-slate-400",
    custom_mechanical: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    sheet_metal:       "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    custom:            "bg-amber-500/10 border-amber-500/20 text-amber-400",
    raw_material:      "bg-purple-500/10 border-purple-500/20 text-purple-400",
    unknown:           "bg-white/[0.04] border-white/[0.08] text-white/50",
  };
  return MAP[cat] || MAP.unknown;
};

// FIX: category icon letter — expanded beyond just C/R/S
const categoryIcon = (cat) => {
  const MAP = {
    standard:          { letter: "S", cls: "bg-emerald-500/15 text-emerald-400" },
    electronics:       { letter: "E", cls: "bg-cyan-500/15 text-cyan-400" },
    electrical:        { letter: "EL", cls: "bg-indigo-500/15 text-indigo-400" },
    fastener:          { letter: "F", cls: "bg-slate-500/15 text-slate-400" },
    custom_mechanical: { letter: "CM", cls: "bg-orange-500/15 text-orange-400" },
    sheet_metal:       { letter: "SM", cls: "bg-yellow-500/15 text-yellow-400" },
    custom:            { letter: "C", cls: "bg-amber-500/15 text-amber-400" },
    raw_material:      { letter: "R", cls: "bg-purple-500/15 text-purple-400" },
    unknown:           { letter: "?", cls: "bg-white/[0.06] text-white/40" },
  };
  return MAP[cat] || MAP.unknown;
};

const RFQ_CATEGORIES = new Set(["custom", "custom_mechanical", "sheet_metal"]);

/* ── Animated counter ─────────────────────────────────────────────────────── */

function AnimNum({ value, prefix = "", suffix = "", duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const target = Number(value) || 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(target * ease);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <>{prefix}{fmt(display)}{suffix}</>;
}

/* ── Custom Part Card (inline — drawing upload for fabricated parts) ───────── */

function CustomPartCard({ part, currency, rfqId, onDrawingUploaded }) {
  const [drawingFile, setDrawingFile] = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploaded, setUploaded]       = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleUpload = async () => {
    if (!drawingFile || !rfqId) return;
    setUploading(true);
    setUploadError(null);
    try {
      await uploadDrawing(rfqId, part.description || part.part_name, drawingFile);
      setUploaded(true);
      onDrawingUploaded?.();
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const processes = part.suggested_processes?.length
    ? part.suggested_processes
    : part.process_chain?.length
    ? part.process_chain
    : [];

  return (
    <div className="mt-3 p-4 bg-amber-500/[0.04] border border-amber-500/20 rounded-xl space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
            Custom / Fabricated Part — Quote Required
          </p>
          <p className="text-white/50 text-xs">
            Upload a drawing (PDF, DXF, STEP) to request a manufacturing quote.
          </p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-[11px] font-bold border border-amber-500/20">
          RFQ
        </span>
      </div>

      {/* Suggested processes */}
      {processes.length > 0 && (
        <div>
          <p className="text-white/35 text-[10px] mb-1.5 uppercase tracking-wider">Suggested Process</p>
          <div className="flex flex-wrap gap-1.5">
            {processes.map((p, i) => (
              <span key={i} className="px-2 py-0.5 bg-violet-500/10 text-violet-300 text-[10px] rounded font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Material */}
      {part.material && (
        <div>
          <p className="text-white/35 text-[10px] mb-0.5 uppercase tracking-wider">Material</p>
          <p className="text-white/70 text-xs">{part.material}</p>
        </div>
      )}

      {/* Indicative shop time */}
      {(part.selected_vendor?.machining_time_hrs > 0 || part.machining_time_hrs > 0) && (
        <div className="p-2.5 bg-white/[0.02] rounded-lg">
          <p className="text-white/35 text-[10px] mb-1 uppercase tracking-wider">
            Indicative Shop Time (actual cost requires quote)
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-white/60">
            <span>
              Machining: ~{fmt(part.selected_vendor?.machining_time_hrs || part.machining_time_hrs, 1)}h
            </span>
            <span>
              Labor: ~{fmt(part.selected_vendor?.labor_hours || part.labor_hours, 1)}h
            </span>
          </div>
        </div>
      )}

      {/* Drawing upload */}
      {rfqId && !uploaded && (
        <div className="flex items-center gap-2 mt-1">
          <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg cursor-pointer hover:border-amber-500/30 transition-all min-w-0">
            <input
              type="file"
              accept=".pdf,.dxf,.step,.stp,.dwg,.stl,.png,.jpg,.jpeg"
              onChange={(e) => setDrawingFile(e.target.files[0])}
              className="hidden"
            />
            <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
            <span className="text-white/40 text-xs truncate">
              {drawingFile ? drawingFile.name : "Upload drawing (PDF, DXF, STEP…)"}
            </span>
          </label>
          <button
            onClick={handleUpload}
            disabled={!drawingFile || uploading}
            className="shrink-0 px-3 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white text-xs font-medium transition-all whitespace-nowrap"
          >
            {uploading ? "Uploading…" : "Submit Drawing"}
          </button>
        </div>
      )}

      {!rfqId && !uploaded && (
        <p className="text-white/30 text-[10px]">
          Request a quote first to enable drawing upload.
        </p>
      )}

      {uploaded && (
        <div className="flex items-center gap-2 text-emerald-400 text-xs">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Drawing submitted — expect a quote within 24 hours.
        </div>
      )}

      {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                           */
/* ══════════════════════════════════════════════════════════════════════════ */

export default function BOMAnalyzer() {
  const { user } = useAuth();

  /* ── State ──────────────────────────────────────────────────────────────── */
  const [step, setStep]               = useState(1);
  const [file, setFile]               = useState(null);
  const [country, setCountry]         = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [city, setCity]               = useState("");
  const [currency, setCurrency]       = useState("USD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress]       = useState("");
  const [error, setError]             = useState(null);

  // Full report state (authenticated users)
  const [report, setReport]     = useState(null);
  const [strategy, setStrategy] = useState(null);

  // Preview state (guest users)
  const [previewData, setPreviewData]   = useState(null);
  const [bomId, setBomId]               = useState(null);
  // FIX: store project_id separately — the "View Project" link must use project_id, not bom_id
  const [projectId, setProjectId]       = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  // UI state
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeTab, setActiveTab]       = useState("overview");

  const states_list = country ? Object.keys(LOCATION_DATA[country] || {}) : [];
  const cities_list = country && stateRegion ? (LOCATION_DATA[country]?.[stateRegion] || []) : [];

  // FIX: helper to format costs with the selected currency symbol
  const fmtCost = (n) => (n == null || isNaN(n) ? "—" : `${currency} ${fmt(n)}`);

  /* ── File handler ───────────────────────────────────────────────────────── */
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const ext = f.name.toLowerCase();
    if (![".csv", ".xlsx", ".xls"].some((x) => ext.endsWith(x))) {
      setError("Please upload a CSV or Excel file");
      setFile(null);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB limit");
      setFile(null);
      return;
    }
    setFile(f);
    setError(null);
  };

  /* ── Start analysis ─────────────────────────────────────────────────────── */
  const startAnalysis = async () => {
    if (!file) { setError("Upload a BOM file first"); setStep(1); return; }
    if (!country || !stateRegion || !city) { setError("Complete the location fields"); return; }

    setStep(3);
    setIsProcessing(true);
    setError(null);
    setProgress("Uploading BOM file…");

    try {
      const location = `${city}, ${stateRegion}, ${country}`;
      setProgress("Running intelligence pipeline…");

      const data = await uploadBOM(file, location, currency);

      setProgress("Building report…");

      // FIX: store both bom_id and project_id from the response
      setBomId(data.bom_id);
      setProjectId(data.project_id || null);

      if (data.preview?.is_preview) {
        // Guest user — show limited preview
        setPreviewData(data.preview);
        setSessionToken(data.session_token);
        setIsProcessing(false);
        setStep(4);
      } else {
        // Authenticated user — show full report
        const fullData = data.preview;
        setReport(fullData.analyzer_report);
        setStrategy(fullData.strategy);
        // FIX: also read currency returned by the API and override if needed
        if (fullData.currency && fullData.currency !== currency) {
          setCurrency(fullData.currency);
        }
        setIsProcessing(false);
        setStep(5);
      }
    } catch (err) {
      setError(err.message || "Analysis failed");
      setIsProcessing(false);
      setStep(2);
    }
  };

  /* ── Unlock full report (guest → registered → unlocks) ─────────────────── */
  const handleUnlock = async () => {
    if (!bomId) return;
    try {
      const data = await unlockBOM(bomId, sessionToken);
      setReport(data.full_report?.analyzer || data.full_report || {});
      setStrategy(data.strategy || {});
      setPreviewData(null);
      setStep(5);
    } catch (err) {
      setError(err.message || "Unlock failed — please log in first");
    }
  };

  /* ── Reset ──────────────────────────────────────────────────────────────── */
  const reset = () => {
    setStep(1); setFile(null); setReport(null); setStrategy(null);
    setPreviewData(null); setBomId(null); setProjectId(null); // FIX: clear projectId
    setSessionToken(null); setError(null);
    setCountry(""); setStateRegion(""); setCity("");
    setExpandedItem(null); setActiveTab("overview");
  };

  /* ── Derived data (from full report) ───────────────────────────────────── */
  const s1   = report?.section_1_executive_summary  || {};
  const s2   = report?.section_2_component_breakdown || [];
  const s3   = report?.section_3_sourcing_strategy  || {};
  const s5   = report?.section_5_recommendation     || {};
  const s6   = report?.section_6_learning_snapshot  || {};
  const meta = report?._meta || {};

  const bd = s1.cost_breakdown      || {};
  const lt = s1.lead_time           || {};
  const dd = s1.decision_distribution || {};

  // Category counts from report — supports all 9 category types
  const categoryCounts = s1.categories || {};
  const rfqCount   = s2.filter((i) => i.requires_rfq).length;
  const pricedCount = s2.length - rfqCount;

  /* ── Shared style strings ───────────────────────────────────────────────── */
  const card      = "rounded-2xl bg-[#0d1117] border border-white/[0.06] overflow-hidden";
  const cardInner = "p-6 sm:p-8";
  const selectCls = `w-full px-4 py-3 bg-[#161b22] border border-white/[0.08] rounded-xl text-white/90
    focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50
    appearance-none cursor-pointer transition-all text-sm
    bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.4)%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22/%3e%3c/svg%3e')]
    bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

  const isGuest   = !user;
  const stepNames = isGuest
    ? ["Upload", "Location", "Analyze", "Preview", "Report"]
    : ["Upload", "Location", "Analyze", "—", "Report"];

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#010409]">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <section className="relative border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
        <Container className="relative py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium tracking-wider uppercase">
                Intelligence Engine v3.0
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">BOM Analyzer</h1>
            <p className="mt-4 text-white/80 text-base leading-relaxed max-w-lg mx-auto">
              Upload your Bill of Materials. Get AI-powered sourcing decisions
              with optimization across 9 global regions.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">

        {/* ── Error banner ────────────────────────────────────────────────── */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/[0.06] border border-red-500/20 rounded-xl flex items-start gap-3">
            <span className="text-red-400 text-sm mt-0.5">●</span>
            <p className="text-red-300 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-white/40 hover:text-white/60 text-sm leading-none">✕</button>
          </div>
        )}

        {/* ── Progress stepper ────────────────────────────────────────────── */}
        {step < 5 && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-between">
              {stepNames
                .filter((_, i) => !(isGuest ? false : i === 3))
                .map((name, i) => {
                  const s      = i + 1;
                  const active = step >= s;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
                          active
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                            : "bg-white/[0.04] text-white/50 border border-white/[0.06]"
                        }`}>
                          {step > s ? "✓" : s}
                        </div>
                        <span className={`text-[10px] transition-colors ${active ? "text-white/60" : "text-white/20"}`}>
                          {name}
                        </span>
                      </div>
                      {s < stepNames.length && (
                        <div className={`flex-1 h-px mx-2 mt-[-12px] transition-colors duration-500 ${
                          step > s ? "bg-emerald-500/40" : "bg-white/[0.06]"
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* STEP 1 — File Upload                                              */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-5 animate-[fadeIn_0.3s_ease]">
            <div className={card}>
              <div className={cardInner}>
                <h2 className="text-xl text-white font-semibold mb-1">Upload BOM File</h2>
                <p className="text-white/50 text-sm mb-6">CSV or Excel — up to 10 MB</p>
                <label className={`relative flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  file
                    ? "border-emerald-500/40 bg-emerald-500/[0.04]"
                    : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"
                }`}>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFile}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="text-center">
                      <div className="text-3xl mb-2">📄</div>
                      <p className="text-emerald-400 font-medium text-sm">{file.name}</p>
                      <p className="text-white/40 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2 opacity-30">⬆</div>
                      <p className="text-white/70 text-sm">Drop file here or click to browse</p>
                      <p className="text-white/40 text-xs mt-1">.csv .xlsx .xls</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <PrimaryButton
              onClick={() => { if (!file) { setError("Select a file first"); return; } setError(null); setStep(2); }}
              disabled={!file}
            >
              Continue →
            </PrimaryButton>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* STEP 2 — Location + Currency                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-5 animate-[fadeIn_0.3s_ease]">
            <div className={card}>
              <div className={`${cardInner} space-y-5`}>
                <h2 className="text-xl text-white font-semibold">Delivery Location</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 font-medium">Country</label>
                    <select
                      value={country}
                      onChange={(e) => { setCountry(e.target.value); setStateRegion(""); setCity(""); }}
                      className={selectCls}
                    >
                      <option value="" className="bg-[#161b22]">Select</option>
                      {Object.keys(LOCATION_DATA).map((c) => (
                        <option key={c} value={c} className="bg-[#161b22]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 font-medium">State / Region</label>
                    <select
                      value={stateRegion}
                      onChange={(e) => { setStateRegion(e.target.value); setCity(""); }}
                      disabled={!country}
                      className={`${selectCls} disabled:opacity-40`}
                    >
                      <option value="" className="bg-[#161b22]">{country ? "Select" : "—"}</option>
                      {states_list.map((s) => (
                        <option key={s} value={s} className="bg-[#161b22]">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 font-medium">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!stateRegion}
                      className={`${selectCls} disabled:opacity-40`}
                    >
                      <option value="" className="bg-[#161b22]">{stateRegion ? "Select" : "—"}</option>
                      {cities_list.map((c) => (
                        <option key={c} value={c} className="bg-[#161b22]">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-medium">Target Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={`${selectCls} max-w-[200px]`}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} className="bg-[#161b22]">{c}</option>
                    ))}
                  </select>
                </div>

                {country && stateRegion && city && (
                  <div className="p-3 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg">
                    <p className="text-emerald-400 text-xs font-medium">
                      ✓ {city}, {stateRegion}, {country} · {currency}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 text-sm font-medium transition-all"
              >
                ← Back
              </button>
              <PrimaryButton
                onClick={startAnalysis}
                disabled={!country || !stateRegion || !city}
              >
                Start Analysis →
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* STEP 3 — Processing                                               */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="text-center py-20 animate-[fadeIn_0.3s_ease]">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-full border-[3px] border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div
                className="absolute inset-0 w-16 h-16 rounded-full border-[3px] border-transparent border-b-emerald-500/30 animate-spin"
                style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
              />
            </div>
            <p className="mt-8 text-white text-lg font-medium">{progress}</p>
            <p className="mt-2 text-white/40 text-sm">{city}, {stateRegion}, {country}</p>
            <div className="mt-6 flex items-center justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* STEP 4 — Guest Preview                                            */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {step === 4 && previewData && (
          <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease]">

            {/* Success header */}
            <div className="text-center mb-2">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl text-white font-bold">Analysis Complete</h2>
              <p className="text-white/40 text-sm mt-1">
                {previewData.total_parts} parts analyzed across{" "}
                {Object.values(previewData.categories || {}).filter((v) => v > 0).length} categories
              </p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Est. Cost",
                  value: fmtCost(previewData.total_cost),
                  sub: previewData.cost_range?.length === 2
                    ? `${fmtCost(previewData.cost_range[0])} – ${fmtCost(previewData.cost_range[1])}`
                    : null,
                },
                {
                  label: "Lead Time",
                  value: `${previewData.lead_time?.min_days || previewData.lead_time?.avg_days || "—"}–${previewData.lead_time?.max_days || "—"}`,
                  sub: "days",
                },
                {
                  label: "Savings",
                  value: previewData.savings_percent ? `${previewData.savings_percent}%` : "—",
                  sub: "vs all-local",
                  valueClass: "text-emerald-400",
                },
                {
                  label: "Risk",
                  value: null,
                  badge: previewData.risk_level || "MEDIUM",
                },
              ].map((kpi, i) => (
                <div key={i} className={card}>
                  <div className="p-4">
                    <p className="text-white/35 text-[10px] font-medium mb-1.5 uppercase tracking-wider">{kpi.label}</p>
                    {kpi.badge ? (
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border ${riskBg(kpi.badge)}`}>
                        {kpi.badge}
                      </span>
                    ) : (
                      <p className={`text-lg font-bold ${kpi.valueClass || "text-white"}`}>{kpi.value}</p>
                    )}
                    {kpi.sub && <p className="text-white/35 text-[10px] mt-1">{kpi.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* FIX: Category pills — all 9 category types with correct colors */}
            {previewData.categories && Object.keys(previewData.categories).length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/25 text-xs">Categories:</span>
                {Object.entries(previewData.categories)
                  .filter(([, v]) => v > 0)
                  .map(([cat, count]) => (
                    <span key={cat} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${categoryBadge(cat)}`}>
                      {cat.replace(/_/g, " ")} ({count})
                    </span>
                  ))}
              </div>
            )}

            {/* Visible component rows */}
            {previewData.visible_parts?.length > 0 && (
              <div className={card}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Component Breakdown</p>
                    <span className="text-white/25 text-[10px]">
                      {previewData.visible_parts.length} of {previewData.total_parts} shown
                    </span>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-2 px-3 pb-2 border-b border-white/[0.06] text-[10px] text-white/25 uppercase tracking-wider">
                    <span className="col-span-4">Part</span>
                    <span className="col-span-2">Category</span>
                    <span className="col-span-1 text-right">Qty</span>
                    <span className="col-span-2">Region</span>
                    <span className="col-span-1">Process</span>
                    <span className="col-span-2 text-right">Est. Cost</span>
                  </div>

                  {previewData.visible_parts.map((part, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-2 px-3 py-3 border-b border-white/[0.03] items-center hover:bg-white/[0.01] transition-colors"
                    >
                      <span className="col-span-4 text-white/80 text-sm truncate" title={part.part_name}>
                        {part.part_name}
                      </span>
                      {/* FIX: uses categoryColor() for all 9 types */}
                      <span className={`col-span-2 text-[11px] font-medium ${categoryColor(part.category)}`}>
                        {part.category?.replace(/_/g, " ")}
                      </span>
                      <span className="col-span-1 text-white/50 text-sm text-right font-mono">{part.quantity}</span>
                      <span className="col-span-2 text-white/50 text-sm">{part.best_region}</span>
                      <span className="col-span-1 text-white/35 text-[11px]">{part.process}</span>
                      {/* FIX: RFQ-required parts show badge instead of fake price */}
                      <span className="col-span-2 text-right">
                        {part.requires_rfq ? (
                          <span className="text-amber-400 text-[10px] font-semibold">RFQ Required</span>
                        ) : (
                          <span className="text-white font-mono text-sm">{fmtCost(part.best_cost)}</span>
                        )}
                      </span>
                    </div>
                  ))}

                  {/* Locked rows */}
                  {previewData.locked_parts_count > 0 && (
                    <div className="relative mt-1">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="grid grid-cols-12 gap-2 px-3 py-3 border-b border-white/[0.03] opacity-20 blur-[3px] select-none pointer-events-none"
                        >
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
                          <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-white/50 text-xs font-medium">
                            +{previewData.locked_parts_count} more parts — sign up to unlock
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Strategy insights + region distribution */}
            {previewData.basic_processes?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={card}>
                  <div className="p-5">
                    <p className="text-white/35 text-xs font-medium mb-3 uppercase tracking-wider">Strategy Insights</p>
                    <div className="space-y-2">
                      {previewData.basic_processes.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5 shrink-0">▸</span>
                          <p className="text-white/60 text-sm leading-relaxed">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {previewData.region_distribution && Object.keys(previewData.region_distribution).length > 0 && (
                  <div className={card}>
                    <div className="p-5">
                      <p className="text-white/35 text-xs font-medium mb-3 uppercase tracking-wider">Sourcing Regions</p>
                      <div className="space-y-2">
                        {Object.entries(previewData.region_distribution)
                          .sort((a, b) => b[1] - a[1])
                          .map(([region, val]) => (
                            <div key={region} className="flex items-center gap-3">
                              <span className="text-white/60 text-sm w-20 truncate">{region}</span>
                              <div className="flex-1 bg-white/[0.05] rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500/60 rounded-full"
                                  style={{ width: `${Math.min(Number(val), 100)}%` }}
                                />
                              </div>
                              <span className="text-white/35 text-xs font-mono w-10 text-right">
                                {Number(val).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI decision summary */}
            {previewData.decision_summary && (
              <div className={card}>
                <div className="p-5">
                  <p className="text-white/35 text-xs font-medium mb-2 uppercase tracking-wider">AI Recommendation</p>
                  <p className="text-white/60 text-sm leading-relaxed">{previewData.decision_summary}</p>
                </div>
              </div>
            )}

            {/* Unlock CTA */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-violet-600/20" />
              <div className="absolute inset-0 bg-[#0d1117]/80" />
              <div className="relative p-8 sm:p-10 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Get the Full Report</h3>
                <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
                  Unlock detailed per-component sourcing, vendor selection,
                  procurement plan, and cost optimization report.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {user ? (
                    <button
                      onClick={handleUnlock}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/25"
                    >
                      Unlock Full Report
                    </button>
                  ) : (
                    <>
                      <a
                        href="/register"
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/25 inline-block"
                      >
                        Create Free Account
                      </a>
                      <a href="/login" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                        Already have an account? Login
                      </a>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[11px] text-white/25">
                  <span>✓ All {previewData.total_parts} components</span>
                  <span>✓ Vendor selection</span>
                  <span>✓ Procurement plan</span>
                  <span>✓ Cost optimization</span>
                  <span>✓ RFQ generation</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={reset}
                className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white/50 text-sm font-medium transition-all"
              >
                ← Analyze Another BOM
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* STEP 5 — Full Report (authenticated users)                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {step === 5 && report && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease]">

            {/* Report header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                <p className="text-white/40 text-sm mt-1">
                  {meta.items} items · {meta.candidates} candidates · {meta.total_time_s}s
                  {bomId && (
                    <span className="text-white/25 ml-2 font-mono">
                      ID: {bomId.slice(0, 8)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                {/* FIX: use projectId, not bomId, for the "View Project" link */}
                {(projectId || bomId) && user && (
                  <a
                    href={`/project/${projectId || bomId}`}
                    className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-medium transition-all"
                  >
                    View Project →
                  </a>
                )}
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-white/50 text-xs font-medium transition-all"
                >
                  New Analysis
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] max-w-fit">
              {[
                ["overview",    "Overview"],
                ["components",  "Components"],
                ["strategy",    "Strategy"],
                ["learning",    "Learning"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === id
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── TAB: Overview ──────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Cost",
                      value: <AnimNum value={s1.cost_breakdown?.total} prefix={`${currency} `} />,
                      sub: `${pct(s1.optimization?.cost_savings_pct)} savings`,
                    },
                    {
                      label: "Lead Time",
                      value: `${lt.min_days || "—"}–${lt.max_days || "—"}d`,
                      sub: `Expected ${lt.expected_days || lt.avg_days || "—"} days`,
                    },
                    {
                      label: "Risk Score",
                      value: <span className={riskColor(s1.risk_score || 0)}>{fmt(s1.risk_score, 3)}</span>,
                      sub: `${s2.length} items · ${rfqCount} need RFQ`,
                    },
                    {
                      label: "Engine",
                      value: `${meta.total_time_s || 0}s`,
                      sub: `${meta.candidates || 0} candidates`,
                    },
                  ].map((kpi, i) => (
                    <div key={i} className={card}>
                      <div className="p-5">
                        <p className="text-white/35 text-xs font-medium mb-2">{kpi.label}</p>
                        <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
                        <p className="text-white/40 text-xs mt-1">{kpi.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FIX: Category summary badges — all 9 types */}
                {Object.keys(categoryCounts).length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-white/25 text-xs">Categories:</span>
                    {Object.entries(categoryCounts)
                      .filter(([, v]) => v > 0)
                      .map(([cat, count]) => (
                        <span key={cat} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${categoryBadge(cat)}`}>
                          {cat.replace(/_/g, " ")} ({count})
                        </span>
                      ))}
                    {rfqCount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium border bg-amber-500/10 border-amber-500/20 text-amber-400">
                        ⚠ {rfqCount} need RFQ
                      </span>
                    )}
                  </div>
                )}

                {/* Cost breakdown */}
                <div className={card}>
                  <div className={cardInner}>
                    <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
                      Cost Breakdown
                      {s1.currency && s1.currency !== "USD" && (
                        <span className="ml-2 text-white/30 normal-case font-normal">({s1.currency})</span>
                      )}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "Manufacturing", value: bd.manufacturing, color: "bg-emerald-500" },
                        { label: "Logistics",     value: bd.logistics,     color: "bg-sky-500" },
                        { label: "Tariffs & Duties", value: bd.tariffs,    color: "bg-amber-500" },
                        { label: "NRE / Tooling", value: bd.nre,           color: "bg-violet-500" },
                        { label: "Material",      value: bd.material,      color: "bg-rose-500" },
                      ].map((row, i) => {
                        const total = bd.total || 1;
                        const w = Math.max(2, ((row.value || 0) / total) * 100);
                        return (
                          <div key={i} className="flex items-center gap-4">
                            <span className="text-white/70 text-xs w-28 shrink-0">{row.label}</span>
                            <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${row.color}`}
                                style={{ width: `${w}%`, transition: "width 1s ease" }}
                              />
                            </div>
                            <span className="text-white/60 text-xs font-mono w-28 text-right">
                              {fmtCost(row.value)}
                            </span>
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
                      <div className="flex h-3 rounded-full overflow-hidden bg-white/[0.04]">
                        <div className="bg-emerald-500 rounded-l-full" style={{ width: `${dd.exploitation_pct || 0}%` }} />
                        <div className="bg-amber-500 rounded-r-full"  style={{ width: `${dd.exploration_pct  || 0}%` }} />
                      </div>
                      <div className="flex justify-between mt-2 text-[10px]">
                        <span className="text-emerald-400">Exploit {pct(dd.exploitation_pct)}</span>
                        <span className="text-amber-400">Explore {pct(dd.exploration_pct)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={card}>
                    <div className="p-5">
                      <p className="text-white/35 text-xs font-medium mb-3">Recommendation</p>
                      <p className="text-white/60 text-xs leading-relaxed">{s5.plan || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Components ────────────────────────────────────────── */}
            {activeTab === "components" && (
              <div className="space-y-3">
                {/* Summary row */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-white/35 text-xs">{s2.length} components</span>
                  <span className="text-white/15">·</span>
                  {Object.entries(categoryCounts)
                    .filter(([, v]) => v > 0)
                    .map(([cat, count]) => (
                      <span key={cat} className={`text-xs ${categoryColor(cat)}`}>
                        {count} {cat.replace(/_/g, " ")}
                      </span>
                    ))}
                  {rfqCount > 0 && (
                    <span className="text-amber-400 text-xs">· {rfqCount} need RFQ</span>
                  )}
                </div>

                {s2.map((item, i) => {
                  const v    = item.selected_vendor || {};
                  const tlcB = v.tlc_breakdown   || {};
                  const exp  = item.explanation  || {};
                  const alts = item.alternatives || [];
                  const open = expandedItem === i;
                  const icon = categoryIcon(item.category);
                  const isRfq = item.requires_rfq || RFQ_CATEGORIES.has(item.category);

                  return (
                    <div key={i} className={`${card} transition-all`}>
                      <button
                        onClick={() => setExpandedItem(open ? null : i)}
                        className="w-full text-left p-4 sm:p-5 flex items-center gap-4 hover:bg-white/[0.01] transition-colors"
                      >
                        {/* Category icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0 ${icon.cls}`}>
                          {icon.letter}
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.description || item.part_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-medium ${categoryColor(item.category)}`}>
                              {item.category?.replace(/_/g, " ")}
                            </span>
                            <span className="text-white/20 text-[10px]">·</span>
                            <span className="text-white/35 text-xs">Q: {item.quantity}</span>
                            {!isRfq && v.region && (
                              <>
                                <span className="text-white/20 text-[10px]">·</span>
                                <span className="text-white/35 text-xs">{regionLabel(v.region)}</span>
                              </>
                            )}
                            {/* FIX: staleness warning */}
                            {item.price_is_stale && (
                              <span className="text-amber-400/70 text-[10px]">
                                ⚠ stale ({item.price_age_days}d)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cost / RFQ badge */}
                        <div className="text-right shrink-0">
                          {isRfq ? (
                            <span className="inline-flex px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[11px] font-bold border border-amber-500/20">
                              RFQ Required
                            </span>
                          ) : (
                            <p className="text-white font-mono text-sm">{fmtCost(v.simulated_tlc)}</p>
                          )}
                          <p className={`text-xs font-medium mt-0.5 ${modeColor(item.decision_mode)}`}>
                            {modeLabel(item.decision_mode)}
                          </p>
                        </div>

                        <span className={`text-white/20 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </button>

                      {/* Expanded detail */}
                      {open && (
                        <div className="border-t border-white/[0.04] p-4 sm:p-5 space-y-4 bg-white/[0.01]">

                          {/* Custom part card — drawing upload */}
                          {isRfq && (
                            <CustomPartCard
                              part={item}
                              currency={currency}
                              rfqId={null}
                              onDrawingUploaded={() => {}}
                            />
                          )}

                          {/* TLC breakdown — only shown for priced parts */}
                          {!isRfq && Object.keys(tlcB).length > 0 && (
                            <div>
                              <p className="text-white/60 text-xs font-medium mb-2">TLC Breakdown</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                {[
                                  ["Mfg",           `${fmtCost(tlcB.c_mfg)} × ${tlcB.quantity}`],
                                  ["Logistics",     fmtCost(tlcB.c_log)],
                                  ["Tariff",        fmtCost(tlcB.c_tariff)],
                                  ["NRE",           fmtCost(tlcB.c_nre)],
                                  ["Inventory",     fmtCost(tlcB.c_inventory)],
                                  ["Risk",          fmtCost(tlcB.c_risk)],
                                  ["Compliance",    fmtCost(tlcB.c_compliance)],
                                  ["Industrial TLC",fmtCost(tlcB.industrial_tlc)],
                                ].map(([l, val], j) => (
                                  <div key={j} className="p-2 bg-white/[0.02] rounded-lg">
                                    <p className="text-white/40 mb-0.5">{l}</p>
                                    <p className="text-white/70 font-mono">{val}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Decision math */}
                          {!isRfq && (exp.math?.ucb || exp.math?.tlc) && (
                            <div>
                              <p className="text-white/60 text-xs font-medium mb-2">Decision Logic</p>
                              <div className="p-3 bg-[#161b22] rounded-lg text-xs font-mono text-white/70 space-y-1 overflow-x-auto">
                                {exp.math?.ucb && <p>{exp.math.ucb}</p>}
                                {exp.math?.tlc && <p className="text-white/40">{exp.math.tlc}</p>}
                              </div>
                            </div>
                          )}

                          {/* Risk indicators */}
                          {exp.risk && (
                            <div className="flex flex-wrap gap-3">
                              {[
                                ["Supply",    exp.risk.supply],
                                ["Logistics", exp.risk.logistics],
                                ["Cost Vol.", exp.risk.cost_volatility],
                                ["Quality",   exp.risk.quality],
                              ].map(([l, val], j) => (
                                <div key={j} className="px-3 py-1.5 bg-white/[0.02] rounded-lg text-xs">
                                  <span className="text-white/40">{l} </span>
                                  <span className={riskColor(val || 0)}>{fmt(val, 3)}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Alternatives */}
                          {alts.length > 0 && (
                            <div>
                              <p className="text-white/60 text-xs font-medium mb-2">Alternatives</p>
                              <div className="space-y-1.5">
                                {alts.map((a, j) => (
                                  <div
                                    key={j}
                                    className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg text-xs"
                                  >
                                    <span className="text-white/70">
                                      {a.supplier_name} · {regionLabel(a.region)}
                                    </span>
                                    <span className="text-white/60 font-mono">{fmtCost(a.simulated_tlc)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Process chain */}
                          {(item.suggested_processes?.length > 0 || v.process_chain?.length > 0) && (
                            <div>
                              <p className="text-white/60 text-xs font-medium mb-2">
                                {isRfq ? "Suggested Process Chain" : "Process Chain"}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {(item.suggested_processes?.length > 0
                                  ? item.suggested_processes
                                  : v.process_chain
                                ).map((p, j) => (
                                  <span key={j} className="px-2 py-1 bg-violet-500/10 text-violet-300 text-[10px] rounded-md font-medium">
                                    {p}
                                  </span>
                                ))}
                              </div>
                              {!isRfq && v.machining_time_hrs > 0 && (
                                <p className="text-white/35 text-xs mt-2">
                                  Machining: {fmt(v.machining_time_hrs)}h · Labor: {fmt(v.labor_hours)}h
                                </p>
                              )}
                            </div>
                          )}

                          {/* Price source + staleness */}
                          {!isRfq && item.price_source && (
                            <p className="text-white/25 text-[10px]">
                              Price source: {item.price_source}
                              {item.price_confidence && ` · confidence: ${item.price_confidence}`}
                              {item.price_is_stale && (
                                <span className="text-amber-400/60"> · ⚠ data is {item.price_age_days} days old</span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TAB: Strategy ──────────────────────────────────────────── */}
            {activeTab === "strategy" && (
              <div className="space-y-6">

                {/* Custom parts summary — NEW SECTION */}
                {(s3.custom_parts_summary || s3.process_summary || []).length > 0 && (
                  <div className={card}>
                    <div className={cardInner}>
                      <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
                        Custom / Fabricated Parts
                      </h3>
                      {(s3.custom_parts_summary || s3.process_summary || []).map((p, i) => (
                        <div key={i} className="p-4 bg-amber-500/[0.03] border border-amber-500/10 rounded-xl mb-3 last:mb-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <p className="text-white text-sm font-medium">{p.item}</p>
                            <span className="shrink-0 px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                              Quote Required
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-white/50 mb-2">
                            {p.material_form && (
                              <span>Form: <span className="text-white/70">{p.material_form}</span></span>
                            )}
                            {(p.machining_hrs || p.machining_time_hrs) > 0 && (
                              <span>Machining: <span className="text-white/70">{fmt(p.machining_hrs || p.machining_time_hrs)}h</span></span>
                            )}
                            {(p.labor_hrs || p.labor_hours) > 0 && (
                              <span>Labor: <span className="text-white/70">{fmt(p.labor_hrs || p.labor_hours)}h</span></span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {(p.suggested_processes || p.process_chain || []).map((proc, j) => (
                              <span key={j} className="px-2 py-0.5 bg-violet-500/10 text-violet-300 text-[10px] rounded font-medium">
                                {proc}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volume strategy */}
                {(s3.volume_strategy || []).length > 0 && (
                  <div className={card}>
                    <div className={cardInner}>
                      <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">Volume Strategy</h3>
                      <div className="space-y-2">
                        {s3.volume_strategy.map((v, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium ${
                                v.type === "high"   ? "bg-emerald-500/15 text-emerald-400" :
                                v.type === "medium" ? "bg-sky-500/15 text-sky-400" :
                                "bg-white/[0.06] text-white/60"
                              }`}>{v.type}</span>
                              <span className="text-white/60 truncate max-w-[200px]">{v.item}</span>
                              {v.requires_rfq && (
                                <span className="shrink-0 text-amber-400 text-[10px]">RFQ</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="text-white/40">Q: {v.qty}</span>
                              <span className="text-white/60">{regionLabel(v.region)}</span>
                              <span className="text-white font-mono">
                                {v.requires_rfq ? "TBD" : fmtCost(v.tlc)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk alerts */}
                {(s3.risk_insights || []).length > 0 && (
                  <div className={card}>
                    <div className={cardInner}>
                      <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">Risk Alerts</h3>
                      {s3.risk_insights.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-red-500/[0.04] border border-red-500/10 rounded-lg mb-2 last:mb-0 text-xs"
                        >
                          <span className="text-red-400 shrink-0">⚠</span>
                          <span className="text-white/50 flex-1 truncate">{r.item}</span>
                          <span className="text-white/40 shrink-0">{r.supplier}</span>
                          <span className="ml-auto text-red-300 font-mono shrink-0">var: {fmt(r.variance, 3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Learning ──────────────────────────────────────────── */}
            {activeTab === "learning" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "System Confidence", value: fmt(s6.system_confidence, 3) },
                    { label: "Exploration Rate",  value: fmt(s6.exploration_rate, 4) },
                    { label: "Total Iterations",  value: s6.total_iterations },
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
                      <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
                        Exploration Decisions
                      </h3>
                      {s6.exploration_decisions.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-amber-500/[0.04] rounded-lg mb-2 text-xs"
                        >
                          <span className="text-white/60">{d.item}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-white/40">{d.supplier}</span>
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
                      <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
                        High Uncertainty Items
                      </h3>
                      {s6.high_uncertainty.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg mb-2 text-xs"
                        >
                          <span className="text-white/70">{h.item}</span>
                          <span className={`font-mono ${riskColor(h.uncertainty)}`}>
                            {fmt(h.uncertainty, 3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={card}>
                  <div className="p-5">
                    <p className="text-white/35 text-xs">{s6.note}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom action */}
            <div className="flex justify-center pt-4">
              <button
                onClick={reset}
                className="px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white/50 text-sm font-medium transition-all"
              >
                ← Analyze Another BOM
              </button>
            </div>
          </div>
        )}
      </Container>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}