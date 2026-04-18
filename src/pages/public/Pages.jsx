import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, StatusBadge } from "../../components/Shared";
import { analyzeBOM, createSearch, promoteToProject, saveAsSourcingCase, getSearchSession } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import ProgressBar from "../../components/ProgressBar";
import Seo, { siteSchema, orgSchema } from "../../components/Seo";
import OAuthButtons from "../../components/OAuthButtons";
import GuestReport from "./GuestReport";

/* ─── Small atoms ─── */
function HeroStat({ value, label, hint }) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 transition hover:border-[#D4D4D4] hover:shadow-sm">
      <div className="text-2xl font-bold tracking-tight text-[#0A0A0A]">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#9CA3AF] font-medium">{label}</div>
      {hint && <div className="mt-2.5 text-[13px] text-[#6B7280] leading-5">{hint}</div>}
    </div>
  );
}
function SectionTitle({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && <div className="section-label">{eyebrow}</div>}
      <h2 className="section-heading mt-4 text-3xl font-bold text-[#0A0A0A] md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-[15px] leading-7 text-[#6B7280] md:text-base">{description}</p>}
    </div>
  );
}

/* ── Stats widget ── */
const BAR_DATA = [
  { label: "Finished", pct: 62, color: "bg-[#0A0A0A]" },
  { label: "In Progress", pct: 24, color: "bg-[#6B7280]" },
  { label: "Awaiting", pct: 11, color: "bg-[#D4D4D4]" },
  { label: "Rejected", pct: 3, color: "bg-red-300" },
];
const CHART_BARS = [38, 62, 48, 78, 55, 90, 70, 85, 60, 95, 72, 88];

function StatsWidget() {
  return (
    <div className="stats-widget p-5 h-full flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#9CA3AF] font-medium">Total Projects</div>
          <div className="mt-1 text-2xl font-bold text-[#0A0A0A] tracking-tight">1,951+<span className="ml-2 text-[11px] font-normal text-emerald-600">↑14%</span></div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#0A0A0A]" /><span className="text-[11px] text-[#6B7280]">16k</span></div>
      </div>
      <div className="space-y-2.5">{BAR_DATA.map(b => (<div key={b.label} className="flex items-center gap-3"><span className="w-[80px] shrink-0 text-[12px] text-[#6B7280]">{b.label}</span><div className="flex-1 h-[5px] rounded-full bg-[#F5F5F5] overflow-hidden"><div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} /></div><span className="w-8 text-right text-[11px] text-[#9CA3AF]">{b.pct}%</span></div>))}</div>
      <div className="mt-1"><div className="flex items-end gap-[3px] h-[48px]">{CHART_BARS.map((h, i) => (<div key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%`, background: i >= CHART_BARS.length - 3 ? "#0A0A0A" : "#E5E5E5" }} />))}</div><div className="mt-2 flex items-center justify-between"><span className="text-[10px] text-[#9CA3AF]">Summary: last 12 months</span><span className="text-[10px] text-[#9CA3AF]">Total 1,951+</span></div></div>
    </div>
  );
}
function FeatureBullet({ title, text }) {
  return (<div className="feature-bullet border-b border-[#F0F0F0] last:border-0"><div className="feature-bullet-icon"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3" fill="#0A0A0A" /></svg></div><div><div className="text-sm font-semibold text-[#0A0A0A]">{title}</div><div className="mt-0.5 text-[13px] leading-5 text-[#6B7280]">{text}</div></div></div>);
}
const SERVICES = [
  { icon: "⬡", title: "BOM Intake & Analysis", text: "Custom solutions for precision BOM parsing, classification, and cost estimation." },
  { icon: "◈", title: "Custom Sourcing", text: "Bespoke sourcing solutions with design and customization options." },
  { icon: "◎", title: "Quality Control", text: "Robust quality checks and inspections to achieve high product quality." },
  { icon: "⬡", title: "Technology & Innovation", text: "Benefit from AI-driven technology to leverage smart manufacturing techniques." },
  { icon: "◈", title: "Vendor Intelligence", text: "AI-powered vendor scoring and ranked comparison with real-time insights." },
  { icon: "◎", title: "End-to-End Workflow", text: "RFQ, quote compare, PO, shipment tracking and spend analytics in one flow." },
];
function ServiceCard({ icon, title, text }) {
  return (<div className="service-card group"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] text-base">{icon}</div><h3 className="text-sm font-semibold text-[#0A0A0A] leading-tight">{title}</h3></div><div className="service-card-arrow">›</div></div><p className="mt-3 text-[13px] leading-5 text-[#6B7280]">{text}</p></div>);
}
function PricingCardNew({ name, price, sub, points, highlight = false, note }) {
  const nav = useNavigate();
  return (<div className={`pricing-card-new ${highlight ? "border-[#0A0A0A] shadow-[0_8px_32px_rgba(0,0,0,0.08)]" : ""}`}>{highlight && <div className="absolute top-4 right-4"><span className="badge-pill border-[#0A0A0A] bg-[#0A0A0A] text-white text-[11px]">Popular</span></div>}<div className="flex items-center justify-between gap-3"><div><div className="text-lg font-semibold text-[#0A0A0A]">{name}</div><div className="mt-0.5 text-[13px] text-[#6B7280]">{sub}</div></div></div><div className="mt-5 flex items-baseline gap-1.5"><span className="text-4xl font-bold tracking-tight text-[#0A0A0A]">{price}</span><span className="text-sm text-[#6B7280]">/ month</span></div>{note && <p className="mt-1.5 text-[12.5px] text-[#6B7280] leading-5">{note}</p>}<button onClick={() => nav("/register")} className="pricing-get-started">Get Started</button><div className="mt-5 space-y-2.5">{points.map(p => (<div key={p} className="check-item"><div className="check-icon"><svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div><span>{p}</span></div>))}</div></div>);
}

/* ─── Async polling helper ─── */
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
          setPolling(false); return;
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

/* ═══ TRUSTED LOGOS ═══ */
function TrustedLogos() {
  const logos = ["Stripe", "OpenAI", "Linear", "Datadog", "NVIDIA", "Figma", "Ramp", "Adobe"];
  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap py-2">
      {logos.map(name => (
        <span key={name} className="text-[14px] md:text-[15px] font-bold text-[#D4D4D4] tracking-wide select-none">{name}</span>
      ))}
    </div>
  );
}

/* ═══ HOME ═══ */
export function Home() {
  const nav = useNavigate();
  const { user, accessToken } = useAuth();
  const [mode, setMode] = useState("text");
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressPct, setProgressPct] = useState(0);

  const searchPoller = usePollStatus(
    useCallback((id) => getSearchSession(id, accessToken), [accessToken])
  );

  useEffect(() => {
    if (searchPoller.data?.status === "COMPLETED") {
      setResult({ type: "search", ...searchPoller.data });
      setLoading(false);
    } else if (searchPoller.data?.status === "FAILED") {
      setError("Analysis failed. Please try again.");
      setLoading(false);
    } else if (searchPoller.polling) {
      setProgressPct(p => Math.min(p + 8, 90));
    }
  }, [searchPoller.data, searchPoller.polling]);

  const analyze = async () => {
    setLoading(true); setError(""); setResult(null); setProgressPct(10);
    try {
      if (mode === "file" && file) {
        const data = await analyzeBOM(file, "", "USD", "balanced", accessToken);
        if (data.status === "PARSING" || data.status === "PENDING") {
          searchPoller.start(data.upload_id || data.search_session_id);
        } else {
          setResult({ type: "bom", ...data }); setLoading(false);
        }
      } else if (query.trim()) {
        const data = await createSearch(query.trim(), query.includes("\n") ? "bom_text" : "component", accessToken);
        if (data.status === "PENDING") {
          searchPoller.start(data.search_session_id);
        } else {
          setResult({ type: "search", ...data }); setLoading(false);
        }
      } else {
        setError("Enter a part number, paste a BOM, or upload a file."); setLoading(false);
      }
    } catch (e) { setError(e.message); setLoading(false); }
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
        await saveAsSourcingCase(sid, query.trim().slice(0, 50) || "Quick analysis", accessToken);
        nav(user ? "/dashboard" : "/register");
      }
    } catch (e) { setError(e.message); }
  };

  return (
    <>
      <Seo title="PGI Hub | AI Sourcing Marketplace" description="Upload a BOM or describe your sourcing needs. Get suppliers, quotes, and cost insight instantly." canonical="https://pgihub.com/" schema={[siteSchema, orgSchema]} />
      {/* GUEST INTELLIGENCE REPORT */}
      <GuestReport />
      {/* HERO — Cursor-style unified intake */}
      <section className="relative pt-16 pb-6 md:pt-24">
        <Container>
          <div className="relative mx-auto max-w-4xl">
            <div className="animate-fade-up mx-auto mb-6 flex w-fit items-center"><div className="hero-pill"><span className="dot-pulse" /><span className="text-[13px] font-medium">AI sourcing marketplace</span></div></div>
            <div className="animate-fade-up-d1 mx-auto max-w-3xl text-center">
              <h1 className="hero-title text-[2.75rem] font-bold text-[#0A0A0A] sm:text-5xl lg:text-[3.75rem]">Upload a <span className="font-extrabold">BOM</span> or<br className="hidden sm:block" />describe your sourcing needs.</h1>
              <p className="hero-subtitle mx-auto mt-5 max-w-xl text-[16px] leading-7 text-[#6B7280] md:text-[17px]">Get <strong className="text-[#0A0A0A] font-semibold">suppliers</strong>, quotes, and cost insight <em className="text-[#0A0A0A]">instantly.</em></p>
            </div>
            {/* Unified intake surface */}
            <div className="animate-fade-up-d2 mx-auto mt-10 max-w-2xl">
              <div className="hero-surface p-5 md:p-6">
                <div className="mt-0">
                  {mode === "text" && (<div className="hero-search-wrap"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Describe anything about product sourcing..." className="hero-search-input" onKeyDown={e => { if (e.key === "Enter") analyze(); }} /><button onClick={analyze} disabled={loading} className="hero-search-btn" aria-label="Search"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5H13M8.5 3L13 7.5L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>)}
                  {mode === "paste" && (<textarea value={query} onChange={e => setQuery(e.target.value)} rows={5} placeholder="Paste BOM text here — one component per line." className="glass-textarea rounded-xl px-4 py-3.5 text-[14px]" />)}
                  {mode === "file" && (<label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D4D4D4] bg-[#FAFAFA] px-5 py-10 text-center transition hover:bg-[#F5F5F5] hover:border-[#9CA3AF]"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 6l4-4 4 4M3 14h12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div><span className="text-sm text-[#6B7280]">{file ? `${file.name} (${(file.size/1024).toFixed(1)} KB)` : "Drop a CSV or XLSX file here"}</span><span className="mt-1 text-xs text-[#9CA3AF]">CSV, XLSX, XLS, TSV supported</span><input type="file" accept=".csv,.xlsx,.xls,.tsv" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" /></label>)}
                </div>
                {/* Quick action pills */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {[{ k: "text", l: "🔍 Find suppliers" }, { k: "paste", l: "🔄 Deep search suppliers" }, { k: "file", l: "📋 Research product" }].map(m => (<button key={m.k} onClick={() => setMode(m.k)} className={`tab-chip text-[12.5px] ${mode === m.k ? "active" : ""}`}>{m.l}</button>))}
                </div>
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                {loading && <div className="mt-3"><ProgressBar progressPct={progressPct} label="Analyzing..." status="processing" /></div>}
                <div className="mt-4"><button onClick={analyze} disabled={loading} className="upload-cta-btn rounded-xl py-3.5"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 6l4-4 4 4M3 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>{loading ? "Analyzing…" : "Upload BOM & Analyze"}</button></div>
              </div>
              {result && (
                <div className="mt-6 rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold text-[#0A0A0A]">Analysis Results</h3><StatusBadge status="ANALYSIS_COMPLETE" /></div>
                  {result.total_parts > 0 && (<div className="mt-5 grid gap-3 sm:grid-cols-3"><HeroStat value={result.total_parts} label="parts" hint="Items detected." />{result.analysis?.total_cost_range?.low != null && <HeroStat value={`$${result.analysis.total_cost_range.low.toLocaleString()}`} label="low estimate" />}{result.analysis?.total_cost_range?.high != null && <HeroStat value={`$${result.analysis.total_cost_range.high.toLocaleString()}`} label="high estimate" />}</div>)}
                  {result.analysis?.rfq_required_count > 0 && <p className="mt-3 text-sm text-[#6B7280]">{result.analysis.rfq_required_count} parts require RFQ · {result.analysis.needs_review_count || 0} need review</p>}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={proceed} className="primary-btn rounded-lg px-6 py-2.5 text-sm font-medium">{user ? "Save & Continue" : "Continue as Guest"}</button>
                    {!user && <Link to="/register" className="secondary-btn rounded-lg px-6 py-2.5 text-sm">Sign Up to Save</Link>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
      {/* Trusted by strip */}
      <section className="py-8 border-t border-[#F0F0F0]"><Container><div className="text-center mb-5"><p className="text-[13px] text-[#9CA3AF] font-medium">Trusted by the best teams building world-class products</p></div><TrustedLogos /></Container></section>
      {/* Work across any surface */}
      <section className="py-16 md:py-20 bg-[#FAFAFA] border-t border-[#F0F0F0]"><Container>
        <div className="animate-fade-up text-center mb-12">
          <h2 className="section-heading text-3xl font-bold text-[#0A0A0A] md:text-[2.5rem]">Work across any surface.</h2>
          <p className="mt-3 text-[16px] text-[#6B7280] mx-auto max-w-md">One. Unified. Sourcing Agent.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {[{ icon: "🖥", title: "Desktop", text: "Full-featured app for fast, familiar sourcing.", link: "Download ›" },
            { icon: "⌨️", title: "CLI", text: "Run agents in any terminal, script, or pipeline.", link: "Install ›" },
            { icon: "🔗", title: "Other Surfaces", text: "Start agents via Slack, GitHub, Linear, Jira, etc.", link: "Connect apps ›" },
            { icon: "📱", title: "Web & Mobile", text: "Push the sourcing process from your phone.", link: "Open in browser ›" }
          ].map((f, i) => (
            <div key={f.title} className={`animate-fade-up-d${Math.min(i+1,5)} rounded-2xl border border-[#E5E5E5] bg-white p-6 text-center hover:border-[#D4D4D4] hover:shadow-md transition`}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-[#0A0A0A]">{f.title}</h3>
              <p className="mt-2 text-[13px] text-[#6B7280] leading-5">{f.text}</p>
              <div className="mt-3 text-[13px] font-semibold text-[#B45309]">{f.link}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link to="/analyze" className="primary-btn rounded-full px-8 py-3 text-sm font-semibold">See all features <span className="ml-1">›</span></Link>
        </div>
      </Container></section>
      {/* Feature pills */}
      <section className="relative border-t border-[#F0F0F0] py-12"><Container><div className="grid gap-4 md:grid-cols-3">{[{ value: "Upload & Analyze", label: "BOM intake", hint: "Upload a BOM or type a component. Get classification and cost estimates instantly." },{ value: "Ranked Vendors", label: "AI scoring", hint: "Vendors ranked by price, lead time, reliability, compliance, and capacity." },{ value: "End-to-End Workflow", label: "Full lifecycle", hint: "RFQ, quote compare, PO, shipment tracking and spend analytics — connected." }].map(h => <HeroStat key={h.label} {...h} />)}</div></Container></section>
      {/* Stats + Efficient */}
      <section className="py-16 bg-[#FAFAFA] border-t border-[#F0F0F0]"><Container><div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-start"><div className="animate-fade-up"><StatsWidget /></div><div className="animate-fade-up-d1 flex flex-col justify-center lg:pl-6"><div className="section-label mb-4">Platform capabilities</div><h2 className="section-heading text-3xl font-bold text-[#0A0A0A] md:text-[2.2rem] leading-tight">Efficient and Integrated<br />Sourcing Services</h2><p className="mt-3 text-[14px] leading-6 text-[#6B7280] max-w-md">Each tool is designed to elevate your procurement workflow. Let's take business further.</p><div className="mt-6 divide-y divide-[#F0F0F0]"><FeatureBullet title="Boosting Quality with AI" text="With advanced AI technology, we help you produce higher-quality sourcing decisions with accurate cost estimates." /><FeatureBullet title="Optimization Procurement Process" text="Robust checks and inspections to achieve high-quality vendor selection and reduce supply chain risk." /><FeatureBullet title="AI-Driven Production" text="Benefit from AI-driven technology to leverage smart manufacturing techniques and real-time sourcing insights." /></div></div></div></Container></section>
      {/* Service grid */}
      <section className="border-t border-[#F0F0F0] py-16"><Container><div className="animate-fade-up text-center mb-10"><div className="section-label mx-auto mb-4">What we offer</div><h2 className="section-heading text-3xl font-bold text-[#0A0A0A] md:text-4xl">Efficient and Integrated<br />Sourcing Services</h2><p className="mt-3 text-[14px] text-[#6B7280] mx-auto max-w-md">Simple solutions for precision assembly, setup, and production flows.</p></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{SERVICES.map((s, i) => <div key={s.title} className={`animate-fade-up-d${Math.min(i+1,5)}`}><ServiceCard {...s} /></div>)}</div></Container></section>
      {/* How it works */}
      <section className="border-t border-[#F0F0F0] py-16 bg-[#FAFAFA]"><Container><div className="grid gap-8 lg:grid-cols-2 items-start"><div><div className="section-label mb-5">How it works</div><h2 className="section-heading text-3xl font-bold text-[#0A0A0A] leading-tight">A smooth workflow<br />from intake to execution.</h2><p className="mt-3 text-sm leading-6 text-[#6B7280] max-w-md">From BOM upload to vendor selection and delivery tracking — everything stays connected in one premium system.</p><div className="mt-8 space-y-3">{[{ n:"01", title:"Describe your need", text:"Paste a BOM, upload a spreadsheet, or type a part number." },{ n:"02", title:"Run AI analysis", text:"Extract parts, estimate cost, flag risks, and determine which items need RFQ." },{ n:"03", title:"Compare suppliers", text:"Use explainable ranking to balance price, logistics, tariffs, and lead time." },{ n:"04", title:"Execute faster", text:"Promote to project, send RFQs, compare quotes, and track delivery in one flow." }].map(step => (<div key={step.n} className="service-card flex items-start gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] text-sm font-bold text-[#0A0A0A]">{step.n}</div><div><div className="text-sm font-semibold text-[#0A0A0A]">{step.title}</div><div className="mt-0.5 text-[13px] text-[#6B7280] leading-5">{step.text}</div></div></div>))}</div></div><div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">{[{ value:"1 min", label:"Upload to insight", hint:"Parse BOMs or describe sourcing needs instantly." },{ value:"Ranked", label:"Vendor scoring", hint:"Compare cost, lead time, and risk in one view." },{ value:"24/7", label:"Always available", hint:"Built for continuous procurement teams and vendors." },{ value:"Unified", label:"System design", hint:"Shared surfaces, buttons, cards, and navigation across the app." }].map(s => <HeroStat key={s.label} {...s} />)}</div></div></Container></section>
      {/* Pricing */}
      <section className="border-t border-[#F0F0F0] py-16"><Container><div className="animate-fade-up text-center mb-10"><div className="section-label mx-auto mb-4">Pricing</div><h2 className="section-heading text-3xl font-bold text-[#0A0A0A] md:text-4xl">Tailored Plans for Your<br />Manufacturing Scale</h2><p className="mt-3 text-sm text-[#6B7280]">Plans priced for any size business needs.</p></div><div className="grid gap-5 lg:grid-cols-2 max-w-3xl mx-auto"><PricingCardNew name="Starter" price="$39" sub="Best for growing teams" note="This package covers the basic features you need." points={["Production up to 10,000 units per month","24/7 technical support","Access to production dashboard","Initial setup guide"]} /><PricingCardNew name="Enterprise" price="$99" sub="Full access · All premium features" note="Full-suite premium procurement tools." highlight points={["Unlimited production units","Dedicated account manager","Tailored manufacturing solutions","Predictive production optimization"]} /></div></Container></section>
    </>
  );
}

/* ═══ ANALYZE ═══ */
export function Analyze() {
  const [mode, setMode] = useState("file"); const [file, setFile] = useState(null); const [text, setText] = useState(""); const [loc, setLoc] = useState(""); const [cur, setCur] = useState("USD"); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [result, setResult] = useState(null);
  const nav = useNavigate(); const { user, accessToken } = useAuth();
  const run = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      if (mode === "file" && file) setResult(await analyzeBOM(file, loc, cur, "balanced", accessToken));
      else if (text.trim()) setResult({ type: "search", ...(await createSearch(text.trim(), text.includes("\n") ? "bom_text" : "component", accessToken)) });
      else setError("Provide input.");
    } catch (e) { setError(e.message); } setLoading(false);
  };
  const promote = async () => { const sid = result?.search_session_id || result?.id; if (!sid) return; try { const p = await promoteToProject(sid, accessToken); nav(`/project/${p.project_id}`); } catch (e) { setError(e.message); } };
  return (
    <section className="py-14"><Seo title="Analyze BOM | PGI Hub" description="Upload a BOM, type a part number, or paste component text for AI sourcing analysis." canonical="https://pgihub.com/analyze" /><Container><div className="mx-auto max-w-3xl"><div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 md:p-8 shadow-sm"><SectionTitle align="left" eyebrow="Analysis studio" title="Upload a BOM, type a part number, or paste component text." description="Get AI-powered cost estimates, risk flags, and vendor matching instantly." /><div className="mt-6 flex flex-wrap gap-2">{[{k:"file",l:"Upload File"},{k:"text",l:"Part Number"},{k:"paste",l:"Paste BOM"}].map(m => <button key={m.k} onClick={()=>setMode(m.k)} className={`tab-chip ${mode===m.k?"active":""}`}>{m.l}</button>)}</div><div className="mt-5 space-y-4">{mode==="file"&&<label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D4D4D4] bg-[#FAFAFA] px-4 py-10 text-center transition hover:bg-[#F5F5F5]"><span className="text-sm text-[#6B7280]">{file?file.name:"Drop CSV/XLSX"}</span><input type="file" accept=".csv,.xlsx,.xls,.tsv" onChange={e=>setFile(e.target.files?.[0]||null)} className="hidden" /></label>}{mode==="text"&&<input value={text} onChange={e=>setText(e.target.value)} placeholder="Part number or name" className="glass-input rounded-xl px-4 py-3 text-sm" />}{mode==="paste"&&<textarea value={text} onChange={e=>setText(e.target.value)} rows={5} placeholder="One component per line" className="glass-textarea rounded-xl px-4 py-3 text-sm" />}<div className="grid gap-3 sm:grid-cols-2"><input value={loc} onChange={e=>setLoc(e.target.value)} placeholder="Delivery location" className="glass-input rounded-xl px-4 py-3 text-sm" /><select value={cur} onChange={e=>setCur(e.target.value)} className="glass-input rounded-xl px-4 py-3 text-sm">{["USD","EUR","INR","CNY","JPY","GBP"].map(c=><option key={c} value={c}>{c}</option>)}</select></div>{error&&<p className="text-sm text-red-600">{error}</p>}<button onClick={run} disabled={loading} className="upload-cta-btn rounded-xl py-3.5 text-sm font-semibold">{loading?"Analyzing...":"Analyze"}</button></div></div>{result&&<div className="mt-6 rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm animate-fade-in"><h3 className="text-lg font-semibold text-[#0A0A0A]">Results</h3>{result.total_parts!=null&&<p className="mt-2 text-sm text-[#6B7280]">{result.total_parts} parts analyzed</p>}<div className="mt-4 flex flex-wrap gap-3"><button onClick={promote} className="primary-btn rounded-lg px-5 py-2.5 text-sm">Create Project</button>{!user&&<Link to="/register" className="secondary-btn rounded-lg px-5 py-2.5 text-sm">Sign Up</Link>}</div></div>}</div></Container></section>
  );
}

/* ═══ AUTH ═══ */
export function Login() {
  const [e, sE] = useState(""); const [p, sP] = useState(""); const [err, sErr] = useState(""); const [l, sL] = useState(false);
  const { login } = useAuth(); const n = useNavigate();
  const sp = new URLSearchParams(window.location.search);
  const oauthError = sp.get("error");
  const sub = async (ev) => { ev.preventDefault(); sErr(""); sL(true); try { await login(e, p); n("/dashboard"); } catch (x) { sErr(x.message); } sL(false); };
  return (<section className="py-16"><Seo title="Sign In | PGI Hub" description="Sign in to access your sourcing dashboard." canonical="https://pgihub.com/login" /><Container><div className="mx-auto max-w-sm rounded-2xl border border-[#E5E5E5] bg-white p-6 md:p-8 shadow-sm"><div className="mb-6 text-center"><div className="section-label mx-auto">Welcome back</div><h1 className="mt-4 text-2xl font-semibold text-[#0A0A0A]">Sign In</h1></div><OAuthButtons /><div className="relative my-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E5E5]"></div></div><div className="relative flex justify-center"><span className="bg-white px-3 text-[11px] text-[#9CA3AF]">or continue with email</span></div></div><form onSubmit={sub} className="space-y-4"><input value={e} onChange={x=>sE(x.target.value)} type="email" placeholder="Email" required className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Email" /><input value={p} onChange={x=>sP(x.target.value)} type="password" placeholder="Password" required className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Password" />{(err||oauthError)&&<p className="text-sm text-red-600">{err||`OAuth error: ${oauthError}`}</p>}<button type="submit" disabled={l} className="primary-btn w-full rounded-xl px-5 py-3 text-sm font-medium">{l?"Signing in...":"Sign In"}</button></form><p className="mt-4 text-center text-sm text-[#6B7280]">No account? <Link to="/register" className="text-[#0A0A0A] font-medium transition hover:underline">Register</Link></p></div></Container></section>);
}
export function Register() {
  const [e, sE] = useState(""); const [p, sP] = useState(""); const [nm, sN] = useState(""); const [err, sErr] = useState(""); const [l, sL] = useState(false);
  const { register } = useAuth(); const n = useNavigate();
  const sub = async (ev) => { ev.preventDefault(); sErr(""); sL(true); try { await register(e, p, nm); n("/dashboard"); } catch (x) { sErr(x.message); } sL(false); };
  return (<section className="py-16"><Seo title="Register | PGI Hub" description="Create your PGI Hub account." canonical="https://pgihub.com/register" /><Container><div className="mx-auto max-w-sm rounded-2xl border border-[#E5E5E5] bg-white p-6 md:p-8 shadow-sm"><div className="mb-6 text-center"><div className="section-label mx-auto">Create account</div><h1 className="mt-4 text-2xl font-semibold text-[#0A0A0A]">Register</h1></div><OAuthButtons /><div className="relative my-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E5E5]"></div></div><div className="relative flex justify-center"><span className="bg-white px-3 text-[11px] text-[#9CA3AF]">or continue with email</span></div></div><form onSubmit={sub} className="space-y-4"><input value={nm} onChange={x=>sN(x.target.value)} placeholder="Full name" className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Full name" /><input value={e} onChange={x=>sE(x.target.value)} type="email" placeholder="Email" required className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Email" /><input value={p} onChange={x=>sP(x.target.value)} type="password" placeholder="Password" required className="glass-input rounded-xl px-4 py-3 text-sm" aria-label="Password" />{err&&<p className="text-sm text-red-600">{err}</p>}<button type="submit" disabled={l} className="primary-btn w-full rounded-xl px-5 py-3 text-sm font-medium">{l?"Creating...":"Create Account"}</button></form><p className="mt-4 text-center text-sm text-[#6B7280]">Have an account? <Link to="/login" className="text-[#0A0A0A] font-medium transition hover:underline">Sign In</Link></p></div></Container></section>);
}

/* ═══ OTHER PUBLIC ═══ */
export function Pricing() { return (<section className="py-16"><Seo title="Pricing | PGI Hub" description="Choose the right plan for your procurement and sourcing workflow." canonical="https://pgihub.com/pricing" /><Container><SectionTitle eyebrow="Pricing" title="Tailored Plans for Your Scale." description="Plans priced for any size business needs." /><div className="mt-10 grid gap-5 lg:grid-cols-2 max-w-3xl mx-auto"><PricingCardNew name="Starter" price="$39" sub="For growing teams" note="Covers the core features you need." points={["Production BOM intake and analysis","Saved sourcing cases","Project promotion","Responsive premium UI"]} /><PricingCardNew name="Enterprise" price="$99" sub="Full access · All premium" highlight note="Meets all premium procurement needs." points={["Unlimited workflow operations","Advanced RFQ, quote, order, analytics","Dedicated account manager","AI-driven production optimization"]} /></div></Container></section>); }
export function Insights() { return (<section className="py-16"><Seo title="Insights | PGI Hub" description="Read sourcing insights, manufacturing strategy, and supply chain analysis." canonical="https://pgihub.com/insights" /><Container><SectionTitle eyebrow="Insights" title="Procurement intelligence, presented cleanly." description="Charts, research, and market signals in a consistent premium surface." /><div className="mt-8 grid gap-4 md:grid-cols-3">{[{title:"Spend Trends",text:"Add future charts and trend summaries with the same premium card surface."},{title:"Supply Risk",text:"Surface vendor, lead time, and sourcing risk without changing the existing layout."},{title:"Market Signals",text:"Highlight logistics, tariff, and pricing changes in a consistent visual language."}].map(c=>(<div key={c.title} className="card p-6"><div className="mb-4 h-9 w-9 rounded-xl border border-[#E5E5E5] bg-[#F5F5F5]" /><h3 className="text-base font-semibold text-[#0A0A0A]">{c.title}</h3><p className="mt-2 text-sm leading-6 text-[#6B7280]">{c.text}</p></div>))}</div></Container></section>); }
export function Contact() { return (<section className="py-16"><Seo title="Contact | PGI Hub" description="Contact the PGI Hub team for sourcing, BOM, and procurement platform support." canonical="https://pgihub.com/contact" /><Container><div className="mx-auto max-w-3xl rounded-2xl border border-[#E5E5E5] bg-white p-8 shadow-sm"><SectionTitle align="left" eyebrow="Contact" title="Talk to the PGI team." description="The contact page is styled to match the rest of the platform." /><div className="mt-8 grid gap-4 md:grid-cols-2"><div className="card p-5"><div className="text-sm font-semibold text-[#0A0A0A]">Email</div><div className="mt-2 text-sm text-[#6B7280]">contact@pgihub.com</div></div><div className="card p-5"><div className="text-sm font-semibold text-[#0A0A0A]">Platform</div><div className="mt-2 text-sm text-[#6B7280]">AI sourcing marketplace and procurement control tower</div></div></div></div></Container></section>); }
export function NotFound() { return (<section className="py-20"><Container><div className="mx-auto max-w-2xl rounded-2xl border border-[#E5E5E5] bg-white px-6 py-16 text-center shadow-sm"><div className="section-label mx-auto">404</div><h1 className="mt-5 text-5xl font-semibold tracking-tight text-[#0A0A0A]">Page not found</h1><p className="mx-auto mt-4 max-w-md text-sm text-[#6B7280]">The page you are looking for does not exist or has been moved.</p><Link to="/" className="primary-btn mt-8 inline-flex rounded-lg px-6 py-3 text-sm font-medium">Return Home</Link></div></Container></section>); }
