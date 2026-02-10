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
        {/* Soft dark glass behind text (so image stays visible but text becomes readable) */}
        <div className="rounded-3xl bg-black/40 backdrop-blur-sm p-6 ring-1 ring-white/10 sm:p-8">
          <p className="text-sm text-white/80 hero-anim-1">
            Procurement & Logistics Coordination Services
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl hero-anim-2">
            Ensuring Your Procurement & Deliveries
            <span className="block text-emerald-300">
            Fully Controlled
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 hero-anim-3">
            Smart Procurement. Smooth Logistics. Zero Hassle.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 hero-anim-4">
            <div className="hero-cta">
              <PrimaryButton to="/contact">Send your BOQ</PrimaryButton>
            </div>

            {/* Boost contrast for secondary button on dark background */}
            <SecondaryButton
              to="/services"
              className="bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15"
            >
              Explore services
            </SecondaryButton>
          </div>

          {/* KPI STATS (readable on image) */}
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

      {/* RIGHT: HERO IMPACT (match left dark-glass style) */}
<div className="relative overflow-hidden rounded-3xl bg-black/55 backdrop-blur-md ring-1 ring-white/15 shadow-[0_18px_46px_rgba(0,0,0,0.45)]">
  {/* subtle brand glow */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.18),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(22,163,74,0.14),transparent_60%)]" />

  <div className="relative p-7 sm:p-10">
    {/* TAGLINE */}
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15">
      <span className="h-2 w-2 rounded-full bg-[rgba(var(--brand-500))] animate-pulse" />
      BOQ → Dispatch → Delivery
    </div>

    {/* HEADLINE */}
    <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl text-white">
      Fewer Delays
      <span className="block text-[rgba(var(--brand-500))]">Better Control</span>
    </h3>

    {/* PARAGRAPH */}
    <p className="mt-3 text-sm leading-relaxed text-white/80">
      Where Procurement Drives Performance
    </p>

    {/* KPI COUNTERS */}
    <div className="mt-7 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 ring-1 ring-white/15 transition hover:ring-white/25 shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
        <div className="text-xs text-white/70">RFQs & quotations coordinated</div>
        <div className="mt-1 text-xl font-semibold text-white">
          <CountUp value={2500} suffix="+" format="number" />
        </div>
        <div className="mt-1 text-xs text-white/65">Across suppliers</div>
      </div>

      <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 ring-1 ring-white/15 transition hover:ring-white/25 shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
        <div className="text-xs text-white/70">Dispatches tracked</div>
        <div className="mt-1 text-xl font-semibold text-white">
          <CountUp value={1200} suffix="+" format="number" />
        </div>
        <div className="mt-1 text-xs text-white/65">Pickup → delivery</div>
      </div>

      <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 ring-1 ring-white/15 transition hover:ring-white/25 shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
        <div className="text-xs text-white/70">Cost overruns avoided</div>
        <div className="mt-1 text-xl font-semibold text-white">
          <CountUp value={18} suffix="%" format="number" />
        </div>
        <div className="mt-1 text-xs text-white/65">Typical improvement</div>
      </div>
    </div>

    {/* Compliance chips */}
    <div className="mt-6 flex flex-wrap gap-2">
      {[
        "Invoice & dispatch docs",
        "E-waybill support",
        "Customs coordination (partners)",
        "Shipping / freight assistance",
        "Delivery confirmation (POD)",
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

      {/* TECHNICAL EXPERTISE SECTION */}
<section className="border-b border-white/10 bg-black/20">
  <Container className="py-14">
    <SectionHeading
      eyebrow="Technical Expertise"
      title="Engineering-grade sourcing for electronics & mechanical components"
      desc="We help clients secure the right technical parts faster and with fewer mistakes by combining vendor intelligence, spec verification, and disciplined procurement execution."
    />

    {/* KPI + Proof */}
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {[
        {
          label: "Components & spares sourced",
          value: <CountUp value={2500} suffix="+" format="number" />,
          note: "Across electronics, mechanical, and engineered items",
          icon: "⚙️",
        },
        {
          label: "Vendors evaluated",
          value: <CountUp value={300} suffix="+" format="number" />,
          note: "Shortlist + capability matching + compliance checks",
          icon: "🧩",
        },
        {
          label: "OTD / delivery discipline",
          value: <CountUp value={92} suffix="%" format="number" />,
          note: "Order follow-ups, dispatch planning, and tracking control",
          icon: "📦",
        },
      ].map((k) => (
        <div
          key={k.label}
          className="group relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10"
        >
          {/* subtle glow */}
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

    {/* Animated progress line (keep animation) */}
    <div className="mt-8 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
      <div className="h-full w-1/3 animate-[slide_2.4s_ease-in-out_infinite] rounded-full bg-[rgba(var(--brand-500))]" />
    </div>

    {/* Expertise Cards */}
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {/* Card 1 */}
      <div className="group rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20">
            ⚡
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Electronics + AI-assisted sourcing
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              We support electronics requirements with structured RFQs, BOM clean-up, alternates mapping,
              and AI-assisted vendor discovery, so availability improves without compromising specs.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm text-white/75">
          {[
            "PCB/boards, sensors, controllers, drives, automation parts",
            "Alternate part identification + lead time visibility",
            "Vendor capability matching (quality, test, documentation)",
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
            🏗️
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Mechanical & engineered components
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              From machined items to industrial spares, we coordinate suppliers and validate the technical
              details that decide fit, performance, and lifecycle reliability.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm text-white/75">
          {[
            "Bearings, seals, gearboxes, motors, pumps, couplings",
            "Fabrication, machining, casting/forging coordination",
            "Material grade + dimensional requirement alignment",
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
            ✅
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Spec verification & compliance control
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              We reduce costly errors by ensuring offered items match your exact specification before ordering.
              Documentation and customs coordination are supported through trusted partners when applicable.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm text-white/75">
          {[
            "Spec match: part numbers, drawings, revisions, approvals",
            "Datasheets, CoC/CoA, test reports, packaging requirements",
            "Import/export docs coordination via partners",
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
          For electronics & engineering procurement
        </div>
        <h3 className="mt-2 text-2xl font-semibold text-white">
          Send your BOM — we’ll structure it and source it
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Share part numbers, specs/drawings, required quantities, and target delivery dates.
          We’ll respond with a sourcing plan, vendor options, lead times, and a coordination model.
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
            "Clear RFQ + quote comparison (spec / lead time / price)",
            "Vendor shortlist + alternates for faster availability",
            "Follow-ups + dispatch planning + delivery confirmation",
            "Structured updates: pending, ETA, risks, next actions",
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
          <PrimaryButton to="/contact">Request sourcing support</PrimaryButton>
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
            title="Procurement + logistics execution, without daily chaos"
            desc="BOQ intake, quotations, vendor follow-ups, dispatch planning, transport arrangement, and delivery tracking."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((s) => (
              <ImageCard key={s.title} title={s.title} desc={s.desc} image={s.image} to="/services" />
            ))}
          </div>
          <div className="mt-6">
            <SecondaryButton to="/services">View all services</SecondaryButton>
          </div>
        </Container>
      </section>

      {/* CAPABILITIES (was outdoorWorks) */}
      <section className="border-y border-white/10 bg-black/20">
        <Container className="py-14">
          <SectionHeading
            eyebrow="Capabilities"
            title="Built for fast-moving requirements"
            desc="From local procurement to multi-location deliveries plus documentation and customs coordination via trusted partners when required."
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
            title="Practical systems for procurement and delivery control"
            desc="Short reads on BOQ management, vendor coordination, logistics tracking, and delay prevention."
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
              <h3 className="text-2xl font-semibold">Need faster procurement and on-time deliveries?</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Share your BOQ or daily requirements, preferred brands/specs, pickup & delivery locations, and timeline.
                We’ll respond with a clear coordination plan, reporting format, and next steps including documentation and
                customs coordination support when needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <PrimaryButton to="/contact">Contact sales</PrimaryButton>
              <SecondaryButton to="/about">Learn about Padanilath</SecondaryButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
