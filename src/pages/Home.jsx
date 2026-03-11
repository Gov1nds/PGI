import React from "react";
import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { services, outdoorWorks, insights, newsItems, differentiators, processSteps } from "../content/siteData.js";
import CountUp from "../components/CountUp.jsx";import PremiumMetricsSection from "../components/PremiumMetricsSection.jsx";

const Home = () => {
  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section className="bg-hero border-b border-white/10">
        <Container className="py-14 sm:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* LEFT - TEXT & CTA */}
            <div className="relative">
              <div className="rounded-3xl bg-black/40 backdrop-blur-sm p-6 ring-1 ring-white/10 sm:p-8">
                <p className="text-sm text-white/80 hero-anim-1">
                  Engineering-Led Manufacturing Network
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl hero-anim-2">
                  Reliable Manufacturing
                  <span className="block text-emerald-300">
                    For Complex Hardware
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 hero-anim-3">
                  PGI coordinates engineering review, material procurement,
                  production scheduling, and quality verification across a
                  structured manufacturing network. Companies rely on PGI to
                  simplify complex manufacturing while maintaining consistent
                  product quality and delivery reliability.
                </p>

                <div className="mt-7 flex flex-wrap gap-3 hero-anim-4">
                  <PrimaryButton to="/contact">
                    Request engineering review
                  </PrimaryButton>

                  <SecondaryButton
                    to="/capabilities"
                    className="bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15"
                  >
                    Explore capabilities
                  </SecondaryButton>
                </div>

                {/* STATS */}
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 hero-anim-4">
                  <div className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15">
                    <div className="text-lg font-semibold text-white">
                      <CountUp value={12200} suffix="+" />
                    </div>
                    <div className="text-xs text-white/80">
                      Components manufactured
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15">
                    <div className="text-lg font-semibold text-white">
                      <CountUp value={300} suffix="+" />
                    </div>
                    <div className="text-xs text-white/80">
                      Manufacturing partners
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15">
                    <div className="text-lg font-semibold text-white">
                      <CountUp value={92} suffix="%" />
                    </div>
                    <div className="text-xs text-white/80">
                      Production reliability
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15">
                    <div className="text-lg font-semibold text-white">
                      <CountUp value={17} suffix="+ yrs" />
                    </div>
                    <div className="text-xs text-white/80">
                      Engineering experience
                    </div>
                  </div>
                </div>
              </div>
            </div>
      {/* RIGHT - PREMIUM METRICS SECTION */}
            <div className="relative hero-anim-5">
              <PremiumMetricsSection />
            </div>
          </div>
        </Container>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section className="border-b border-white/10 py-20 bg-gradient-to-b from-transparent to-emerald-500/5">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Complete manufacturing coordination"
            desc="From engineering review to final quality verification, we manage every step of your production process with precision and accountability."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((s, idx) => (
              <div key={idx} className="group rounded-2xl bg-white/5 hover:bg-white/8 p-6 ring-1 ring-white/10 hover:ring-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                <div className="relative overflow-hidden rounded-xl aspect-video bg-black/40 mb-4">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {s.benefits?.slice(0, 2).map((b, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.slice(3, 6).map((s, idx) => (
              <div key={idx} className="group rounded-2xl bg-white/5 hover:bg-white/8 p-6 ring-1 ring-white/10 hover:ring-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                <div className="relative overflow-hidden rounded-xl aspect-video bg-black/40 mb-4">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {s.benefits?.slice(0, 2).map((b, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <PrimaryButton to="/services">View all services →</PrimaryButton>
          </div>
        </Container>
      </section>

      {/* ========== CAPABILITIES SECTION ========== */}
      <section className="border-b border-white/10 py-20">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Precision manufacturing across a distributed network"
            desc="Machining, electronics manufacturing, fabrication, and electromechanical assembly coordinated through trusted partner facilities."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {outdoorWorks.map((o, idx) => (
              <div key={idx} className="group rounded-2xl bg-white/5 hover:bg-white/8 ring-1 ring-white/10 hover:ring-emerald-500/30 overflow-hidden transition-all duration-300">
                <div className="relative overflow-hidden aspect-video bg-black/40">
                  <img src={o.image} alt={o.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-white">{o.title}</h3>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">{o.desc}</p>
                  <p className="mt-3 text-xs text-emerald-300 group-hover:text-emerald-200 transition">Learn more →</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <PrimaryButton to="/capabilities">Explore all capabilities →</PrimaryButton>
          </div>
        </Container>
      </section>

      {/* ========== PROCESS STEPS SECTION ========== */}
      <section className="border-b border-white/10 py-20 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-semibold">How We Work</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Manufacturing Process</h2>
            <p className="mt-2 text-white/70 max-w-2xl mx-auto">Five-step structured approach to deliver reliable manufacturing results</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-5">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="rounded-2xl bg-white/5 hover:bg-white/8 p-6 ring-1 ring-white/10 hover:ring-emerald-500/30 transition-all duration-300 h-full">
                  <div className="text-4xl font-bold text-emerald-400/20 mb-2">{step.number}</div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{step.desc}</p>
                </div>
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 w-6 h-0.5 bg-gradient-to-r from-emerald-500/40 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========== DIFFERENTIATORS SECTION ========== */}
      <section className="border-b border-white/10 py-20">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-semibold">Why PGI</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Key Differentiators</h2>
            <p className="mt-2 text-white/70 max-w-2xl mx-auto">What sets us apart in manufacturing coordination</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {differentiators.map((d, idx) => (
              <div key={idx} className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 p-6 ring-1 ring-white/10 hover:ring-emerald-500/30 transition-all duration-300">
                <div className="text-4xl mb-3">{d.icon}</div>
                <h3 className="text-lg font-semibold text-white">{d.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========== INSIGHTS SECTION ========== */}
      <section className="border-b border-white/10 py-20 bg-gradient-to-b from-transparent to-emerald-500/5">
        <Container>
          <SectionHeading
            eyebrow="Insights"
            title="Manufacturing Intelligence"
            desc="Articles on scaling hardware production, supply chains, and distributed manufacturing best practices."
          />

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {insights.map((i, idx) => (
              <a 
                key={idx}
                href={`/insights/${i.slug}`}
                className="group rounded-2xl bg-white/5 hover:bg-white/8 ring-1 ring-white/10 hover:ring-emerald-500/30 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="relative overflow-hidden aspect-video bg-black/40">
                  <img src={i.image} alt={i.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30">
                      {i.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition">{i.title}</h3>
                  <p className="mt-2 text-sm text-white/70 flex-1">{i.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                    <span>{i.readTime}</span>
                    <span className="text-emerald-400">Read →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <PrimaryButton to="/insights">Browse all insights →</PrimaryButton>
          </div>
        </Container>
      </section>

      {/* ========== NEWS SECTION ========== */}
      <section className="border-b border-white/10 py-20">
        <Container>
          <SectionHeading
            eyebrow="Network Updates"
            title="Manufacturing Network & Operations Updates"
            desc="Latest developments on new partnerships, expanded capabilities, and operational milestones across the PGI ecosystem."
          />

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {newsItems.map((n, idx) => (
              <a 
                key={idx}
                href={`/news/${n.slug}`}
                className="group rounded-2xl bg-white/5 hover:bg-white/8 ring-1 ring-white/10 hover:ring-emerald-500/30 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="relative overflow-hidden aspect-video bg-black/40">
                  <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                      {n.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 text-xs text-white/70 bg-black/40 backdrop-blur px-2 py-1 rounded-lg">
                    {n.date}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition">{n.title}</h3>
                  <p className="mt-2 text-sm text-white/70 flex-1">{n.excerpt}</p>
                  <div className="mt-4 text-emerald-400 text-sm group-hover:text-emerald-300 transition">Read update →</div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <PrimaryButton to="/news">View all updates →</PrimaryButton>
          </div>
        </Container>
      </section>

      {/* ========== SPECIALTIES SECTION ========== */}
      <section className="border-b border-white/10 py-20 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-semibold">Materials & Processes</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Manufacturing Specialties</h2>
            <p className="mt-2 text-white/70 max-w-2xl mx-auto">Comprehensive capabilities across multiple disciplines</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { category: "Materials", items: ["Aluminum & Alloys", "Stainless Steel", "Titanium", "Brass & Copper", "Engineering Plastics", "Carbon Fiber"] },
              { category: "Mechanical", items: ["CNC Machining", "Sheet Metal", "Injection Molding", "Die Casting", "Precision Turning", "Custom Fabrication"] },
              { category: "Electronics", items: ["PCB Design Support", "Component Sourcing", "SMT Assembly", "Through-Hole Assembly", "PCBA Testing", "Conformal Coating"] },
              { category: "Finishing", items: ["Anodizing", "Powder Coating", "Plating", "Wire Harnesses", "Box Assembly", "Final Testing"] }
            ].map((spec, idx) => (
              <div key={idx} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <h3 className="text-lg font-semibold text-emerald-300 mb-4">{spec.category}</h3>
                <ul className="space-y-2">
                  {spec.items.map((item, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-20">
        <Container>
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-emerald-500/15 p-8 md:p-12 ring-1 ring-emerald-500/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                Ready to scale your production?
              </h2>
              <p className="mt-3 text-white/75 max-w-2xl mx-auto leading-relaxed">
                Share your CAD files, drawings, or BOM for a comprehensive engineering review and manufacturing quotation. Our team responds within 24 hours.
              </p>
              <div className="mt-8 flex gap-4 justify-center flex-wrap">
                <PrimaryButton to="/contact">Contact engineering team</PrimaryButton>
                <SecondaryButton to="/pricing">View pricing</SecondaryButton>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;