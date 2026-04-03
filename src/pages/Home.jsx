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
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    draftText: "Find suppliers for my BOM with lead time, MOQ, and compliance filtering.",
  },
  {
    label: "Deep search suppliers",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 2v10l6.5-3" />
      </svg>
    ),
    draftText: "Deep search suppliers for critical components, alternate parts, and regional sourcing.",
  },
  {
    label: "Research product",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    draftText: "Research the best manufacturing strategy for this part and identify supplier categories.",
  },
  {
    label: "Help center",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
      </svg>
    ),
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
    <div className="hero-input-shell">
      <div className="hero-input-glow" />
      <div className="hero-input-inner">
        <textarea
          className="hero-textarea"
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
          className="hero-send-btn"
          aria-label="Send to BOM analyzer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Quick action chips */}
      <div className="hero-chips">
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
            className="hero-chip"
          >
            <span className="hero-chip-icon">{chip.icon}</span>
            {chip.label}
          </button>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="hero-input-ctas">
        <button
          type="button"
          onClick={() => submit()}
          className="hero-cta-upload"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload BOM &amp; Analyze
        </button>
        <Link
          to="/bom-analyzer?demo=1"
          className="hero-cta-demo"
        >
          Try with Demo Data
        </Link>
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

      {/* ════════════ HERO ════════════ */}
      <section className="hero-section">
        {/* Background layers */}
        <div className="hero-bg-base" aria-hidden />
        <div className="hero-bg-map" aria-hidden />
        <div className="hero-bg-circuit" aria-hidden />
        <div className="hero-bg-gradient" aria-hidden />
        <div className="hero-bg-glow" aria-hidden />

        <Container className="hero-container">
          {/* Badge */}
          <div className="hero-badge hero-anim-1">
            <span className="hero-badge-dot" />
            AI sourcing marketplace
          </div>

          {/* Headline */}
          <h1 className="hero-h1 hero-anim-2">
            <span className="hero-h1-bold">Upload a BOM</span>{" "}
            <span className="hero-h1-light">or describe</span>
            <br />
            <span className="hero-h1-light">your sourcing needs.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-sub hero-anim-3">
            <span className="hero-sub-bold">Get suppliers, quotes, and cost insight</span>{" "}
            <span className="hero-sub-accent">Instantly.</span>
          </p>

          {/* Input + CTAs */}
          <div className="hero-input-wrap hero-anim-4">
            <HeroInput />
          </div>

          {/* Workflow tabs */}
          <div className="hero-workflow hero-anim-5">
            <div className="hero-workflow-track">
              {WORKFLOW_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`hero-workflow-tab ${activeTab === tab ? "hero-workflow-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
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

      {/* ════════════ SERVICES ════════════ */}
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

      {/* ════════════ TESTIMONIALS ════════════ */}
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

      {/* ════════════ BOTTOM CTA ════════════ */}
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