import Container from "../components/Container.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { pricingPlans, pricingFeatures } from "../content/siteData.js";
import { RevealSection } from "../components/RevealSection.jsx";

function Check({ on }) {
  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ring-1 ${on ? "bg-blue-500/15 text-blue-300 ring-blue-500/25" : "bg-white/[0.05] text-white/20 ring-white/[0.08]"}`} aria-hidden="true">
      {on ? "✓" : "–"}
    </span>
  );
}

export default function Pricing() {
  return (
    <div>
      <section className="border-b border-white/[0.08] bg-gradient-to-b from-[rgb(10,14,28)] to-[rgb(12,18,34)] py-16 md:py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-400 mb-4">
              <span className="w-6 h-px bg-blue-500/50" />Plans<span className="w-6 h-px bg-blue-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Membership Plans</h1>
            <p className="mt-5 text-white/80 leading-relaxed">Choose the level of manufacturing coordination you need. Upgrade anytime as project load increases.</p>
          </div>
        </Container>
      </section>

      <Container className="py-16 md:py-20">
        {/* CARDS */}
        <div className="grid gap-5 lg:grid-cols-3 mb-16">
          {pricingPlans.map((p) => (
            <div key={p.key} className={`relative overflow-hidden rounded-xl p-7 ring-1 transition-all duration-300 flex flex-col ${p.highlight ? "bg-gradient-to-br from-blue-500/10 to-blue-500/[0.02] ring-blue-500/25 shadow-lg shadow-blue-500/5" : "bg-white/[0.04] ring-white/[0.08] hover:ring-white/[0.12]"}`}>
              {p.highlight && (
                <div className="absolute right-4 top-4 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-blue-300 ring-1 ring-blue-500/25">POPULAR</div>
              )}
              <div>
                <div className="text-xl font-semibold text-white">{p.name}</div>
                <div className="mt-2 text-2xl font-bold text-blue-400">{p.price}</div>
                <div className="mt-1 text-[11px] text-white/70">{p.note}</div>
                <div className="mt-3 text-sm text-white/80">{p.desc}</div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <PrimaryButton to={p.to} className="w-full text-center">{p.cta}</PrimaryButton>
                <SecondaryButton to="/contact" className="w-full text-center">Ask a question</SecondaryButton>
              </div>
              <div className="mt-5 h-px bg-white/[0.06]" />
              <div className="mt-5 space-y-3 flex-grow">
                <div>
                  <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Project Support</div>
                  <p className="text-sm text-white/80 leading-relaxed">{p.poSupport}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Additional Support</div>
                  <p className="text-sm text-white/80"><span className="font-medium text-white/60">{p.demandTaskSupport}</span></p>
                </div>
              </div>
              <div className="mt-5 h-px bg-white/[0.06]" />
              <div className="mt-5">
                <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-3">Features</div>
                <ul className="space-y-2.5">
                  {pricingFeatures.map((f) => {
                    const on = p.key === "basic" ? f.basic : p.key === "standard" ? f.standard : f.premium;
                    return (
                      <li key={f.label} className="flex items-start gap-2.5">
                        <Check on={on} />
                        <span className={`text-sm ${on ? "text-white/60" : "text-white/50"}`}>{f.label}</span>
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
          <div className="rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] overflow-hidden mb-16">
            <div className="p-7">
              <h2 className="text-xl font-semibold text-white mb-6">Feature Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-3 px-3 text-sm font-semibold text-white/60">Feature</th>
                      <th className="text-center py-3 px-3 text-sm font-semibold text-white/60">Prototype</th>
                      <th className="text-center py-3 px-3 text-sm font-semibold text-blue-400">Production</th>
                      <th className="text-center py-3 px-3 text-sm font-semibold text-white/60">Scale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingFeatures.map((f, i) => (
                      <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 text-sm text-white/80">{f.label}</td>
                        <td className="py-3 px-3 text-center"><Check on={f.basic} /></td>
                        <td className="py-3 px-3 text-center"><Check on={f.standard} /></td>
                        <td className="py-3 px-3 text-center"><Check on={f.premium} /></td>
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
          <div className="mb-16">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { q: "Can I upgrade my plan anytime?", a: "Yes, upgrade anytime as your project load increases. We'll pro-rate any adjustments." },
                { q: "What's included in the engineering review?", a: "CAD analysis, DFM assessment, tolerance review, material selection, and manufacturing method optimization." },
                { q: "How quickly do you respond?", a: "Our team responds to all project inquiries within 24 hours with a detailed engineering assessment." },
                { q: "Do you handle international shipping?", a: "Yes, we coordinate worldwide shipping with export documentation and customs clearance." },
                { q: "What payment terms do you offer?", a: "Flexible payment terms are negotiated based on project scope and volume commitments." },
                { q: "Can I get a custom plan?", a: "Absolutely. Contact our team to discuss a custom plan tailored to your specific needs." }
              ].map((faq, i) => (
                <div key={i} className="rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] p-5">
                  <h4 className="font-semibold text-white text-sm mb-2">{faq.q}</h4>
                  <p className="text-sm text-white/75">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/5 p-10 text-center ring-1 ring-blue-500/15">
          <h2 className="text-2xl font-semibold text-white">Ready to get started?</h2>
          <p className="mt-3 text-white/75 text-sm">Choose a plan and begin your manufacturing coordination journey</p>
          <div className="mt-6"><PrimaryButton to="/contact">Contact our sales team</PrimaryButton></div>
        </div>
      </Container>
    </div>
  );
}
