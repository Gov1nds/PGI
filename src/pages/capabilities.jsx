import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { outdoorWorks } from "../content/siteData.js";
import { RevealSection } from "../components/RevealSection.jsx";

export default function Capabilities() {
  return (
    <div>
      <section className="border-b border-white/[0.08] bg-gradient-to-b from-[rgb(10,14,28)] to-[rgb(12,18,34)] py-16 md:py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-violet-400 mb-4">
              <span className="w-6 h-px bg-violet-500/50" />Manufacturing Network<span className="w-6 h-px bg-violet-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Engineering-driven manufacturing coordination</h1>
            <p className="mt-5 text-white/80 leading-relaxed">PGI manages the complete manufacturing lifecycle for complex hardware products — from engineering review and material procurement to production coordination and quality verification.</p>
          </div>
        </Container>
      </section>

      <Container className="py-16 md:py-20">
        {/* CAPABILITY CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {outdoorWorks.map((o, idx) => (
            <div key={idx} className="group rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] hover:ring-violet-500/20 overflow-hidden transition-all duration-300 flex flex-col">
              <div className="relative overflow-hidden aspect-video">
                <img src={o.image} alt={o.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-white">{o.title}</h3>
                <p className="mt-2 text-xs text-white/75 flex-1 leading-relaxed">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CORE CAPABILITIES */}
        <RevealSection>
          <div className="rounded-xl bg-white/[0.04] p-7 md:p-10 ring-1 ring-white/[0.08] mb-16">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-400 mb-2">Manufacturing Framework</div>
                <h2 className="text-2xl font-semibold text-white mb-5">Capabilities across the entire production lifecycle</h2>
                <p className="text-sm text-white/75 leading-relaxed mb-6">PGI integrates engineering expertise with a carefully managed network of manufacturing partners, controlling procurement, technical review, and quality verification.</p>
                <div className="space-y-4">
                  {[
                    { title: "Engineering & Manufacturability Review", desc: "CAD analysis, DFM assessment, tolerance review, and design optimization" },
                    { title: "Raw Material & Component Procurement", desc: "Direct sourcing with traceability, quality control, and stable supply" },
                    { title: "Mechanical Manufacturing", desc: "CNC machining, turning, fabrication, casting, and surface finishing" },
                    { title: "Electronic Manufacturing Services", desc: "PCBA production with sourcing, assembly, inspection, and testing" },
                    { title: "Electromechanical Integration", desc: "Full product assembly combining enclosures, PCBs, and subsystems" },
                    { title: "Quality Verification & Inspection", desc: "CMM reports, functional testing, and material certification" }
                  ].map((cap, idx) => (
                    <div key={idx} className="border-l-2 border-violet-500/30 pl-4">
                      <h4 className="font-semibold text-white text-sm">{cap.title}</h4>
                      <p className="text-xs text-white/70 mt-1">{cap.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Integrated Oversight", desc: "One engineering team manages design, vendors, and production verification" },
                  { title: "Distributed Capacity", desc: "Access to multiple facilities reduces dependencies and improves resilience" },
                  { title: "Cost Optimization", desc: "DFM reviews and smart supplier selection reduce per-unit costs" },
                  { title: "Scalable Production", desc: "Seamless transitions from prototypes to batches to high-volume" },
                  { title: "Quality Assurance", desc: "Comprehensive inspection and documentation for compliance" },
                  { title: "Global Delivery", desc: "Export coordination and worldwide logistics management" }
                ].map((b, idx) => (
                  <div key={idx} className="rounded-lg bg-white/[0.05] hover:bg-white/[0.05] p-4 ring-1 ring-white/[0.06] hover:ring-violet-500/15 transition-all duration-300">
                    <div className="font-semibold text-white text-sm">{b.title}</div>
                    <p className="text-xs text-white/75 mt-1.5 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* NETWORK DETAILS */}
        <RevealSection>
          <div className="mb-16">
            <div className="text-center mb-10">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-400 mb-3">Network Details</div>
              <h2 className="text-3xl font-semibold text-white">Our Manufacturing Ecosystem</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Precision Mechanical", items: ["CNC Milling & Turning", "Sheet Metal Fabrication", "Precision Casting", "Surface Finishing", "Tight Tolerance Control", "5-Axis Capabilities"] },
                { title: "Electronics Manufacturing", items: ["PCB Design Support", "Component Sourcing", "SMT & Through-Hole Assembly", "Automated Inspection", "Functional Testing", "Box Assembly Integration"] },
                { title: "Quality & Verification", items: ["First Article Inspection (FAI)", "CMM Dimensional Reports", "Material Mill Certificates", "Functional Testing", "Compliance Verification", "Traceability Documentation"] },
                { title: "Logistics & Delivery", items: ["Secure Packaging", "Export Documentation", "Freight Coordination", "Customs Clearance", "Worldwide Shipping", "Delivery Tracking"] }
              ].map((sec, idx) => (
                <div key={idx} className="rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] p-6">
                  <h3 className="text-base font-semibold text-white mb-4">{sec.title}</h3>
                  <ul className="space-y-2.5">
                    {sec.items.map((item, i) => (
                      <li key={i} className="text-sm text-white/80 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-violet-500/30 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/5 p-10 text-center ring-1 ring-violet-500/15">
          <h2 className="text-2xl font-semibold text-white">Explore our full capabilities</h2>
          <p className="mt-3 text-white/75 text-sm">Let's discuss how we can support your manufacturing requirements</p>
          <div className="mt-6"><PrimaryButton to="/contact">Start a conversation</PrimaryButton></div>
        </div>
      </Container>
    </div>
  );
}
