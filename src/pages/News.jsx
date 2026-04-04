import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { newsItems } from "../content/siteData.js";
import { PrimaryButton } from "../components/Buttons.jsx";
import { RevealSection } from "../components/RevealSection.jsx";

export default function News() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-white/[0.08] bg-gradient-to-b from-[rgb(10,14,28)] to-[rgb(12,18,34)] py-16 md:py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-400 mb-4">
              <span className="w-6 h-px bg-blue-500/50" />
              Network Updates
              <span className="w-6 h-px bg-blue-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Manufacturing Network Updates
            </h1>
            <p className="mt-5 text-white/80 leading-relaxed max-w-2xl mx-auto">
              Updates on new partnerships, expanded CNC and electronics capacity, engineering initiatives, and milestones across the PGI network.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16 md:py-20">
        {/* GRID — using Link for client-side routing (FIX for 404 bug) */}
        <div className="grid gap-6 md:grid-cols-3">
          {newsItems.map((n, idx) => (
            <Link
              key={idx}
              to={`/news/${n.slug}`}
              className="group rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] overflow-hidden transition-all duration-300 hover:ring-blue-500/20 hover:bg-white/[0.04] flex flex-col h-full"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={n.image}
                  alt={n.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/25 backdrop-blur-sm">
                    {n.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 text-[10px] text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                  {n.date}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[15px] font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {n.title}
                </h3>
                <p className="mt-3 text-sm text-white/75 flex-1 leading-relaxed">{n.excerpt}</p>
                <div className="mt-5 pt-4 border-t border-white/[0.08]">
                  <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors font-medium">Read update →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* INFO */}
        <RevealSection className="mt-20">
          <div className="rounded-2xl bg-white/[0.04] p-8 md:p-10 ring-1 ring-white/[0.08]">
            <h2 className="text-2xl font-semibold text-white mb-4">About Network Updates</h2>
            <p className="text-sm text-white/75 leading-relaxed mb-6">
              Our network updates highlight developments across PGI's manufacturing ecosystem, including new supplier partnerships, production capability expansions, and quality initiatives.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: "🤝", title: "New Partnerships", desc: "Expanded manufacturing network and supplier relationships" },
                { icon: "⚡", title: "Capacity Expansion", desc: "New facilities and expanded production capabilities" },
                { icon: "✓", title: "Quality Initiatives", desc: "Enhanced inspection and quality assurance processes" }
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-white/[0.05] p-4 ring-1 ring-white/[0.06]">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA */}
        <RevealSection className="mt-14">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/5 p-10 text-center ring-1 ring-blue-500/15">
            <h2 className="text-2xl font-semibold text-white">Stay updated</h2>
            <p className="mt-3 text-white/75 text-sm">Get notifications about new manufacturing partnerships and capability expansions</p>
            <div className="mt-6">
              <PrimaryButton to="/contact">Subscribe to updates</PrimaryButton>
            </div>
          </div>
        </RevealSection>
      </Container>
    </div>
  );
}
