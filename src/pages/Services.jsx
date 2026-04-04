import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { services } from "../content/siteData.js";
import { RevealSection } from "../components/RevealSection.jsx";

export default function Services() {
  return (
    <div>
      <section className="border-b border-white/[0.08] bg-gradient-to-b from-[rgb(10,14,28)] to-[rgb(12,18,34)] py-16 md:py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-400 mb-4">
              <span className="w-6 h-px bg-blue-500/50" />Services<span className="w-6 h-px bg-blue-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Engineering-led manufacturing solutions</h1>
            <p className="mt-5 text-white/80 leading-relaxed">PGI coordinates the complete manufacturing lifecycle - from engineering review and prototyping to production scaling, assembly, quality verification, and global delivery.</p>
          </div>
        </Container>
      </section>

      <RevealSection>
        <section className="border-b border-white/[0.08] py-16 md:py-20">
          <Container>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s, idx) => (
                <div key={idx} className="group rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] hover:ring-blue-500/20 transition-all duration-300 flex flex-col">
                  <div className="relative overflow-hidden rounded-lg aspect-video mb-5">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/75 leading-relaxed">{s.desc}</p>
                  <div className="mt-4 pt-4 border-t border-white/[0.08]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400/70 mb-2.5">Key Benefits</p>
                    <ul className="space-y-1.5">
                      {s.benefits?.map((b, i) => (
                        <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                          <span className="text-blue-500/50 mt-0.5 text-[10px]">▸</span><span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="border-b border-white/[0.08] py-16 md:py-20">
          <Container>
            <div className="text-center mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-400 mb-3">Detailed Capabilities</div>
              <h2 className="text-3xl font-semibold text-white">Manufacturing Excellence</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: "Precision CNC Machining", items: ["Multi-axis CNC milling and turning", "Materials: Aluminum, Stainless Steel, Brass, Titanium", "Custom surface finishing options", "Tight tolerance control & inspection"], icon: "🔧" },
                { title: "Sheet Metal Fabrication", items: ["Laser cutting & precision bending", "Welding & forming capabilities", "Custom brackets & structural components", "Anodizing, powder coating, electroplating"], icon: "⚙️" },
                { title: "Electronic Assembly (PCBA)", items: ["Component sourcing from authorized distributors", "SMT & through-hole assembly", "Automated optical inspection (AOI)", "Functional testing & firmware programming"], icon: "📱" },
                { title: "Electromechanical Integration", items: ["Full box-build assembly", "Wire harness & connector integration", "Enclosure + PCB integration", "Multi-component assembly & testing"], icon: "🔌" },
                { title: "Quality Assurance & Inspection", items: ["First Article Inspection (FAI)", "Dimensional measurement reports (CMM)", "Material certificates & traceability", "Batch documentation & compliance"], icon: "✓" },
                { title: "Global Logistics & Export", items: ["Secure component packaging", "Export documentation management", "International freight coordination", "Worldwide delivery tracking"], icon: "🚀" }
              ].map((cap, idx) => (
                <div key={idx} className="rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] hover:ring-blue-500/15 p-6 transition-all duration-300">
                  <div className="grid md:grid-cols-4 gap-5">
                    <div className="text-3xl">{cap.icon}</div>
                    <div className="md:col-span-3">
                      <h3 className="text-base font-semibold text-white mb-3">{cap.title}</h3>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {cap.items.map((item, i) => (
                          <li key={i} className="text-sm text-white/80 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-blue-500/30 shrink-0" />{item}
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
      </RevealSection>

      <RevealSection>
        <section className="py-16 md:py-20">
          <Container>
            <div className="text-center mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-400 mb-3">Our Process</div>
              <h2 className="text-3xl font-semibold text-white">How We Deliver</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { step: "01", title: "Review", desc: "CAD analysis & DFM assessment" },
                { step: "02", title: "Plan", desc: "Sourcing & vendor coordination" },
                { step: "03", title: "Manufacture", desc: "Production execution & tracking" },
                { step: "04", title: "Test", desc: "Quality inspection & testing" },
                { step: "05", title: "Deliver", desc: "Global logistics & shipment" }
              ].map((p, idx) => (
                <div key={idx} className="text-center p-4">
                  <div className="rounded-xl w-14 h-14 bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-blue-400 font-mono">{p.step}</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm">{p.title}</h4>
                  <p className="text-xs text-white/70 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      <section className="py-14 border-t border-white/[0.08]">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/5 p-10 text-center ring-1 ring-blue-500/15">
            <h2 className="text-2xl font-semibold text-white">Discuss your manufacturing needs</h2>
            <p className="mt-3 text-white/75 text-sm">Get a free engineering review and quotation</p>
            <div className="mt-6"><PrimaryButton to="/contact">Contact our engineering team</PrimaryButton></div>
          </div>
        </Container>
      </section>
    </div>
  );
}
