import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { services } from "../content/siteData.js";
import { RevealSection } from "../components/RevealSection.jsx";

export default function Services() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[rgb(8,12,21)] to-[rgb(11,15,27)] py-20 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400 mb-5">
              <span className="w-8 h-px bg-gradient-to-r from-sky-500/60 to-sky-500/0" />Services<span className="w-8 h-px bg-gradient-to-l from-sky-500/60 to-sky-500/0" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Engineering-led manufacturing solutions</h1>
            <p className="mt-5 text-white/60 leading-[1.7] max-w-2xl mx-auto">PGI coordinates the complete manufacturing lifecycle — from engineering review and prototyping to production scaling, assembly, quality verification, and global delivery.</p>
          </div>
        </Container>
      </section>

      <RevealSection>
        <section className="py-20 md:py-24">
          <div className="section-divider mb-20" />
          <Container>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s, idx) => (
                <div key={idx} className="group rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06] hover:ring-sky-500/20 hover:bg-white/[0.04] transition-all duration-400 flex flex-col hover:-translate-y-1 shadow-card hover:shadow-card-hover">
                  <div className="relative overflow-hidden rounded-xl aspect-video mb-5">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgb(8,12,21)]/40 to-transparent" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">{s.title}</h3>
                  <p className="mt-2.5 text-sm text-white/55 leading-relaxed">{s.desc}</p>
                  <div className="mt-5 pt-5 border-t border-white/[0.06]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400/60 mb-3">Key Benefits</p>
                    <ul className="space-y-2">
                      {s.benefits?.map((b, i) => (
                        <li key={i} className="text-xs text-white/60 flex items-start gap-2.5">
                          <span className="text-sky-500/50 mt-0.5 text-[10px]">▸</span><span>{b}</span>
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
        <section className="py-20 md:py-24">
          <div className="section-divider mb-20" />
          <Container>
            <div className="text-center mb-14">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-400 mb-3">Detailed Capabilities</div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Manufacturing Excellence</h2>
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
                <div key={idx} className="rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06] hover:ring-sky-500/15 hover:bg-white/[0.03] p-7 transition-all duration-300 shadow-card">
                  <div className="grid md:grid-cols-4 gap-5">
                    <div className="text-3xl">{cap.icon}</div>
                    <div className="md:col-span-3">
                      <h3 className="text-base font-bold text-white mb-3">{cap.title}</h3>
                      <ul className="grid md:grid-cols-2 gap-2.5">
                        {cap.items.map((item, i) => (
                          <li key={i} className="text-sm text-white/60 flex items-center gap-2.5">
                            <span className="w-1 h-1 rounded-full bg-sky-500/30 shrink-0" />{item}
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
        <section className="py-20 md:py-24">
          <div className="section-divider mb-20" />
          <Container>
            <div className="text-center mb-14">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-400 mb-3">Our Process</div>
              <h2 className="text-3xl font-bold text-white tracking-tight">How We Deliver</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { step: "01", title: "Review", desc: "CAD analysis & DFM assessment" },
                { step: "02", title: "Plan", desc: "Sourcing & vendor coordination" },
                { step: "03", title: "Manufacture", desc: "Production execution & tracking" },
                { step: "04", title: "Test", desc: "Quality inspection & testing" },
                { step: "05", title: "Deliver", desc: "Global logistics & shipment" }
              ].map((p, idx) => (
                <div key={idx} className="text-center p-5 group">
                  <div className="rounded-xl w-14 h-14 bg-sky-500/10 ring-1 ring-sky-500/20 flex items-center justify-center mx-auto mb-4 group-hover:ring-sky-500/40 group-hover:bg-sky-500/15 transition-all duration-300">
                    <span className="text-xl font-bold text-sky-400 font-mono">{p.step}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{p.title}</h4>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      <section className="py-16">
        <Container>
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-500/5" />
            <div className="absolute top-0 left-1/3 w-80 h-80 bg-sky-500/8 rounded-full blur-[100px]" />
            <div className="relative p-10 md:p-14 text-center ring-1 ring-sky-500/15 rounded-2xl">
              <h2 className="text-2xl font-bold text-white">Discuss your manufacturing needs</h2>
              <p className="mt-4 text-white/55 text-sm">Get a free engineering review and quotation</p>
              <div className="mt-8"><PrimaryButton to="/contact">Contact our engineering team</PrimaryButton></div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
