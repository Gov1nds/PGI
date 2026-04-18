import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, StatusBadge } from "../../components/Shared";
import {
  analyzeBOM,
  createSearch,
  promoteToProject,
  saveAsSourcingCase,
  getSearchSession,
  getGuestIntelligenceReport,
} from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useLocation as useGeoLocation } from "../../context/LocationContext";
import ProgressBar from "../../components/ProgressBar";
import Seo, { siteSchema, orgSchema } from "../../components/Seo";
import OAuthButtons from "../../components/OAuthButtons";
import FreeReportCard from "../../components/FreeReportCard";
import VendorRedactedCard from "../../components/VendorRedactedCard";
import LockedFeatureTeaser from "../../components/LockedFeatureTeaser";
import StaleBadge from "../../components/StaleBadge";

/* ─────────────────────────  Utils  ───────────────────────── */
function getCookie(name) {
  const m = typeof document !== "undefined" && document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? m[2] : null;
}
function setCookie(name, value, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

/* Reveal-on-scroll hook: toggles .in class on elements with .reveal */
function useRevealOnScroll() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─────────────────────────  Atoms  ───────────────────────── */
function HeroStat({ value, label, hint }) {
  return (
    <div className="surface p-5">
      <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
      {hint && <div className="mt-3 text-sm text-muted">{hint}</div>}
    </div>
  );
}
function SectionTitle({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && <div className="section-label">{eyebrow}</div>}
      <h2 className="section-heading mt-4 text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-sm leading-7 text-muted md:text-base max-w-2xl mx-auto">{description}</p>}
    </div>
  );
}

/* ─── StatsWidget (kept; used on home) ─── */
const BAR_DATA = [
  { label: "Finished", pct: 62 },
  { label: "In Progress", pct: 24 },
  { label: "Awaiting", pct: 11 },
  { label: "Rejected", pct: 3 },
];
const CHART_BARS = [38, 62, 48, 78, 55, 90, 70, 85, 60, 95, 72, 88];

function StatsWidget() {
  return (
    <div className="surface p-6 h-full flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.15em] text-white/40">Total projects</div>
          <div className="mt-1 text-2xl font-bold text-white tracking-tight">
            1,951+<span className="ml-2 text-[11px] font-normal text-emerald-400">↑14%</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="text-[11px] text-white/55">16k parts</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {BAR_DATA.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-[80px] shrink-0 text-[12px] text-white/55">{b.label}</span>
            <div className="flex-1 h-[5px] rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full bg-white" style={{ width: `${b.pct}%`, opacity: 0.5 + b.pct / 200 }} />
            </div>
            <span className="w-8 text-right text-[11px] text-white/40">{b.pct}%</span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-end gap-[3px] h-[48px]">
          {CHART_BARS.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-[4px]"
              style={{ height: `${h}%`, background: i >= CHART_BARS.length - 3 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)" }} />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-white/30">Summary: last 12 months</span>
          <span className="text-[10px] text-white/30">Total 1,951+</span>
        </div>
      </div>
    </div>
  );
}

function FeatureBullet({ title, text }) {
  return (
    <div className="feature-bullet border-b border-white/[0.055] last:border-0">
      <div className="feature-bullet-icon">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <circle cx="4.5" cy="4.5" r="2.5" fill="#ffffff" />
        </svg>
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-0.5 text-[13px] leading-5 text-muted">{text}</div>
      </div>
    </div>
  );
}

const SERVICES = [
  { title: "BOM Intake & Analysis", text: "Upload CSV, XLSX, or paste text. We classify parts, estimate cost, flag risks, and split commodity vs. RFQ-bound items." },
  { title: "Vendor Intelligence",   text: "Ranked vendor shortlists scored across price, lead time, reliability, compliance, capacity, and proximity." },
  { title: "RFQ Dispatch",          text: "Send structured RFQs to multiple vendors in a single action. Track responses, deadlines, and deviations." },
  { title: "Quote Comparison",      text: "Side-by-side Total Landed Cost with tariff, freight, and MOQ modeling built into the comparison matrix." },
  { title: "Purchase Orders",       text: "Promote winning quotes to PO. Twelve-state timeline from draft to delivery confirmation with audit trail." },
  { title: "Logistics Tracking",    text: "Shipment milestones, ETA variance, carrier visibility, and exception alerts piped into the procurement timeline." },
];

function ServiceCard({ title, text, index }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className="service-card spotlight group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.04] text-[11px] font-mono font-semibold text-white/70">
            {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="text-[14.5px] font-semibold text-white leading-tight">{title}</h3>
        </div>
        <div className="service-card-arrow">→</div>
      </div>
      <p className="mt-3 text-[13px] leading-5 text-muted">{text}</p>
    </div>
  );
}

function PricingCardNew({ name, price, sub, points, highlight = false, note }) {
  const nav = useNavigate();
  return (
    <div className={`pricing-card-new ${highlight ? "border-white/20 shadow-[0_28px_64px_rgba(255,255,255,0.04)]" : ""}`}>
      {highlight && (
        <div className="absolute top-4 right-4">
          <span className="badge-pill border-white/20 bg-white/10 text-white text-[11px]">Popular</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{name}</div>
          <div className="mt-0.5 text-[13px] text-muted">{sub}</div>
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight text-white">{price}</span>
        <span className="text-sm text-muted">/ month</span>
      </div>
      {note && <p className="mt-1.5 text-[12.5px] text-muted leading-5">{note}</p>}
      <button onClick={() => nav("/register")} className="pricing-get-started">Get Started</button>
      <div className="mt-5 space-y-2.5">
        {points.map((p) => (
          <div key={p} className="check-item">
            <div className="check-icon">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Polling helper ─── */
function usePollStatus(fetchFn, interval = 2000) {
  const [data, setData] = useState(null);
  const [polling, setPolling] = useState(false);
  const timerRef = useRef(null);

  const start = useCallback(async (id) => {
    setPolling(true);
    const poll = async () => {
      try {
        const result = await fetchFn(id);
        setData(result);
        if (result.status === "COMPLETED" || result.status === "PARSED" || result.status === "FAILED") {
          setPolling(false);
          return;
        }
        timerRef.current = setTimeout(poll, interval);
      } catch { setPolling(false); }
    };
    poll();
  }, [fetchFn, interval]);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPolling(false);
  }, []);

  useEffect(() => () => stop(), [stop]);
  return { data, polling, start, stop };
}

/* ═════════════════════════════════════════════════════════
   UNIFIED HERO INTAKE  (merges both previous intake flows)
   Modes: part | paste | upload | quick
   - part/paste/upload → analyzeBOM + createSearch + promoteToProject path
   - quick             → getGuestIntelligenceReport (free report, no signup)
════════════════════════════════════════════════════════════ */
function UnifiedIntake() {
  const nav = useNavigate();
  const { user, accessToken } = useAuth();
  const { loc } = useGeoLocation();

  const [mode, setMode] = useState("part"); // "part" | "paste" | "upload" | "quick"
  const [query, setQuery] = useState("");
  const [quickItems, setQuickItems] = useState([]);
  const [quickInput, setQuickInput] = useState("");
  const [file, setFile] = useState(null);

  const [result, setResult] = useState(null);   // BOM/search result
  const [report, setReport] = useState(null);   // Guest intelligence report
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [previousSearch, setPreviousSearch] = useState(null);

  const searchPoller = usePollStatus(useCallback((id) => getSearchSession(id, accessToken), [accessToken]));

  /* Restore saved guest search */
  useEffect(() => {
    try {
      const saved = getCookie("pgi_guest_search");
      if (saved) setPreviousSearch(JSON.parse(decodeURIComponent(saved)));
    } catch {}
  }, []);

  /* Progress when async */
  useEffect(() => {
    if (searchPoller.data?.status === "COMPLETED") {
      setResult({ type: "search", ...searchPoller.data });
      setLoading(false);
    } else if (searchPoller.data?.status === "FAILED") {
      setError("Analysis failed. Please try again.");
      setLoading(false);
    } else if (searchPoller.polling) {
      setProgressPct((p) => Math.min(p + 8, 90));
    }
  }, [searchPoller.data, searchPoller.polling]);

  const addQuickItems = () => {
    if (!quickInput.trim()) return;
    const items = quickInput
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((raw_text) => ({ raw_text, qty: 1 }));
    setQuickItems((prev) => [...prev, ...items]);
    setQuickInput("");
  };
  const removeQuickItem = (i) => setQuickItems((prev) => prev.filter((_, j) => j !== i));

  const run = async () => {
    setError("");
    setResult(null);
    setReport(null);
    setProgressPct(10);
    setLoading(true);
    try {
      if (mode === "upload" && file) {
        const data = await analyzeBOM(file, "", "USD", "balanced", accessToken);
        if (data.status === "PARSING" || data.status === "PENDING") {
          searchPoller.start(data.upload_id || data.search_session_id);
        } else {
          setResult({ type: "bom", ...data });
          setLoading(false);
        }
      } else if (mode === "part" || mode === "paste") {
        const text = query.trim();
        if (!text) {
          setError("Enter a part number or paste BOM text.");
          setLoading(false);
          return;
        }
        const data = await createSearch(text, mode === "paste" || text.includes("\n") ? "bom_text" : "component", accessToken);
        if (data.status === "PENDING") {
          searchPoller.start(data.search_session_id);
        } else {
          setResult({ type: "search", ...data });
          setLoading(false);
        }
      } else if (mode === "quick") {
        const items = quickItems.length ? quickItems : quickInput.trim()
          ? quickInput.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean).map((raw_text) => ({ raw_text, qty: 1 }))
          : [];
        if (!items.length) {
          setError("Add at least one component to generate a free report.");
          setLoading(false);
          return;
        }
        const body = {
          components: items.map((c) => c.raw_text),
          delivery_location: { country: loc?.country, city: loc?.city, country_code: loc?.country_code },
          currency: loc?.currency || "USD",
          session_token: getCookie("pgi_guest") || undefined,
        };
        const res = await getGuestIntelligenceReport(body);
        setReport(res);
        try {
          setCookie(
            "pgi_guest_search",
            encodeURIComponent(JSON.stringify(items.map((c) => c.raw_text).slice(0, 5))),
            7
          );
        } catch {}
        setLoading(false);
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const proceed = async () => {
    if (!result) return;
    const sid = result.search_session_id || result.id;
    if (!sid) return;
    try {
      if (result.recommended_flow === "project" || (result.total_parts || 0) > 3) {
        const p = await promoteToProject(sid, accessToken);
        nav(`/project/${p.project_id}`);
      } else {
        await saveAsSourcingCase(sid, (query.trim().slice(0, 50)) || "Quick analysis", accessToken);
        nav(user ? "/dashboard" : "/register");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const TABS = [
    { k: "part",   l: "Part Number", i: "🔎" },
    { k: "paste",  l: "Paste BOM",   i: "📋" },
    { k: "upload", l: "Upload File", i: "⬆" },
    { k: "quick",  l: "Free Report", i: "⚡" },
  ];

  return (
    <div className="animate-fade-up-d2 mx-auto mt-10 max-w-3xl">
      {/* restore-previous pill */}
      {previousSearch && !report && !result && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs animate-fade-in">
          <span className="text-white/55">
            Welcome back — your previous search for{" "}
            <strong className="text-white/80">{previousSearch.slice(0, 3).join(", ")}</strong> is saved.
          </span>
          <button
            onClick={() => {
              setMode("quick");
              setQuickItems(previousSearch.map((t) => ({ raw_text: t, qty: 1 })));
            }}
            className="shrink-0 text-white hover:text-white/80 font-medium"
          >
            Restore →
          </button>
        </div>
      )}

      <div className="hero-surface p-4 md:p-5">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => { setMode(t.k); setError(""); }}
              className={`tab-chip ${mode === t.k ? "active" : ""}`}
            >
              <span className="opacity-80">{t.i}</span>
              {t.l}
            </button>
          ))}
        </div>

        {/* Mode bodies */}
        <div className="mt-4">
          {mode === "part" && (
            <div className="hero-search-wrap">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe anything about product sourcing"
                className="hero-search-input"
                onKeyDown={(e) => { if (e.key === "Enter") run(); }}
              />
              <button onClick={run} disabled={loading} className="hero-search-btn" aria-label="Search">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5H13M8.5 3L13 7.5L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {mode === "paste" && (
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={5}
              placeholder="Paste BOM text here — one component per line."
              className="glass-textarea rounded-[16px] px-4 py-3.5 text-[14px]"
            />
          )}

          {mode === "upload" && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-white/15 bg-white/[0.02] px-5 py-10 text-center transition hover:bg-white/[0.04]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2v10M5 6l4-4 4 4M3 14h12" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm text-white/80">
                {file ? `${file.name} (${(file.size / 1024).toFixed(1)} KB)` : "Drop a CSV or XLSX file here"}
              </span>
              <span className="mt-1 text-xs text-white/40">CSV, XLSX, XLS, TSV supported</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.tsv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          )}

          {mode === "quick" && (
            <div className="space-y-3">
              <textarea
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                rows={3}
                placeholder="Enter components — one per line or comma-separated&#10;e.g. STM32F407, 10uF capacitor, M3 steel bolt"
                className="glass-textarea rounded-[16px] px-4 py-3 text-sm resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) {
                    addQuickItems();
                    setTimeout(run, 0);
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <button onClick={addQuickItems} className="secondary-btn rounded-lg px-3.5 py-1.5 text-xs">+ Add</button>
                <span className="text-[11px] text-white/40">
                  {quickItems.length > 0
                    ? `${quickItems.length} component${quickItems.length !== 1 ? "s" : ""} queued`
                    : "Free intelligence report · no signup required"}
                </span>
              </div>
              {quickItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {quickItems.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-white/80">
                      {c.raw_text}
                      <button onClick={() => removeQuickItem(i)} className="text-white/50 hover:text-white ml-0.5" aria-label={`Remove ${c.raw_text}`}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        {loading && (
          <div className="mt-3">
            <ProgressBar progressPct={progressPct} label="Analyzing..." status="processing" />
          </div>
        )}

        <div className="mt-4">
          <button onClick={run} disabled={loading} className="upload-cta-btn rounded-[16px] py-3.5">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v10M5 6l4-4 4 4M3 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {loading
              ? "Analyzing…"
              : mode === "upload" ? "Upload BOM & Analyze"
              : mode === "quick"  ? `Run Free Report${quickItems.length ? ` (${quickItems.length})` : ""}`
              : mode === "paste"  ? "Analyze Pasted BOM"
              : "Analyze"}
          </button>
          <p className="mt-3 text-center text-[11.5px] text-white/38">
            No sign-up required to try. Free reports include vendor shortlist, price bands, and risk flags.
          </p>
        </div>
      </div>

      {/* Result surface (BOM / search) */}
      {result && (
        <div className="mt-6 surface-strong rounded-[24px] p-6 animate-fade-in">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
            <StatusBadge status="ANALYSIS_COMPLETE" />
          </div>
          {result.total_parts > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <HeroStat value={result.total_parts} label="parts" hint="Items detected." />
              {result.analysis?.total_cost_range?.low != null && (
                <HeroStat value={`$${result.analysis.total_cost_range.low.toLocaleString()}`} label="low estimate" />
              )}
              {result.analysis?.total_cost_range?.high != null && (
                <HeroStat value={`$${result.analysis.total_cost_range.high.toLocaleString()}`} label="high estimate" />
              )}
            </div>
          )}
          {result.analysis?.rfq_required_count > 0 && (
            <p className="mt-3 text-sm text-white/60">
              {result.analysis.rfq_required_count} parts require RFQ · {result.analysis.needs_review_count || 0} need review
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={proceed} className="primary-btn rounded-xl px-5 py-2.5 text-sm">
              {user ? "Save & Continue" : "Continue as Guest"}
            </button>
            {!user && <Link to="/register" className="secondary-btn rounded-xl px-5 py-2.5 text-sm">Sign Up to Save</Link>}
          </div>
        </div>
      )}

      {/* Result surface (Guest intelligence report) */}
      {report && (
        <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6 animate-fade-in">
          <div className="space-y-4">
            {report.computed_at && <StaleBadge computedAt={report.computed_at} onRefresh={run} />}
            {report.strategy_summary && (
              <div className="card p-5 border-l-2 border-white/30">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Strategy summary</div>
                <p className="text-sm text-white/85 leading-6">{report.strategy_summary}</p>
              </div>
            )}
            {report.components?.map((c, i) => (
              <FreeReportCard key={c.raw_text || i} component={c} strategy={report.strategy_summary} currency={loc?.currency} />
            ))}
            {report.vendor_shortlist?.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Vendor shortlist
                  <span className="ml-2 text-xs text-white/35 font-normal">(limited preview)</span>
                </h3>
                <div className="space-y-2">
                  {report.vendor_shortlist.map((v, i) => (
                    <VendorRedactedCard key={v.vendor_id || i} vendor={v} rank={i + 1} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {(report.locked_features || [
              { feature: "Full Vendor Contacts", description: "Phone, email, and direct messaging with matched vendors." },
              { feature: "Score Decomposition", description: "See exactly how each vendor was scored across 8 dimensions." },
              { feature: "RFQ Dispatch", description: "Send structured RFQs to multiple vendors in one click." },
              { feature: "Quote Comparison", description: "Side-by-side TLC with tariff and freight breakdown." },
              { feature: "Order Tracking", description: "12-state PO timeline with logistics and delivery confirmation." },
            ]).map((f) => (
              <LockedFeatureTeaser key={f.feature} feature={f} />
            ))}
            <div className="card p-5">
              <div className="text-sm font-semibold text-white mb-2">Unlock full intelligence</div>
              <p className="text-xs text-white/55 mb-4 leading-5">
                Sign in to access vendor contact info, detailed score breakdowns, RFQ dispatch, order tracking, and more.
              </p>
              <Link to="/register" className="primary-btn block text-center rounded-xl px-5 py-2.5 text-sm">
                Create Free Account
              </Link>
              <p className="text-center mt-2 text-[11px] text-white/35">
                Already have an account?{" "}
                <Link to="/login" className="text-white hover:text-white/80">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   HOME
════════════════════════════════════════════════════════════ */
const LOGOS = ["stripe", "OpenAI", "Linear", "Datadog", "NVIDIA", "Figma", "Ramp", "Adobe", "Notion", "Vercel", "Shopify", "Airbnb"];

const FEATURE_TILES = [
  {
    eyebrow: "BOM intake",
    title: "One paste turns into a sourcing plan.",
    body: "Upload a spreadsheet or describe the part. We classify, estimate cost, and flag what needs RFQ before you look at a single vendor.",
    preview: (
      <div className="code-preview">
        <div className="ln"><span className="ln-no">1</span><span><span className="c">// bom.csv uploaded</span></span></div>
        <div className="ln"><span className="ln-no">2</span><span><span className="k">analyze</span>(<span className="s">"bom.csv"</span>) → <span className="n">148 parts</span></span></div>
        <div className="ln"><span className="ln-no">3</span><span><span className="c">// auto-classified</span></span></div>
        <div className="ln hl"><span className="ln-no">4</span><span><span className="k">category</span>: semiconductors · <span className="n">12 items</span></span></div>
        <div className="ln"><span className="ln-no">5</span><span><span className="k">category</span>: passives · <span className="n">83 items</span></span></div>
        <div className="ln"><span className="ln-no">6</span><span><span className="k">category</span>: mechanical · <span className="n">53 items</span></span></div>
        <div className="ln"><span className="ln-no">7</span><span><span className="k">rfq_required</span>: <span className="n">21</span> · <span className="k">commodity</span>: <span className="n">127</span></span></div>
      </div>
    ),
  },
  {
    eyebrow: "Vendor scoring",
    title: "Ranked vendors with an explanation.",
    body: "Every vendor on the shortlist comes with a decomposed score — price, lead time, reliability, compliance, capacity, and proximity — so you defend the choice, not guess it.",
    preview: (
      <div className="feature-tile-preview">
        <div className="flex items-center justify-between mb-2"><span className="text-white/80 font-semibold">Apex Precision</span><span className="text-emerald-400">94</span></div>
        <div className="space-y-1.5">
          {[["Price", 92], ["Lead time", 88], ["Reliability", 96], ["Compliance", 97]].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="w-[70px] text-white/45">{k}</span>
              <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-white/70 rounded-full" style={{ width: `${v}%` }} /></div>
              <span className="w-7 text-right text-white/60">{v}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "RFQ & quotes",
    title: "Dispatch once. Compare side by side.",
    body: "Send structured RFQs in a single action. Quotes land in a matrix with Total Landed Cost already including tariff, freight, and MOQ effects.",
    preview: (
      <div className="feature-tile-preview">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 text-white/60">
          <div className="text-white/40 text-[10px]">Vendor</div>
          <div className="text-white/40 text-[10px]">Unit</div>
          <div className="text-white/40 text-[10px]">TLC / EA</div>
          {[["Apex", "$12.40", "$14.10"], ["NovaCore", "$12.95", "$13.80"], ["Meridian", "$11.20", "$14.60"]].map(([a, b, c]) => (
            <>
              <div className="text-white/80">{a}</div>
              <div>{b}</div>
              <div className="text-white">{c}</div>
            </>
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Orders & shipments",
    title: "A control tower, not a spreadsheet.",
    body: "Promote a winning quote to PO. Twelve-state timeline. Carrier milestones, ETA variance, and exception alerts in the same place you bought the parts.",
    preview: (
      <div className="feature-tile-preview">
        <div className="space-y-1.5">
          {[
            ["PO-3821 issued", "Apr 12"],
            ["Production started", "Apr 14"],
            ["QC passed", "Apr 22"],
            ["Shipped · DHL 7291…", "Apr 24"],
            ["In transit · SG → LAX", "Apr 26"],
          ].map(([t, d]) => (
            <div key={t} className="flex items-center gap-2 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="text-white/80 flex-1">{t}</span>
              <span className="text-white/35">{d}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function Home() {
  useRevealOnScroll();

  return (
    <>
      <Seo
        title="PGI Hub | AI Sourcing Marketplace"
        description="Upload a BOM or describe your sourcing needs. Get suppliers, quotes, and cost insight instantly."
        canonical="https://pgihub.com/"
        schema={[siteSchema, orgSchema]}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden pt-12 pb-10 md:pt-16">
        <Container>
          <div className="relative mx-auto max-w-6xl">
            <div className="grid-orb one" />
            <div className="grid-orb two" />

            <div className="animate-fade-up mx-auto mb-7 flex w-fit items-center">
              <div className="hero-pill">
                <span className="dot-pulse" />
                <span>AI sourcing marketplace</span>
              </div>
            </div>

            <div className="animate-fade-up-d1 mx-auto max-w-4xl text-center">
              <h1 className="hero-title text-5xl font-semibold sm:text-6xl lg:text-[5.5rem]">
                Upload a <span className="gradient-text">BOM</span> or describe<br className="hidden sm:block" />
                your sourcing needs.
              </h1>
              <p className="hero-subtitle mx-auto mt-6 max-w-2xl text-base leading-8 md:text-lg">
                Get suppliers, quotes, and cost insight <em className="not-italic text-white/90 italic">Instantly.</em>
              </p>
            </div>

            {/* Unified intake */}
            <UnifiedIntake />
          </div>
        </Container>
      </section>

      {/* ═══ TRUSTED BY ═══ */}
      <section className="border-t border-white/[0.055] py-12">
        <Container>
          <p className="text-center text-[12px] tracking-wide text-white/35 mb-8">
            Trusted every day by teams that build world-class products
          </p>
          <div className="marquee">
            <div className="marquee-track">
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <span key={i} className="brand select-none">{l}</span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ "AGENTS TURN IDEAS INTO CODE" equivalent: sourcing flow narrative ═══ */}
      <section className="py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
            <div className="reveal">
              <div className="section-label mb-5">Sourcing, reimagined</div>
              <h2 className="section-heading text-3xl md:text-5xl font-semibold">
                Sourcing turns <span className="gradient-text">ideas into supply chains.</span>
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-muted max-w-md">
                Hand off intake, analysis, and vendor matching to PGI Hub, while you focus on the decisions that actually move the program.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <Link to="/register" className="primary-btn rounded-full px-5 py-2.5 text-[13px]">Start free</Link>
                <Link to="/analyze" className="secondary-btn rounded-full px-5 py-2.5 text-[13px]">See the flow →</Link>
              </div>
            </div>

            <div className="reveal d1">
              <div className="code-preview">
                <div className="ln"><span className="ln-no">1</span><span><span className="c">// paste a part description</span></span></div>
                <div className="ln"><span className="ln-no">2</span><span><span className="k">search</span>(<span className="s">"STM32F407VGT6, 10k units, EU"</span>)</span></div>
                <div className="ln"><span className="ln-no">3</span><span className="c">// → classified as MCU / active</span></div>
                <div className="ln"><span className="ln-no">4</span><span><span className="k">cost_range</span>: <span className="n">$6.10 – $8.40</span></span></div>
                <div className="ln hl"><span className="ln-no">5</span><span><span className="k">risk</span>: <span className="n">single-source</span> (alt found)</span></div>
                <div className="ln"><span className="ln-no">6</span><span><span className="k">vendors</span>: <span className="n">7 ranked</span> · top = <span className="s">"Apex Precision"</span></span></div>
                <div className="ln"><span className="ln-no">7</span><span><span className="k">action</span>: <span className="s">"promote to project"</span></span></div>
                <div className="ln"><span className="ln-no">8</span><span><span className="c">✓ project #P-2031 created, RFQ drafted</span></span></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ EVERYWHERE YOU WORK (feature tiles, Cursor-style) ═══ */}
      <section className="border-t border-white/[0.055] py-20">
        <Container>
          <div className="reveal max-w-3xl mb-12">
            <div className="section-label mb-5">Across the workflow</div>
            <h2 className="section-heading text-3xl md:text-5xl font-semibold">
              One platform.<br />Every procurement surface.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-muted max-w-xl">
              From raw intake to ship notification — PGI Hub connects every step of the sourcing lifecycle in one consistent surface.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {FEATURE_TILES.map((t, i) => (
              <div key={t.title} className={`feature-tile reveal ${i % 2 ? "d1" : ""}`}>
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/40 mb-3">{t.eyebrow}</div>
                <h3 className="text-[22px] md:text-[26px] font-semibold text-white leading-tight tracking-tight">{t.title}</h3>
                <p className="mt-3 text-[14px] leading-6 text-muted max-w-[42ch]">{t.body}</p>
                <div className="mt-6">{t.preview}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══ STATS + Efficient copy ═══ */}
      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-start">
            <div className="reveal">
              <StatsWidget />
            </div>
            <div className="reveal d1 flex flex-col justify-center lg:pl-4">
              <div className="section-label mb-5">Platform capabilities</div>
              <h2 className="section-heading text-3xl md:text-[2.6rem] font-semibold leading-tight">
                Efficient. Integrated.<br />
                <span className="gradient-text">End-to-end sourcing.</span>
              </h2>
              <p className="mt-4 text-[14.5px] leading-6 text-muted max-w-md">
                Every surface shares state. When a quote lands, it updates the PO shortlist. When a shipment is delayed, it shows on the project. Nothing lives in a silo.
              </p>
              <div className="mt-7 divide-y divide-white/[0.055]">
                <FeatureBullet title="AI-ranked vendor shortlists"     text="Explainable scoring across price, lead time, reliability, compliance, capacity, and proximity." />
                <FeatureBullet title="BOM parsing & cost estimation"    text="Multi-format intake (CSV / XLSX / text). Automatic classification and RFQ splitting." />
                <FeatureBullet title="RFQ → PO → shipment, connected"   text="The quote matrix, the purchase order, and the delivery timeline share one data model." />
                <FeatureBullet title="Spend + risk analytics"           text="Category spend, savings vs baseline, supplier performance, and lead-time risk in one dashboard." />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ SERVICES GRID ═══ */}
      <section className="border-t border-white/[0.055] py-20">
        <Container>
          <div className="reveal text-center mb-12 max-w-2xl mx-auto">
            <div className="section-label mb-5 mx-auto">What we offer</div>
            <h2 className="section-heading text-3xl md:text-5xl font-semibold">Built for procurement teams that want execution, not dashboards.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <div key={s.title} className={`reveal ${["", "d1", "d2", "d3"][i % 4]}`}>
                <ServiceCard {...s} index={i} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="border-t border-white/[0.055] py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div className="reveal">
              <div className="section-label mb-5">How it works</div>
              <h2 className="section-heading text-3xl md:text-5xl font-semibold leading-tight">
                A smooth workflow,<br /><span className="gradient-text">intake to execution.</span>
              </h2>
              <p className="mt-4 text-[14.5px] leading-6 text-muted max-w-md">
                From BOM upload to vendor selection and delivery tracking — everything stays connected in one premium system.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { n: "01", title: "Describe your need", text: "Paste a BOM, upload a spreadsheet, or type a part number." },
                  { n: "02", title: "Run AI analysis", text: "Extract parts, estimate cost, flag risks, determine RFQ items." },
                  { n: "03", title: "Compare suppliers", text: "Explainable ranking across price, logistics, tariffs, and lead time." },
                  { n: "04", title: "Execute faster", text: "Promote to project, send RFQs, compare quotes, track delivery." },
                ].map((step) => (
                  <div key={step.n} className="service-card flex items-start gap-4 reveal">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-sm font-bold text-white font-mono">
                      {step.n}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{step.title}</div>
                      <div className="mt-0.5 text-[13px] text-muted leading-5">{step.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              {[
                { value: "1 min",    label: "Upload to insight", hint: "Parse BOMs or describe sourcing needs instantly." },
                { value: "Ranked",   label: "Vendor scoring",    hint: "Compare cost, lead time, and risk in one view." },
                { value: "24/7",     label: "Always available",  hint: "Built for continuous procurement teams and vendors." },
                { value: "Unified",  label: "System design",     hint: "Shared surfaces, buttons, cards, and navigation across the app." },
              ].map((s, i) => (
                <div key={s.label} className={`reveal ${["", "d1", "d2", "d3"][i]}`}>
                  <HeroStat {...s} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ TESTIMONIAL BLOCK ═══ */}
      <section className="border-t border-white/[0.055] py-20">
        <Container>
          <div className="reveal max-w-4xl mx-auto text-center">
            <div className="section-label mx-auto mb-5">From procurement leaders</div>
            <blockquote className="text-2xl md:text-4xl font-semibold tracking-tight leading-[1.15] text-white">
              “We replaced three spreadsheets, one PDF workflow, and two email threads with PGI Hub. Our lead time on a new vendor dropped from <span className="gradient-text">nine days to under two.</span>”
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/25 to-white/5 border border-white/10" />
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Priya Nair</div>
                <div className="text-xs text-white/50">Director of Sourcing, Axiom Robotics</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="border-t border-white/[0.055] py-20">
        <Container>
          <div className="reveal text-center mb-12">
            <div className="section-label mx-auto mb-4">Pricing</div>
            <h2 className="section-heading text-3xl md:text-5xl font-semibold">Tailored plans for your scale.</h2>
            <p className="mt-3 text-sm text-muted">Plans priced for any size business needs.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 max-w-3xl mx-auto">
            <PricingCardNew
              name="Starter"
              price="$39"
              sub="Best for growing teams"
              note="Covers the core features you need to run sourcing end-to-end."
              points={["BOM intake and AI analysis", "Up to 10,000 parts / month", "Saved sourcing cases & project promotion", "Email & chat support"]}
            />
            <PricingCardNew
              name="Enterprise"
              price="$99"
              sub="Full access · All premium features"
              highlight
              note="For teams running production sourcing across multiple programs."
              points={["Unlimited BOMs, RFQs, and POs", "Advanced analytics & risk dashboard", "Dedicated account manager", "SSO, audit logs, custom SLAs"]}
            />
          </div>
          <p className="text-center mt-8 text-xs text-white/35">
            Need a custom plan? <Link to="/contact" className="text-white hover:text-white/80 underline underline-offset-4">Talk to sales →</Link>
          </p>
        </Container>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="border-t border-white/[0.055] py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.5fr_1fr]">
            <div className="reveal">
              <div className="section-label mb-4">FAQ</div>
              <h2 className="section-heading text-2xl md:text-3xl">Common questions.</h2>
              <p className="mt-3 text-sm text-muted max-w-xs">Still have a question? <Link to="/contact" className="text-white underline underline-offset-4">Talk to us →</Link></p>
            </div>
            <div className="space-y-3">
              {[
                ["Do I need to create an account to try it?", "No. The Free Report tab on the hero lets you drop in components and get a vendor shortlist, price bands, and risk flags without signing up."],
                ["What formats do you support for BOM upload?", "CSV, XLSX, XLS, and TSV. You can also paste BOM text directly, one component per line."],
                ["How do you score vendors?", "Each vendor is scored across eight dimensions — price, lead time, reliability, compliance, capacity, proximity, responsiveness, and prior fit. The score is always decomposed and explainable."],
                ["Can I bring my own vendors?", "Yes. You can import your approved-supplier list and route RFQs only to them, or blend them into the marketplace shortlist."],
                ["Is the data secure?", "All data is encrypted in transit and at rest. Enterprise plans add SSO, SCIM, audit logs, and custom retention."],
              ].map(([q, a], i) => (
                <details key={i} className="card p-5 group">
                  <summary className="cursor-pointer flex items-center justify-between gap-4 text-[15px] font-medium text-white">
                    <span>{q}</span>
                    <span className="text-white/40 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-6 text-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="border-t border-white/[0.055] py-24">
        <Container>
          <div className="reveal relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-16 text-center md:px-10">
            <div className="grid-orb one" style={{ top: "-40px", left: "10%", opacity: 0.2 }} />
            <div className="grid-orb two" style={{ top: "-20px", right: "10%", opacity: 0.15 }} />
            <div className="relative z-10">
              <div className="section-label mx-auto mb-5">Get started</div>
              <h2 className="section-heading text-3xl md:text-5xl font-semibold">
                Ready to ship faster?
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-muted max-w-lg mx-auto">
                Upload a BOM or type a component. See suppliers, quotes, and cost insight in under a minute.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/register" className="primary-btn rounded-full px-6 py-3 text-[14px]">Create free account →</Link>
                <Link to="/contact" className="secondary-btn rounded-full px-6 py-3 text-[14px]">Talk to sales</Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ═════════════════════════════════════════════════════════
   ANALYZE (preserved functionality; restyled)
════════════════════════════════════════════════════════════ */
export function Analyze() {
  const [mode, setMode] = useState("file");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loc, setLoc] = useState("");
  const [cur, setCur] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const nav = useNavigate();
  const { user, accessToken } = useAuth();

  const run = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      if (mode === "file" && file) setResult(await analyzeBOM(file, loc, cur, "balanced", accessToken));
      else if (text.trim()) setResult({ type: "search", ...(await createSearch(text.trim(), text.includes("\n") ? "bom_text" : "component", accessToken)) });
      else setError("Provide input.");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };
  const promote = async () => {
    const sid = result?.search_session_id || result?.id;
    if (!sid) return;
    try {
      const p = await promoteToProject(sid, accessToken);
      nav(`/project/${p.project_id}`);
    } catch (e) { setError(e.message); }
  };

  return (
    <section className="py-16">
      <Seo title="Analyze BOM | PGI Hub" description="Upload a BOM, type a part number, or paste component text for AI sourcing analysis." canonical="https://pgihub.com/analyze" />
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="surface-strong p-6 md:p-8">
            <SectionTitle align="left" eyebrow="Analysis studio" title="Upload a BOM, type a part number, or paste component text." description="Get AI-powered cost estimates, risk flags, and vendor matching instantly." />
            <div className="mt-6 flex flex-wrap gap-2">
              {[{ k: "file", l: "Upload File" }, { k: "text", l: "Part Number" }, { k: "paste", l: "Paste BOM" }].map((m) => (
                <button key={m.k} onClick={() => setMode(m.k)} className={`tab-chip ${mode === m.k ? "active" : ""}`}>{m.l}</button>
              ))}
            </div>
            <div className="mt-5 space-y-4">
              {mode === "file" && (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-white/15 bg-white/[0.02] px-4 py-10 text-center transition hover:bg-white/[0.035]">
                  <span className="text-sm text-white/70">{file ? file.name : "Drop CSV/XLSX"}</span>
                  <input type="file" accept=".csv,.xlsx,.xls,.tsv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              )}
              {mode === "text" && <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Part number or name" className="glass-input rounded-[16px] px-4 py-3 text-sm" />}
              {mode === "paste" && <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="One component per line" className="glass-textarea rounded-[16px] px-4 py-3 text-sm" />}
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Delivery location" className="glass-input rounded-[16px] px-4 py-3 text-sm" />
                <select value={cur} onChange={(e) => setCur(e.target.value)} className="glass-input rounded-[16px] px-4 py-3 text-sm">
                  {["USD", "EUR", "INR", "CNY", "JPY", "GBP"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {error && <p className="text-sm text-red-200">{error}</p>}
              <button onClick={run} disabled={loading} className="upload-cta-btn rounded-2xl py-3.5 text-sm font-semibold">{loading ? "Analyzing..." : "Analyze"}</button>
            </div>
          </div>
          {result && (
            <div className="surface mt-6 p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-white">Results</h3>
              {result.total_parts != null && <p className="mt-2 text-sm text-white/70">{result.total_parts} parts analyzed</p>}
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={promote} className="primary-btn rounded-xl px-5 py-2.5 text-sm">Create Project</button>
                {!user && <Link to="/register" className="secondary-btn rounded-xl px-5 py-2.5 text-sm">Sign Up</Link>}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════
   AUTH (restyled, logic preserved)
════════════════════════════════════════════════════════════ */
export function Login() {
  const [e, sE] = useState(""); const [p, sP] = useState(""); const [err, sErr] = useState(""); const [l, sL] = useState(false);
  const { login } = useAuth(); const n = useNavigate();
  const sp = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const oauthError = sp.get("error");
  const sub = async (ev) => { ev.preventDefault(); sErr(""); sL(true); try { await login(e, p); n("/dashboard"); } catch (x) { sErr(x.message); } sL(false); };
  return (
    <section className="py-20">
      <Seo title="Sign In | PGI Hub" description="Sign in to access your sourcing dashboard." canonical="https://pgihub.com/login" />
      <Container>
        <div className="mx-auto max-w-sm surface-strong p-6 md:p-8">
          <div className="mb-6 text-center">
            <div className="section-label mx-auto">Welcome back</div>
            <h1 className="mt-4 text-2xl font-semibold text-white">Sign In</h1>
          </div>
          <OAuthButtons />
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]"></div></div>
            <div className="relative flex justify-center"><span className="bg-black px-3 text-[11px] text-white/30">or continue with email</span></div>
          </div>
          <form onSubmit={sub} className="space-y-4">
            <input value={e} onChange={(x) => sE(x.target.value)} type="email" placeholder="Email" required className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Email" />
            <input value={p} onChange={(x) => sP(x.target.value)} type="password" placeholder="Password" required className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Password" />
            {(err || oauthError) && <p className="text-sm text-red-200">{err || `OAuth error: ${oauthError}`}</p>}
            <button type="submit" disabled={l} className="primary-btn w-full rounded-xl px-5 py-3 text-sm">{l ? "Signing in..." : "Sign In"}</button>
          </form>
          <p className="mt-4 text-center text-sm text-muted">No account? <Link to="/register" className="text-white hover:underline">Register</Link></p>
        </div>
      </Container>
    </section>
  );
}
export function Register() {
  const [e, sE] = useState(""); const [p, sP] = useState(""); const [nm, sN] = useState(""); const [err, sErr] = useState(""); const [l, sL] = useState(false);
  const { register } = useAuth(); const n = useNavigate();
  const sub = async (ev) => { ev.preventDefault(); sErr(""); sL(true); try { await register(e, p, nm); n("/dashboard"); } catch (x) { sErr(x.message); } sL(false); };
  return (
    <section className="py-20">
      <Seo title="Register | PGI Hub" description="Create your PGI Hub account." canonical="https://pgihub.com/register" />
      <Container>
        <div className="mx-auto max-w-sm surface-strong p-6 md:p-8">
          <div className="mb-6 text-center">
            <div className="section-label mx-auto">Create account</div>
            <h1 className="mt-4 text-2xl font-semibold text-white">Register</h1>
          </div>
          <OAuthButtons />
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]"></div></div>
            <div className="relative flex justify-center"><span className="bg-black px-3 text-[11px] text-white/30">or continue with email</span></div>
          </div>
          <form onSubmit={sub} className="space-y-4">
            <input value={nm} onChange={(x) => sN(x.target.value)} placeholder="Full name" className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Full name" />
            <input value={e} onChange={(x) => sE(x.target.value)} type="email" placeholder="Email" required className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Email" />
            <input value={p} onChange={(x) => sP(x.target.value)} type="password" placeholder="Password" required className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Password" />
            {err && <p className="text-sm text-red-200">{err}</p>}
            <button type="submit" disabled={l} className="primary-btn w-full rounded-xl px-5 py-3 text-sm">{l ? "Creating..." : "Create Account"}</button>
          </form>
          <p className="mt-4 text-center text-sm text-muted">Have an account? <Link to="/login" className="text-white hover:underline">Sign In</Link></p>
        </div>
      </Container>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════
   PRICING (dedicated)
════════════════════════════════════════════════════════════ */
export function Pricing() {
  return (
    <section className="py-20">
      <Seo title="Pricing | PGI Hub" description="Choose the right plan for your procurement and sourcing workflow." canonical="https://pgihub.com/pricing" />
      <Container>
        <SectionTitle eyebrow="Pricing" title="Tailored plans for your scale." description="Simple, transparent pricing. No per-seat tax. Scale when you're ready." />
        <div className="mt-12 grid gap-5 lg:grid-cols-3 max-w-5xl mx-auto">
          <PricingCardNew
            name="Free"
            price="$0"
            sub="For individuals & proof of concept"
            note="Explore the platform with real BOM analysis and guest reports."
            points={["Free intelligence reports", "Up to 25 parts / month", "Vendor shortlists (redacted)", "Community support"]}
          />
          <PricingCardNew
            name="Starter"
            price="$39"
            sub="For growing teams"
            note="Covers the core features needed for end-to-end sourcing."
            highlight
            points={["BOM intake & AI analysis", "Up to 10,000 parts / month", "Saved sourcing cases, project promotion", "RFQ dispatch, quote compare, PO & tracking"]}
          />
          <PricingCardNew
            name="Enterprise"
            price="Talk"
            sub="Full access · Procurement at scale"
            note="For teams running production sourcing across multiple programs."
            points={["Unlimited usage", "Advanced analytics & risk dashboard", "Dedicated account manager", "SSO, SCIM, audit logs, custom SLA"]}
          />
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="section-heading text-xl font-semibold text-white mb-6 text-center">Compare the plans</h3>
          <div className="card divide-y divide-white/[0.05]">
            {[
              ["BOM analysis & cost estimates",   "Limited", "Yes", "Yes"],
              ["Vendor shortlists",                "Redacted","Full","Full"],
              ["RFQ dispatch",                     "—",       "Yes", "Yes + bulk"],
              ["Quote comparison matrix",          "—",       "Yes", "Yes + TLC"],
              ["Purchase orders & shipment tracking","—",      "Yes", "Yes"],
              ["Analytics & risk dashboard",       "—",       "Basic","Advanced"],
              ["SSO / SCIM / audit logs",          "—",       "—",   "Yes"],
              ["Account manager",                  "—",       "Email","Dedicated"],
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-[1.4fr_1fr_1fr_1fr] px-5 py-3 text-sm items-center">
                <div className={`${i === 0 ? "text-white/40 text-[11px] uppercase tracking-wider" : "text-white/80"}`}>{row[0]}</div>
                <div className="text-white/60 text-[13px]">{row[1]}</div>
                <div className="text-white/80 text-[13px]">{row[2]}</div>
                <div className="text-white text-[13px]">{row[3]}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════
   INSIGHTS (enhanced article grid)
════════════════════════════════════════════════════════════ */
export function Insights() {
  const ARTICLES = [
    { tag: "Procurement", title: "Total Landed Cost: the only metric that survives a tariff shock.", excerpt: "Why unit price is the wrong anchor and how TLC modeling stays stable when freight and duties move." },
    { tag: "Supply risk",  title: "Single-source components: when to diversify vs when to double down.",     excerpt: "A practical scoring rubric we use inside the platform to flag concentration risk in real programs." },
    { tag: "Vendor intel", title: "What the top 1% of vendor shortlists have in common.",                     excerpt: "An analysis of 12,000+ shortlists: proximity and responsiveness matter more than quoted unit price." },
    { tag: "AI sourcing",  title: "How we classify 150-line BOMs in under 90 seconds.",                       excerpt: "The pipeline: normalization → fuzzy match → taxonomy mapping → risk surface → cost band." },
    { tag: "Logistics",    title: "ETA variance is a sourcing signal, not a logistics one.",                  excerpt: "The same carrier lane delivers different variance profiles depending on which vendor you buy from." },
    { tag: "Playbook",     title: "A 7-step onboarding playbook for new suppliers.",                          excerpt: "From first RFQ to first shipment — the path that cut our average onboarding window from 14 to 5 days." },
  ];
  return (
    <section className="py-20">
      <Seo title="Insights | PGI Hub" description="Sourcing insights, manufacturing strategy, and supply chain analysis." canonical="https://pgihub.com/insights" />
      <Container>
        <SectionTitle eyebrow="Insights" title="Procurement intelligence, presented cleanly." description="Writing, research, and market signals from the PGI Hub team." />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <article key={a.title} className="card p-6 group cursor-pointer">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge-pill">{a.tag}</span>
                <span className="text-[11px] text-white/30">5 min read</span>
              </div>
              <h3 className="text-[17px] font-semibold text-white leading-snug group-hover:text-white/90">{a.title}</h3>
              <p className="mt-3 text-[13.5px] text-muted leading-6">{a.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-white/40">PGI Research</span>
                <span className="service-card-arrow">→</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 card p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-white">Get the sourcing brief.</h3>
            <p className="mt-2 text-[14px] text-muted">One email, once a month. Best reads + supply signals. No spam.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@company.com" className="glass-input rounded-xl px-4 py-2.5 text-sm flex-1 min-w-[240px]" />
            <button className="primary-btn rounded-xl px-5 py-2.5 text-sm">Subscribe</button>
          </form>
        </div>
      </Container>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════
   CONTACT (restyled)
════════════════════════════════════════════════════════════ */
export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="py-20">
      <Seo title="Contact | PGI Hub" description="Contact the PGI Hub team for sourcing, BOM, and procurement platform support." canonical="https://pgihub.com/contact" />
      <Container>
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="section-label mb-5">Contact</div>
            <h1 className="section-heading text-3xl md:text-4xl font-semibold">Talk to the PGI team.</h1>
            <p className="mt-4 text-[14.5px] leading-6 text-muted max-w-md">
              Sales, demos, procurement partnerships, or integration questions — we'll get back within one business day.
            </p>

            <div className="mt-8 space-y-3">
              <div className="card p-4">
                <div className="text-xs uppercase tracking-wider text-white/40">Email</div>
                <div className="mt-1 text-sm text-white">contact@pgihub.com</div>
              </div>
              <div className="card p-4">
                <div className="text-xs uppercase tracking-wider text-white/40">Sales</div>
                <div className="mt-1 text-sm text-white">sales@pgihub.com</div>
              </div>
              <div className="card p-4">
                <div className="text-xs uppercase tracking-wider text-white/40">Support</div>
                <div className="mt-1 text-sm text-white">support@pgihub.com</div>
              </div>
            </div>
          </div>

          <div className="surface-strong p-8">
            <h3 className="text-lg font-semibold text-white">Send us a message</h3>
            {sent ? (
              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                Thanks — we'll be in touch within one business day.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="First name" className="glass-input rounded-xl px-4 py-2.5 text-sm" />
                  <input placeholder="Last name" className="glass-input rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <input type="email" placeholder="Work email" className="glass-input rounded-xl px-4 py-2.5 text-sm" />
                <input placeholder="Company" className="glass-input rounded-xl px-4 py-2.5 text-sm" />
                <textarea rows={5} placeholder="Tell us what you're working on" className="glass-textarea rounded-xl px-4 py-2.5 text-sm" />
                <button className="primary-btn w-full rounded-xl py-2.5 text-sm">Send message</button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════
   404
════════════════════════════════════════════════════════════ */
export function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl surface-strong px-6 py-16 text-center">
          <div className="section-label mx-auto">404</div>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">The page you are looking for does not exist or has been moved.</p>
          <Link to="/" className="primary-btn mt-8 inline-flex rounded-xl px-6 py-3 text-sm">Return Home</Link>
        </div>
      </Container>
    </section>
  );
}
