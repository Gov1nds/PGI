import React, { useState } from "react";
import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { Link } from "react-router-dom";
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
import UniversalIntakeBox from "../components/UniversalIntakeBox";

<UniversalIntakeBox className="mt-6" />
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

/* ─── Hero search input ─────────────────────────────────── */
const HeroInput = () => {
  const [value, setValue] = useState("");
  return (
    <div className="hero-input-box">
      <textarea
        className="hero-input-textarea"
        placeholder="Describe your sourcing requirement — e.g. 1,000 SMT resistors, ISO-certified, 4-week lead time..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
      />
      <div className="hero-input-footer">
        <span className="hero-input-hint">Press Enter or click → to start sourcing</span>
        <Link to="/bom-analyzer" className="hero-input-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
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

      {/* ════════════ HERO — SourceReady style ════════════ */}
      <section className="hero-section">
        <div className="hero-mesh" aria-hidden />

        <Container className="hero-container">
          {/* Brand name */}
          <div className="hero-anim-1 hero-brand-name">PGI Hub</div>

          {/* Badge */}
          <div className="hero-anim-1" style={{ marginTop: "0.75rem" }}>
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              AI sourcing marketplace · procurement control tower
            </span>
          </div>

          {/* Headline — smaller, clean white */}
          <h1 className="hero-h1 hero-anim-2">
            Upload a BOM or describe a requirement.
            <br className="hidden sm:block" />
            <span className="hero-h1-accent"> Get suppliers, quotes, and cost insight instantly.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-sub hero-anim-3">
            Intake structured demand, match qualified suppliers, launch RFQs, compare quotes
            side by side, execute purchase decisions, track fulfillment, and record spend in
            one operational surface.
          </p>

          {/* Search input — SourceReady style */}
          <div className="hero-anim-4" style={{ width: "100%", maxWidth: 700 }}>
            <HeroInput />
          </div>

          {/* Quick action chips */}
          <div className="hero-chips hero-anim-4">
            {[
              { icon: "🔍", label: "Find suppliers" },
              { icon: "📋", label: "Upload BOM" },
              { icon: "📨", label: "Launch RFQ" },
              { icon: "📊", label: "Compare quotes" },
            ].map((chip) => (
              <Link key={chip.label} to="/bom-analyzer" className="hero-quick-chip">
                <span>{chip.icon}</span>
                {chip.label}
              </Link>
            ))}
          </div>

          {/* Tab strip */}
          <div className="hero-tabs-wrap hero-anim-4">
            <div className="hero-tabs">
              {WORKFLOW_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`hero-tab ${activeTab === tab ? "hero-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="hero-stats hero-anim-5">
            {[
              { val: 12200, suffix: "+", label: "Components" },
              { val: 300, suffix: "+", label: "Suppliers" },
              { val: 92, suffix: "%", label: "Match accuracy" },
            ].map((s, i) => (
              <div key={i} className="hero-stat">
                <div className="hero-stat-val">
                  <CountUp value={s.val} suffix={s.suffix} />
                </div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

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