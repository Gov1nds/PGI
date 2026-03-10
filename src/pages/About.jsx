import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";

export default function About() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-white/10 bg-black/20">
        <Container className="py-16">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>
              <SectionHeading
                eyebrow="About PGI"
                title="Engineering-driven manufacturing network for modern hardware"
                desc="PGI is an engineering-led manufacturing network that simplifies complex industrial production. We integrate engineering review, material procurement, supplier coordination, and quality verification within a single operational structure. This allows companies to access reliable manufacturing capacity without the challenge of managing multiple vendors."
              />

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton to="/contact">
                  Contact Engineering
                </PrimaryButton>
              </div>

              {/* credibility chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Engineering Review",
                  "Material Procurement",
                  "Supplier Network Coordination",
                  "Mechanical & Machined Components",
                  "Electronic Assemblies (PCBA)",
                  "Global Delivery Logistics",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white/75 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
              <img
                src="/images/about-hero.jpg"
                alt="PGI Manufacturing Network"
                className="h-full w-full object-cover"
              />
            </div>

          </div>
        </Container>
      </section>


      {/* PHILOSOPHY / MISSION / VISION */}
      <section>
        <Container className="py-16">

          <div className="grid gap-8 md:grid-cols-3">

            <div className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">
                Our Philosophy
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Modern hardware products require close coordination between
                engineering, manufacturing, and supply chain operations.
                PGI was built on the belief that manufacturing should be
                engineering-driven, transparent, and operationally disciplined.
                By combining technical review, procurement control, and
                production oversight, we ensure that complex components can be
                manufactured efficiently while maintaining consistent quality.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">
                Our Mission
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Our mission is to simplify global manufacturing by providing a
                structured network that connects engineering teams with
                reliable production facilities. Through disciplined sourcing,
                technical review, production coordination, and quality
                verification, PGI enables companies to scale manufacturing
                without the operational burden of managing multiple suppliers.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">
                Our Vision
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                PGI aims to build a globally trusted manufacturing network
                that bridges engineering innovation with dependable
                production. Our goal is to create a supply ecosystem where
                companies can access precision manufacturing capabilities
                quickly, reliably, and at scale.
              </p>
            </div>

          </div>


          {/* OPERATIONS */}
          <div className="mt-16 grid gap-10 md:grid-cols-2">

            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">

              <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">
                Operational Process
              </div>

              <div className="mt-2 text-xl font-semibold">
                How PGI executes manufacturing projects
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Each project managed by PGI follows a structured engineering
                workflow designed to ensure technical accuracy, cost
                efficiency, and consistent product quality.
              </p>

              <ul className="mt-6 space-y-4 text-sm text-white/70">

                <li>
                  <strong className="text-white">1. Engineering Review</strong><br/>
                  CAD files, BOMs, and specifications are reviewed by our
                  engineering team to validate manufacturability and identify
                  potential cost or design optimizations.
                </li>

                <li>
                  <strong className="text-white">2. Material & Component Procurement</strong><br/>
                  PGI procures raw materials and electronic components directly
                  from qualified suppliers to ensure full control over quality
                  and traceability.
                </li>

                <li>
                  <strong className="text-white">3. Production Coordination</strong><br/>
                  Manufacturing tasks are assigned to specialized partner
                  facilities within the PGI network while our team coordinates
                  scheduling and technical requirements.
                </li>

                <li>
                  <strong className="text-white">4. Quality Verification & Delivery</strong><br/>
                  Final inspection and quality verification are conducted
                  before products are securely packaged and delivered to
                  customer facilities worldwide.
                </li>

              </ul>

            </div>


            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">

              <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">
                The PGI Manufacturing Network
              </div>

              <div className="mt-2 text-xl font-semibold">
                Coordinated supply ecosystem
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/70">
                PGI operates through a carefully structured network of
                manufacturing partners and suppliers. While production is
                distributed across specialized facilities, engineering
                control, procurement, and quality oversight remain centralized
                under PGI management.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                {[
                  "Raw Material Sourcing",
                  "Electronic Component Procurement",
                  "Precision Machining Partners",
                  "PCB Assembly Facilities",
                  "Central Engineering Oversight",
                  "Logistics & Export Coordination",
                ].map((x) => (
                  <div
                    key={x}
                    className="rounded-2xl bg-black/30 p-4 text-sm text-white/70 ring-1 ring-white/10"
                  >
                    {x}
                  </div>
                ))}

              </div>

              <div className="mt-6 rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">

                <div className="text-sm font-semibold text-white">
                  Continuous Improvement
                </div>

                <p className="mt-2 text-sm text-white/70">
                  PGI continuously studies advancements in electronics
                  manufacturing, automation, and precision machining to
                  strengthen our production network and improve product
                  reliability for our clients.
                </p>

              </div>

            </div>

          </div>


          {/* INDUSTRIES */}
          <div className="mt-16 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">

            <div className="grid gap-8 md:grid-cols-3 md:items-start">

              <div>
                <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">
                  Industries Served
                </div>

                <div className="mt-2 text-xl font-semibold">
                  Built for complex hardware
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  PGI supports companies developing sophisticated mechanical,
                  electronic, and electromechanical products requiring
                  reliable manufacturing coordination.
                </p>
              </div>

              <div className="md:col-span-2">

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {[
                    "Industrial Machinery",
                    "Robotics & Automation",
                    "Energy Systems",
                    "Electronics Equipment",
                    "Automotive Components",
                    "Technology Hardware",
                  ].map((x) => (
                    <div
                      key={x}
                      className="rounded-2xl bg-black/30 p-4 text-sm text-white/70 ring-1 ring-white/10"
                    >
                      {x}
                    </div>
                  ))}

                </div>

              </div>

            </div>


            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

              <div className="text-sm text-white/70">
                Need support for your next manufacturing project?
              </div>

              <PrimaryButton to="/contact">
                Request Engineering Review
              </PrimaryButton>

            </div>

          </div>

        </Container>
      </section>
    </div>
  );
}