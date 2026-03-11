import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { services } from "../content/siteData.js";

export default function Services() {
  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm text-emerald-400 font-semibold">Services</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              Engineering-led manufacturing solutions
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed">
              PGI coordinates the complete manufacturing lifecycle-from engineering review and prototyping to production scaling, assembly, quality verification, and global delivery.
            </p>
          </div>
        </Container>
      </section>

      {/* ========== SERVICES GRID ========== */}
      <section className="border-b border-white/10 py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, idx) => (
              <div 
                key={idx}
                className="group rounded-2xl bg-gradient-to-br from-white/8 to-white/3 hover:from-white/12 hover:to-white/8 p-6 ring-1 ring-white/10 hover:ring-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col"
              >
                <div className="relative overflow-hidden rounded-xl aspect-video bg-black/40 mb-5">
                  <img 
                    src={s.image} 
                    alt={s.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition">{s.title}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{s.desc}</p>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-emerald-400 mb-3">Key Benefits:</p>
                  <ul className="space-y-2">
                    {s.benefits?.map((b, i) => (
                      <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex-grow"></div>
                <p className="text-sm text-emerald-400 group-hover:text-emerald-300 transition">Learn more →</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========== DETAILED CAPABILITIES ========== */}
      <section className="border-b border-white/10 py-20 bg-gradient-to-b from-transparent to-emerald-500/5">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-semibold">Detailed Capabilities</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Manufacturing Excellence</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "Precision CNC Machining",
                items: ["Multi-axis CNC milling and turning", "Materials: Aluminum, Stainless Steel, Brass, Titanium", "Custom surface finishing options", "Tight tolerance control & inspection"],
                icon: "🔧"
              },
              {
                title: "Sheet Metal Fabrication",
                items: ["Laser cutting & precision bending", "Welding & forming capabilities", "Custom brackets & structural components", "Anodizing, powder coating, electroplating"],
                icon: "⚙️"
              },
              {
                title: "Electronic Assembly (PCBA)",
                items: ["Component sourcing from authorized distributors", "SMT & through-hole assembly", "Automated optical inspection (AOI)", "Functional testing & firmware programming"],
                icon: "📱"
              },
              {
                title: "Electromechanical Integration",
                items: ["Full box-build assembly", "Wire harness & connector integration", "Enclosure + PCB integration", "Multi-component assembly & testing"],
                icon: "🔌"
              },
              {
                title: "Quality Assurance & Inspection",
                items: ["First Article Inspection (FAI)", "Dimensional measurement reports (CMM)", "Material certificates & traceability", "Batch documentation & compliance"],
                icon: "✓"
              },
              {
                title: "Global Logistics & Export",
                items: ["Secure component packaging", "Export documentation management", "International freight coordination", "Worldwide delivery tracking"],
                icon: "🚀"
              }
            ].map((cap, idx) => (
              <div key={idx} className="rounded-2xl bg-white/5 ring-1 ring-white/10 hover:ring-emerald-500/30 p-7 transition-all duration-300 hover:bg-white/8">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-4xl">{cap.icon}</div>
                  <div className="md:col-span-3">
                    <h3 className="text-lg font-semibold text-white mb-3">{cap.title}</h3>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {cap.items.map((item, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========== PROCESS SECTION ========== */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-semibold">Our Process</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">How We Deliver</h2>
            <p className="mt-2 text-white/70">Structured approach to manufacturing excellence</p>
          </div>

          <div className="mt-12 grid md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Review", desc: "CAD analysis & DFM assessment" },
              { step: "02", title: "Plan", desc: "Sourcing & vendor coordination" },
              { step: "03", title: "Manufacture", desc: "Production execution & tracking" },
              { step: "04", title: "Test", desc: "Quality inspection & testing" },
              { step: "05", title: "Deliver", desc: "Global logistics & shipment" }
            ].map((p, idx) => (
              <div key={idx} className="text-center">
                <div className="rounded-full w-16 h-16 bg-emerald-500/20 ring-2 ring-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-emerald-300">{p.step}</span>
                </div>
                <h4 className="font-semibold text-white">{p.title}</h4>
                <p className="text-xs text-white/70 mt-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-16 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 border-t border-white/10">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white">Discuss your manufacturing needs</h2>
            <p className="mt-3 text-white/75">Get a free engineering review and quotation</p>
            <PrimaryButton to="/contact" className="mt-6">Contact our engineering team</PrimaryButton>
          </div>
        </Container>
      </section>
    </div>
  );
}