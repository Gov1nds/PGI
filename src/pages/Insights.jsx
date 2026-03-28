import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { insights } from "../content/siteData.js";
import { PrimaryButton } from "../components/Buttons.jsx";
import { RevealSection } from "../components/RevealSection.jsx";

export default function Insights() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#080c15] to-[#0b0f1b] py-20 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400 mb-5">
              <span className="w-8 h-px bg-gradient-to-r from-sky-500/60 to-sky-500/0" />
              Engineering & Manufacturing Intelligence
              <span className="w-8 h-px bg-gradient-to-l from-sky-500/60 to-sky-500/0" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Industry Insights</h1>
            <p className="mt-5 text-white/60 leading-[1.7] max-w-2xl mx-auto">
              Practical insights on scaling hardware production from engineering optimization and supplier coordination to precision manufacturing, quality control, and global delivery.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {insights.map((i, idx) => (
            <Link key={idx} to={`/insights/${i.slug}`}
              className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden transition-all duration-300 hover:ring-sky-500/20 hover:bg-white/[0.04] hover:-translate-y-1 flex flex-col h-full shadow-card hover:shadow-card-hover"
            >
              <div className="relative overflow-hidden aspect-video">
                <img src={i.image} alt={i.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25 backdrop-blur-sm">
                    {i.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-[15px] font-bold text-white group-hover:text-sky-400 transition-colors leading-snug">{i.title}</h3>
                <p className="mt-3 text-sm text-white/55 flex-1 leading-relaxed">{i.excerpt}</p>
                <div className="mt-5 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-white/40">{i.readTime}</span>
                  <span className="text-sm text-sky-400 group-hover:text-sky-300 transition-colors font-semibold">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <RevealSection className="mt-24">
          <div className="rounded-2xl bg-white/[0.02] p-8 md:p-10 ring-1 ring-white/[0.06] shadow-card">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-5">About Our Insights</h2>
                <p className="text-sm text-white/55 mb-5 leading-[1.7]">
                  Our insights are based on real-world manufacturing coordination across CNC facilities, electronics assembly partners, fabrication workshops, and global logistics providers.
                </p>
                <div className="space-y-3">
                  {["Real manufacturing experience across multiple industries", "Practical solutions to common production challenges", "Supply chain optimization strategies", "Quality control best practices", "Cost reduction techniques"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-white/60">
                      <span className="w-1 h-1 rounded-full bg-sky-500/40 shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-6 ring-1 ring-white/[0.06]">
                <h3 className="text-lg font-bold text-white mb-5">Browse by Category</h3>
                <div className="space-y-2">
                  {["Manufacturing Strategy", "Supply Chain", "Industry Trends", "Quality Control", "Cost Optimization"].map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer group/cat">
                      <span className="text-sm text-white/65 group-hover/cat:text-white/80 transition-colors">{cat}</span>
                      <span className="text-sky-400 text-sm group-hover/cat:translate-x-0.5 transition-transform">→</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="mt-16">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-500/5" />
            <div className="relative p-10 md:p-14 ring-1 ring-sky-500/15 rounded-2xl text-center">
              <h2 className="text-2xl font-bold text-white">Subscribe to insights</h2>
              <p className="mt-4 text-white/55 text-sm">Get manufacturing tips and industry updates directly to your inbox</p>
              <div className="mt-7 flex gap-2.5 justify-center max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" className="flex-1 rounded-xl bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-white/25 ring-1 ring-white/[0.08] focus:ring-sky-500/30 focus:outline-none transition-all" />
                <PrimaryButton to="/contact">Subscribe</PrimaryButton>
              </div>
            </div>
          </div>
        </RevealSection>
      </Container>
    </div>
  );
}
