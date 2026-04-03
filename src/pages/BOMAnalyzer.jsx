import React, { useState, useEffect, useRef, useMemo } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { uploadBOM, unlockBOM } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UniversalIntakeBox from "../components/UniversalIntakeBox.jsx";


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
const CURRENCY_CONFIG = {
  USD: { locale: "en-US", decimals: 2 },
  EUR: { locale: "de-DE", decimals: 2 },
  INR: { locale: "en-IN", decimals: 2 },
  CNY: { locale: "zh-CN", decimals: 2 },
  JPY: { locale: "ja-JP", decimals: 0 },
  GBP: { locale: "en-GB", decimals: 2 },
  KRW: { locale: "ko-KR", decimals: 0 },
  MXN: { locale: "es-MX", decimals: 2 },
  THB: { locale: "th-TH", decimals: 2 },
  VND: { locale: "vi-VN", decimals: 0 },
};
const fmt = (n, d = 2, cur = null) => {
  if (n == null || isNaN(n)) return "—";
  const cfg = cur ? CURRENCY_CONFIG[cur] : null;
  const locale = cfg?.locale || "en-US";
  const decimals = cfg ? cfg.decimals : d;
  return Number(n).toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};
const pct = (n) => (n != null ? `${Number(n).toFixed(1)}%` : "—");
const regionLabel = (r) => {
  const m = { CN: "China", IN: "India", US: "USA", EU: "Europe", VN: "Vietnam", JP: "Japan", KR: "S.Korea", TW: "Taiwan", TH: "Thailand", MX: "Mexico", local: "Local" };
  return m[r] || r;
};
const modeColor = (m) => {
  if (m === "exploration") return "bom-text-warn";
  if (m === "thompson_sampling") return "bom-text-info";
  return "bom-text-accent";
};
const modeLabel = (m) => {
  if (m === "exploration") return "Explore";
  if (m === "thompson_sampling") return "Thompson";
  return "Exploit";
};
const riskColor = (s) => {
  if (s >= 0.7) return "bom-text-danger";
  if (s >= 0.4) return "bom-text-warn";
  return "bom-text-accent";
};
const riskBg = (level) => {
  if (level === "HIGH") return "bom-badge-danger";
  if (level === "LOW") return "bom-badge-success";
  return "bom-badge-warn";
};

/* ── Stagger animation hook ──────────────────────────────── */
function useStagger(items, delay = 60) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (!items || items.length === 0) return;
    setVisible(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= items.length) clearInterval(iv);
    }, delay);
    return () => clearInterval(iv);
  }, [items, delay]);
  return visible;
}

/* ── Animated counter ────────────────────────────────────── */
function AnimNum({ value, prefix = "", suffix = "", duration = 1100 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const target = Number(value) || 0;
    const start = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setDisplay(start + (target - start) * ease);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <>{prefix}{fmt(display)}{suffix}</>;
}

/* ── Fade-in wrapper ─────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "", y = 16 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Shimmer bar (loading skeleton) ──────────────────────── */
function Shimmer({ w = "100%", h = 12 }) {
  return (
    <div
      className="bom-shimmer"
      style={{ width: w, height: h, borderRadius: 6 }}
    />
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                           */
/* ══════════════════════════════════════════════════════════ */

export default function BOMAnalyzer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analysisStatus, setAnalysisStatus] = useState("guest_preview");
  const [reportVisibilityLevel, setReportVisibilityLevel] = useState("preview");
  const [unlockStatus, setUnlockStatus] = useState("locked");
  const [guestBomId, setGuestBomId] = useState(null);
  const [workspaceRoute, setWorkspaceRoute] = useState(null);
  const location = useLocation();
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const demoMode = query.get("demo") === "1";

    const incomingDraft =
      location.state?.draftText ||
      localStorage.getItem("pgi_intake_draft") ||
      "";

    if (demoMode) {
      const demoDraft =
        "Demo BOM: 1,000 SMT resistors, ISO-certified supplier, 4-week lead time, preferred delivery in India. Need quotes, alternates, and RFQ-ready sourcing options.";
      setDraftText(demoDraft);
      localStorage.setItem("pgi_intake_draft", demoDraft);
      return;
    }

    if (incomingDraft) {
      setDraftText(incomingDraft);
      localStorage.setItem("pgi_intake_draft", incomingDraft);
    }
  }, [location.search, location.state]);

  // existing state...
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
  const [dragOver, setDragOver] = useState(false);

  const [report, setReport] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [bomId, setBomId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  const [expandedItem, setExpandedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const states_list = country ? Object.keys(LOCATION_DATA[country] || {}) : [];
  const cities_list = country && stateRegion ? (LOCATION_DATA[country]?.[stateRegion] || []) : [];
  const handleUniversalParsed = (res) => {
    if (!res) return;

    const nextSessionToken =
      res?.intake_session?.session_token ||
      res?.session_token ||
      sessionToken ||
      null;

    if (nextSessionToken) {
      setSessionToken(nextSessionToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("guest_session_token", nextSessionToken);
        localStorage.setItem("pgi_guest_session_token", nextSessionToken);
        localStorage.setItem("pgi_session", nextSessionToken);
      }
    }

    if (res?.bom_id || res?.intake_session?.bom_id) {
      setBomId(res?.bom_id || res?.intake_session?.bom_id);
    }

    if (res?.project_id) {
      setProjectId(res.project_id);
    }

    if (res?.analysis_status) {
      setAnalysisStatus(res.analysis_status);
    }

    if (res?.report_visibility_level) {
      setReportVisibilityLevel(res.report_visibility_level);
    }

    if (res?.unlock_status) {
      setUnlockStatus(res.unlock_status);
    }

    if (res?.workspace_route) {
      setWorkspaceRoute(res.workspace_route);
    }

    if (res?.preview || res?.parsed_summary || res?.normalized_items) {
      setPreviewData(res.preview || res);
    }
  };

  const handleUniversalSubmitted = (res) => {
    const route =
      res?.workspace_route ||
      (res?.project_id ? `/project/${res.project_id}` : null);

    if (route) {
      navigate(route, { replace: true });
    }
  };
  /* ── File handler ────────────────────────────────────── */
  const handleFile = (e) => {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!f) return;
    const ext = f.name.toLowerCase();
    if (![".csv", ".xlsx", ".xls"].some((x) => ext.endsWith(x))) {
      setError("Please upload a CSV or Excel file"); setFile(null); return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB limit"); setFile(null); return;
    }
    setFile(f); setError(null); setDragOver(false);
  };

  const handleDrop = (e) => { e.preventDefault(); handleFile(e); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  /* ── API call ─────────────────────────────────────────── */
    const startAnalysis = async () => {
    if (!file) { setError("Upload a BOM file first"); setStep(1); return; }
    if (!country || !stateRegion || !city) { setError("Complete the location fields"); return; }

    setStep(3);
    setIsProcessing(true);
    setError(null);
    setProgress("Uploading BOM file...");

    try {
      const location = `${city}, ${stateRegion}, ${country}`;
      setProgress("Running intelligence pipeline...");

      const data = await uploadBOM(file, location, currency, "cost");

      setProgress("Building report...");
      const preview = data.preview || {};
      const nextProjectId = data.project_id || preview.project_id || data.bom_id;
      const nextWorkspaceRoute = data.workspace_route || preview.workspace_route || `/project/${nextProjectId}`;

      setBomId(data.bom_id || preview.guest_bom_id || null);
      setGuestBomId(data.guest_bom_id || preview.guest_bom_id || data.bom_id || null);
      setProjectId(nextProjectId);
      setSessionToken(data.session_token || preview.session_token || null);
      setAnalysisStatus(data.analysis_status || preview.analysis_status || (preview.is_preview ? "guest_preview" : "authenticated_unlocked"));
      setReportVisibilityLevel(data.report_visibility_level || preview.report_visibility_level || (preview.is_preview ? "preview" : "full"));
      setUnlockStatus(data.unlock_status || preview.unlock_status || (preview.is_preview ? "locked" : "unlocked"));
      setWorkspaceRoute(nextWorkspaceRoute);

      if (preview.is_preview) {
        setPreviewData(preview);
        setIsProcessing(false);
        setStep(4);
      } else {
        const fullData = preview;
        setReport(fullData.analyzer_report || fullData.full_report || {});
        setStrategy(fullData.strategy || {});
        setPreviewData(null);
        setIsProcessing(false);
        setStep(6);
        navigate(nextWorkspaceRoute, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Analysis failed");
      setIsProcessing(false);
      setStep(2);
    }
   };

  /* ── Unlock ───────────────────────────────────────────── */
    const handleUnlock = async () => {
    if (!bomId) return;
    try {
      const data = await unlockBOM(bomId, sessionToken);

      const nextProjectId = data.project_id || projectId || bomId;
      const nextWorkspaceRoute = data.workspace_route || `/project/${nextProjectId}`;

      setReport(data.full_report?.analyzer || data.full_report || {});
      setStrategy(data.strategy || {});
      setPreviewData(null);
      setProjectId(nextProjectId);
      setAnalysisStatus(data.analysis_status || "authenticated_unlocked");
      setReportVisibilityLevel(data.report_visibility_level || "full");
      setUnlockStatus(data.unlock_status || "unlocked");
      setWorkspaceRoute(nextWorkspaceRoute);
      setStep(6);

      navigate(nextWorkspaceRoute, { replace: true });
    } catch (err) {
      setError(err.message || "Unlock failed — please login first");
    }
  };

  // ── Reset ─────────────────────────────────────────────── (6.5)
  const reset = () => {
    setStep(1);
    setFile(null);
    setReport(null);
    setStrategy(null);
    setPreviewData(null);
    setBomId(null);
    setGuestBomId(null);
    setProjectId(null);
    setSessionToken(null);
    setWorkspaceRoute(null);
    setAnalysisStatus("guest_preview");
    setReportVisibilityLevel("preview");
    setUnlockStatus("locked");
    setError(null);
    setCountry("");
    setStateRegion("");
    setCity("");
    setExpandedItem(null);
    setActiveTab("overview");
  };

  /* ── Derived data ────────────────────────────────────── */
  const s1 = report?.section_1_executive_summary || {};
  const s2 = report?.section_2_component_breakdown || [];
  const s3 = report?.section_3_sourcing_strategy || {};
  const s5 = report?.section_5_recommendation || {};
  const s6 = report?.section_6_learning_snapshot || {};
  const meta = report?._meta || {};

  const bd = s1.cost_breakdown || {};
  const lt = s1.lead_time || {};
  const dd = s1.decision_distribution || {};

  /* ── Category grouping ────────────────────────────────── */
  const S5_CAT_ORDER = ["standard", "electrical", "electronics", "fastener", "machined", "custom_mechanical", "sheet_metal", "raw_material", "unknown"];
  const S5_CAT_LABELS = { standard: "Standard / Catalog", electrical: "Electrical", electronics: "Electronics", fastener: "Fasteners", machined: "Machined Parts", custom_mechanical: "Custom Manufacturing", sheet_metal: "Sheet Metal", raw_material: "Raw Material", unknown: "Needs Review" };
  const S5_CAT_ICONS = { standard: "◈", electrical: "⚡", electronics: "◉", fastener: "⊕", machined: "⚙", custom_mechanical: "🔧", sheet_metal: "◆", raw_material: "◇", unknown: "?" };
  const S5_CAT_ACCENT = {
    standard: { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.15)", text: "#34d399", dot: "#34d399" },
    electrical: { bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.15)", text: "#38bdf8", dot: "#38bdf8" },
    electronics: { bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.15)", text: "#60a5fa", dot: "#60a5fa" },
    fastener: { bg: "rgba(34,211,238,0.08)", border: "rgba(34,211,238,0.15)", text: "#22d3ee", dot: "#22d3ee" },
    machined: { bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.15)", text: "#f472b6", dot: "#f472b6" },
    custom_mechanical: { bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.15)", text: "#a78bfa", dot: "#a78bfa" },
    sheet_metal: { bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.15)", text: "#818cf8", dot: "#818cf8" },
    raw_material: { bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.15)", text: "#c084fc", dot: "#c084fc" },
    unknown: { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.4)", dot: "rgba(255,255,255,0.3)" },
  };

  const groupedS2 = {};
  for (const item of s2) {
    const cat = item.category || "unknown";
    if (!groupedS2[cat]) groupedS2[cat] = [];
    groupedS2[cat].push(item);
  }

  /* ── Workflow stage + step definitions ───────────────── (6.6) */
  const workflowStage = useMemo(() => {
    if (step === 1) return 1;
    if (step === 2) return 2;
    if (isProcessing) return 3;
    if (previewData && unlockStatus !== "unlocked") return 4;
    if (unlockStatus === "unlocked" && report) return 6;
    return Math.min(step, 6);
  }, [step, isProcessing, previewData, unlockStatus, report]);

  const stepDefs = [
    { n: "Upload", icon: "↑" },
    { n: "Normalize", icon: "◎" },
    { n: "Analyze", icon: "⟳" },
    { n: "Preview", icon: "◉" },
    { n: "Unlock", icon: "🔓" },
    { n: "Workspace", icon: "✦" },
  ];

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden xl:flex w-[260px] shrink-0 flex-col border-r border-white/[0.08] bg-[#111827]">
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.08]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 font-bold">
              P
            </div>
            <div>
              <div className="text-sm font-semibold">ProcureFlow AI</div>
              <div className="text-[11px] text-white/30">BOM control tower</div>
            </div>
          </div>

          <div className="flex-1 px-3 py-4">
            <div className="space-y-1">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition text-white/55 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-50" /> Dashboard
              </button>
              <button
                onClick={() => navigate("/bom-analyzer")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition bg-violet-500/15 text-violet-300"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-50" /> BOM Management
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition text-white/55 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-50" /> Vendor Matching
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition text-white/55 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-50" /> RFQ Workflow
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition text-white/55 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-50" /> Quote Comparison
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition text-white/55 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-50" /> Collaboration
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition text-white/55 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-50" /> Order Tracking
              </button>
              <button
                onClick={() => navigate("/analytics")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition text-white/55 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-50" /> Analytics & Insights
              </button>
            </div>
          </div>

          <div className="border-t border-white/[0.08] p-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">User</p>
              <p className="mt-1 text-sm font-medium">{user?.full_name || "Guest user"}</p>
              <p className="text-xs text-white/30">{user?.email || "Not signed in"}</p>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#111827]/95 backdrop-blur-md">
            <Container className="py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 font-bold xl:hidden">
                    P
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">BOM Analyzer</h1>
                    <p className="text-sm text-white/35">
                      Upload, normalize, analyze, preview, and unlock sourcing intelligence
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-center gap-3 lg:max-w-[720px] lg:justify-center">
                  <div className="relative flex-1">
                    <input
                      value={file?.name || ""}
                      readOnly
                      placeholder="Search or select a BOM file"
                      className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 pl-11 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-500/30 transition"
                    />
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">⌕</span>
                  </div>
                  <button
                    onClick={reset}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.08]"
                  >
                    Reset
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.07]"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/analytics")}
                    className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20"
                  >
                    Analytics
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/bom-analyzer")}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium transition bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20"
                >
                  Start New Project
                </button>
                <button
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  Upload BOM (Excel/CSV)
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  Dashboard
                </button>
              </div>
            </Container>
          </header>

          <div className="bom-root">
      {/* ── Header ──────────────────────────────────── */}
      <section className="bom-hero">
        <div className="bom-hero-glow" />
        <div className="bom-hero-grid" />
        <Container className="bom-hero-inner">
          <FadeIn delay={0}>
            <div className="bom-hero-badge">
              <span className="bom-hero-dot" />
              <span>Intelligence Engine v2.0</span>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="bom-hero-title">BOM Analyzer</h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="bom-hero-sub">
              Upload your Bill of Materials. Get AI-powered sourcing decisions
              with reinforcement learning optimization across 11 global regions.
            </p>
          </FadeIn>
        </Container>
      </section>

      <Container className="bom-body">
        <UniversalIntakeBox
          className="mb-8"
          initialText={draftText}
          initialIntent="source"
          initialMode="auto"
          onParsed={handleUniversalParsed}
          onSubmitted={handleUniversalSubmitted}
        />
        {/* ── Error toast ──────────────────────────────── */}
        {error && (
          <div className="bom-error">
            <div className="bom-error-icon">!</div>
            <p className="bom-error-text">{error}</p>
            {step === 2 && (
              <button onClick={startAnalysis} className="bom-error-retry">Retry</button>
            )}
            <button onClick={() => setError(null)} className="bom-error-close">✕</button>
          </div>
        )}

        {/* ── Step indicator ───────────────────────────── (6.7) */}
        {workflowStage < 6 && (
          <FadeIn delay={200}>
            <div className="bom-steps">
              {stepDefs.map((sd, i) => {
                const s = i + 1;
                const done = workflowStage > s;
                const active = workflowStage === s;
                const future = workflowStage < s;
                return (
                  <React.Fragment key={s}>
                    <div className={`bom-step ${done ? "done" : ""} ${active ? "active" : ""} ${future ? "future" : ""}`}>
                      <div className="bom-step-circle">
                        {done ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <span className="bom-step-num">{s}</span>
                        )}
                      </div>
                      <span className="bom-step-label">{sd.n}</span>
                    </div>
                    {s < stepDefs.length && (
                      <div className={`bom-step-line ${done ? "done" : ""}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </FadeIn>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STEP 1 — File Upload                           */}
        {/* ═══════════════════════════════════════════════ */}
        {step === 1 && (
          <FadeIn delay={100} className="bom-center-col">
            <div className="bom-card bom-card-lg">
              <div className="bom-card-body">
                <div className="bom-section-header">
                  <h2 className="bom-section-title">Upload BOM File</h2>
                  <span className="bom-section-meta">CSV or Excel · up to 10 MB</span>
                </div>

                <label
                  className={`bom-dropzone ${file ? "has-file" : ""} ${dragOver ? "drag-over" : ""}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} className="bom-dropzone-input" />
                  {file ? (
                    <div className="bom-dropzone-content">
                      <div className="bom-file-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </div>
                      <p className="bom-file-name">{file.name}</p>
                      <p className="bom-file-size">{(file.size / 1024).toFixed(1)} KB · Ready to analyze</p>
                    </div>
                  ) : (
                    <div className="bom-dropzone-content">
                      <div className="bom-upload-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <p className="bom-dropzone-label">Drop your file here, or <span className="bom-dropzone-browse">browse</span></p>
                      <p className="bom-dropzone-hint">.csv  .xlsx  .xls</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <PrimaryButton onClick={() => { if (!file) { setError("Select a file"); return; } setError(null); setStep(2); }} disabled={!file} className="bom-primary-btn">
              Continue →
            </PrimaryButton>
          </FadeIn>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STEP 2 — Location + Currency                   */}
        {/* ═══════════════════════════════════════════════ */}
        {step === 2 && (
          <FadeIn delay={100} className="bom-center-col">
            <div className="bom-card bom-card-lg">
              <div className="bom-card-body">
                <div className="bom-section-header">
                  {/* 6.8 — updated heading */}
                  <h2 className="bom-section-title">Normalize Analysis Context</h2>
                  <span className="bom-section-meta">Location and currency are used to normalize the BOM before classification.</span>
                </div>

                <div className="bom-form-grid">
                  <div className="bom-field">
                    <label className="bom-label">Country</label>
                    <select value={country} onChange={(e) => { setCountry(e.target.value); setStateRegion(""); setCity(""); }} className="bom-select">
                      <option value="">Select country</option>
                      {Object.keys(LOCATION_DATA).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="bom-field">
                    <label className="bom-label">State / Region</label>
                    <select value={stateRegion} onChange={(e) => { setStateRegion(e.target.value); setCity(""); }} disabled={!country} className="bom-select">
                      <option value="">{country ? "Select region" : "—"}</option>
                      {states_list.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="bom-field">
                    <label className="bom-label">City</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!stateRegion} className="bom-select">
                      <option value="">{stateRegion ? "Select city" : "—"}</option>
                      {cities_list.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bom-field" style={{ maxWidth: 220 }}>
                  <label className="bom-label">Target Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bom-select">
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {country && stateRegion && city && (
                  <div className="bom-location-confirm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>{city}, {stateRegion}, {country} · {currency}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bom-btn-row">
              <button onClick={() => setStep(1)} className="bom-ghost-btn">← Back</button>
              <PrimaryButton onClick={startAnalysis} disabled={!country || !stateRegion || !city} className="bom-primary-btn">
                Start Analysis →
              </PrimaryButton>
            </div>
          </FadeIn>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STEP 3 — Processing                            */}
        {/* ═══════════════════════════════════════════════ */}
        {step === 3 && (
          <FadeIn delay={0} className="bom-processing">
            <div className="bom-spinner-wrap">
              <div className="bom-spinner-ring" />
              <div className="bom-spinner-ring bom-spinner-ring-2" />
              <div className="bom-spinner-core" />
            </div>
            <p className="bom-processing-label">{progress}</p>
            <p className="bom-processing-sub">{city}, {stateRegion}, {country}</p>
            <div className="bom-processing-dots">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bom-processing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </FadeIn>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STEP 4 — Guest Preview                         */}
        {/* ═══════════════════════════════════════════════ */}
        {step === 4 && previewData && (
          <div className="bom-report-wrap">
            {/* Success header */}
            <FadeIn delay={0}>
              <div className="bom-success-header">
                <div className="bom-success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="bom-report-title">Analysis Complete</h2>
                <p className="bom-report-sub">
                  {previewData.total_parts} parts analyzed across {Object.keys(previewData.categories || {}).filter(k => (previewData.categories||{})[k] > 0).length} categories
                </p>
              </div>
            </FadeIn>

            {/* KPI row */}
            <FadeIn delay={100}>
              <div className="bom-kpi-grid bom-kpi-4">
                {[
                  { label: "Est. Cost", value: `${currency} ${fmt(previewData.total_cost)}`, sub: previewData.cost_range ? `${currency} ${fmt(previewData.cost_range?.[0] || previewData.cost_range?.min)} – ${fmt(previewData.cost_range?.[1] || previewData.cost_range?.max)}` : null },
                  { label: "Lead Time", value: `${previewData.lead_time?.min_days || previewData.lead_time?.avg_days || "—"}–${previewData.lead_time?.max_days || "—"}`, suffix: "days" },
                  { label: "Savings", value: previewData.savings_percent ? `${previewData.savings_percent}%` : "—", sub: "vs all-local sourcing", accent: true },
                  { label: "Risk", badge: previewData.risk_level || "MEDIUM" },
                ].map((kpi, i) => (
                  <div key={i} className="bom-kpi-card">
                    <span className="bom-kpi-label">{kpi.label}</span>
                    {kpi.badge ? (
                      <span className={`bom-kpi-badge ${riskBg(kpi.badge)}`}>{kpi.badge}</span>
                    ) : (
                      <span className={`bom-kpi-value ${kpi.accent ? "accent" : ""}`}>{kpi.value}{kpi.suffix && <span className="bom-kpi-suffix">{kpi.suffix}</span>}</span>
                    )}
                    {kpi.sub && <span className="bom-kpi-sub">{kpi.sub}</span>}
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Category pills */}
            {previewData.categories && Object.keys(previewData.categories).length > 0 && (
              <FadeIn delay={180}>
                <div className="bom-cat-pills">
                  <span className="bom-cat-pills-label">Categories</span>
                  {Object.entries(previewData.categories).filter(([,v]) => v > 0).map(([cat, count]) => (
                    <span key={cat} className="bom-cat-pill">{cat.replace("_", " ")} <b>{count}</b></span>
                  ))}
                </div>
              </FadeIn>
            )}

            {/* Component table preview */}
            {previewData.visible_parts?.length > 0 && (
              <FadeIn delay={260}>
                <div className="bom-card">
                  <div className="bom-card-body">
                    <div className="bom-table-header">
                      <span className="bom-table-title">Component Breakdown</span>
                      <span className="bom-table-meta">{previewData.visible_parts.length} of {previewData.total_parts} shown</span>
                    </div>

                    <div className="bom-table">
                      <div className="bom-table-head">
                        <span className="bom-th" style={{ flex: 3 }}>Part</span>
                        <span className="bom-th" style={{ flex: 1.5 }}>Category</span>
                        <span className="bom-th bom-th-right" style={{ flex: 0.8 }}>Qty</span>
                        <span className="bom-th" style={{ flex: 1.2 }}>Region</span>
                        <span className="bom-th" style={{ flex: 1 }}>Process</span>
                        <span className="bom-th bom-th-right" style={{ flex: 1.5 }}>Est. Cost</span>
                      </div>
                      {previewData.visible_parts.map((part, i) => (
                        <div key={i} className="bom-table-row" style={{ animationDelay: `${i * 60}ms` }}>
                          <span className="bom-td bom-td-name" style={{ flex: 3 }} title={part.part_name}>{part.part_name}</span>
                          <span className="bom-td bom-td-cat" style={{ flex: 1.5 }}>{part.category?.replace("_", " ")}</span>
                          <span className="bom-td bom-td-mono bom-td-right" style={{ flex: 0.8 }}>{part.quantity}</span>
                          <span className="bom-td" style={{ flex: 1.2 }}>{part.best_region}</span>
                          <span className="bom-td bom-td-dim" style={{ flex: 1 }}>{part.process}</span>
                          <span className="bom-td bom-td-mono bom-td-right bom-td-cost" style={{ flex: 1.5 }}>{currency} {fmt(part.best_cost)}</span>
                        </div>
                      ))}

                      {/* Locked rows */}
                      {previewData.locked_parts_count > 0 && (
                        <div className="bom-locked-overlay">
                          {[1, 2].map(i => (
                            <div key={i} className="bom-table-row bom-locked-row">
                              <span className="bom-td" style={{ flex: 3 }}>████████ ██████</span>
                              <span className="bom-td" style={{ flex: 1.5 }}>██████</span>
                              <span className="bom-td" style={{ flex: 0.8 }}>███</span>
                              <span className="bom-td" style={{ flex: 1.2 }}>█████</span>
                              <span className="bom-td" style={{ flex: 1 }}>███</span>
                              <span className="bom-td" style={{ flex: 1.5 }}>███.██</span>
                            </div>
                          ))}
                          <div className="bom-locked-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                            <span>+{previewData.locked_parts_count} more parts — sign up to unlock</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Insights + Regions */}
            <FadeIn delay={340}>
              <div className="bom-split-grid">
                {previewData.basic_processes?.length > 0 && (
                  <div className="bom-card">
                    <div className="bom-card-body">
                      <span className="bom-card-label">Strategy Insights</span>
                      <div className="bom-insights-list">
                        {previewData.basic_processes.map((reason, i) => (
                          <div key={i} className="bom-insight-item">
                            <span className="bom-insight-dot" />
                            <p>{reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {previewData.region_distribution && Object.keys(previewData.region_distribution).length > 0 && (
                  <div className="bom-card">
                    <div className="bom-card-body">
                      <span className="bom-card-label">Sourcing Regions</span>
                      <div className="bom-regions-list">
                        {Object.entries(previewData.region_distribution).sort((a, b) => b[1] - a[1]).map(([region, pctVal]) => (
                          <div key={region} className="bom-region-row">
                            <span className="bom-region-name">{region}</span>
                            <div className="bom-region-bar-wrap">
                              <div className="bom-region-bar" style={{ width: `${Math.min(pctVal, 100)}%` }} />
                            </div>
                            <span className="bom-region-pct">{typeof pctVal === "number" ? pctVal.toFixed(0) : pctVal}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Decision summary */}
            {previewData.decision_summary && (
              <FadeIn delay={400}>
                <div className="bom-card">
                  <div className="bom-card-body">
                    <span className="bom-card-label">AI Recommendation</span>
                    <p className="bom-recommendation-text">{previewData.decision_summary}</p>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Unlock CTA */}
            <FadeIn delay={480}>
              <div className="bom-cta-card">
                <div className="bom-cta-bg" />
                <div className="bom-cta-content">
                  <h3 className="bom-cta-title">Get the Full Report</h3>
                  <p className="bom-cta-desc">
                    Unlock detailed per-component sourcing, vendor selection,
                    procurement plan, and downloadable cost optimization report.
                  </p>
                  <div className="bom-cta-actions">
                    {user ? (
                      <button onClick={handleUnlock} className="bom-cta-btn">Unlock & Continue to Workspace</button>
                    ) : (
                      <>
                        <a href="/register" className="bom-cta-btn">Create Free Account</a>
                        <a href="/login" className="bom-cta-link">Already have an account? Login</a>
                      </>
                    )}
                  </div>
                  <div className="bom-cta-features">
                    {["All " + previewData.total_parts + " components", "Vendor selection", "Procurement plan", "Cost optimization", "RFQ generation"].map((f, i) => (
                      <span key={i} className="bom-cta-feature">✓ {f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="bom-center-row">
              <button onClick={reset} className="bom-ghost-btn">← Analyze Another BOM</button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STEP 5 — Full Report                           */}
        {/* ═══════════════════════════════════════════════ */}
        {step === 5 && report && (
          <div className="bom-report-wrap">
            {/* Report header */}
            <FadeIn delay={0}>
              <div className="bom-report-header">
                <div>
                  <h2 className="bom-report-title" style={{ textAlign: "left" }}>Analysis Report</h2>
                  <p className="bom-report-sub" style={{ textAlign: "left" }}>
                    {meta.items} items · {meta.candidates} candidates · {meta.total_time_s}s
                    {bomId && <span className="bom-report-id"> · ID: {bomId.slice(0, 8)}</span>}
                  </p>
                </div>
                <div className="bom-report-actions">
                  {/* 6.10 — replaced <a> with navigate button */}
                  {bomId && user && (
                    <button
                      onClick={() => navigate(workspaceRoute || `/project/${projectId || bomId}`, { replace: true })}
                      className="bom-accent-btn"
                    >
                      Open Workspace →
                    </button>
                  )}
                  <button onClick={reset} className="bom-ghost-btn bom-ghost-btn-sm">New Analysis</button>
                </div>
              </div>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={80}>
              <div className="bom-tabs">
                {[
                  ["overview", "Overview"],
                  ["components", "Components"],
                  ["strategy", "Strategy"],
                  ["learning", "Learning"],
                ].map(([id, label]) => (
                  <button key={id} onClick={() => setActiveTab(id)} className={`bom-tab ${activeTab === id ? "active" : ""}`}>
                    {label}
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* ── TAB: Overview ──────────────────────────── */}
            {activeTab === "overview" && (
              <div className="bom-tab-content">
                <FadeIn delay={100}>
                  <div className="bom-kpi-grid bom-kpi-4">
                    {[
                      { label: "Total Cost", value: <AnimNum value={s1.total_cost} prefix={currency + " "} />, sub: `${pct(s1.optimization?.cost_savings_pct)} savings` },
                      { label: "Lead Time", value: `${lt.min_days}–${lt.max_days}d`, sub: `Expected ${lt.expected_days} days` },
                      { label: "Risk Score", value: <span className={riskColor(s1.risk_score)}>{fmt(s1.risk_score, 3)}</span>, sub: `${s2.length} items analyzed` },
                      { label: "Engine", value: `${meta.total_time_s || 0}s`, sub: `${meta.candidates || 0} candidates` },
                    ].map((kpi, i) => (
                      <div key={i} className="bom-kpi-card">
                        <span className="bom-kpi-label">{kpi.label}</span>
                        <span className="bom-kpi-value">{kpi.value}</span>
                        <span className="bom-kpi-sub">{kpi.sub}</span>
                      </div>
                    ))}
                  </div>
                </FadeIn>

                {/* Cost breakdown */}
                <FadeIn delay={200}>
                  <div className="bom-card">
                    <div className="bom-card-body">
                      <span className="bom-card-label">Cost Breakdown</span>
                      <div className="bom-cost-bars">
                        {[
                          { label: "Manufacturing", value: bd.manufacturing, color: "#34d399" },
                          { label: "Logistics", value: bd.logistics, color: "#38bdf8" },
                          { label: "Tariffs & Duties", value: bd.tariffs, color: "#818cf8" },
                          { label: "NRE / Tooling", value: bd.nre, color: "#a78bfa" },
                          { label: "Material", value: bd.material, color: "#f87171" },
                        ].map((row, i) => {
                          const total = s1.total_cost || 1;
                          const w = Math.max(2, ((row.value || 0) / total) * 100);
                          return (
                            <div key={i} className="bom-cost-row">
                              <span className="bom-cost-label">{row.label}</span>
                              <div className="bom-cost-track">
                                <div className="bom-cost-fill" style={{ width: `${w}%`, background: row.color, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
                              </div>
                              <span className="bom-cost-val">{currency} {fmt(row.value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={300}>
                  <div className="bom-split-grid">
                    <div className="bom-card">
                      <div className="bom-card-body">
                        <span className="bom-card-label">Decision Distribution</span>
                        <div className="bom-decision-bar-wrap">
                          <div className="bom-decision-bar">
                            <div className="bom-decision-exploit" style={{ width: `${dd.exploitation_pct || 0}%` }} />
                            <div className="bom-decision-explore" style={{ width: `${dd.exploration_pct || 0}%` }} />
                          </div>
                          <div className="bom-decision-legend">
                            <span className="bom-legend-exploit">Exploit {pct(dd.exploitation_pct)}</span>
                            <span className="bom-legend-explore">Explore {pct(dd.exploration_pct)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bom-card">
                      <div className="bom-card-body">
                        <span className="bom-card-label">Recommendation</span>
                        <p className="bom-recommendation-text">{s5.plan || "—"}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            )}

            {/* ── TAB: Components ────────────────────────── */}
            {activeTab === "components" && (
              <div className="bom-tab-content">
                <FadeIn delay={60}>
                  <div className="bom-cat-pills" style={{ marginBottom: 24 }}>
                    <span className="bom-cat-pills-label">{s2.length} components</span>
                    {S5_CAT_ORDER.filter(c => groupedS2[c]?.length > 0).map(c => {
                      const a = S5_CAT_ACCENT[c];
                      return (
                        <span key={c} className="bom-cat-pill-rich" style={{ background: a.bg, borderColor: a.border, color: a.text }}>
                          <span style={{ opacity: 0.7 }}>{S5_CAT_ICONS[c]}</span> {S5_CAT_LABELS[c]} <b>{groupedS2[c].length}</b>
                        </span>
                      );
                    })}
                  </div>
                </FadeIn>

                {S5_CAT_ORDER.filter(cat => groupedS2[cat]?.length > 0).map((cat, catIdx) => {
                  const a = S5_CAT_ACCENT[cat];
                  return (
                    <FadeIn key={cat} delay={100 + catIdx * 80}>
                      <div className="bom-comp-group">
                        <div className="bom-comp-group-header">
                          <span className="bom-comp-group-dot" style={{ background: a.dot }} />
                          <h3 className="bom-comp-group-title">{S5_CAT_LABELS[cat]}</h3>
                          <span className="bom-comp-group-count">{groupedS2[cat].length}</span>
                        </div>
                        <div className="bom-comp-list">
                          {groupedS2[cat].map((item) => {
                            const globalIdx = s2.indexOf(item);
                            const v = item.selected_vendor || {};
                            const tlcB = v.tlc_breakdown || {};
                            const exp = item.explanation || {};
                            const alts = item.alternatives || [];
                            const open = expandedItem === globalIdx;
                            return (
                              <div key={globalIdx} className={`bom-comp-card ${open ? "expanded" : ""}`}>
                                <button onClick={() => setExpandedItem(open ? null : globalIdx)} className="bom-comp-summary">
                                  <div className="bom-comp-icon" style={{ background: a.bg, color: a.text, borderColor: a.border }}>
                                    {S5_CAT_ICONS[cat]}
                                  </div>
                                  <div className="bom-comp-info">
                                    <p className="bom-comp-name">{item.description}</p>
                                    <p className="bom-comp-meta">Q: {item.quantity} · {regionLabel(v.region)} · {v.transport_mode || ""}</p>
                                  </div>
                                  <div className="bom-comp-cost">
                                    <p className="bom-comp-cost-val">{v.simulated_tlc ? `${currency} ${fmt(v.simulated_tlc)}` : "RFQ"}</p>
                                    <p className={`bom-comp-mode ${modeColor(item.decision_mode)}`}>{modeLabel(item.decision_mode)}</p>
                                  </div>
                                  <span className={`bom-comp-chevron ${open ? "open" : ""}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                                  </span>
                                </button>

                                {open && (
                                  <div className="bom-comp-detail">
                                    {/* Price Source & Freshness */}
                                    <div className="bom-detail-section">
                                      <span className="bom-detail-label">Price Source</span>
                                      <div className="bom-detail-grid">
                                        {[
                                          ["Source", item.price_source || "estimated"],
                                          ["Unit Price", item.unit_price != null ? `${currency} ${fmt(item.unit_price, 2, currency)}` : "RFQ"],
                                          ["Region", (v.region || "—")],
                                          ["Category", (item.category || "—").replace("_", " ")],
                                        ].map(([l, val], j) => (
                                          <div key={j} className="bom-detail-cell">
                                            <span className="bom-detail-cell-label">{l}</span>
                                            <span className="bom-detail-cell-val">{val}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {/* Source vs display currency indicator */}
                                      {currency !== "USD" && item.price_source && item.price_source !== "custom_rfq_required" && (
                                        <p className="bom-currency-note">
                                          Prices sourced in USD · displayed in {currency}
                                        </p>
                                      )}
                                    </div>

                                    <div className="bom-detail-section">
                                      <span className="bom-detail-label">TLC Breakdown</span>
                                      <div className="bom-detail-grid">
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
                                          <div key={j} className="bom-detail-cell">
                                            <span className="bom-detail-cell-label">{l}</span>
                                            <span className="bom-detail-cell-val">{val}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="bom-detail-section">
                                      <span className="bom-detail-label">Decision Logic</span>
                                      <div className="bom-code-block">
                                        <p>{exp.math?.ucb || "—"}</p>
                                        <p className="bom-code-dim">{exp.math?.tlc || "—"}</p>
                                      </div>
                                    </div>

                                    <div className="bom-detail-section">
                                      <span className="bom-detail-label">Risk Factors</span>
                                      <div className="bom-risk-pills">
                                        {[
                                          ["Supply", exp.risk?.supply],
                                          ["Logistics", exp.risk?.logistics],
                                          ["Cost Vol.", exp.risk?.cost_volatility],
                                          ["Quality", exp.risk?.quality],
                                        ].map(([l, val], j) => (
                                          <div key={j} className="bom-risk-pill">
                                            <span className="bom-risk-pill-label">{l}</span>
                                            <span className={`bom-risk-pill-val ${riskColor(val || 0)}`}>{fmt(val, 3)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {alts.length > 0 && (
                                      <div className="bom-detail-section">
                                        <span className="bom-detail-label">Alternatives</span>
                                        <div className="bom-alts-list">
                                          {alts.map((al, j) => (
                                            <div key={j} className="bom-alt-row">
                                              <span>{al.supplier_name} · {regionLabel(al.region)}</span>
                                              <span className="bom-alt-cost">{currency} {fmt(al.simulated_tlc)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {v.process_chain && v.process_chain.length > 0 && (
                                      <div className="bom-detail-section">
                                        <span className="bom-detail-label">Process Chain</span>
                                        <div className="bom-process-chain">
                                          {v.process_chain.map((p, j) => (
                                            <React.Fragment key={j}>
                                              <span className="bom-process-tag">{p}</span>
                                              {j < v.process_chain.length - 1 && <span className="bom-process-arrow">→</span>}
                                            </React.Fragment>
                                          ))}
                                        </div>
                                        {v.machining_time_hrs > 0 && (
                                          <p className="bom-process-meta">Machining: {fmt(v.machining_time_hrs)}h · Labor: {fmt(v.labor_hours)}h</p>
                                        )}
                                      </div>
                                    )}

                                    {/* RFQ Actions for custom parts */}
                                    {(cat === "machined" || cat === "custom_mechanical" || cat === "sheet_metal" || cat === "raw_material" || item.decision_mode === "exploration") && (
                                      <div className="bom-detail-section">
                                        <span className="bom-detail-label">Actions</span>
                                        <div className="bom-rfq-actions">
                                          {bomId && user ? (
                                            <>
                                              <button
                                                className="bom-rfq-btn"
                                                onClick={(e) => { e.stopPropagation(); window.location.href = `/project/${projectId || bomId}`; }}
                                              >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                Request Quote
                                              </button>
                                              <button
                                                className="bom-rfq-btn bom-rfq-btn-secondary"
                                                onClick={(e) => { e.stopPropagation(); window.location.href = `/project/${projectId || bomId}`; }}
                                              >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                                Upload Drawing
                                              </button>
                                            </>
                                          ) : (
                                            <a href="/register" className="bom-rfq-btn">Sign Up to Request Quote</a>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            )}

            {/* ── TAB: Strategy ──────────────────────────── */}
            {activeTab === "strategy" && (
              <div className="bom-tab-content">
                <FadeIn delay={100}>
                  <div className="bom-card">
                    <div className="bom-card-body">
                      <span className="bom-card-label">Volume Strategy</span>
                      <div className="bom-strat-list">
                        {(s3.volume_strategy || []).map((v, i) => (
                          <div key={i} className="bom-strat-row">
                            <span className={`bom-strat-type ${v.type === "high" ? "high" : v.type === "medium" ? "med" : "low"}`}>{v.type}</span>
                            <span className="bom-strat-item">{v.item}</span>
                            <span className="bom-strat-qty">Q: {v.qty}</span>
                            <span className="bom-strat-region">{regionLabel(v.region)}</span>
                            <span className="bom-strat-cost">{currency} {fmt(v.tlc)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {(s3.process_summary || []).length > 0 && (
                  <FadeIn delay={200}>
                    <div className="bom-card">
                      <div className="bom-card-body">
                        <span className="bom-card-label">Custom Manufacturing</span>
                        {(s3.process_summary || []).map((p, i) => (
                          <div key={i} className="bom-mfg-item">
                            <p className="bom-mfg-name">{p.item}</p>
                            <div className="bom-mfg-meta">
                              <span>Form: {p.material_form}</span>
                              <span>Machining: {fmt(p.machining_hrs)}h</span>
                              <span>Labor: {fmt(p.labor_hrs)}h</span>
                            </div>
                            <div className="bom-process-chain" style={{ marginTop: 8 }}>
                              {(p.process_chain || []).map((proc, j) => (
                                <React.Fragment key={j}>
                                  <span className="bom-process-tag">{proc}</span>
                                  {j < (p.process_chain || []).length - 1 && <span className="bom-process-arrow">→</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )}

                {(s3.risk_insights || []).length > 0 && (
                  <FadeIn delay={300}>
                    <div className="bom-card">
                      <div className="bom-card-body">
                        <span className="bom-card-label">Risk Alerts</span>
                        {(s3.risk_insights || []).map((r, i) => (
                          <div key={i} className="bom-risk-alert">
                            <span className="bom-risk-alert-icon">⚠</span>
                            <span className="bom-risk-alert-item">{r.item}</span>
                            <span className="bom-risk-alert-sep">·</span>
                            <span className="bom-risk-alert-supplier">{r.supplier}</span>
                            <span className="bom-risk-alert-var">var: {fmt(r.variance, 3)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )}
              </div>
            )}

            {/* ── TAB: Learning ──────────────────────────── */}
            {activeTab === "learning" && (
              <div className="bom-tab-content">
                <FadeIn delay={100}>
                  <div className="bom-kpi-grid bom-kpi-3">
                    {[
                      { label: "System Confidence", value: fmt(s6.system_confidence, 3) },
                      { label: "Exploration Rate", value: fmt(s6.exploration_rate, 4) },
                      { label: "Total Iterations", value: s6.total_iterations },
                    ].map((kpi, i) => (
                      <div key={i} className="bom-kpi-card">
                        <span className="bom-kpi-label">{kpi.label}</span>
                        <span className="bom-kpi-value">{kpi.value}</span>
                      </div>
                    ))}
                  </div>
                </FadeIn>

                {(s6.exploration_decisions || []).length > 0 && (
                  <FadeIn delay={200}>
                    <div className="bom-card">
                      <div className="bom-card-body">
                        <span className="bom-card-label">Exploration Decisions</span>
                        {s6.exploration_decisions.map((d, i) => (
                          <div key={i} className="bom-learn-row bom-learn-explore">
                            <span className="bom-learn-item">{d.item}</span>
                            <span className="bom-learn-supplier">{d.supplier}</span>
                            <span className="bom-learn-gain">gain: {fmt(d.info_gain, 3)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )}

                {(s6.high_uncertainty || []).length > 0 && (
                  <FadeIn delay={300}>
                    <div className="bom-card">
                      <div className="bom-card-body">
                        <span className="bom-card-label">High Uncertainty Items</span>
                        {s6.high_uncertainty.map((h, i) => (
                          <div key={i} className="bom-learn-row">
                            <span className="bom-learn-item">{h.item}</span>
                            <span className={`bom-learn-uncertainty ${riskColor(h.uncertainty)}`}>{fmt(h.uncertainty, 3)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )}

                <FadeIn delay={400}>
                  <div className="bom-card">
                    <div className="bom-card-body">
                      <p className="bom-note">{s6.note}</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            )}

            {/* Bottom */}
            <FadeIn delay={100}>
              <div className="bom-center-row" style={{ paddingTop: 16 }}>
                <button onClick={reset} className="bom-ghost-btn">← Analyze Another BOM</button>
              </div>
            </FadeIn>
          </div>
        )}
      </Container>

      {/* ═══════════════════════════════════════════════════ */}
      {/* STYLES                                             */}
      {/* ═══════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');

        /* ── Root ────────────────────────────────────── */
        .bom-root {
          --bg: #06060a;
          --surface: #111827;
          --surface-2: #172033;
          --surface-3: #121a2a;
          --border: rgba(255,255,255,0.06);
          --border-2: rgba(255,255,255,0.09);
          --accent: #8b5cf6;
          --accent-dim: rgba(139,92,246,0.12);
          --accent-glow: rgba(139,92,246,0.06);
          --text: rgba(255,255,255,0.92);
          --text-2: rgba(255,255,255,0.55);
          --text-3: rgba(255,255,255,0.30);
          --text-4: rgba(255,255,255,0.16);
          --danger: #f87171;
          --warn: #818cf8;
          --info: #38bdf8;
          --radius: 14px;
          --radius-sm: 10px;
          --radius-xs: 7px;
          --font: 'DM Sans', -apple-system, sans-serif;
          --mono: 'JetBrains Mono', 'SF Mono', monospace;
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
        }

        /* ── Semantic text classes ────────────────────── */
        .bom-text-accent { color: var(--accent) !important; }
        .bom-text-warn   { color: var(--warn) !important; }
        .bom-text-info   { color: var(--info) !important; }
        .bom-text-danger { color: var(--danger) !important; }

        .bom-badge-danger  { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.18); }
        .bom-badge-success { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.18); }
        .bom-badge-warn    { background: rgba(129,140,248,0.1); color: #818cf8; border: 1px solid rgba(129,140,248,0.18); }

        /* ── Hero ────────────────────────────────────── */
        .bom-hero {
          position: relative;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .bom-hero-glow {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .bom-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 60% 80% at 50% 40%, black, transparent);
          pointer-events: none;
        }
        .bom-hero-inner {
          position: relative;
          padding: 64px 0 56px;
          text-align: center;
        }
        .bom-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 100px;
          background: var(--accent-dim);
          border: 1px solid rgba(139,92,246,0.18);
          margin-bottom: 24px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .bom-hero-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: bom-pulse 2s ease infinite;
        }
        .bom-hero-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          color: white;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }
        .bom-hero-sub {
          margin-top: 14px;
          font-size: 15px;
          color: var(--text-2);
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        /* ── Body ────────────────────────────────────── */
        .bom-body { padding: 40px 0 60px; }

        /* ── Cards ───────────────────────────────────── */
        .bom-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .bom-card:hover {
          border-color: var(--border-2);
        }
        .bom-card-lg { max-width: 640px; margin: 0 auto; }
        .bom-card-body { padding: 24px 28px; }

        .bom-card-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-3);
          margin-bottom: 16px;
        }

        /* ── Section header ──────────────────────────── */
        .bom-section-header { margin-bottom: 24px; }
        .bom-section-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.01em;
        }
        .bom-section-meta {
          display: block;
          font-size: 13px;
          color: var(--text-3);
          margin-top: 4px;
        }

        /* ── Center col / row ────────────────────────── */
        .bom-center-col {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .bom-center-row {
          display: flex;
          justify-content: center;
        }

        /* ── Error ───────────────────────────────────── */
        .bom-error {
          max-width: 640px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: rgba(248,113,113,0.06);
          border: 1px solid rgba(248,113,113,0.15);
          border-radius: var(--radius-sm);
        }
        .bom-error-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(248,113,113,0.15);
          color: var(--danger);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .bom-error-text { flex: 1; font-size: 13px; color: #fca5a5; }
        .bom-error-retry {
          padding: 5px 14px;
          border-radius: 6px;
          background: rgba(248,113,113,0.12);
          border: 1px solid rgba(248,113,113,0.2);
          color: #fca5a5;
          font-family: var(--font);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .bom-error-retry:hover { background: rgba(248,113,113,0.2); }
        .bom-error-close {
          background: none;
          border: none;
          color: var(--text-3);
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
        }

        /* ── Steps ───────────────────────────────────── */
        .bom-steps {
          max-width: 560px;
          margin: 0 auto 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bom-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .bom-step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          border: 1.5px solid transparent;
        }
        .bom-step.done .bom-step-circle {
          background: var(--accent);
          color: white;
          box-shadow: 0 0 20px rgba(139,92,246,0.25);
        }
        .bom-step.active .bom-step-circle {
          background: var(--accent);
          color: white;
          box-shadow: 0 0 24px rgba(139,92,246,0.3);
          transform: scale(1.08);
        }
        .bom-step.future .bom-step-circle {
          background: var(--surface-2);
          color: var(--text-3);
          border-color: var(--border);
        }
        .bom-step-num { font-size: 13px; }
        .bom-step-label {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          transition: color 0.3s;
        }
        .bom-step.done .bom-step-label,
        .bom-step.active .bom-step-label { color: var(--text-2); }
        .bom-step.future .bom-step-label { color: var(--text-4); }

        .bom-step-line {
          flex: 1;
          height: 1.5px;
          margin: 0 10px;
          margin-top: -18px;
          background: var(--border);
          transition: background 0.5s;
          border-radius: 1px;
        }
        .bom-step-line.done {
          background: linear-gradient(90deg, var(--accent), rgba(139,92,246,0.3));
        }

        /* ── Dropzone ────────────────────────────────── */
        .bom-dropzone {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          border: 2px dashed var(--border-2);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          background: transparent;
        }
        .bom-dropzone:hover {
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.015);
        }
        .bom-dropzone.drag-over {
          border-color: var(--accent);
          background: var(--accent-glow);
          transform: scale(1.01);
        }
        .bom-dropzone.has-file {
          border-color: rgba(139,92,246,0.35);
          background: rgba(139,92,246,0.03);
        }
        .bom-dropzone-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }
        .bom-dropzone-content { text-align: center; }
        .bom-upload-icon {
          margin: 0 auto 12px;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-3);
          transition: all 0.3s;
        }
        .bom-dropzone:hover .bom-upload-icon {
          color: var(--text-2);
          border-color: var(--border-2);
          transform: translateY(-2px);
        }
        .bom-file-icon {
          margin: 0 auto 10px;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--accent-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }
        .bom-dropzone-label { font-size: 14px; color: var(--text-2); }
        .bom-dropzone-browse { color: var(--accent); font-weight: 600; }
        .bom-dropzone-hint { font-size: 12px; color: var(--text-3); margin-top: 4px; letter-spacing: 0.04em; }
        .bom-file-name { font-size: 14px; color: var(--accent); font-weight: 600; }
        .bom-file-size { font-size: 12px; color: var(--text-3); margin-top: 3px; }

        /* ── Forms ───────────────────────────────────── */
        .bom-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }
        .bom-field { display: flex; flex-direction: column; gap: 6px; }
        .bom-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-3);
          letter-spacing: 0.04em;
        }
        .bom-select {
          width: 100%;
          padding: 10px 36px 10px 14px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          color: var(--text);
          font-family: var(--font);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          appearance: none;
          background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.3)%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22/%3e%3c/svg%3e');
          background-size: 14px;
          background-position: right 12px center;
          background-repeat: no-repeat;
        }
        .bom-select:focus {
          outline: none;
          border-color: rgba(139,92,246,0.4);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.08);
        }
        .bom-select:disabled { opacity: 0.35; cursor: not-allowed; }
        .bom-select option { background: var(--surface-2); }

        .bom-location-confirm {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(139,92,246,0.05);
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: var(--radius-xs);
          color: var(--accent);
          font-size: 13px;
          font-weight: 500;
          margin-top: 4px;
        }

        /* ── Buttons ─────────────────────────────────── */
        .bom-btn-row { display: flex; gap: 10px; }
        .bom-ghost-btn {
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-2);
          font-family: var(--font);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .bom-ghost-btn:hover { background: var(--surface-3); color: var(--text); }
        .bom-ghost-btn-sm { padding: 7px 14px; font-size: 12px; }

        .bom-accent-btn {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: var(--radius-xs);
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.18);
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          font-family: var(--font);
          transition: all 0.2s;
        }
        .bom-accent-btn:hover { background: rgba(139,92,246,0.16); }

        /* ── Processing ──────────────────────────────── */
        .bom-processing {
          text-align: center;
          padding: 80px 0;
        }
        .bom-spinner-wrap {
          position: relative;
          width: 72px;
          height: 72px;
          margin: 0 auto 32px;
        }
        .bom-spinner-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2.5px solid rgba(139,92,246,0.1);
          border-top-color: var(--accent);
          animation: bom-spin 1s linear infinite;
        }
        .bom-spinner-ring-2 {
          inset: 6px;
          border-top-color: transparent;
          border-right-color: rgba(139,92,246,0.4);
          animation-duration: 1.6s;
          animation-direction: reverse;
        }
        .bom-spinner-core {
          position: absolute;
          inset: 16px;
          border-radius: 50%;
          background: var(--accent-dim);
          animation: bom-pulse 2s ease infinite;
        }
        .bom-processing-label {
          font-size: 18px;
          font-weight: 600;
          color: white;
        }
        .bom-processing-sub {
          font-size: 13px;
          color: var(--text-3);
          margin-top: 6px;
        }
        .bom-processing-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 24px;
        }
        .bom-processing-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          animation: bom-pulse 1.4s ease infinite;
        }

        /* ── Report wrap ─────────────────────────────── */
        .bom-report-wrap {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Success header ──────────────────────────── */
        .bom-success-header { text-align: center; margin-bottom: 8px; }
        .bom-success-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: var(--accent-dim);
          border: 1px solid rgba(139,92,246,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }
        .bom-report-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
          text-align: center;
          letter-spacing: -0.02em;
        }
        .bom-report-sub {
          font-size: 13px;
          color: var(--text-3);
          text-align: center;
          margin-top: 4px;
        }
        .bom-report-id { color: var(--text-4); }

        /* ── Report header bar ───────────────────────── */
        .bom-report-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .bom-report-actions { display: flex; gap: 8px; }

        /* ── KPI cards ───────────────────────────────── */
        .bom-kpi-grid { display: grid; gap: 14px; }
        .bom-kpi-4 { grid-template-columns: repeat(4, 1fr); }
        .bom-kpi-3 { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 640px) {
          .bom-kpi-4 { grid-template-columns: repeat(2, 1fr); }
          .bom-kpi-3 { grid-template-columns: repeat(1, 1fr); }
        }
        .bom-kpi-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 0.25s, transform 0.25s;
        }
        .bom-kpi-card:hover {
          border-color: var(--border-2);
          transform: translateY(-1px);
        }
        .bom-kpi-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-3);
        }
        .bom-kpi-value {
          font-size: 22px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
          font-family: var(--font);
        }
        .bom-kpi-value.accent { color: var(--accent); }
        .bom-kpi-suffix {
          font-size: 13px;
          font-weight: 400;
          color: var(--text-3);
          margin-left: 2px;
        }
        .bom-kpi-sub { font-size: 11px; color: var(--text-3); }
        .bom-kpi-badge {
          display: inline-flex;
          align-self: flex-start;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.03em;
        }

        /* ── Category pills ──────────────────────────── */
        .bom-cat-pills {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        .bom-cat-pills-label {
          font-size: 11px;
          color: var(--text-3);
          margin-right: 4px;
        }
        .bom-cat-pill {
          padding: 4px 12px;
          border-radius: 100px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          font-size: 11px;
          font-weight: 500;
          color: var(--text-2);
          text-transform: capitalize;
        }
        .bom-cat-pill b { color: var(--text); margin-left: 3px; }
        .bom-cat-pill-rich {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 500;
        }
        .bom-cat-pill-rich b { margin-left: 2px; }

        /* ── Tables ──────────────────────────────────── */
        .bom-table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .bom-table-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-3);
        }
        .bom-table-meta { font-size: 10px; color: var(--text-4); }
        .bom-table { width: 100%; }
        .bom-table-head {
          display: flex;
          align-items: center;
          padding: 0 12px 10px;
          border-bottom: 1px solid var(--border);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-4);
        }
        .bom-th { min-width: 0; }
        .bom-th-right { text-align: right; }
        .bom-table-row {
          display: flex;
          align-items: center;
          padding: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.15s;
          animation: bom-rowIn 0.4s ease both;
        }
        .bom-table-row:hover { background: rgba(255,255,255,0.015); }
        .bom-td { min-width: 0; font-size: 13px; color: var(--text-2); }
        .bom-td-name { color: var(--text); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bom-td-cat { font-size: 11px; font-weight: 500; color: var(--text-3); text-transform: capitalize; }
        .bom-td-mono { font-family: var(--mono); font-size: 12px; }
        .bom-td-right { text-align: right; }
        .bom-td-dim { font-size: 11px; color: var(--text-3); }
        .bom-td-cost { color: white; font-weight: 500; }

        /* ── Locked overlay ──────────────────────────── */
        .bom-locked-overlay { position: relative; }
        .bom-locked-row { opacity: 0.12; filter: blur(3px); pointer-events: none; user-select: none; }
        .bom-locked-badge {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .bom-locked-badge > span {
          font-size: 12px;
          color: var(--text-2);
          font-weight: 500;
        }
        .bom-locked-badge svg { color: var(--text-3); }

        /* ── Split grid ──────────────────────────────── */
        .bom-split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 640px) {
          .bom-split-grid { grid-template-columns: 1fr; }
        }

        /* ── Insights ────────────────────────────────── */
        .bom-insights-list { display: flex; flex-direction: column; gap: 10px; }
        .bom-insight-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: var(--text-2);
          line-height: 1.5;
        }
        .bom-insight-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          margin-top: 7px;
          flex-shrink: 0;
        }

        /* ── Regions bar ─────────────────────────────── */
        .bom-regions-list { display: flex; flex-direction: column; gap: 10px; }
        .bom-region-row { display: flex; align-items: center; gap: 12px; }
        .bom-region-name {
          width: 72px;
          font-size: 12px;
          color: var(--text-2);
          flex-shrink: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bom-region-bar-wrap {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.04);
          border-radius: 100px;
          overflow: hidden;
        }
        .bom-region-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), rgba(139,92,246,0.5));
          border-radius: 100px;
          transition: width 1s cubic-bezier(0.16,1,0.3,1);
        }
        .bom-region-pct {
          width: 36px;
          text-align: right;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text-3);
        }

        /* ── Recommendation ──────────────────────────── */
        .bom-recommendation-text {
          font-size: 13px;
          color: var(--text-2);
          line-height: 1.65;
        }

        /* ── CTA card ────────────────────────────────── */
        .bom-cta-card {
          position: relative;
          border-radius: var(--radius);
          overflow: hidden;
        }
        .bom-cta-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(56,189,248,0.06), rgba(167,139,250,0.06));
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: var(--radius);
        }
        .bom-cta-content {
          position: relative;
          padding: 44px 32px;
          text-align: center;
        }
        .bom-cta-title {
          font-size: 22px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.01em;
        }
        .bom-cta-desc {
          font-size: 14px;
          color: var(--text-2);
          max-width: 420px;
          margin: 10px auto 28px;
          line-height: 1.5;
        }
        .bom-cta-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .bom-cta-btn {
          display: inline-flex;
          padding: 13px 32px;
          background: var(--accent);
          border: none;
          border-radius: var(--radius-sm);
          color: #06060a;
          font-family: var(--font);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 4px 24px rgba(139,92,246,0.25);
        }
        .bom-cta-btn:hover {
          background: #a78bfa;
          transform: translateY(-1px);
          box-shadow: 0 6px 32px rgba(139,92,246,0.35);
        }
        .bom-cta-link {
          font-size: 13px;
          color: var(--text-3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .bom-cta-link:hover { color: var(--text-2); }
        .bom-cta-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-top: 28px;
        }
        .bom-cta-feature {
          font-size: 11px;
          color: var(--text-3);
        }

        /* ── Tabs ────────────────────────────────────── */
        .bom-tabs {
          display: inline-flex;
          gap: 2px;
          padding: 3px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .bom-tab {
          padding: 8px 18px;
          border: none;
          border-radius: var(--radius-xs);
          background: transparent;
          color: var(--text-2);
          font-family: var(--font);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .bom-tab:hover { color: var(--text); }
        .bom-tab.active {
          background: var(--accent);
          color: white;
          box-shadow: 0 2px 12px rgba(139,92,246,0.2);
        }
        .bom-tab-content { display: flex; flex-direction: column; gap: 20px; }

        /* ── Cost bars ───────────────────────────────── */
        .bom-cost-bars { display: flex; flex-direction: column; gap: 14px; }
        .bom-cost-row { display: flex; align-items: center; gap: 16px; }
        .bom-cost-label {
          width: 110px;
          font-size: 12px;
          color: var(--text-2);
          flex-shrink: 0;
        }
        .bom-cost-track {
          flex: 1;
          height: 7px;
          background: rgba(255,255,255,0.03);
          border-radius: 100px;
          overflow: hidden;
        }
        .bom-cost-fill { height: 100%; border-radius: 100px; }
        .bom-cost-val {
          width: 100px;
          text-align: right;
          font-family: var(--mono);
          font-size: 12px;
          color: var(--text-2);
        }

        /* ── Decision bar ────────────────────────────── */
        .bom-decision-bar-wrap { margin-top: 4px; }
        .bom-decision-bar {
          display: flex;
          height: 10px;
          border-radius: 100px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
        }
        .bom-decision-exploit { background: var(--accent); border-radius: 100px 0 0 100px; }
        .bom-decision-explore { background: var(--warn); border-radius: 0 100px 100px 0; }
        .bom-decision-legend {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 10px;
          font-weight: 600;
        }
        .bom-legend-exploit { color: var(--accent); }
        .bom-legend-explore { color: var(--warn); }

        /* ── Component cards ─────────────────────────── */
        .bom-comp-group { margin-bottom: 8px; }
        .bom-comp-group-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-top: 4px;
        }
        .bom-comp-group-dot { width: 8px; height: 8px; border-radius: 50%; }
        .bom-comp-group-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-2);
        }
        .bom-comp-group-count { font-size: 11px; color: var(--text-4); }
        .bom-comp-list { display: flex; flex-direction: column; gap: 8px; }
        .bom-comp-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: all 0.25s;
        }
        .bom-comp-card:hover { border-color: var(--border-2); }
        .bom-comp-card.expanded { border-color: var(--border-2); }
        .bom-comp-summary {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: var(--font);
          transition: background 0.15s;
        }
        .bom-comp-summary:hover { background: rgba(255,255,255,0.01); }
        .bom-comp-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .bom-comp-info { flex: 1; min-width: 0; }
        .bom-comp-name {
          font-size: 13px;
          font-weight: 600;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bom-comp-meta { font-size: 11px; color: var(--text-3); margin-top: 2px; }
        .bom-comp-cost { text-align: right; flex-shrink: 0; }
        .bom-comp-cost-val { font-family: var(--mono); font-size: 13px; color: white; font-weight: 500; }
        .bom-comp-mode { font-size: 11px; font-weight: 600; margin-top: 2px; }
        .bom-comp-chevron {
          color: var(--text-3);
          transition: transform 0.25s;
          flex-shrink: 0;
        }
        .bom-comp-chevron.open { transform: rotate(180deg); }

        /* ── Detail panel ────────────────────────────── */
        .bom-comp-detail {
          border-top: 1px solid var(--border);
          padding: 20px 24px;
          background: rgba(255,255,255,0.008);
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: bom-slideDown 0.3s ease;
        }
        .bom-detail-section { display: flex; flex-direction: column; gap: 8px; }
        .bom-detail-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-3);
        }
        .bom-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 8px;
        }
        .bom-detail-cell {
          padding: 10px 12px;
          background: var(--surface-2);
          border-radius: var(--radius-xs);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .bom-detail-cell-label { font-size: 10px; color: var(--text-3); }
        .bom-detail-cell-val { font-family: var(--mono); font-size: 12px; color: var(--text); }

        .bom-code-block {
          padding: 14px 16px;
          background: var(--surface-2);
          border-radius: var(--radius-xs);
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text-2);
          line-height: 1.6;
          overflow-x: auto;
        }
        .bom-code-dim { color: var(--text-3); }

        .bom-currency-note {
          margin-top: 8px;
          font-size: 10px;
          color: var(--text-3);
          font-style: italic;
          padding: 4px 8px;
          background: rgba(56,189,248,0.04);
          border-radius: 4px;
          display: inline-block;
        }

        .bom-risk-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .bom-risk-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: var(--surface-2);
          border-radius: var(--radius-xs);
          font-size: 12px;
        }
        .bom-risk-pill-label { color: var(--text-3); }
        .bom-risk-pill-val { font-family: var(--mono); font-weight: 500; }

        .bom-alts-list { display: flex; flex-direction: column; gap: 6px; }
        .bom-alt-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: var(--surface-2);
          border-radius: var(--radius-xs);
          font-size: 12px;
          color: var(--text-2);
        }
        .bom-alt-cost { font-family: var(--mono); color: var(--text); font-weight: 500; }

        .bom-process-chain { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .bom-process-tag {
          padding: 4px 10px;
          background: rgba(167,139,250,0.08);
          border: 1px solid rgba(167,139,250,0.15);
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 600;
          border-radius: 6px;
          letter-spacing: 0.02em;
        }
        .bom-process-arrow { color: var(--text-4); font-size: 11px; }
        .bom-process-meta { font-size: 11px; color: var(--text-3); margin-top: 8px; }

        /* ── RFQ Actions ─────────────────────────────── */
        .bom-rfq-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .bom-rfq-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-xs);
          background: var(--accent);
          border: none;
          color: #06060a;
          font-family: var(--font);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .bom-rfq-btn:hover { background: #a78bfa; transform: translateY(-1px); }
        .bom-rfq-btn-secondary {
          background: rgba(167,139,250,0.1);
          border: 1px solid rgba(167,139,250,0.2);
          color: #c4b5fd;
        }
        .bom-rfq-btn-secondary:hover { background: rgba(167,139,250,0.2); }

        /* ── Strategy tab ────────────────────────────── */
        .bom-strat-list { display: flex; flex-direction: column; gap: 6px; }
        .bom-strat-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: var(--surface-2);
          border-radius: var(--radius-xs);
          font-size: 12px;
        }
        .bom-strat-type {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .bom-strat-type.high { background: rgba(139,92,246,0.1); color: var(--accent); }
        .bom-strat-type.med { background: rgba(56,189,248,0.1); color: var(--info); }
        .bom-strat-type.low { background: rgba(255,255,255,0.04); color: var(--text-2); }
        .bom-strat-item { color: var(--text-2); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
        .bom-strat-qty { color: var(--text-3); }
        .bom-strat-region { color: var(--text-2); }
        .bom-strat-cost { font-family: var(--mono); color: white; font-weight: 500; margin-left: auto; }

        .bom-mfg-item {
          padding: 16px 18px;
          background: var(--surface-2);
          border-radius: var(--radius-xs);
          margin-bottom: 10px;
        }
        .bom-mfg-item:last-child { margin-bottom: 0; }
        .bom-mfg-name { font-size: 13px; font-weight: 600; color: white; margin-bottom: 8px; }
        .bom-mfg-meta { display: flex; flex-wrap: wrap; gap: 16px; font-size: 12px; color: var(--text-3); }

        .bom-risk-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(248,113,113,0.03);
          border: 1px solid rgba(248,113,113,0.08);
          border-radius: var(--radius-xs);
          font-size: 12px;
          margin-bottom: 6px;
        }
        .bom-risk-alert:last-child { margin-bottom: 0; }
        .bom-risk-alert-icon { color: var(--danger); }
        .bom-risk-alert-item { color: var(--text-2); }
        .bom-risk-alert-sep { color: var(--text-4); }
        .bom-risk-alert-supplier { color: var(--text-2); }
        .bom-risk-alert-var { margin-left: auto; font-family: var(--mono); color: #fca5a5; }

        /* ── Learning tab ────────────────────────────── */
        .bom-learn-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: var(--surface-2);
          border-radius: var(--radius-xs);
          font-size: 12px;
          margin-bottom: 6px;
        }
        .bom-learn-row:last-child { margin-bottom: 0; }
        .bom-learn-explore { background: rgba(129,140,248,0.03); }
        .bom-learn-item { color: var(--text-2); }
        .bom-learn-supplier { color: var(--text-3); }
        .bom-learn-gain { font-family: var(--mono); color: var(--warn); }
        .bom-learn-uncertainty { font-family: var(--mono); }
        .bom-note { font-size: 12px; color: var(--text-3); line-height: 1.6; }

        /* ── Shimmer ─────────────────────────────────── */
        .bom-shimmer {
          background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%);
          background-size: 200% 100%;
          animation: bom-shimmer 1.5s ease infinite;
        }

        /* ── Keyframes ───────────────────────────────── */
        @keyframes bom-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes bom-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bom-rowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bom-slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 2000px; }
        }
        @keyframes bom-shimmer {
          to { background-position: -200% 0; }
        }
      `}</style>
          </div>
        </main>
      </div>
    </div>
  );
}