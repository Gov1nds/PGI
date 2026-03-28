import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { newsItems } from "../content/siteData.js";
import { PrimaryButton } from "../components/Buttons.jsx";
import { RevealSection } from "../components/RevealSection.jsx";

export default function News() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[rgb(8,12,21)] to-[rgb(11,15,27)] py-20 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400 mb-5">
              <span className="w-8 h-px bg-gradient-to-r from-sky-500/60 to-sky-500/0" />Network Updates<span className="w-8 h-px bg-gradient-to-l from-sky-500/60 to-sky-500/0" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Manufacturing Network Updates</h1>
            <p className="mt-5 text-white/60 leading-[1.7] max-w-2xl mx-auto">
              Updates on new partnerships, expanded CNC and electronics capacity, engineering initiatives, and milestones across the PGI network.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {newsItems.map((n, idx) => (
            <Link key={idx} to={`/news/${n.slug}`}
              className="group rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] overflow-hidden transition-all duration-400 hover:ring-sky-500/20 hover:bg-white/[0.04] hover:-translate-y-1 flex flex-col h-full shadow-card hover:shadow-card-hover"
            >
              <div className="relative overflow-hidden aspect-video">
                <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25 backdrop-blur-sm">{n.category}</span>
                </div>
                <div className="absolute bottom-3 right-3 text-[10px] text-white/65 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md font-medium">{n.date}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-[15px] font-bold text-white group-hover:text-sky-400 transition-colors leading-snug">{n.title}</h3>
                <p className="mt-3 text-sm text-white/55 flex-1 leading-relaxed">{n.excerpt}</p>
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <span className="text-sm text-sky-400 group-hover:text-sky-300 transition-colors font-semibold">Read update →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <RevealSection className="mt-24">
          <div className="rounded-2xl bg-white/[0.02] p-8 md:p-10 ring-1 ring-white/[0.06] shadow-card">
            <h2 className="text-2xl font-bold text-white mb-5">About Network Updates</h2>
            <p className="text-sm text-white/55 leading-[1.7] mb-7">
              Our network updates highlight developments across PGI's manufacturing ecosystem, including new supplier partnerships, production capability expansions, and quality initiatives.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: "🤝", title: "New Partnerships", desc: "Expanded manufacturing network and supplier relationships" },
                { icon: "⚡", title: "Capacity Expansion", desc: "New facilities and expanded production capabilities" },
                { icon: "✓", title: "Quality Initiatives", desc: "Enhanced inspection and quality assurance processes" }
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.04] hover:ring-white/[0.08] transition-all duration-200">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-1.5">{item.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="mt-16">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-500/5" />
            <div className="relative p-10 md:p-14 ring-1 ring-sky-500/15 rounded-2xl text-center">
              <h2 className="text-2xl font-bold text-white">Stay updated</h2>
              <p className="mt-4 text-white/55 text-sm">Get notifications about new manufacturing partnerships and capability expansions</p>
              <div className="mt-8"><PrimaryButton to="/contact">Subscribe to updates</PrimaryButton></div>
            </div>
          </div>
        </RevealSection>
      </Container>
    </div>
  );
}
