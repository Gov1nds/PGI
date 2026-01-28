import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { heroStats, services, outdoorWorks, insights } from "../content/siteData.js";

export default function Home() {
  return (
    <div>
      <section className="bg-hero border-b border-white/10">
        <Container className="py-14 sm:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm text-white/70">Project management consultancy</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Sustainable construction.
                <span className="block text-[rgba(var(--brand-500))]">Delivered on time.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
                We provide expert project management consultancy for sustainable and high-quality construction projects,
                with specialized experience in outdoor and infrastructure works. From planning and design coordination to
                budgeting, procurement and on-site execution, we keep delivery predictable.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <PrimaryButton to="/contact">Talk to us</PrimaryButton>
                <SecondaryButton to="/services">Explore services</SecondaryButton>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {heroStats.map((h) => (
                  <div key={h.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="text-lg font-semibold">{h.kpi}</div>
                    <div className="mt-1 text-xs text-white/60">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
              <div className="absolute inset-0 bg-[rgba(var(--brand-600)/0.12)]" />
              <img
                src="/images/hero.jpg"
                alt="Padanilath project management"
                className="h-full w-full object-cover opacity-90"
              />
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-14">
          <SectionHeading
            eyebrow="What we do"
            title="Project governance that makes execution easier"
            desc="Clarity, accountability and predictable delivery—built with simple systems that work on real sites."
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

      <section className="border-y border-white/10 bg-black/20">
        <Container className="py-14">
          <SectionHeading
            eyebrow="Outdoor works"
            title="Specialized in outdoor construction & site development"
            desc="Outdoor works require careful planning—drainage, durability, material choices and long-term maintenance."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {outdoorWorks.map((o) => (
              <ImageCard key={o.title} title={o.title} desc={o.desc} image={o.image} to="/outdoor-works" />
            ))}
          </div>
        </Container>
      </section>

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
