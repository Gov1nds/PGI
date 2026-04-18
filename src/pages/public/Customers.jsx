import { Link } from "react-router-dom";
import { Container } from "../../components/Shared";
import Seo from "../../components/Seo";

const LOGOS = ["Axiom Robotics", "NovaCore", "Apex Precision", "Meridian Mfg", "HelioSat", "Orbit Labs", "Parallax Dyn", "Kepler Dev", "ZephyrWorks", "Lattice Flow", "NimbusOps", "Terrafirma"];

const CASE_STUDIES = [
  {
    company: "Axiom Robotics",
    industry: "Robotics",
    quote: "We replaced three spreadsheets and two email threads. Lead time for new vendors dropped from nine days to under two.",
    person: "Priya Nair, Director of Sourcing",
    result: "78% faster vendor onboarding",
  },
  {
    company: "NovaCore Energy",
    industry: "Clean Tech",
    quote: "PGI Hub's BOM analysis caught single-source risk on a $2.4M build we'd already signed off on. We rebuilt the shortlist in an afternoon.",
    person: "Devon Cho, VP Operations",
    result: "$340K in avoided exposure",
  },
  {
    company: "HelioSat",
    industry: "Aerospace",
    quote: "The RFQ dispatch and quote matrix are our procurement stack now. What took 40 emails takes one action.",
    person: "Marc Idowu, Procurement Lead",
    result: "12x RFQ throughput",
  },
];

export default function Customers() {
  return (
    <>
      <Seo title="Customers | PGI Hub" description="Customers building the next generation of hardware on PGI Hub." canonical="https://pgihub.com/customers" />

      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-label mx-auto mb-5">Customers</div>
            <h1 className="hero-title text-4xl md:text-6xl font-semibold">
              The teams building <span className="gradient-text">real things.</span>
            </h1>
            <p className="hero-subtitle mt-5 text-base leading-7 max-w-2xl mx-auto">
              From robotics startups to aerospace primes, procurement teams rely on PGI Hub to turn BOMs into execution.
            </p>
          </div>

          <div className="marquee mt-14">
            <div className="marquee-track">
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <span key={i} className="brand select-none">{l}</span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.055] py-20">
        <Container>
          <div className="mb-12 max-w-2xl">
            <div className="section-label mb-4">Case studies</div>
            <h2 className="section-heading text-3xl md:text-4xl font-semibold">What changed after switching.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {CASE_STUDIES.map((c, i) => (
              <article key={c.company} className={`feature-tile ${i === 1 ? "md:translate-y-4" : ""}`}>
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/40 mb-3">{c.industry}</div>
                <h3 className="text-[20px] font-semibold text-white leading-tight tracking-tight mb-5">{c.company}</h3>
                <p className="text-[14px] leading-6 text-muted flex-1">“{c.quote}”</p>
                <div className="mt-5 pt-4 border-t border-white/[0.055]">
                  <div className="text-[12.5px] font-medium text-white">{c.person}</div>
                  <div className="mt-0.5 text-[11.5px] text-emerald-400">{c.result}</div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.055] py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-4 items-center text-center">
            {[
              { k: "3.2M+",   v: "Parts analyzed" },
              { k: "18K+",    v: "Vendors ranked" },
              { k: "$840M",   v: "POs processed" },
              { k: "71%",     v: "Avg lead-time reduction" },
            ].map((s) => (
              <div key={s.v}>
                <div className="stat-big">{s.k}</div>
                <div className="mt-2 text-[12px] uppercase tracking-[0.15em] text-white/45">{s.v}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.055] py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-16 text-center md:px-10">
            <h2 className="section-heading text-3xl md:text-5xl font-semibold">
              Join the next cohort.
            </h2>
            <p className="mt-4 text-[15px] text-muted max-w-lg mx-auto">
              Start free, no credit card. Or talk to us about an enterprise setup with SSO, SCIM, and a dedicated account manager.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/register" className="primary-btn rounded-full px-6 py-3 text-[14px]">Get started free</Link>
              <Link to="/contact" className="secondary-btn rounded-full px-6 py-3 text-[14px]">Talk to sales</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
