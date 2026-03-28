import React from "react";
import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { Link } from "react-router-dom";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { services, outdoorWorks, insights, newsItems, differentiators, processSteps, testimonials } from "../content/siteData.js";
import CountUp from "../components/CountUp.jsx";
import { RevealSection } from "../components/RevealSection.jsx";

const Home = () => {
  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section className="bg-hero min-h-[92vh] flex items-center relative">
        <Container className="py-16 sm:py-24 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* LEFT */}
            <div>
              <div className="hero-anim-1">
                <span className="inline-flex items-center gap-2.5 rounded-full bg-sky-500/10 px-4 py-1.5 text-[11px] font-semibold text-sky-400 ring-1 ring-sky-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  Manufacturing Intelligence Platform
                </span>
              </div>

              <h1 className="mt-7 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.08] hero-anim-2">
                Global Manufacturing Network
                <span className="block mt-2 gradient-text">
                  + Intelligent BOM Optimization
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-white/70 hero-anim-3">
                Reduce sourcing costs up to 40%. Get instant manufacturing strategy, cost estimation, and supplier recommendations from a network of 300+ verified partners.
              </p>

              {/* Stats row */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 hero-anim-4">
                {[
                  { val: 12200, suffix: "+", label: "Components" },
                  { val: 300, suffix: "+", label: "Partners" },
                  { val: 92, suffix: "%", label: "Reliability" },
                  { val: 9, suffix: "+ yrs", label: "Experience" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06] text-center hover:bg-white/[0.05] hover:ring-white/[0.1] transition-all duration-300">
                    <div className="text-xl font-bold text-white tracking-tight">
                      <CountUp value={s.val} suffix={s.suffix} />
                    </div>
                    <div className="text-[10px] text-white/50 mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — BOM Analyzer Card */}
            <div className="hero-anim-5">
              <div className="relative">
                <div className="absolute -inset-6 rounded-3xl bg-sky-500/[0.04] blur-3xl" />

                <div className="relative rounded-2xl bg-[#0f1423/85] backdrop-blur-xl p-7 sm:p-8 ring-1 ring-sky-500/15 bom-glow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-sky-500/15 ring-1 ring-sky-500/25 flex items-center justify-center">
                      <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Analyze Your BOM Instantly</h3>
                      <p className="text-xs text-white/50">Free manufacturing intelligence</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-7">
                    {[
                      { text: "Part classification & material analysis" },
                      { text: "Cost estimation across regions" },
                      { text: "Global sourcing strategy" },
                      { text: "Lead time & logistics estimate" },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                        <div className="w-5 h-5 rounded-md bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{f.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5">
                    <Link
                      to="/bom-analyzer"
                      className="flex items-center justify-center gap-2 w-full rounded-xl btn-primary px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload BOM & Analyze
                    </Link>
                    <Link
                      to="/bom-analyzer"
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/55 ring-1 ring-white/[0.08] hover:bg-white/[0.07] hover:text-white/75 transition-all duration-300"
                    >
                      Try with Demo Data
                    </Link>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-white/40">
                    <svg className="w-3.5 h-3.5 text-emerald-500/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No sign-up required · Instant results · 100% free
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <RevealSection>
        <section className="py-24 bg-gradient-to-b from-[#080c15] to-[#0b0f1b]">
          <div className="section-divider mb-24" />
          <Container>
            <SectionHeading
              eyebrow="How It Works"
              title="Engineering-led manufacturing in 5 steps"
              desc="From design review to global delivery — structured, reliable, scalable."
            />
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="group rounded-xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06] hover:ring-sky-500/20 hover:bg-white/[0.04] transition-all duration-300 relative"
                >
                  <div className="text-2xl font-bold text-sky-500/15 mb-3 font-mono group-hover:text-sky-500/30 transition-colors">{step.number}</div>
                  <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
                  {idx < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 text-white/10">→</div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== SERVICES ========== */}
      <RevealSection>
        <section className="py-24">
          <div className="section-divider mb-24" />
          <Container>
            <SectionHeading
              eyebrow="Services"
              title="Complete manufacturing coordination"
              desc="End-to-end production management from engineering review to global delivery."
            />
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden hover:ring-sky-500/20 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080c15] via-transparent to-transparent opacity-50" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-[15px] font-bold text-white group-hover:text-sky-400 transition-colors">{s.title}</h3>
                    <p className="mt-2.5 text-sm text-white/60 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <PrimaryButton to="/services">Explore all services →</PrimaryButton>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== CAPABILITIES ========== */}
      <RevealSection>
        <section className="py-24 bg-gradient-to-b from-transparent to-sky-500/[0.02]">
          <div className="section-divider mb-24" />
          <Container>
            <SectionHeading
              eyebrow="Manufacturing Network"
              title="Distributed production ecosystem"
              desc="Coordinated network of CNC, electronics, fabrication, and assembly partners across multiple regions."
            />
            <div className="mt-16 grid gap-5 sm:grid-cols-2">
              {outdoorWorks.map((c, idx) => (
                <ImageCard key={idx} title={c.title} desc={c.desc} image={c.image} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <PrimaryButton to="/capabilities">View full network →</PrimaryButton>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== DIFFERENTIATORS ========== */}
      <RevealSection>
        <section className="py-24">
          <div className="section-divider mb-24" />
          <Container>
            <SectionHeading
              eyebrow="Why PGI Hub"
              title="Engineering-first manufacturing"
              desc="We combine engineering expertise with a distributed network to deliver reliable production at scale."
            />
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {differentiators.map((d, idx) => (
                <div key={idx} className="rounded-xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06] hover:ring-sky-500/15 hover:bg-white/[0.04] transition-all duration-300 group">
                  <div className="text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{d.icon}</div>
                  <h3 className="text-sm font-bold text-white">{d.title}</h3>
                  <p className="mt-2.5 text-sm text-white/60 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== TESTIMONIALS ========== */}
      <RevealSection>
        <section className="py-24 bg-gradient-to-b from-sky-500/[0.02] to-transparent">
          <div className="section-divider mb-24" />
          <Container>
            <SectionHeading eyebrow="Results" title="What our partners say" />
            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {testimonials.map((t, idx) => (
                <div key={idx} className="rounded-2xl bg-white/[0.02] p-7 ring-1 ring-white/[0.06] hover:ring-white/[0.1] transition-all duration-300">
                  <div className="inline-flex rounded-lg bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400 ring-1 ring-sky-500/20 mb-5">
                    {t.metric}
                  </div>
                  <p className="text-sm text-white/55 leading-[1.7] italic">"{t.quote}"</p>
                  <div className="mt-6 pt-5 border-t border-white/[0.06]">
                    <div className="text-sm font-bold text-white">{t.person}</div>
                    <div className="text-xs text-white/50 mt-0.5">{t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== INSIGHTS ========== */}
      <RevealSection>
        <section className="py-24">
          <div className="section-divider mb-24" />
          <Container>
            <SectionHeading
              eyebrow="Insights"
              title="Manufacturing Intelligence"
              desc="Articles on scaling hardware production, supply chains, and distributed manufacturing best practices."
            />
            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {insights.map((i, idx) => (
                <Link key={idx} to={`/insights/${i.slug}`}
                  className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden transition-all duration-300 hover:ring-sky-500/20 hover:bg-white/[0.04] hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img src={i.image} alt={i.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25 backdrop-blur-sm">
                        {i.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[15px] font-bold text-white group-hover:text-sky-400 transition-colors leading-snug">{i.title}</h3>
                    <p className="mt-2.5 text-sm text-white/60 flex-1">{i.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between text-xs text-white/40">
                      <span>{i.readTime}</span>
                      <span className="text-sky-400 font-semibold group-hover:text-sky-300 transition-colors">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <PrimaryButton to="/insights">Browse all insights →</PrimaryButton>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== NEWS ========== */}
      <RevealSection>
        <section className="py-24">
          <div className="section-divider mb-24" />
          <Container>
            <SectionHeading
              eyebrow="Network Updates"
              title="Manufacturing Network News"
              desc="Latest developments, partnerships, and operational milestones across the PGI ecosystem."
            />
            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {newsItems.map((n, idx) => (
                <Link key={idx} to={`/news/${n.slug}`}
                  className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden transition-all duration-300 hover:ring-sky-500/20 hover:bg-white/[0.04] hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25 backdrop-blur-sm">
                        {n.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] text-white/70 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                      {n.date}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[15px] font-bold text-white group-hover:text-sky-400 transition-colors leading-snug">{n.title}</h3>
                    <p className="mt-2.5 text-sm text-white/60 flex-1">{n.excerpt}</p>
                    <div className="mt-5 text-sky-400 text-sm font-semibold group-hover:text-sky-300 transition-colors">Read update →</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <PrimaryButton to="/news">View all updates →</PrimaryButton>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== SPECIALTIES ========== */}
      <RevealSection>
        <section className="py-24">
          <div className="section-divider mb-24" />
          <Container>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400 mb-4">
                <span className="w-8 h-px bg-gradient-to-r from-sky-500/60 to-sky-500/0" />
                Materials & Processes
                <span className="w-8 h-px bg-gradient-to-l from-sky-500/60 to-sky-500/0" />
              </div>
              <h2 className="mt-2 text-3xl font-bold text-white">Manufacturing Specialties</h2>
              <p className="mt-4 text-white/60 max-w-xl mx-auto text-sm">Comprehensive capabilities across multiple disciplines</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { category: "Materials", items: ["Aluminum & Alloys", "Stainless Steel", "Titanium", "Brass & Copper", "Engineering Plastics", "Carbon Fiber"] },
                { category: "Mechanical", items: ["CNC Machining", "Sheet Metal", "Injection Molding", "Die Casting", "Precision Turning", "Custom Fabrication"] },
                { category: "Electronics", items: ["PCB Design Support", "Component Sourcing", "SMT Assembly", "Through-Hole Assembly", "PCBA Testing", "Conformal Coating"] },
                { category: "Finishing", items: ["Anodizing", "Powder Coating", "Plating", "Wire Harnesses", "Box Assembly", "Final Testing"] }
              ].map((spec, idx) => (
                <div key={idx} className="rounded-xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06] hover:ring-sky-500/15 hover:bg-white/[0.04] transition-all duration-300">
                  <h3 className="text-sm font-bold text-sky-400 mb-5">{spec.category}</h3>
                  <ul className="space-y-2.5">
                    {spec.items.map((item, i) => (
                      <li key={i} className="text-sm text-white/60 flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-sky-500/30 shrink-0" />
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

      {/* ========== BOTTOM CTA ========== */}
      <RevealSection>
        <section className="py-24">
          <Container>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-cyan-500/10" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/8 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-[100px]" />

              <div className="relative p-10 md:p-16 ring-1 ring-sky-500/15 rounded-2xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to optimize your production?
                </h2>
                <p className="mt-5 text-white/65 max-w-2xl mx-auto leading-relaxed">
                  Upload your BOM for instant analysis, or share your CAD files for a comprehensive engineering review. Our team responds within 24 hours.
                </p>
                <div className="mt-9 flex gap-3 justify-center flex-wrap">
                  <PrimaryButton to="/bom-analyzer">Analyze BOM Free</PrimaryButton>
                  <SecondaryButton to="/contact">Contact Engineering</SecondaryButton>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </RevealSection>
    </div>
  );
};

export default Home;
