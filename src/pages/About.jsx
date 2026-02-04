import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";

export default function About() {
  return (
    <div>
      <section className="border-b border-white/10 bg-black/20">
        <Container className="py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <SectionHeading
                eyebrow="About PGI"
                title="Built for real-world delivery"
                desc="We help clients plan, control and deliver landscaping works projects—with special attention to outdoor works and sustainable outcomes."
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <PrimaryButton to="/contact">Contact sales</PrimaryButton>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
              <img src="/images/about-hero.jpg" alt="About PGI" className="h-full w-full object-cover" />
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                t: "Mission",
                d: "Deliver sustainable, high-quality projects through disciplined planning, clear coordination, and on-site governance.",
              },
              {
                t: "Vision",
                d: "To be Kerala’s most trusted partner for project management in construction and outdoor infrastructure.",
              },
              {
                t: "Values",
                d: "Integrity, clarity, safety-first execution, and respect for people, cost and the environment.",
              },
            ].map((b) => (
              <div key={b.t} className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">{b.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{b.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <div className="text-sm font-semibold">What makes us different</div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                We focus on fundamentals that protect budgets and timelines: scope clarity, BOQ discipline, procurement planning,
                and frequent site-level communication. Our approach keeps stakeholders aligned and reduces rework.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                <li>• Transparent reporting with clear next actions</li>
                <li>• Practical checklists and documentation that contractors use</li>
                <li>• Risk logs, quality checks and safety-first routines</li>
                <li>• Sustainable choices: drainage, durability, and maintainability</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <div className="text-sm font-semibold">Who we serve</div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Homeowners, institutions and businesses planning new builds, renovations, or outdoor construction projects.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Residential builds",
                  "Commercial projects",
                  "Outdoor works",
                  "Site development",
                  "Infrastructure coordination",
                  "Sustainability upgrades",
                ].map((x) => (
                  <div key={x} className="rounded-2xl bg-black/30 p-4 text-sm text-white/70 ring-1 ring-white/10">
                    {x}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
