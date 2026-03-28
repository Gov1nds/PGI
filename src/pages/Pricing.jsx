import Container from "../components/Container.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { pricingPlans, pricingFeatures } from "../content/siteData.js";
import { RevealSection } from "../components/RevealSection.jsx";

function Check({ on }) {
  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ring-1 ${on ? "bg-sky-500/15 text-sky-300 ring-sky-500/25" : "bg-white/[0.03] text-white/15 ring-white/[0.06]"}`} aria-hidden="true">
      {on ? "✓" : "–"}
    </span>
  );
}

export default function Pricing() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#080c15] to-[#0b0f1b] py-20 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400 mb-5">
              <span className="w-8 h-px bg-gradient-to-r from-sky-500/60 to-sky-500/0" />Plans<span className="w-8 h-px bg-gradient-to-l from-sky-500/60 to-sky-500/0" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Membership Plans</h1>
            <p className="mt-5 text-white/60 leading-[1.7] max-w-xl mx-auto">Choose the level of manufacturing coordination you need. Upgrade anytime as project load increases.</p>
          </div>
        </Container>
      </section>

      <Container className="py-20 md:py-24">
        {/* CARDS */}
        <div className="grid gap-5 lg:grid-cols-3 mb-20">
          {pricingPlans.map((p) => (
            <div key={p.key} className={`relative overflow-hidden rounded-2xl p-8 ring-1 transition-all duration-300 flex flex-col hover:-translate-y-1 ${p.highlight ? "bg-gradient-to-br from-sky-500/10 to-sky-500/[0.02] ring-sky-500/25 shadow-xl shadow-sky-500/[0.06]" : "bg-white/[0.02] ring-white/[0.06] hover:ring-white/[0.12] shadow-card"}`}>
              {p.highlight && (
                <div className="absolute right-4 top-4 rounded-full bg-sky-500/15 px-3 py-0.5 text-[10px] font-bold text-sky-300 ring-1 ring-sky-500/25 tracking-wider uppercase">Popular</div>
              )}
              <div>
                <div className="text-xl font-bold text-white">{p.name}</div>
                <div className="mt-3 text-2xl font-bold gradient-text">{p.price}</div>
                <div className="mt-1.5 text-[11px] text-white/50 font-medium">{p.note}</div>
                <div className="mt-4 text-sm text-white/60 leading-relaxed">{p.desc}</div>
              </div>
              <div className="mt-6 flex flex-col gap-2.5">
                <PrimaryButton to={p.to} className="w-full text-center">{p.cta}</PrimaryButton>
                <SecondaryButton to="/contact" className="w-full text-center">Ask a question</SecondaryButton>
              </div>
              <div className="mt-6 h-px bg-white/[0.06]" />
              <div className="mt-6 space-y-4 flex-grow">
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.12em] mb-2">Project Support</div>
                  <p className="text-sm text-white/60 leading-relaxed">{p.poSupport}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.12em] mb-2">Additional Support</div>
                  <p className="text-sm text-white/60"><span className="font-medium text-white/50">{p.demandTaskSupport}</span></p>
                </div>
              </div>
              <div className="mt-6 h-px bg-white/[0.06]" />
              <div className="mt-6">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.12em] mb-4">Features</div>
                <ul className="space-y-3">
                  {pricingFeatures.map((f) => {
                    const on = p.key === "basic" ? f.basic : p.key === "standard" ? f.standard : f.premium;
                    return (
                      <li key={f.label} className="flex items-start gap-3">
                        <Check on={on} />
                        <span className={`text-sm ${on ? "text-white/60" : "text-white/30"}`}>{f.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* COMPARISON TABLE */}
        <RevealSection>
          <div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden mb-20 shadow-card">
            <div className="p-8">
              <h2 className="text-xl font-bold text-white mb-8">Feature Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-3 px-4 text-sm font-bold text-white/50">Feature</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-white/50">Prototype</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-sky-400">Production</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-white/50">Scale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingFeatures.map((f, i) => (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 text-sm text-white/65">{f.label}</td>
                        <td className="py-3.5 px-4 text-center"><Check on={f.basic} /></td>
                        <td className="py-3.5 px-4 text-center"><Check on={f.standard} /></td>
                        <td className="py-3.5 px-4 text-center"><Check on={f.premium} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* FAQ */}
        <RevealSection>
          <div className="mb-20">
            <h2 className="text-xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { q: "Can I upgrade my plan anytime?", a: "Yes, upgrade anytime as your project load increases. We'll pro-rate any adjustments." },
                { q: "What's included in the engineering review?", a: "CAD analysis, DFM assessment, tolerance review, material selection, and manufacturing method optimization." },
                { q: "How quickly do you respond?", a: "Our team responds to all project inquiries within 24 hours with a detailed engineering assessment." },
                { q: "Do you handle international shipping?", a: "Yes, we coordinate worldwide shipping with export documentation and customs clearance." },
                { q: "What payment terms do you offer?", a: "Flexible payment terms are negotiated based on project scope and volume commitments." },
                { q: "Can I get a custom plan?", a: "Absolutely. Contact our team to discuss a custom plan tailored to your specific needs." }
              ].map((faq, i) => (
                <div key={i} className="rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06] p-6 hover:ring-white/[0.1] transition-all duration-300">
                  <h4 className="font-bold text-white text-sm mb-2.5">{faq.q}</h4>
                  <p className="text-sm text-white/55 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-500/5" />
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-sky-500/8 rounded-full blur-[100px]" />
          <div className="relative p-10 md:p-14 ring-1 ring-sky-500/15 rounded-2xl text-center">
            <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
            <p className="mt-4 text-white/55 text-sm">Choose a plan and begin your manufacturing coordination journey</p>
            <div className="mt-8"><PrimaryButton to="/contact">Contact our sales team</PrimaryButton></div>
          </div>
        </div>
      </Container>
    </div>
  );
}
