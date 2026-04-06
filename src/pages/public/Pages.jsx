import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, StatusBadge } from "../../components/Shared";
import { analyzeBOM, createSearch, promoteToProject, saveAsSourcingCase } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Seo, { siteSchema, orgSchema } from "../../components/Seo";

function HeroStat({ value, label, hint }) {
  return (
    <div className="surface p-5">
      <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
      {hint && <div className="mt-3 text-sm text-muted">{hint}</div>}
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="card p-6">
      <div className="mb-4 h-10 w-10 rounded-2xl border border-white/10 bg-white/5 shadow-soft" />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      <div className="section-label">{eyebrow}</div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-sm leading-7 text-muted md:text-base">{description}</p>}
    </div>
  );
}

function WorkflowStep({ n, title, text }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white/90">{n}</div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}

function PricingCard({ name, price, points, highlight = false }) {
  return (
    <div className={`surface-strong p-6 ${highlight ? "border-white/15 shadow-[0_24px_60px_rgba(111,92,255,0.18)]" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{name}</div>
          <div className="mt-1 text-sm text-muted">For teams building sourcing workflows</div>
        </div>
        {highlight && <span className="badge-pill border-purple-400/15 bg-purple-500/10 text-purple-200">Popular</span>}
      </div>
      <div className="mt-6 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight text-white">{price}</span>
        <span className="pb-1 text-sm text-muted">/ month</span>
      </div>
      <div className="mt-6 space-y-3">
        {points.map((p) => (
          <div key={p} className="flex items-start gap-3 text-sm text-white/80">
            <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent-2)] shadow-[0_0_18px_rgba(143,121,255,0.45)]" />
            <span>{p}</span>
          </div>
        ))}
      </div>
      <button className={`mt-6 w-full rounded-2xl px-5 py-3 text-sm font-medium ${highlight ? "primary-btn" : "secondary-btn"}`}>Get Started</button>
    </div>
  );
}

function LogoSlot() {
  return (
    <div className="flex h-14 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/95 shadow-[0_12px_38px_rgba(0,0,0,0.22)]">
      <img src="/logo.svg" alt="PGI Hub" className="h-10 w-auto" />
    </div>
  );
}

export function Home() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState("text");
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      if (mode === "file" && file) {
        setResult({ type: "bom", ...(await analyzeBOM(file, "", "USD", "balanced")) });
      } else if (query.trim()) {
        setResult({ type: "search", ...(await createSearch(query.trim(), query.includes("\n") ? "bom_text" : "component")) });
      } else {
        setError("Enter a part number, paste a BOM, or upload a file.");
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const proceed = async () => {
    if (!result) return;
    const sid = result.search_session_id || result.id;
    if (!sid) return;
    try {
      if (result.recommended_flow === "project" || (result.total_parts || 0) > 3) {
        const p = await promoteToProject(sid);
        nav(`/project/${p.project_id}`);
      } else {
        await saveAsSourcingCase(sid, query.trim().slice(0, 50) || "Quick analysis");
        nav(user ? "/dashboard" : "/register");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const highlights = useMemo(
    () => [
      { value: "1 min", label: "Upload to insight", hint: "Parse BOMs or describe sourcing needs instantly." },
      { value: "Ranked", label: "vendor scoring", hint: "Compare cost, lead time, and risk in one view." },
      { value: "End-to-end", label: "workflow coverage", hint: "Move from analysis to RFQ, order, and tracking." },
    ],
    []
  );

  return (
    <>
      <Seo
        title="PGI Hub | AI Sourcing Marketplace"
        description="Upload a BOM or describe your sourcing needs. Get suppliers, quotes, and cost insight instantly."
        canonical="https://pgihub.com/"
        schema={[siteSchema, orgSchema]}
      />

      <section className="relative overflow-hidden pt-10 md:pt-16">
        <Container>
          <div className="relative mx-auto max-w-6xl">
            <div className="grid-orb one" />
            <div className="grid-orb two" />
            <div className="grid-orb three" />

            <div className="mx-auto mb-8 flex w-fit items-center gap-3">
              <LogoSlot />
              <div className="hero-pill text-[12px]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-2)] shadow-[0_0_20px_rgba(143,121,255,0.55)]" />
                <span>AI sourcing marketplace</span>
              </div>
            </div>

            <div className="mx-auto max-w-4xl text-center">
              <h1 className="hero-title text-5xl font-semibold text-white sm:text-6xl lg:text-[5.25rem]">
                Upload a BOM or describe your sourcing needs.
              </h1>
              <p className="hero-subtitle mx-auto mt-6 max-w-2xl text-base leading-8 md:text-lg">
                Get suppliers, quotes, and cost insight instantly. Match vendors, compare options, and move from analysis to execution in one unified system.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <div className="hero-surface rounded-[28px] p-4 md:p-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    { k: "text", l: "Part Number" },
                    { k: "paste", l: "Paste BOM" },
                    { k: "file", l: "Upload File" },
                  ].map((m) => (
                    <button key={m.k} onClick={() => setMode(m.k)} className={`tab-chip ${mode === m.k ? "active" : ""}`}>
                      {m.l}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {mode === "text" && (
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Describe anything about product sourcing"
                      className="glass-input rounded-[22px] px-5 py-4 text-base"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") analyze();
                      }}
                    />
                  )}
                  {mode === "paste" && (
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows={5}
                      placeholder="Paste BOM text here - one component per line."
                      className="glass-textarea rounded-[22px] px-5 py-4 text-base"
                    />
                  )}
                  {mode === "file" && (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-white/[0.025] px-5 py-10 text-center transition hover:bg-white/[0.04]">
                      <span className="text-sm text-white/70">
                        {file ? `${file.name} (${(file.size / 1024).toFixed(1)} KB)` : "Drop a CSV or XLSX file here"}
                      </span>
                      <span className="mt-1 text-xs text-white/40">CSV, XLSX, XLS, TSV</span>
                      <input type="file" accept=".csv,.xlsx,.xls,.tsv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button onClick={analyze} disabled={loading} className="primary-btn rounded-[22px] px-6 py-4 text-sm font-medium">
                    {loading ? "Analyzing..." : "Analyze BOM & Find Sources"}
                  </button>
                  <button onClick={() => nav("/analyze")} className="secondary-btn rounded-[22px] px-6 py-4 text-sm font-medium">
                    Open Analysis Studio
                  </button>
                </div>

                {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
              </div>

              {result && (
                <div className="mt-6 surface-strong rounded-[28px] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
                    <StatusBadge status="analyzed" />
                  </div>

                  {result.total_parts > 0 && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <HeroStat value={result.total_parts} label="parts" hint="Items detected in the intake." />
                      {result.analysis?.total_cost_range?.low != null && (
                        <HeroStat value={`$${result.analysis.total_cost_range.low.toLocaleString()}`} label="low estimate" />
                      )}
                      {result.analysis?.total_cost_range?.high != null && (
                        <HeroStat value={`$${result.analysis.total_cost_range.high.toLocaleString()}`} label="high estimate" />
                      )}
                    </div>
                  )}

                  {result.analysis?.rfq_required_count > 0 && (
                    <p className="mt-4 text-sm text-white/65">
                      {result.analysis.rfq_required_count} parts require RFQ · {result.analysis.needs_review_count || 0} need review
                    </p>
                  )}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button onClick={proceed} className="primary-btn rounded-2xl px-6 py-3 text-sm font-medium">
                      {user ? "Save & Continue" : "Continue as Guest"}
                    </button>
                    {!user && (
                      <Link to="/register" className="secondary-btn rounded-2xl px-6 py-3 text-sm">
                        Sign Up to Save
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="relative mt-16 border-t border-white/[0.06] py-16">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((h) => (
              <HeroStat key={h.label} value={h.value} label={h.label} hint={h.hint} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <SectionTitle
            eyebrow="Platform capabilities"
            title="Everything your sourcing workflow needs in one premium system."
            description="Keep the existing business logic intact while elevating the interface into a dark, high-contrast, glass-morphism control layer."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Upload & Analyze"
              description="Upload a BOM or type a component. Get classification, cost estimates, and risk flags with a polished intake experience."
            />
            <FeatureCard
              title="Ranked Vendors"
              description="Vendors are ranked by price, lead time, reliability, compliance, and capacity with explainable scoring."
            />
            <FeatureCard
              title="End-to-End Workflow"
              description="RFQ, quote comparison, PO, shipment tracking, and spend analytics stay connected across the entire lifecycle."
            />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-strong p-7">
              <SectionTitle
                align="left"
                eyebrow="How it works"
                title="A smooth workflow from intake to supplier execution."
                description="The home page now mirrors the reference mood: centered, dark, premium, and visually calm."
              />
              <div className="mt-8 grid gap-4">
                <WorkflowStep n="01" title="Describe your need" text="Paste a BOM, upload a spreadsheet, or type a part number." />
                <WorkflowStep n="02" title="Run AI analysis" text="Extract parts, estimate cost, flag risks, and determine which items need RFQ." />
                <WorkflowStep n="03" title="Compare suppliers" text="Use explainable ranking to balance price, logistics, tariffs, and lead time." />
                <WorkflowStep n="04" title="Execute faster" text="Promote to project, send RFQs, compare quotes, and track delivery in one flow." />
              </div>
            </div>
            <div className="grid gap-4">
              <HeroStat value="24/7" label="available" hint="Built for continuous procurement teams and vendors." />
              <HeroStat value="Premium" label="visual language" hint="Dark navy, violet glow, glass surfaces, and subtle depth." />
              <HeroStat value="Unified" label="system design" hint="Shared surfaces, buttons, cards, and navigation across the app." />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.06] py-16">
        <Container>
          <div className="grid gap-4 lg:grid-cols-2">
            <PricingCard
              name="Starter"
              price="$39"
              points={[
                "Production BOM intake and analysis",
                "Saved sourcing cases and project promotion",
                "Responsive premium UI theme",
              ]}
            />
            <PricingCard
              name="Enterprise"
              price="$99"
              points={[
                "Unlimited workflow operations",
                "Advanced RFQ, quote, order, and analytics views",
                "Ideal for procurement and manufacturing teams",
              ]}
              highlight
            />
          </div>
        </Container>
      </section>
    </>
  );
}

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
  const { user } = useAuth();

  const run = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      if (mode === "file" && file) setResult(await analyzeBOM(file, loc, cur, "balanced"));
      else if (text.trim()) setResult({ type: "search", ...(await createSearch(text.trim(), text.includes("\n") ? "bom_text" : "component")) });
      else setError("Provide input.");
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const promote = async () => {
    const sid = result?.search_session_id || result?.id;
    if (!sid) return;
    try {
      const p = await promoteToProject(sid);
      nav(`/project/${p.project_id}`);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="py-14">
      <Seo
        title="Analyze BOM | PGI Hub"
        description="Upload a BOM, type a part number, or paste component text for AI sourcing analysis."
        canonical="https://pgihub.com/analyze"
      />
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="surface-strong p-6 md:p-8">
            <SectionTitle
              align="left"
              eyebrow="Analysis studio"
              title="Upload a BOM, type a part number, or paste component text."
              description="This page keeps the same logic but uses the new premium dark theme and glass surfaces."
            />

            <div className="mt-6 flex flex-wrap gap-2">
              {[{ k: "file", l: "Upload File" }, { k: "text", l: "Part Number" }, { k: "paste", l: "Paste BOM" }].map((m) => (
                <button key={m.k} onClick={() => setMode(m.k)} className={`tab-chip ${mode === m.k ? "active" : ""}`}>{m.l}</button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {mode === "file" && (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[22px] border border-dashed border-white/10 bg-white/[0.025] px-4 py-10 text-center transition hover:bg-white/[0.04]">
                  <span className="text-sm text-white/70">{file ? file.name : "Drop CSV/XLSX"}</span>
                  <input type="file" accept=".csv,.xlsx,.xls,.tsv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              )}
              {mode === "text" && <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Part number or name" className="glass-input rounded-[18px] px-4 py-3 text-sm" />}
              {mode === "paste" && <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="One component per line" className="glass-textarea rounded-[18px] px-4 py-3 text-sm" />}
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Delivery location" className="glass-input rounded-[18px] px-4 py-3 text-sm" />
                <select value={cur} onChange={(e) => setCur(e.target.value)} className="glass-input rounded-[18px] px-4 py-3 text-sm">
                  {["USD", "EUR", "INR", "CNY", "JPY", "GBP"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {error && <p className="text-sm text-red-200">{error}</p>}
              <button onClick={run} disabled={loading} className="primary-btn w-full rounded-2xl px-6 py-3 text-sm font-medium">
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>

          {result && (
            <div className="surface mt-6 p-6">
              <h3 className="text-lg font-semibold text-white">Results</h3>
              {result.total_parts != null && <p className="mt-2 text-sm text-white/75">{result.total_parts} parts analyzed</p>}
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={promote} className="primary-btn rounded-2xl px-5 py-2.5 text-sm">Create Project</button>
                {!user && <Link to="/register" className="secondary-btn rounded-2xl px-5 py-2.5 text-sm">Sign Up</Link>}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export function Login() {
  const [e, sE] = useState("");
  const [p, sP] = useState("");
  const [err, sErr] = useState("");
  const [l, sL] = useState(false);
  const { login } = useAuth();
  const n = useNavigate();

  const sub = async (ev) => {
    ev.preventDefault();
    sErr("");
    sL(true);
    try {
      await login(e, p);
      n("/dashboard");
    } catch (x) {
      sErr(x.message);
    }
    sL(false);
  };

  return (
    <section className="py-16">
      <Seo
        title="Sign In | PGI Hub"
        description="Sign in to access your sourcing dashboard."
        canonical="https://pgihub.com/login"
      />
      <Container>
        <div className="mx-auto max-w-sm surface-strong p-6 md:p-8">
          <div className="mb-6 text-center">
            <div className="section-label mx-auto">Welcome back</div>
            <h1 className="mt-4 text-2xl font-semibold text-white">Sign In</h1>
          </div>
          <form onSubmit={sub} className="space-y-4">
            <input value={e} onChange={(x) => sE(x.target.value)} type="email" placeholder="Email" required className="glass-input rounded-2xl px-4 py-3 text-sm" />
            <input value={p} onChange={(x) => sP(x.target.value)} type="password" placeholder="Password" required className="glass-input rounded-2xl px-4 py-3 text-sm" />
            {err && <p className="text-sm text-red-200">{err}</p>}
            <button type="submit" disabled={l} className="primary-btn w-full rounded-2xl px-5 py-3 text-sm font-medium">
              {l ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted">
            No account? <Link to="/register" className="text-white transition hover:text-[var(--accent-2)]">Register</Link>
          </p>
        </div>
      </Container>
    </section>
  );
}

export function Register() {
  const [e, sE] = useState("");
  const [p, sP] = useState("");
  const [nm, sN] = useState("");
  const [err, sErr] = useState("");
  const [l, sL] = useState(false);
  const { register } = useAuth();
  const n = useNavigate();

  const sub = async (ev) => {
    ev.preventDefault();
    sErr("");
    sL(true);
    try {
      await register(e, p, nm);
      n("/dashboard");
    } catch (x) {
      sErr(x.message);
    }
    sL(false);
  };

  return (
    <section className="py-16">
      <Seo
        title="Register | PGI Hub"
        description="Create your PGI Hub account."
        canonical="https://pgihub.com/register"
      />
      <Container>
        <div className="mx-auto max-w-sm surface-strong p-6 md:p-8">
          <div className="mb-6 text-center">
            <div className="section-label mx-auto">Create account</div>
            <h1 className="mt-4 text-2xl font-semibold text-white">Register</h1>
          </div>
          <form onSubmit={sub} className="space-y-4">
            <input value={nm} onChange={(x) => sN(x.target.value)} placeholder="Full name" className="glass-input rounded-2xl px-4 py-3 text-sm" />
            <input value={e} onChange={(x) => sE(x.target.value)} type="email" placeholder="Email" required className="glass-input rounded-2xl px-4 py-3 text-sm" />
            <input value={p} onChange={(x) => sP(x.target.value)} type="password" placeholder="Password" required className="glass-input rounded-2xl px-4 py-3 text-sm" />
            {err && <p className="text-sm text-red-200">{err}</p>}
            <button type="submit" disabled={l} className="primary-btn w-full rounded-2xl px-5 py-3 text-sm font-medium">
              {l ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted">
            Have an account? <Link to="/login" className="text-white transition hover:text-[var(--accent-2)]">Sign In</Link>
          </p>
        </div>
      </Container>
    </section>
  );
}

export function Pricing() {
  return (
    <section className="py-16">
      <Seo
        title="Pricing | PGI Hub"
        description="Choose the right plan for your procurement and sourcing workflow."
        canonical="https://pgihub.com/pricing"
      />
      <Container>
        <SectionTitle
          eyebrow="Pricing"
          title="Simple plans for the sourcing team."
          description="Keep this section aligned to the same dark glass design language."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <PricingCard
            name="Starter"
            price="$39"
            points={[
              "Production BOM intake and analysis",
              "Saved sourcing cases and project promotion",
              "Responsive premium UI theme",
            ]}
          />
          <PricingCard
            name="Enterprise"
            price="$99"
            points={[
              "Unlimited workflow operations",
              "Advanced RFQ, quote, order, and analytics views",
              "Ideal for procurement and manufacturing teams",
            ]}
            highlight
          />
        </div>
      </Container>
    </section>
  );
}

export function Insights() {
  return (
    <section className="py-16">
      <Seo
        title="Insights | PGI Hub"
        description="Read sourcing insights, manufacturing strategy, and supply chain analysis."
        canonical="https://pgihub.com/insights"
      />
      <Container>
        <SectionTitle
          eyebrow="Insights"
          title="Procurement intelligence, presented cleanly."
          description="This page is ready for charts, research, and market signals while matching the new theme."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <FeatureCard title="Spend Trends" description="Add future charts and trend summaries here with the same premium card surface." />
          <FeatureCard title="Supply Risk" description="Surface vendor, lead time, and sourcing risk without changing the existing layout." />
          <FeatureCard title="Market Signals" description="Highlight logistics, tariff, and pricing changes in a consistent visual language." />
        </div>
      </Container>
    </section>
  );
}

export function Contact() {
  return (
    <section className="py-16">
      <Seo
        title="Contact | PGI Hub"
        description="Contact the PGI Hub team for sourcing, BOM, and procurement platform support."
        canonical="https://pgihub.com/contact"
      />
      <Container>
        <div className="mx-auto max-w-3xl surface-strong p-8">
          <SectionTitle
            align="left"
            eyebrow="Contact"
            title="Talk to the PGI team."
            description="The contact page is now styled like the rest of the platform."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <div className="text-sm font-semibold text-white">Email</div>
              <div className="mt-2 text-sm text-muted">contact@pgihub.com</div>
            </div>
            <div className="card p-5">
              <div className="text-sm font-semibold text-white">Platform</div>
              <div className="mt-2 text-sm text-muted">AI sourcing marketplace and procurement control tower</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function NotFound() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-2xl surface-strong px-6 py-16 text-center">
          <div className="section-label mx-auto">404</div>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">The page you are looking for does not exist or has been moved.</p>
          <Link to="/" className="primary-btn mt-8 rounded-2xl px-6 py-3 text-sm font-medium">
            Return Home
          </Link>
        </div>
      </Container>
    </section>
  );
}