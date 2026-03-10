import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { pricingPlans, pricingFeatures } from "../content/siteData.js";

function Check({ on }) {
  return (
    <span
      className={
        "inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 " +
        (on
          ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
          : "bg-white/5 text-white/25 ring-white/10")
      }
      aria-hidden="true"
    >
      {on ? "✓" : "–"}
    </span>
  );
}

export default function Pricing() {
  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm text-emerald-400 font-semibold">Pricing</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              Membership Plans
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed">
              Choose the level of procurement and logistics coordination you need. Upgrade anytime as project load increases. All plans include dedicated engineering support.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-20">
        {/* ========== PRICING CARDS ========== */}
        <div className="grid gap-6 lg:grid-cols-3 mb-20">
          {pricingPlans.map((p) => (
            <div
              key={p.key}
              className={
                "relative overflow-hidden rounded-3xl p-8 ring-1 transition-all duration-300 flex flex-col " +
                (p.highlight
                  ? "bg-gradient-to-br from-white/12 to-white/5 ring-emerald-400/40 shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 ring-white/10 hover:ring-white/20 hover:bg-white/8")
              }
            >
              {p.highlight && (
                <div className="absolute right-4 top-4 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                  POPULAR
                </div>
              )}

              <div>
                <div className="text-2xl font-semibold text-white">{p.name}</div>
                <div className="mt-2 text-3xl font-bold text-emerald-300">{p.price}</div>
                <div className="mt-1 text-xs text-white/60">{p.note}</div>
                <div className="mt-3 text-sm text-white/70">{p.desc}</div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <PrimaryButton to={p.to} className="w-full text-center">{p.cta}</PrimaryButton>
                <SecondaryButton to="/contact" className="w-full text-center">Ask a question</SecondaryButton>
              </div>

              <div className="mt-6 h-px bg-white/10" />

              <div className="mt-6 space-y-4 flex-grow">
                <div>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Project Support</div>
                  <p className="text-sm text-white/75 leading-relaxed">{p.poSupport}</p>
                </div>

                <div>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Additional Support</div>
                  <p className="text-sm text-white/75 leading-relaxed">
                    <span className="font-semibold text-white/85">{p.demandTaskSupport}</span>{" "}
                    <span className="text-white/55">(extra scope / urgent tasks)</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 h-px bg-white/10" />

              <div className="mt-6">
                <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-4">Included Features</div>
                <ul className="space-y-3">
                  {pricingFeatures.map((f) => {
                    const on =
                      p.key === "basic"
                        ? f.basic
                        : p.key === "standard"
                        ? f.standard
                        : f.premium;

                    return (
                      <li key={f.label} className="flex items-start gap-3">
                        <Check on={on} />
                        <span className={`text-sm ${on ? "text-white/80" : "text-white/40"}`}>
                          {f.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ========== COMPARISON TABLE ========== */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-8">Detailed Feature Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 font-semibold text-white">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-white">Prototype</th>
                    <th className="text-center py-4 px-4 font-semibold text-emerald-300">Production</th>
                    <th className="text-center py-4 px-4 font-semibold text-white">Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingFeatures.map((f, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-4 px-4 text-sm text-white/70">{f.label}</td>
                      <td className="py-4 px-4 text-center">
                        <Check on={f.basic} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check on={f.standard} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check on={f.premium} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========== FAQ SECTION ========== */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I upgrade my plan anytime?",
                a: "Yes, upgrade anytime as your project load increases. We'll pro-rate any adjustments."
              },
              {
                q: "What's included in the engineering review?",
                a: "CAD analysis, DFM assessment, tolerance review, material selection, and manufacturing method optimization."
              },
              {
                q: "How quickly do you respond to inquiries?",
                a: "Our team responds to all project inquiries within 24 hours with a detailed engineering assessment."
              },
              {
                q: "Do you handle international shipping?",
                a: "Yes, we coordinate worldwide shipping with export documentation and customs clearance."
              },
              {
                q: "What payment terms do you offer?",
                a: "Flexible payment terms are negotiated based on project scope and volume commitments."
              },
              {
                q: "Can I get a custom plan?",
                a: "Absolutely. Contact our team to discuss a custom plan tailored to your specific needs."
              }
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-white/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========== CTA ========== */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 p-12 text-center ring-1 ring-emerald-500/20">
          <h2 className="text-3xl font-semibold text-white">Ready to get started?</h2>
          <p className="mt-3 text-white/75">Choose a plan and begin your manufacturing coordination journey</p>
          <PrimaryButton to="/contact" className="mt-6">Contact our sales team</PrimaryButton>
        </div>
      </Container>
    </div>
  );
}