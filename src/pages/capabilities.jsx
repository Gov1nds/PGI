import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { outdoorWorks } from "../content/siteData.js";
import { RevealSection } from "../components/RevealSection.jsx";

export default function Capabilities() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#080c15] to-[#0b0f1b] py-20 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400 mb-5">
              <span className="w-8 h-px bg-gradient-to-r from-sky-500/60 to-sky-500/0" />Manufacturing Network<span className="w-8 h-px bg-gradient-to-l from-sky-500/60 to-sky-500/0" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Engineering-driven manufacturing coordination</h1>
            <p className="mt-5 text-white/60 leading-[1.7] max-w-2xl mx-auto">PGI manages the complete manufacturing lifecycle for complex hardware products — from engineering review and material procurement to production coordination and quality verification.</p>
          </div>
        </Container>
      </section>

      <Container className="py-20 md:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {outdoorWorks.map((o, idx) => (
            <div key={idx} className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] hover:ring-sky-500/20 overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 shadow-card hover:shadow-card-hover">
              <div className="relative overflow-hidden aspect-video">
                <img src={o.image} alt={o.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-white">{o.title}</h3>
                <p className="mt-2.5 text-xs text-white/55 flex-1 leading-relaxed">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <RevealSection>
          <div className="rounded-2xl bg-white/[0.02] p-8 md:p-10 ring-1 ring-white/[0.06] mb-20 shadow-card">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400 mb-2">Manufacturing Framework</div>
                <h2 className="text-2xl font-bold text-white mb-5 tracking-tight">Capabilities across the entire production lifecycle</h2>
                <p className="text-sm text-white/55 leading-[1.7] mb-7">PGI integrates engineering expertise with a carefully managed network of manufacturing partners, controlling procurement, technical review, and quality verification.</p>
                <div className="space-y-5">
                  {[
                    { title: "Engineering & Manufacturability Review", desc: "CAD analysis, DFM assessment, tolerance review, and design optimization" },
                    { title: "Raw Material & Component Procurement", desc: "Direct sourcing with traceability, quality control, and stable supply" },
                    { title: "Mechanical Manufacturing", desc: "CNC machining, turning, fabrication, casting, and surface finishing" },
                    { title: "Electronic Manufacturing Services", desc: "PCBA production with sourcing, assembly, inspection, and testing" },
                    { title: "Electromechanical Integration", desc: "Full product assembly combining enclosures, PCBs, and subsystems" },
                    { title: "Quality Verification & Inspection", desc: "CMM reports, functional testing, and material certification" }
                  ].map((cap, idx) => (
                    <div key={idx} className="border-l-2 border-sky-500/25 pl-5 hover:border-sky-500/50 transition-colors">
                      <h4 className="font-bold text-white text-sm">{cap.title}</h4>
                      <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{cap.desc}</p>
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
                  <div key={idx} className="rounded-xl bg-white/[0.03] hover:bg-white/[0.05] p-5 ring-1 ring-white/[0.04] hover:ring-sky-500/15 transition-all duration-300">
                    <div className="font-bold text-white text-sm">{b.title}</div>
                    <p className="text-xs text-white/55 mt-2 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection>
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-400 mb-3">Network Details</div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Our Manufacturing Ecosystem</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Precision Mechanical", items: ["CNC Milling & Turning", "Sheet Metal Fabrication", "Precision Casting", "Surface Finishing", "Tight Tolerance Control", "5-Axis Capabilities"] },
                { title: "Electronics Manufacturing", items: ["PCB Design Support", "Component Sourcing", "SMT & Through-Hole Assembly", "Automated Inspection", "Functional Testing", "Box Assembly Integration"] },
                { title: "Quality & Verification", items: ["First Article Inspection (FAI)", "CMM Dimensional Reports", "Material Mill Certificates", "Functional Testing", "Compliance Verification", "Traceability Documentation"] },
                { title: "Logistics & Delivery", items: ["Secure Packaging", "Export Documentation", "Freight Coordination", "Customs Clearance", "Worldwide Shipping", "Delivery Tracking"] }
              ].map((sec, idx) => (
                <div key={idx} className="rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06] p-7 hover:ring-white/[0.1] transition-all duration-300 shadow-card">
                  <h3 className="text-base font-bold text-white mb-5">{sec.title}</h3>
                  <ul className="space-y-3">
                    {sec.items.map((item, i) => (
                      <li key={i} className="text-sm text-white/60 flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-sky-500/30 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-500/5" />
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-sky-500/8 rounded-full blur-[100px]" />
          <div className="relative p-10 md:p-14 text-center ring-1 ring-sky-500/15 rounded-2xl">
            <h2 className="text-2xl font-bold text-white">Explore our full capabilities</h2>
            <p className="mt-4 text-white/55 text-sm">Let's discuss how we can support your manufacturing requirements</p>
            <div className="mt-8"><PrimaryButton to="/contact">Start a conversation</PrimaryButton></div>
          </div>
        </div>
      </Container>
    </div>
  );
}
