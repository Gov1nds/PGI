import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { heroStats, services, outdoorWorks, insights } from "../content/siteData.js";
import CountUp from "../components/CountUp.jsx";

export default function Home() {
  return (
    <div>
      {/* HERO (light + premium + animated) */}
      <section className="bg-hero border-b border-black/10">
        <Container className="py-14 sm:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* LEFT */}
            <div>
              <p className="text-sm text-slate-700 hero-anim-1">
                Procurement & Logistics Coordination Services
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl hero-anim-2">
                Keep procurement and deliveries
                <span className="block text-[rgba(var(--brand-700))]">
                  on time, on budget, and under control.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-700 hero-anim-3">
                We coordinate your BOQ and daily requirements end-to-end: quotations, vendor follow-ups, dispatch planning,
                transport arrangement, shipment tracking, and delivery confirmation. For imports and regulated shipments,
                we also support documentation and customs coordination through verified partners.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 hero-anim-4">
                <div className="hero-cta">
                  <PrimaryButton to="/contact">Send your BOQ</PrimaryButton>
                </div>
                <SecondaryButton to="/services">Explore services</SecondaryButton>
              </div>

              {/* KPI STATS */}
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 hero-anim-4">
                {heroStats.map((h) => (
                  <div key={h.label} className="hero-kpi rounded-2xl p-4">
                    <div className="kpi-num text-lg">{h.kpi}</div>
                    <div className="kpi-label mt-1 text-xs">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: HERO IMPACT */}
            <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-black/10 shadow-lg">
              {/* Soft light-green glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.12),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(22,163,74,0.10),transparent_60%)]" />

              <div className="relative p-7 sm:p-10">
                {/* TAGLINE */}
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-[rgba(var(--brand-500))] animate-pulse" />
                  BOQ → Dispatch → Delivery
                </div>

                {/* HEADLINE */}
                <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl text-emerald-900">
                  Fewer delays,
                  <span className="block text-emerald-600">better control</span>
                </h3>

                {/* PARAGRAPH */}
                <p className="mt-3 text-sm leading-relaxed text-emerald-950/70">
                  We bring structure to unorganized daily requirements—clear trackers, vendor coordination, transport planning,
                  and documentation support (including customs and compliance coordination via partners when needed).
                </p>

                {/* KPI COUNTERS (LOGISTICS) */}
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/80 backdrop-blur p-5 ring-1 ring-emerald-100 transition hover:ring-emerald-300 shadow-sm">
                    <div className="text-xs text-emerald-900/60">RFQs & quotations coordinated</div>
                    <div className="mt-1 text-xl font-semibold text-emerald-700">
                      <CountUp value={2500} suffix="+" format="number" />
                    </div>
                    <div className="mt-1 text-xs text-emerald-900/55">Across suppliers</div>
                  </div>

                  <div className="rounded-2xl bg-white/80 backdrop-blur p-5 ring-1 ring-emerald-100 transition hover:ring-emerald-300 shadow-sm">
                    <div className="text-xs text-emerald-900/60">Dispatches tracked</div>
                    <div className="mt-1 text-xl font-semibold text-emerald-700">
                      <CountUp value={1200} suffix="+" format="number" />
                    </div>
                    <div className="mt-1 text-xs text-emerald-900/55">Pickup → delivery</div>
                  </div>

                  <div className="rounded-2xl bg-white/80 backdrop-blur p-5 ring-1 ring-emerald-100 transition hover:ring-emerald-300 shadow-sm">
                    <div className="text-xs text-emerald-900/60">Cost overruns avoided</div>
                    <div className="mt-1 text-xl font-semibold text-emerald-700">
                      <CountUp value={18} suffix="%" format="number" />
                    </div>
                    <div className="mt-1 text-xs text-emerald-900/55">Typical improvement</div>
                  </div>
                </div>

                {/* Compliance chips */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Invoice & dispatch docs",
                    "E-waybill support",
                    "Customs coordination (partners)",
                    "Shipping / freight assistance",
                    "Delivery confirmation (POD)"
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Animated progress line */}
                <div className="mt-7 h-[2px] w-full overflow-hidden rounded-full bg-emerald-200">
                  <div className="h-full w-1/3 animate-[slide_2.4s_ease-in-out_infinite] rounded-full bg-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-white/10 bg-black/20">
        <Container className="py-14">
          <SectionHeading
            eyebrow="Testimonials"
            title="What clients say about our coordination"
            desc="Feedback from teams who needed faster follow-ups, cleaner reporting, and on-time deliveries."
          />

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-soft">
              <img
                src="/images/testimonials.jpg"
                alt="Client testimonials and reviews"
                className="w-full h-auto object-contain"
              />
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
            desc="From local procurement to multi-location deliveries—plus documentation and customs coordination via trusted partners when required."
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
                We’ll respond with a clear coordination plan, reporting format, and next steps—including documentation and
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
