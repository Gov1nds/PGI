import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";

export default function About() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-white/10 bg-black/20">
        <Container className="py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <SectionHeading
                eyebrow="About PGI"
                title="Simplifying complex manufacturing for global clients"
                desc="PGI Manufacturing Network provides engineering-led manufacturing solutions. We integrate engineering review, supplier network management, and logistics within a single operational framework, allowing clients to access reliable production without the burden of managing multiple vendors."
              />

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton to="/contact">Contact engineering</PrimaryButton>
              </div>

              {/* Quick credibility chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Engineering-Driven Decisions",
                  "Ownership of Supply Chain",
                  "Consistent Quality Verification",
                  "Mechanical & Machined Items",
                  "Electronic Assemblies (PCBA)",
                  "Global Delivery Coordination",
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
              <img src="/images/about-hero.jpg" alt="About PGI" className="h-full w-full object-cover" />
            </div>
          </div>
        </Container>
      </section>

      {/* CORE BLOCKS */}
      <section>
        <Container className="py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                t: "Philosophy",
                d: "Modern manufacturing demands engineering expertise, disciplined supply chain coordination, and consistent quality assurance. We prioritize operational excellence to provide enduring manufacturing partnerships[cite: 10, 13].",
              },
              {
                t: "Mission",
                d: "To simplify global manufacturing by building a coordinated network of trusted suppliers, providing engineering-driven sourcing, production oversight, quality assurance, and reliable delivery for precision industrial components[cite: 29].",
              },
              {
                t: "Vision",
                d: "To build a globally trusted manufacturing network that connects engineering innovation with reliable production, enabling companies worldwide to access high-quality industrial manufacturing through a seamless and coordinated supply ecosystem[cite: 31].",
              },
            ].map((b) => (
              <div key={b.t} className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">{b.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{b.d}</p>
              </div>
            ))}
          </div>

          {/* How we operate */}
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">Operational Process</div>
              <div className="mt-2 text-xl font-semibold">How we execute projects</div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                PGI follows a highly structured, disciplined workflow for managing manufacturing projects from inception to global delivery[cite: 128].
              </p>

              <ul className="mt-6 space-y-4 text-sm text-white/70">
                <li>
                  <strong className="text-white">1. Review & Evaluate:</strong> Comprehensive review of CAD files and specs to evaluate manufacturability and identify cost optimizations[cite: 134, 135].
                </li>
                <li>
                  <strong className="text-white">2. Procure & Schedule:</strong> Procurement of all raw materials and electronic components, followed by meticulous scheduling across our most qualified partner facilities[cite: 137, 138].
                </li>
                <li>
                  <strong className="text-white">3. Coordinate & Monitor:</strong> PGI engineers coordinate activities on the factory floor and actively monitor progress to ensure strict adherence to technical requirements[cite: 140].
                </li>
                <li>
                  <strong className="text-white">4. Verify & Deliver:</strong> Rigorous final inspection and quality verification before components are securely packaged and delivered directly to client facilities worldwide[cite: 142].
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">Supply Chain Ecosystem</div>
              <div className="mt-2 text-xl font-semibold">The PGI Network Model</div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                We operate through a structured network of vetted manufacturing facilities across India. This distributed model allows PGI to provide scalable capacity while maintaining centralized engineering and quality control[cite: 81, 86].
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Raw Material Sourcing [cite: 111]",
                  "Electronic Component Procurement [cite: 96]",
                  "Partner Facility Allocation [cite: 114]",
                  "Central Engineering Oversight [cite: 115]",
                  "Quality Verification Labs [cite: 101]",
                  "Export & Logistics Coordination [cite: 104]",
                ].map((x) => (
                  <div key={x} className="rounded-2xl bg-black/30 p-4 text-sm text-white/70 ring-1 ring-white/10">
                    {x}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-white">Innovation & R&D</div>
                <p className="mt-2 text-sm text-white/70">
                  We intensively study advanced manufacturing techniques and emerging technologies in electronics assembly and precision machining to continually improve production capabilities[cite: 122, 123].
                </p>
              </div>
            </div>
          </div>

          {/* Who we serve */}
          <div className="mt-14 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
            <div className="grid gap-8 md:grid-cols-3 md:items-start">
              <div>
                <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">Industries Served</div>
                <div className="mt-2 text-xl font-semibold">Built for complex hardware</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  By supporting both mechanical and electronic manufacturing, PGI is perfectly positioned to assist companies developing complex electromechanical products[cite: 150].
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Industrial Machinery [cite: 151]",
                    "Robotics & Automation [cite: 153]",
                    "Energy & Infrastructure [cite: 155]",
                    "Electronics & Equipment [cite: 152]",
                    "Automotive Components [cite: 154]",
                    "Technology Hardware [cite: 156]",
                  ].map((x) => (
                    <div key={x} className="rounded-2xl bg-black/30 p-4 text-sm text-white/70 ring-1 ring-white/10">
                      {x}
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-white">Why Choose PGI?</div>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                      <li>• Single point of coordination for mechanical and electronic needs [cite: 146]</li>
                      <li>• Allows clients to focus purely on product development and growth [cite: 146]</li>
                      <li>• Predictable delivery timelines and efficient production scaling [cite: 147]</li>
                      <li>• Unwavering commitment to quality and integrity [cite: 20, 33]</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-white">Our Product Portfolio</div>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                      <li>• Precision CNC & Sheet Metal Enclosures [cite: 60, 62]</li>
                      <li>• Cast, Forged & Custom Fasteners [cite: 64, 66]</li>
                      <li>• PCB Assemblies & Wire Harnesses [cite: 69, 70]</li>
                      <li>• Full "Box-Build" Electromechanical Assemblies [cite: 75, 77]</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-white/70">
                Ready to optimize your manufacturing supply chain?
              </div>
              <PrimaryButton to="/contact">Request an engineering review</PrimaryButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}