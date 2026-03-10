import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { outdoorWorks, services } from "../content/siteData.js";

export default function Capabilities() {
  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm text-emerald-400 font-semibold">Capabilities</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              Engineering-driven manufacturing coordination
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed">
              PGI manages the complete manufacturing lifecycle for complex hardware products. From engineering review and material procurement to production coordination and final quality verification, we ensure reliable execution across our distributed manufacturing network.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-20">
        {/* ========== CAPABILITY CARDS ========== */}
        <div className="grid gap-6 md:grid-cols-4 mb-20">
          {outdoorWorks.map((o, idx) => (
            <div 
              key={idx}
              className="group rounded-2xl bg-white/5 hover:bg-white/8 ring-1 ring-white/10 hover:ring-emerald-500/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col"
            >
              <div className="relative overflow-hidden aspect-video bg-black/40">
                <img 
                  src={o.image} 
                  alt={o.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-base font-semibold text-white">{o.title}</h3>
                <p className="mt-2 text-xs text-white/70 flex-1 leading-relaxed">{o.desc}</p>
                <p className="mt-3 text-xs text-emerald-400 group-hover:text-emerald-300 transition">Explore →</p>
              </div>
            </div>
          ))}
        </div>

        {/* ========== CORE CAPABILITIES ========== */}
        <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10 mb-20">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Left side - List */}
            <div>
              <div className="text-sm font-semibold text-emerald-400 mb-2">Manufacturing Framework</div>
              <h2 className="text-3xl font-semibold text-white mb-6">
                Capabilities across the entire production lifecycle
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                PGI integrates engineering expertise with a carefully managed network of manufacturing partners. By controlling procurement, technical review, and quality verification, we ensure that production remains consistent, scalable, and aligned with customer requirements.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Engineering & Manufacturability Review", desc: "CAD analysis, DFM assessment, tolerance review, and design optimization" },
                  { title: "Raw Material & Component Procurement", desc: "Direct sourcing with traceability, quality control, and stable supply" },
                  { title: "Mechanical Manufacturing", desc: "CNC machining, turning, fabrication, casting, and surface finishing" },
                  { title: "Electronic Manufacturing Services", desc: "PCBA production with sourcing, assembly, inspection, and testing" },
                  { title: "Electromechanical Integration", desc: "Full product assembly combining enclosures, PCBs, and subsystems" },
                  { title: "Quality Verification & Inspection", desc: "CMM reports, functional testing, and material certification" }
                ].map((cap, idx) => (
                  <div key={idx} className="border-l-2 border-emerald-500/40 pl-4">
                    <h4 className="font-semibold text-white text-sm">{cap.title}</h4>
                    <p className="text-xs text-white/60 mt-1">{cap.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Benefits boxes */}
            <div className="space-y-4">
              {[
                { title: "Integrated Oversight", desc: "One engineering team manages design, vendors, and production verification" },
                { title: "Distributed Capacity", desc: "Access to multiple facilities reduces dependencies and improves resilience" },
                { title: "Cost Optimization", desc: "DFM reviews and smart supplier selection reduce per-unit costs" },
                { title: "Scalable Production", desc: "Seamless transitions from prototypes to batches to high-volume" },
                { title: "Quality Assurance", desc: "Comprehensive inspection and documentation for compliance" },
                { title: "Global Delivery", desc: "Export coordination and worldwide logistics management" }
              ].map((benefit, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl bg-black/40 hover:bg-black/60 p-4 ring-1 ring-white/10 hover:ring-emerald-500/30 transition-all duration-300"
                >
                  <div className="font-semibold text-white text-sm">{benefit.title}</div>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== MANUFACTURING NETWORK ========== */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-sm text-emerald-400 font-semibold">Network Details</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Our Manufacturing Ecosystem</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-7">
              <h3 className="text-xl font-semibold text-white mb-4">Precision Mechanical</h3>
              <ul className="space-y-3">
                {["CNC Milling & Turning", "Sheet Metal Fabrication", "Precision Casting", "Surface Finishing", "Tight Tolerance Control", "5-Axis Capabilities"].map((item, i) => (
                  <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-7">
              <h3 className="text-xl font-semibold text-white mb-4">Electronics Manufacturing</h3>
              <ul className="space-y-3">
                {["PCB Design Support", "Component Sourcing", "SMT & Through-Hole Assembly", "Automated Inspection", "Functional Testing", "Box Assembly Integration"].map((item, i) => (
                  <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-7">
              <h3 className="text-xl font-semibold text-white mb-4">Quality & Verification</h3>
              <ul className="space-y-3">
                {["First Article Inspection (FAI)", "CMM Dimensional Reports", "Material Mill Certificates", "Functional Testing", "Compliance Verification", "Traceability Documentation"].map((item, i) => (
                  <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-7">
              <h3 className="text-xl font-semibold text-white mb-4">Logistics & Delivery</h3>
              <ul className="space-y-3">
                {["Secure Packaging", "Export Documentation", "Freight Coordination", "Customs Clearance", "Worldwide Shipping", "Delivery Tracking"].map((item, i) => (
                  <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ========== CTA ========== */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 p-12 text-center ring-1 ring-emerald-500/20">
          <h2 className="text-3xl font-semibold text-white">Explore our full capabilities</h2>
          <p className="mt-3 text-white/75">Let's discuss how we can support your manufacturing requirements</p>
          <PrimaryButton to="/contact" className="mt-6">Start a conversation</PrimaryButton>
        </div>
      </Container>
    </div>
  );
}