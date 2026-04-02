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
      {/* ========== HERO SECTION — AI Sourcing Marketplace / Control Tower ========== */}
      <section className="bg-hero min-h-[92vh] flex items-center relative">
        <Container className="py-16 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr]">
            {/* LEFT — Product message */}
            <div className="max-w-2xl">
              <div className="hero-anim-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-white/[0.78] backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_0_6px_rgba(125,211,252,0.12)]" />
                  AI sourcing marketplace · procurement control tower
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.9rem] lg:leading-[1.02] hero-anim-2">
                Upload a BOM or describe a requirement.
                <span className="mt-2 block bg-gradient-to-r from-white via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                  Get suppliers, quotes, and cost insight instantly.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/[0.72] hero-anim-3">
                Intake structured demand, match qualified suppliers, launch RFQs, compare quotes side by side, execute purchase decisions, track fulfillment, and record spend in one operational surface.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5 hero-anim-4">
                {[
                  "Intake",
                  "Match",
                  "RFQ",
                  "Compare quotes",
                  "Execute",
                  "Track",
                  "Analyze",
                ].map((step) => (
                  <span
                    key={step}
                    className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-2 text-[12px] font-medium text-white/[0.72] backdrop-blur-sm"
                  >
                    {step}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 hero-anim-4">
                {[
                  { val: 12200, suffix: "+", label: "Components" },
                  { val: 300, suffix: "+", label: "Suppliers" },
                  { val: 92, suffix: "%", label: "Match accuracy" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                  >
                    <div className="text-xl font-semibold text-white">
                      <CountUp value={s.val} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/[0.55]">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — action surface */}
            <div className="hero-anim-5">
              <div className="relative">
                <div className="absolute -inset-8 rounded-[2.25rem] bg-sky-500/10 blur-3xl" />
                <div className="absolute -right-10 top-8 h-36 w-36 rounded-full bg-indigo-500/15 blur-3xl" />
                <div className="absolute left-4 bottom-0 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[rgba(16,22,38,0.86)] shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-7">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 ring-1 ring-sky-400/20">
                        <svg className="h-5 w-5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.9}
                            d="M12 16.5v-9m0 0 3.5 3.5M12 7.5 8.5 11M4 19.5h16"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">Sourcing workspace</h3>
                        <p className="text-xs text-white/[0.55]">Upload BOM · describe requirement · start matching</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                      Live workflow
                    </span>
                  </div>

                  <div className="px-6 py-6 sm:px-7">
                    <div className="rounded-[1.35rem] border border-dashed border-white/[0.12] bg-white/[0.025] p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                          <svg className="h-5 w-5 text-white/[0.76]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white/[0.92]">
                            Drop a BOM, paste part numbers, or type a procurement request
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-white/[0.58]">
                            Normalize demand, identify sourcing gaps, and generate the next action automatically.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-[rgba(8,12,22,0.72)] p-4 ring-1 ring-white/[0.04]">
                        <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">Example requirement</div>
                        <div className="mt-2 text-sm leading-relaxed text-white/88">
                          1,000 units · SMT resistors · ISO-certified suppliers · 4-week lead time · target cost under budget
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Link
                          to="/bom-analyzer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl btn-primary px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300"
                        >
                          Upload BOM & analyze
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h14m-7-7 7 7-7 7"
                            />
                          </svg>
                        </Link>
                        <Link
                          to="/capabilities"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-white/[0.82] transition-all duration-300 hover:bg-white/[0.07] hover:text-white"
                        >
                          Explore workflow
                        </Link>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {[
                        "Supplier matching",
                        "RFQ automation",
                        "Quote comparison",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-3 text-center text-[12px] font-medium text-white/[0.66]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========== TRUSTED BY / PROCESS ========== */}

      <RevealSection>
        <section className="border-b border-white/[0.04] py-20 bg-gradient-to-b from-[rgb(10,15,26)] to-[rgb(13,18,30)]">
          <Container>
            <SectionHeading
              eyebrow="How It Works"
              title="Engineering-led manufacturing in 5 steps"
              desc="From design review to global delivery — structured, reliable, scalable."
            />
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="group rounded-xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06] hover:ring-sky-500/20 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sky-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-semibold mb-4 ring-1 ring-sky-500/20">
                      {idx + 1}
                    </div>
                    <h3 className="text-[15px] font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== SERVICES ========== */}
      <RevealSection>
        <section className="border-b border-white/[0.04] py-20 bg-gradient-to-b from-transparent to-white/[0.01]">
          <Container>
            <SectionHeading
              eyebrow="Solutions"
              title="Full-Spectrum Manufacturing Services"
              desc="From concept to production — we cover every stage of the manufacturing lifecycle with precision and scalability."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s, idx) => (
                <div key={idx} className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden transition-all duration-300 hover:ring-sky-500/20 hover:bg-white/[0.04]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgb(10,15,26)] via-transparent to-transparent opacity-50" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-[15px] font-semibold text-white group-hover:text-sky-400 transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/[0.75] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <PrimaryButton to="/services">Explore all services →</PrimaryButton>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== CAPABILITIES / NETWORK ========== */}
      <RevealSection>
        <section className="border-b border-white/[0.04] py-20 bg-gradient-to-b from-transparent to-sky-500/[0.02]">
          <Container>
            <SectionHeading
              eyebrow="Manufacturing Network"
              title="Distributed production ecosystem"
              desc="Coordinated network of CNC, electronics, fabrication, and assembly partners across multiple regions."
            />
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {outdoorWorks.map((c, idx) => (
                <ImageCard key={idx} title={c.title} desc={c.desc} image={c.image} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <PrimaryButton to="/capabilities">View full network →</PrimaryButton>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== DIFFERENTIATORS ========== */}
      <RevealSection>
        <section className="border-b border-white/[0.04] py-20">
          <Container>
            <SectionHeading
              eyebrow="Why PGI Hub"
              title="Engineering-first manufacturing"
              desc="We combine engineering expertise with a distributed network to deliver reliable production at scale."
            />
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {differentiators.map((d, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06] hover:ring-sky-500/15 transition-all duration-300"
                >
                  <div className="text-2xl mb-3">{d.icon}</div>
                  <h3 className="text-sm font-semibold text-white">{d.title}</h3>
                  <p className="mt-2 text-sm text-white/[0.75] leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== TESTIMONIALS ========== */}
      <RevealSection>
        <section className="border-b border-white/[0.04] py-20 bg-gradient-to-b from-sky-500/[0.02] to-transparent">
          <Container>
            <SectionHeading eyebrow="Results" title="What our partners say" />
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {testimonials.map((t, idx) => (
                <div key={idx} className="rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06]">
                  <div className="inline-flex rounded-lg bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/20 mb-4">
                    {t.metric}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed italic">"{t.quote}"</p>
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <div className="text-sm font-semibold text-white">{t.person}</div>
                    <div className="text-xs text-white/[0.70]">{t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== INSIGHTS SECTION ========== */}
      <RevealSection>
        <section className="border-b border-white/[0.04] py-20">
          <Container>
            <SectionHeading
              eyebrow="Insights"
              title="Manufacturing Intelligence"
              desc="Articles on scaling hardware production, supply chains, and distributed manufacturing best practices."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {insights.map((i, idx) => (
                <Link
                  key={idx}
                  to={`/insights/${i.slug}`}
                  className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden transition-all duration-300 hover:ring-sky-500/20 hover:bg-white/[0.04] flex flex-col"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={i.image}
                      alt={i.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25 backdrop-blur-sm">
                        {i.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[15px] font-semibold text-white group-hover:text-sky-400 transition-colors leading-snug">
                      {i.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/[0.75] flex-1">{i.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                      <span>{i.readTime}</span>
                      <span className="text-sky-400 font-medium group-hover:text-sky-300 transition-colors">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <PrimaryButton to="/insights">Browse all insights →</PrimaryButton>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== NEWS SECTION ========== */}
      <RevealSection>
        <section className="border-b border-white/[0.04] py-20">
          <Container>
            <SectionHeading
              eyebrow="Network Updates"
              title="Manufacturing Network News"
              desc="Latest developments, partnerships, and operational milestones across the PGI ecosystem."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {newsItems.map((n, idx) => (
                <Link
                  key={idx}
                  to={`/news/${n.slug}`}
                  className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden transition-all duration-300 hover:ring-sky-500/20 hover:bg-white/[0.04] flex flex-col"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25 backdrop-blur-sm">
                        {n.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] text-white/[0.80] bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                      {n.date}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[15px] font-semibold text-white group-hover:text-sky-400 transition-colors leading-snug">
                      {n.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/[0.75] flex-1">{n.excerpt}</p>
                    <div className="mt-4 text-sky-400 text-sm font-medium group-hover:text-sky-300 transition-colors">
                      Read update →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <PrimaryButton to="/news">View all updates →</PrimaryButton>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* ========== SPECIALTIES ========== */}
      <RevealSection>
        <section className="border-b border-white/[0.04] py-20">
          <Container>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-sky-400 mb-3">
                <span className="w-6 h-px bg-sky-500/50" />
                Materials & Processes
                <span className="w-6 h-px bg-sky-500/50" />
              </div>
              <h2 className="mt-2 text-3xl font-semibold text-white">Manufacturing Specialties</h2>
              <p className="mt-3 text-white/[0.75] max-w-xl mx-auto text-sm">
                Comprehensive capabilities across multiple disciplines
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  category: "Materials",
                  items: [
                    "Aluminum & Alloys",
                    "Stainless Steel",
                    "Titanium",
                    "Brass & Copper",
                    "Engineering Plastics",
                    "Carbon Fiber",
                  ],
                },
                {
                  category: "Mechanical",
                  items: [
                    "CNC Machining",
                    "Sheet Metal",
                    "Injection Molding",
                    "Die Casting",
                    "Precision Turning",
                    "Custom Fabrication",
                  ],
                },
                {
                  category: "Electronics",
                  items: [
                    "PCB Design Support",
                    "Component Sourcing",
                    "SMT Assembly",
                    "Through-Hole Assembly",
                    "PCBA Testing",
                    "Conformal Coating",
                  ],
                },
                {
                  category: "Finishing",
                  items: [
                    "Anodizing",
                    "Powder Coating",
                    "Plating",
                    "Wire Harnesses",
                    "Box Assembly",
                    "Final Testing",
                  ],
                },
              ].map((spec, idx) => (
                <div key={idx} className="rounded-xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06]">
                  <h3 className="text-sm font-semibold text-sky-400 mb-4">{spec.category}</h3>
                  <ul className="space-y-2">
                    {spec.items.map((item, i) => (
                      <li key={i} className="text-sm text-white/[0.75] flex items-center gap-2.5">
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
        <section className="py-20">
          <Container>
            <div className="relative rounded-2xl overflow-hidden">
              {/* BG glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-cyan-500/10" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/8 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-[80px]" />

              <div className="relative p-8 md:p-14 ring-1 ring-sky-500/15 rounded-2xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to optimize your production?
                </h2>
                <p className="mt-4 text-white/[0.80] max-w-2xl mx-auto leading-relaxed">
                  Upload your BOM for instant analysis, or share your CAD files for a comprehensive engineering review. Our team responds within 24 hours.
                </p>
                <div className="mt-8 flex gap-3 justify-center flex-wrap">
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