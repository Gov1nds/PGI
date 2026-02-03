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
            <div>
              <p className="text-sm text-slate-700 hero-anim-1">
                Outdoor Development & Landscaping
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl hero-anim-2">
                Turning your vision into reality
                <span className="block text-[rgba(var(--brand-700))]">
                  with expert guidance at every step.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-700 hero-anim-3">
                We deliver premium outdoor and landscaping works with a focus on planning, drainage-first execution,
                quality finishing, and predictable timelines. From design coordination to procurement and on-site execution,
                we keep delivery smooth and long-lasting.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 hero-anim-4">
                <div className="hero-cta">
                  <PrimaryButton to="/contact">Talk to us</PrimaryButton>
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

            {/* HERO IMAGE — upgraded visual & UX for premium look */}
            <div className="relative overflow-hidden rounded-3xl bg-white/3 ring-1 ring-white/10">
              {/* Decorative ambient layers for depth */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(40% 40% at 20% 20%, rgba(34,197,94,0.14), transparent 22%)," +
                    "radial-gradient(30% 30% at 80% 70%, rgba(16,185,129,0.10), transparent 25%)," +
                    "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))",
                  mixBlendMode: "screen",
                }}
              />

              {/* Subtle border stroke using an overlay for premium glass edge */}
              <div
                aria-hidden
                className="absolute -inset-px rounded-3xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                  mask:
                    "linear-gradient(#000, #000)",
                  WebkitMask:
                    "linear-gradient(#000, #000)",
                }}
              />

              <div className="relative p-7 sm:p-10 bg-transparent">
                {/* Animated tagline — elevated pill */}
                <div className="inline-flex items-center gap-3 rounded-full bg-black/40 px-4 py-2 text-xs font-semibold ring-1 ring-white/8 backdrop-blur-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-[rgba(var(--brand-500))] animate-ping-slow"
                    aria-hidden
                  />
                  <span className="text-white/90">Green Today, Greener Tomorrow</span>
                </div>

                <h3 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  Measurable impact,
                  <span className="block text-[rgba(var(--brand-600))]">not just nice visuals.</span>
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
                  We plan outdoor works with drainage-first execution, durable materials, and greener outcomes that last.
                </p>

                {/* Counters — brighter, premium cards */}
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/6 backdrop-blur-sm p-5 ring-1 ring-white/8 transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="text-xs text-white/60">Plants installed</div>
                    <div className="mt-2 text-2xl font-bold text-[rgba(var(--brand-500))]">
                      <CountUp value={100000} suffix="+" format="indian" />
                    </div>
                    <div className="mt-1 text-xs text-white/60">Across projects</div>
                  </div>

                  <div className="rounded-2xl bg-white/6 backdrop-blur-sm p-5 ring-1 ring-white/8 transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="text-xs text-white/60">CO₂ reduced</div>
                    <div className="mt-2 text-2xl font-bold text-[rgba(var(--brand-500))]">
                      <CountUp value={250} suffix="+ t" format="number" />
                    </div>
                    <div className="mt-1 text-xs text-white/60">Estimated savings</div>
                  </div>

                  <div className="rounded-2xl bg-white/6 backdrop-blur-sm p-5 ring-1 ring-white/8 transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="text-xs text-white/60">Carbon footprint</div>
                    <div className="mt-2 text-2xl font-bold text-[rgba(var(--brand-500))]">
                      <CountUp value={35} suffix="%" format="number" />
                    </div>
                    <div className="mt-1 text-xs text-white/60">Reduction goal</div>
                  </div>
                </div>

                {/* Progress-line — refined & premium */}
                <div className="mt-8">
                  <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[rgba(var(--brand-500))] transition-[width] duration-1500 ease-in-out"
                      style={{ width: "34%" }}
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
                    <div className="h-0.5 w-8 rounded bg-[rgba(var(--brand-500))]" />
                    <div>Our approach focuses on drainage-first planning and durable delivery</div>
                  </div>
                </div>
              </div>

              {/* subtle drop shadow vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  boxShadow: "inset 0 30px 80px rgba(0,0,0,0.12)",
                }}
              />

              {/* Motion styles (reduced motion aware) */}
              <style>{`
                @keyframes ping-slow {
                  0% { transform: scale(1); opacity: 0.9; }
                  70% { transform: scale(2.2); opacity: 0; }
                  100% { transform: scale(2.2); opacity: 0; }
                }
                .animate-ping-slow { animation: ping-slow 2.8s cubic-bezier(.4,0,.2,1) infinite; }

                @media (prefers-reduced-motion: reduce) {
                  .animate-ping-slow { animation: none; opacity: 1; transform: none; }
                }

                /* small helper to soften the progress width animation on mount */
                .duration-1500 { transition-duration: 1500ms; }
              `}</style>
            </div>
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="border-b border-white/10 bg-black/20">
        <Container className="py-14">
          <SectionHeading
            eyebrow="Testimonials"
            title="What our clients say about working with Padanilath"
            desc="Real feedback from project owners and collaborators who trusted us with their Landscaping and outdoor works."
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
            title="Outdoor execution that stays clean and durable"
            desc="Drainage-first planning, strong material choices, sharp finishing, and smooth site coordination."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((s) => (
              <ImageCard
                key={s.title}
                title={s.title}
                desc={s.desc}
                image={s.image}
                to="/services"
              />
            ))}
          </div>
          <div className="mt-6">
            <SecondaryButton to="/services">View all services</SecondaryButton>
          </div>
        </Container>
      </section>

      {/* OUTDOOR WORKS */}
      <section className="border-y border-white/10 bg-black/20">
        <Container className="py-14">
          <SectionHeading
            eyebrow="Outdoor works"
            title="Specialized in outdoor construction & site development"
            desc="Outdoor works require careful planning—drainage, durability, material choices and long-term maintenance."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {outdoorWorks.map((o) => (
              <ImageCard
                key={o.title}
                title={o.title}
                desc={o.desc}
                image={o.image}
                to="/outdoor-works"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* INSIGHTS */}
      <section>
        <Container className="py-14">
          <SectionHeading
            eyebrow="Insights"
            title="Field-tested insights for clients and contractors"
            desc="Short reads on budgeting, delivery, quality and outdoor work planning."
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
              <h3 className="text-2xl font-semibold">Ready to start your next project?</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Share your project scope, location and timeline. We’ll respond with a clear approach and what we can take ownership of.
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