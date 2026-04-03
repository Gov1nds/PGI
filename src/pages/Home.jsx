import React, { useState } from "react";
import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { Link, useNavigate } from "react-router-dom";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import {
  services,
  outdoorWorks,
  insights,
  newsItems,
  differentiators,
  processSteps,
  testimonials,
} from "../content/siteData.js";
import CountUp from "../components/CountUp.jsx";
import { RevealSection } from "../components/RevealSection.jsx";

/* ─── Marquee strip helper ─────────────────────────────── */
const Marquee = ({ children, speed = 40 }) => (
  <div className="marquee-outer" aria-hidden>
    <div className="marquee-track" style={{ "--speed": `${speed}s` }}>
      {children}
      {children}
    </div>
  </div>
);

/* ─── Workflow tab config ───────────────────────────────── */
const WORKFLOW_TABS = [
  "Intake",
  "Match",
  "RFQ",
  "Compare quotes",
  "Execute",
  "Track",
  "Analyze",
];

const QUICK_ACTIONS = [
  {
    label: "Find suppliers",
    draftText: "Find suppliers for my BOM with lead time, MOQ, and compliance filtering.",
  },
  {
    label: "Deep search suppliers",
    draftText: "Deep search suppliers for critical components, alternate parts, and regional sourcing.",
  },
  {
    label: "Research product",
    draftText: "Research the best manufacturing strategy for this part and identify supplier categories.",
  },
  {
    label: "Help center",
    draftText: "I need help understanding BOM upload, supplier matching, RFQ, comparison, and tracking.",
  },
];

/* ─── Hero search input ─────────────────────────────────── */
const HeroInput = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const submit = (draft = value) => {
    const next = draft.trim();
    if (!next) {
      navigate("/bom-analyzer");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("pgi_intake_draft", next);
    }

    navigate("/bom-analyzer", {
      state: {
        draftText: next,
        source: "home-hero",
      },
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))]" />
      <div className="relative">
        <textarea
          className="min-h-[110px] w-full resize-none rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-4 pr-12 text-[15px] leading-6 text-white outline-none placeholder:text-white/40 focus:border-sky-400/30"
          placeholder="Describe anything about product sourcing"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          aria-label="Describe your sourcing requirement"
        />

        <button
          type="button"
          onClick={() => submit()}
          className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/15 text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition hover:bg-white/20"
          aria-label="Send to BOM analyzer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </button>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {QUICK_ACTIONS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() =>
                navigate("/bom-analyzer", {
                  state: {
                    draftText: chip.draftText,
                    source: "home-quick-action",
                  },
                })
              }
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/15"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => submit()}
            className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_45px_rgba(14,165,233,0.25)] transition hover:bg-sky-400"
          >
            Upload BOM & Analyze
          </button>
          <Link
            to="/bom-analyzer?demo=1"
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/15"
          >
            Try with Demo Data
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
const Home = () => {
  const [activeTab, setActiveTab] = useState("Intake");

  return (
    <div className="home-root">
      <section className="relative overflow-hidden border-b border-white/8 bg-[#09071a] text-white">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(21, 12, 51, 0.28) 0%, rgba(9, 7, 26, 0.96) 100%), url('/images/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.36),transparent_42%),radial-gradient(circle_at_20%_70%,rgba(236,72,153,0.18),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,26,0.18),rgba(7,8,26,0.8))]" />

        <Container className="relative z-10 mx-auto max-w-7xl py-16 lg:py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              AI sourcing marketplace
            </span>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[72px] lg:leading-[0.95]">
              <span className="drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)]">Upload a BOM</span>{" "}
              <span className="text-white/90">or describe</span>
              <br className="hidden sm:block" />
              <span className="text-white/95">your sourcing needs.</span>
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-white/78 sm:text-xl">
              <span className="font-semibold text-white">Get suppliers, quotes, and cost insight</span>{" "}
              <span className="text-orange-300">Instantly.</span>
            </p>

            <div className="mt-10 w-full max-w-4xl">
              <HeroInput />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {[
                "Find suppliers",
                "Deep search suppliers",
                "Research product",
                "Help center",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75 backdrop-blur-md"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/bom-analyzer"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(34,211,238,0.25)] transition hover:bg-cyan-400"
              >
                Upload BOM & Analyze
              </Link>
              <Link
                to="/bom-analyzer?demo=1"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-medium text-white/85 transition hover:bg-white/15"
              >
                Try with Demo Data
              </Link>
            </div>

            <div className="mt-14 w-full max-w-4xl rounded-full border border-white/10 bg-black/20 p-2 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-full sm:grid-cols-7">
                {WORKFLOW_TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`rounded-full px-3 py-3 text-sm font-medium transition ${
                      activeTab === tab
                        ? "bg-orange-400 text-white shadow-[0_14px_30px_rgba(251,146,60,0.35)]"
                        : "text-white/70 hover:bg-white/8 hover:text-white"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* keep the rest of your current Home.jsx exactly as it is now, starting from
          the existing “How It Works” section onward */}

      {/* ════════════ HOW IT WORKS — Cursor-style clean ════════════ */}
      <RevealSection>
        <section className="section-light">
          <Container>
            <div className="section-eyebrow">How It Works</div>
            <h2 className="section-h2">Engineering-led manufacturing in 5 steps</h2>
            <p className="section-desc">
              From design review to global delivery — structured, reliable, scalable.
            </p>
            <div className="process-grid">
              {processSteps.map((step, idx) => (
                <div key={idx} className="process-card">
                  <div className="process-num">{idx + 1}</div>
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ════════════ SERVICES — Cursor alternating feature sections ════════════ */}
      <RevealSection>
        <section className="section-alt">
          <Container>
            <div className="section-eyebrow">Solutions</div>
            <h2 className="section-h2">Full-Spectrum Manufacturing Services</h2>
            <p className="section-desc">
              From concept to production — we cover every stage of the manufacturing lifecycle
              with precision and scalability.
            </p>
          </Container>

          <div className="services-list">
            {services.map((s, idx) => (
              <div key={idx} className={`service-feature ${idx % 2 === 1 ? "service-feature-rev" : ""}`}>
                <div className="service-feature-img-wrap">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="service-feature-img"
                    loading="lazy"
                  />
                </div>
                <div className="service-feature-body">
                  <span className="service-feature-num">0{idx + 1}</span>
                  <h3 className="service-feature-title">{s.title}</h3>
                  <p className="service-feature-desc">{s.desc}</p>
                  <Link to="/services" className="service-feature-link">
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Container>
            <div className="section-cta-wrap">
              <Link to="/services" className="hero-cta-primary">
                Explore all services →
              </Link>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ════════════ CAPABILITIES / NETWORK ════════════ */}
      <RevealSection>
        <section className="section-light">
          <Container>
            <div className="section-eyebrow">Manufacturing Network</div>
            <h2 className="section-h2">Distributed production ecosystem</h2>
            <p className="section-desc">
              Coordinated network of CNC, electronics, fabrication, and assembly partners
              across multiple regions.
            </p>
            <div className="capabilities-grid">
              {outdoorWorks.map((c, idx) => (
                <div key={idx} className="capability-card">
                  <img src={c.image} alt={c.title} className="capability-img" loading="lazy" />
                  <div className="capability-body">
                    <h3 className="capability-title">{c.title}</h3>
                    <p className="capability-desc">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-cta-wrap">
              <Link to="/capabilities" className="hero-cta-primary">
                View full network →
              </Link>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ════════════ DIFFERENTIATORS ════════════ */}
      <RevealSection>
        <section className="section-alt">
          <Container>
            <div className="section-eyebrow">Why PGI Hub</div>
            <h2 className="section-h2">Engineering-first manufacturing</h2>
            <p className="section-desc">
              We combine engineering expertise with a distributed network to deliver reliable
              production at scale.
            </p>
            <div className="diff-grid">
              {differentiators.map((d, idx) => (
                <div key={idx} className="diff-card">
                  <div className="diff-icon">{d.icon}</div>
                  <h3 className="diff-title">{d.title}</h3>
                  <p className="diff-desc">{d.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ════════════ TESTIMONIALS — Cursor marquee style ════════════ */}
      <RevealSection>
        <section className="section-light section-overflow">
          <Container>
            <div className="section-eyebrow">Results</div>
            <h2 className="section-h2">The new way to manufacture.</h2>
          </Container>

          <Marquee speed={44}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="testi-card">
                <div className="testi-metric">{t.metric}</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-footer">
                  <div className="testi-person">{t.person}</div>
                  <div className="testi-company">{t.company}</div>
                </div>
              </div>
            ))}
          </Marquee>
        </section>
      </RevealSection>

      {/* ════════════ INSIGHTS ════════════ */}
      <RevealSection>
        <section className="section-alt">
          <Container>
            <div className="section-eyebrow">Insights</div>
            <h2 className="section-h2">Manufacturing Intelligence</h2>
            <p className="section-desc">
              Articles on scaling hardware production, supply chains, and distributed
              manufacturing best practices.
            </p>
            <div className="card-grid-3">
              {insights.map((i, idx) => (
                <Link key={idx} to={`/insights/${i.slug}`} className="article-card">
                  <div className="article-img-wrap">
                    <img src={i.image} alt={i.title} className="article-img" loading="lazy" />
                    <span className="article-category">{i.category}</span>
                  </div>
                  <div className="article-body">
                    <h3 className="article-title">{i.title}</h3>
                    <p className="article-excerpt">{i.excerpt}</p>
                    <div className="article-footer">
                      <span className="article-read-time">{i.readTime}</span>
                      <span className="article-read-link">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="section-cta-wrap">
              <Link to="/insights" className="hero-cta-primary">
                Browse all insights →
              </Link>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ════════════ NEWS ════════════ */}
      <RevealSection>
        <section className="section-light">
          <Container>
            <div className="section-eyebrow">Network Updates</div>
            <h2 className="section-h2">Manufacturing Network News</h2>
            <p className="section-desc">
              Latest developments, partnerships, and operational milestones across the PGI
              ecosystem.
            </p>
            <div className="card-grid-3">
              {newsItems.map((n, idx) => (
                <Link key={idx} to={`/news/${n.slug}`} className="article-card">
                  <div className="article-img-wrap">
                    <img src={n.image} alt={n.title} className="article-img" loading="lazy" />
                    <span className="article-category">{n.category}</span>
                    <span className="article-date">{n.date}</span>
                  </div>
                  <div className="article-body">
                    <h3 className="article-title">{n.title}</h3>
                    <p className="article-excerpt">{n.excerpt}</p>
                    <span className="article-read-link">Read update →</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="section-cta-wrap">
              <Link to="/news" className="hero-cta-primary">
                View all updates →
              </Link>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ════════════ SPECIALTIES ════════════ */}
      <RevealSection>
        <section className="section-alt">
          <Container>
            <div className="section-eyebrow">Materials &amp; Processes</div>
            <h2 className="section-h2">Manufacturing Specialties</h2>
            <p className="section-desc">
              Comprehensive capabilities across multiple disciplines
            </p>
            <div className="spec-grid">
              {[
                {
                  category: "Materials",
                  items: ["Aluminum & Alloys", "Stainless Steel", "Titanium", "Brass & Copper", "Engineering Plastics", "Carbon Fiber"],
                },
                {
                  category: "Mechanical",
                  items: ["CNC Machining", "Sheet Metal", "Injection Molding", "Die Casting", "Precision Turning", "Custom Fabrication"],
                },
                {
                  category: "Electronics",
                  items: ["PCB Design Support", "Component Sourcing", "SMT Assembly", "Through-Hole Assembly", "PCBA Testing", "Conformal Coating"],
                },
                {
                  category: "Finishing",
                  items: ["Anodizing", "Powder Coating", "Plating", "Wire Harnesses", "Box Assembly", "Final Testing"],
                },
              ].map((spec, idx) => (
                <div key={idx} className="spec-card">
                  <h3 className="spec-category">{spec.category}</h3>
                  <ul className="spec-list">
                    {spec.items.map((item, i) => (
                      <li key={i} className="spec-item">
                        <span className="spec-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ════════════ BOTTOM CTA — Cursor style ════════════ */}
      <RevealSection>
        <section className="section-cta-final">
          <Container>
            <div className="final-cta-inner">
              <h2 className="final-cta-h2">Ready to optimize your production?</h2>
              <p className="final-cta-sub">
                Upload your BOM for instant analysis, or share your CAD files for a
                comprehensive engineering review. Our team responds within 24 hours.
              </p>
              <div className="final-cta-btns">
                <Link to="/bom-analyzer" className="hero-cta-primary">
                  Analyze BOM Free
                </Link>
                <Link to="/contact" className="hero-cta-ghost">
                  Contact Engineering →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </RevealSection>
    </div>
  );
};

export default Home;