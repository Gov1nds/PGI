import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { heroStats, services, outdoorWorks, insights } from "../content/siteData.js";
import CountUp from "../components/CountUp.jsx";

export default function Home() {
  return (
    <div>
      {/* HERO (image background + readable white text) */}
      <section className="bg-hero border-b border-white/10">
        <Container className="py-14 sm:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* LEFT */}
            <div className="relative">
              {/* Soft dark glass behind text */}
              <div className="rounded-3xl bg-black/40 backdrop-blur-sm p-6 ring-1 ring-white/10 sm:p-8">
                <p className="text-sm text-white/80 hero-anim-1">
                  Engineering-Led Manufacturing & Global Supply
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl hero-anim-2">
                  Precision Components & Assemblies
                  <span className="block text-emerald-300">
                    Fully Delivered
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 hero-anim-3">
                  Your dedicated manufacturing partner in India. We manage distributed production networks to deliver CNC machined parts, sheet metal, and PCB assemblies with total accountability.
                </p>

                <div className="mt-7 flex flex-wrap gap-3 hero-anim-4">
                  <div className="hero-cta">
                    <PrimaryButton to="/contact">Send your CAD / BOM</PrimaryButton>
                  </div>

                  <SecondaryButton
                    to="/capabilities"
                    className="bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15"
                  >
                    Explore capabilities
                  </SecondaryButton>
                </div>

                {/* KPI STATS (imported from siteData) */}
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 hero-anim-4">
                  {heroStats.map((h) => (
                    <div
                      key={h.label}
                      className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15 shadow-[0_10px_26px_rgba(0,0,0,0.35)]"
                    >
                      <div className="text-lg font-semibold tracking-tight text-white">
                        {h.kpi}
                      </div>
                      <div className="mt-1 text-xs font-medium text-white/80">
                        {h.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: HERO IMPACT */}
            <div className="relative overflow-hidden rounded-3xl bg-black/55 backdrop-blur-md ring-1 ring-white/15 shadow-[0_18px_46px_rgba(0,0,0,0.45)]">
              {/* subtle brand glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.18),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(22,163,74,0.14),transparent_60%)]" />

              <div className="relative p-7 sm:p-10">
                {/* TAGLINE */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15">
                  <span className="h-2 w-2 rounded-full bg-[rgba(var(--brand-500))] animate-pulse" />
                  CAD/BOM → Manufacturing → Global Delivery
                </div>

                {/* HEADLINE */}
                <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl text-white">
                  Scalable Capacity
                  <span className="block text-[rgba(var(--brand-500))]">Uncompromising Quality</span>
                </h3>

                {/* PARAGRAPH */}
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  Leveraging India's top distributed manufacturing network.
                </p>

                {/* KPI COUNTERS */}
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 ring-1 ring-white/15 transition hover:ring-white/25 shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
                    <div className="text-xs text-white/70">Parts manufactured</div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      <CountUp value={500} suffix="k+" format="number" />
                    </div>
                    <div className="mt-1 text-xs text-white/65">Components shipped</div>
                  </div>

                  <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 ring-1 ring-white/15 transition hover:ring-white/25 shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
                    <div className="text-xs text-white/70">Production yield</div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      <CountUp value={99} suffix="%" format="number" />
                    </div>
                    <div className="mt-1 text-xs text-white/65">Quality controlled</div>
                  </div>

                  <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 ring-1 ring-white/15 transition hover:ring-white/25 shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
                    <div className="text-xs text-white/70">On-time delivery</div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      <CountUp value={96} suffix="%" format="number" />
                    </div>
                    <div className="mt-1 text-xs text-white/65">Global logistics</div>
                  </div>
                </div>

                {/* Compliance chips */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "CNC Machining & Turning",
                    "Sheet Metal Fabrication",
                    "PCB Assembly (PCBA)",
                    "Electromechanical Box Builds",
                    "ISO 9001 Compliant Network",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Progress line */}
                <div className="mt-7 h-[2px] w-full overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-1/3 animate-[slide_2.4s_ease-in-out_infinite] rounded-full bg-[rgba(var(--brand-500))]" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MANUFACTURING CAPABILITIES SECTION */}
      <section className="border-b border-white/10 bg-black/20">
        <Container className="py-14">
          <SectionHeading
            eyebrow="Core Capabilities"
            title="Precision engineering & electromechanical manufacturing"
            desc="We eliminate the complexity of offshore manufacturing by taking full accountability for your production, from DFM (Design for Manufacturing) to final assembly and global dispatch."
          />

          {/* KPI + Proof */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                label: "Manufacturing Network",
                value: <CountUp value={40} suffix="+" format="number" />,
                note: "Vetted Indian partner facilities",
                icon: "🏭",
              },
              {
                label: "Tolerances achieved",
                value: <CountUp value={5} suffix=" μm" format="number" />,
                note: "High-precision turning & milling",
                icon: "⚙️",
              },
              {
                label: "End-to-end integration",
                value: <CountUp value={100} suffix="%" format="number" />,
                note: "Single point of accountability",
                icon: "🤝",
              },
            ].map((k) => (
              <div
                key={k.label}
                className="group relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.14),transparent_55%)]" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-white/55">{k.label}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
                      {k.value}
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-white/70">
                      {k.note}
                    </div>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 text-lg">
                    {k.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 animate-[slide_2.4s_ease-in-out_infinite] rounded-full bg-[rgba(var(--brand-500))]" />
          </div>

          {/* Expertise Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div className="group rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20">
                  ⚙️
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Precision Mechanical Components
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    High-quality manufacturing of complex mechanical parts. We match your drawings with the ideal machinery in our network.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-white/75">
                {[
                  "3-axis, 4-axis, and 5-axis CNC Machining",
                  "Precision CNC Turning & Milling",
                  "Sheet Metal Fabrication & Laser Cutting",
                  "Surface treatments & custom finishing",
                ].map((t) => (
                  <div key={t} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20">
                  ⚡
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Electronic Assemblies (PCBA)
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Turnkey printed circuit board assembly services. We handle component procurement, population, and functional testing.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-white/75">
                {[
                  "SMT (Surface Mount) & DIP Assembly",
                  "BOM component sourcing & alternate matching",
                  "AOI (Automated Optical Inspection) & ICT",
                  "Conformal coating & potting",
                ].map((t) => (
                  <div key={t} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 */}
            <div className="group rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20">
                  🏗️
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Electromechanical Box Builds
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Complete product integration. We bring together mechanical enclosures, wiring, and electronics into final, ready-to-ship products.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-white/75">
                {[
                  "Enclosure assembly (metal & plastic)",
                  "Cable & wire harness routing",
                  "System-level testing & burn-in",
                  "Custom packaging & global shipping prep",
                ].map((t) => (
                  <div key={t} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className="mt-12 grid gap-8 rounded-3xl bg-black/30 p-8 ring-1 ring-white/10 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-sm text-[rgba(var(--brand-500))]">
                Ready for production?
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Send your CAD files & BOM for a DFM review
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Share your 3D models (STEP/IGES), 2D drawings, or Bill of Materials. 
                Our engineering team will assess manufacturability, optimize for cost, and provide a clear quotation and lead time.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">What you’ll get</div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/20">
                  24–48h response
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-white/75">
                {[
                  "Design for Manufacturing (DFM) feedback",
                  "Transparent pricing & structured lead times",
                  "First Article Inspection (FAI) reports on initial runs",
                  "Dedicated project manager for ongoing production",
                ].map((t) => (
                  <div key={t} className="flex gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20">
                      ✓
                    </span>
                    <span className="leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <PrimaryButton to="/contact">Request a quote</PrimaryButton>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICES */}
      <section>
        <Container className="py-14">
          <SectionHeading
            eyebrow="What we do"
            title="End-to-end manufacturing solutions"
            desc="From prototyping and DFM optimization to full-scale production and global logistics, we handle the entire hardware lifecycle."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((s) => (
              <ImageCard key={s.title} title={s.title} desc={s.desc} image={s.image} to="/services" />
            ))}
          </div>
          <div className="mt-6">
            <SecondaryButton to="/services">View all capabilities</SecondaryButton>
          </div>
        </Container>
      </section>

      {/* CAPABILITIES */}
      <section className="border-y border-white/10 bg-black/20">
        <Container className="py-14">
          <SectionHeading
            eyebrow="Industries Served"
            title="Built for rigorous hardware requirements"
            desc="Manufacturing components and assemblies for robotics, industrial automation, marine technology, and specialized electronics."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {outdoorWorks.map((o) => (
              <ImageCard key={o.title} title={o.title} desc={o.desc} image={o.image} to="/capabilities" />
            ))}
          </div>
        </Container>
      </section>

      {/* INSIGHTS */}
      <section>
        <Container className="py-14">
          <SectionHeading
            eyebrow="Insights"
            title="Practical systems for production and quality control"
            desc="Short reads on navigating distributed manufacturing, optimizing PCB assemblies, and improving CAD designs for CNC."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {insights.map((i) => (
              <ImageCard
                key={i.slug}
                title={i.title}
                desc={i.excerpt}
                image={i.image}
                to={`/insights/${i.slug}`}
                tag={i.category}
              />
            ))}
          </div>
          <div className="mt-6">
            <SecondaryButton to="/insights">Browse all insights</SecondaryButton>
          </div>
        </Container>
      </section>

      {/* CTA (dark) */}
      <section className="border-t border-white/10 bg-black/30">
        <Container className="py-14">
          <div className="grid gap-8 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-semibold">Looking for a reliable manufacturing partner in India?</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Whether you need precision mechanical components, PCBA, or complete box builds, we have the network and engineering expertise to deliver. Share your drawings or BOM, and let's discuss your production goals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <PrimaryButton to="/contact">Contact engineering</PrimaryButton>
              <SecondaryButton to="/about">Learn about Padanilath Global Integrated</SecondaryButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}