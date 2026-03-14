import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { newsItems } from "../content/siteData.js";
import { PrimaryButton } from "../components/Buttons.jsx";

export default function News() {
  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm text-emerald-400 font-semibold">Network Updates</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              Manufacturing Network Updates
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed">
              Updates on new manufacturing partnerships, expanded CNC and electronics production capacity, engineering initiatives, and operational milestones across the PGI manufacturing network.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-20">
        {/* ========== NEWS GRID ========== */}
        <div className="grid gap-8 md:grid-cols-3">
          {newsItems.map((n, idx) => (
            <Link 
              key={idx}
              to={`/news/${n.slug}`}
              className="group rounded-2xl bg-white/5 hover:bg-white/8 ring-1 ring-white/10 hover:ring-blue-500/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col h-full"
            >
              <div className="relative overflow-hidden aspect-video bg-black/40">
                <img 
                  src={n.image} 
                  alt={n.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                    {n.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="text-xs text-white/70 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg">
                    {n.date}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition leading-snug">
                  {n.title}
                </h3>
                
                <p className="mt-3 text-sm text-white/70 flex-1 leading-relaxed">
                  {n.excerpt}
                </p>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="text-sm text-blue-400 group-hover:text-blue-300 transition font-semibold">Read update →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ========== INFO SECTION ========== */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
          <h2 className="text-3xl font-semibold text-white mb-4">About Network Updates</h2>
          <p className="text-white/70 leading-relaxed mb-6">
            Our network updates highlight developments across PGI's manufacturing ecosystem, including new supplier partnerships, production capability expansions, quality initiatives, and improvements in engineering-driven manufacturing coordination.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: "🤝", title: "New Partnerships", desc: "Expanded manufacturing network and supplier relationships" },
              { icon: "⚡", title: "Capacity Expansion", desc: "New facilities and expanded production capabilities" },
              { icon: "✓", title: "Quality Initiatives", desc: "Enhanced inspection and quality assurance processes" }
            ].map((item, i) => (
              <div key={i} className="rounded-xl bg-black/40 p-4">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-white text-sm mb-2">{item.title}</h4>
                <p className="text-xs text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========== CTA ========== */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-500/15 to-blue-500/5 p-12 text-center ring-1 ring-blue-500/20">
          <h2 className="text-3xl font-semibold text-white">Stay updated</h2>
          <p className="mt-3 text-white/75">Get notifications about new manufacturing partnerships and capability expansions</p>
          <PrimaryButton to="/contact" className="mt-6">Subscribe to updates</PrimaryButton>
        </div>
      </Container>
    </div>
  );
}