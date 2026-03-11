import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { insights } from "../content/siteData.js";
import { PrimaryButton } from "../components/Buttons.jsx";

export default function Insights() {
  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm text-emerald-400 font-semibold">Engineering & Manufacturing Intelligence</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              Industry Insights
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed">
              Practical insights on scaling hardware production from engineering optimization and supplier coordination to precision manufacturing, quality control, and global delivery.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-20">
        {/* ========== INSIGHTS GRID ========== */}
        <div className="grid gap-8 md:grid-cols-3">
          {insights.map((i, idx) => (
            <a 
              key={idx}
              href={`/insights/${i.slug}`}
              className="group rounded-2xl bg-white/5 hover:bg-white/8 ring-1 ring-white/10 hover:ring-emerald-500/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col h-full"
            >
              <div className="relative overflow-hidden aspect-video bg-black/40">
                <img 
                  src={i.image} 
                  alt={i.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30">
                    {i.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition leading-snug">
                  {i.title}
                </h3>
                
                <p className="mt-3 text-sm text-white/70 flex-1 leading-relaxed">
                  {i.excerpt}
                </p>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/50">{i.readTime}</span>
                  <span className="text-sm text-emerald-400 group-hover:text-emerald-300 transition font-semibold">Read →</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* ========== INFO SECTION ========== */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white mb-4">About Our Insights</h2>
              <p className="text-white/70 mb-4 leading-relaxed">
                Our insights and articles are based on real-world manufacturing coordination across CNC machining facilities, electronics assembly partners, fabrication workshops, and global logistics providers.
              </p>
              <p className="text-white/70 mb-6 leading-relaxed">
                Our focus is on practical knowledge sharing-improving manufacturability, ensuring production reliability, and helping companies scale hardware manufacturing through structured engineering and supplier network management.
              </p>
              <div className="space-y-3">
                {[
                  "Real manufacturing experience across multiple industries",
                  "Practical solutions to common production challenges",
                  "Supply chain optimization strategies",
                  "Quality control best practices",
                  "Cost reduction techniques"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-black/40 p-8 ring-1 ring-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Browse by Category</h3>
              <div className="space-y-3">
                {["Manufacturing Strategy", "Supply Chain", "Industry Trends", "Quality Control", "Cost Optimization"].map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer">
                    <span className="text-sm text-white/70">{cat}</span>
                    <span className="text-emerald-400">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========== CTA ========== */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 p-12 text-center ring-1 ring-emerald-500/20">
          <h2 className="text-3xl font-semibold text-white">Subscribe to insights</h2>
          <p className="mt-3 text-white/75">Get manufacturing tips and industry updates directly to your inbox</p>
          <div className="mt-6 flex gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 ring-1 ring-white/20 focus:ring-emerald-500/40 focus:outline-none transition"
            />
            <PrimaryButton to="/contact">Subscribe</PrimaryButton>
          </div>
        </div>
      </Container>
    </div>
  );
}