import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { RevealSection } from "../components/RevealSection.jsx";

export default function About() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-white/[0.08] bg-gradient-to-b from-[rgb(10,14,28)] to-[rgb(12,18,34)]">
        <Container className="py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <SectionHeading
                eyebrow="About PGI Hub"
                title="Engineering-driven manufacturing network for modern hardware"
                desc="PGI is an engineering-led manufacturing network that simplifies complex industrial production. We integrate engineering review, material procurement, supplier coordination, and quality verification within a single operational structure."
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton to="/contact">Contact Engineering</PrimaryButton>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Engineering Review", "Material Procurement", "Supplier Network Coordination", "Mechanical & Machined Components", "Electronic Assemblies (PCBA)", "Global Delivery Logistics"].map((t) => (
                  <span key={t} className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/[0.08]">{t}</span>
                ))}
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.08]">
              <img src="/images/about-hero.jpg" alt="PGI Manufacturing Network" className="h-full w-full object-cover" />
            </div>
          </div>
        </Container>
      </section>

      {/* PHILOSOPHY / MISSION / VISION */}
      <RevealSection>
        <section>
          <Container className="py-16 md:py-20">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { label: "Our Philosophy", text: "Modern hardware products require close coordination between engineering, manufacturing, and supply chain operations. PGI was built on the belief that manufacturing should be engineering-driven, transparent, and operationally disciplined." },
                { label: "Our Mission", text: "Our mission is to simplify global manufacturing by providing a structured network that connects engineering teams with reliable production facilities. Through disciplined sourcing, technical review, and quality verification." },
                { label: "Our Vision", text: "PGI aims to build a globally trusted manufacturing network that bridges engineering innovation with dependable production. Our goal is to create a supply ecosystem where companies can access precision manufacturing quickly and at scale." }
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-white/[0.04] p-6 ring-1 ring-white/[0.08]">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-400 mb-3">{item.label}</div>
                  <p className="text-sm leading-relaxed text-white/80">{item.text}</p>
                </div>
              ))}
            </div>

            {/* OPERATIONS */}
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl bg-white/[0.04] p-7 ring-1 ring-white/[0.08]">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-400 mb-2">Operational Process</div>
                <div className="text-lg font-semibold text-white">How PGI executes manufacturing projects</div>
                <p className="mt-3 text-sm leading-relaxed text-white/80">Each project follows a structured engineering workflow designed for technical accuracy and consistent quality.</p>
                <ul className="mt-6 space-y-4 text-sm text-white/75">
                  {[
                    { step: "1. Engineering Review", desc: "CAD files, BOMs, and specifications are reviewed for manufacturability and cost optimization." },
                    { step: "2. Material & Component Procurement", desc: "Raw materials and electronic components procured from qualified suppliers with full traceability." },
                    { step: "3. Production Coordination", desc: "Manufacturing tasks assigned to specialized partner facilities with coordinated scheduling." },
                    { step: "4. Quality Verification & Delivery", desc: "Final inspection and quality verification before secure packaging and worldwide delivery." }
                  ].map((s, i) => (
                    <li key={i}>
                      <strong className="text-white">{s.step}</strong>
                      <br />
                      {s.desc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-white/[0.04] p-7 ring-1 ring-white/[0.08]">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-400 mb-2">The PGI Manufacturing Network</div>
                <div className="text-lg font-semibold text-white">Coordinated supply ecosystem</div>
                <p className="mt-3 text-sm leading-relaxed text-white/80">PGI operates through a carefully structured network of manufacturing partners and suppliers.</p>
                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {["Raw Material Sourcing", "Electronic Component Procurement", "Precision Machining Partners", "PCB Assembly Facilities", "Central Engineering Oversight", "Logistics & Export Coordination"].map((x) => (
                    <div key={x} className="rounded-lg bg-white/[0.05] p-3 text-sm text-white/75 ring-1 ring-white/[0.06]">{x}</div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg bg-white/[0.05] p-4 ring-1 ring-white/[0.06]">
                  <div className="text-sm font-semibold text-white">Continuous Improvement</div>
                  <p className="mt-1.5 text-sm text-white/80">PGI continuously studies advancements in electronics manufacturing, automation, and precision machining to strengthen our production network.</p>
                </div>
              </div>
            </div>

            {/* INDUSTRIES */}
            <div className="mt-12 rounded-xl bg-white/[0.04] p-7 ring-1 ring-white/[0.08]">
              <div className="grid gap-8 md:grid-cols-3 md:items-start">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-400 mb-2">Industries Served</div>
                  <div className="text-lg font-semibold text-white">Built for complex hardware</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">PGI supports companies developing sophisticated mechanical, electronic, and electromechanical products.</p>
                </div>
                <div className="md:col-span-2 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {["Industrial Machinery", "Robotics & Automation", "Energy Systems", "Electronics Equipment", "Automotive Components", "Technology Hardware"].map((x) => (
                    <div key={x} className="rounded-lg bg-white/[0.05] p-3.5 text-sm text-white/75 ring-1 ring-white/[0.06]">{x}</div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
                <div className="text-sm text-white/80">
                  Need support for your next manufacturing project?
                </div>
                <PrimaryButton to="/contact">Request Engineering Review</PrimaryButton>
              </div>
            </div>

          </Container>
        </section>
      </RevealSection>
    </div>
  );
}