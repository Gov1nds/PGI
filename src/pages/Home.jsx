import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { heroStats, services, outdoorWorks, insights } from "../content/siteData.js";

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

            {/* HERO IMAGE */}
            <div className="hero-media relative overflow-hidden rounded-3xl bg-white/60 ring-1 ring-black/10 backdrop-blur">
              <div className="absolute inset-0 bg-white/10" />
              <img
                src="/images/hero.jpg"
                alt="Outdoor and landscaping works"
                className="h-full w-full object-cover opacity-95"
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
