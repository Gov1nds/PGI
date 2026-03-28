import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { newsItems } from "../content/siteData.js";

export default function NewsDetail() {
  const { slug } = useParams();
  const news = newsItems.find((n) => n.slug === slug);

  if (!news) {
    return <Navigate to="/news" replace />;
  }

  const getFullContent = () => {
    const contentMap = {
      "cnc-network-expansion": {
        sections: [
          { title: "Strategic Growth in Precision Manufacturing", content: "PGI announces major expansion of its CNC manufacturing network with three new partner facilities across key geographic regions. This expansion strengthens our ability to handle complex precision machining projects with reduced lead times and increased capacity." },
          { title: "New Facilities and Capabilities", content: "The newly integrated facilities bring advanced multi-axis CNC capabilities, custom surface finishing, and specialized processes including aerospace-grade material handling. Combined, they add 40% additional production capacity for precision components." },
          { title: "Geographic Diversification", content: "The new locations reduce manufacturing dependency on any single region and provide better logistics efficiency for our clients across different markets. This diversification also improves supply chain resilience." },
          { title: "Quality Standards Maintained", content: "All new partner facilities meet PGI's stringent quality standards, ISO certifications, and material traceability requirements. Existing clients will see no change in quality assurance processes." },
          { title: "Impact on Client Projects", content: "Existing and new clients benefit immediately through faster turnaround times, increased production capacity, and more flexible manufacturing options. Complex projects can now be executed more efficiently." }
        ]
      },
      "turnkey-pcba-launch": {
        sections: [
          { title: "Comprehensive Electronics Manufacturing Services", content: "PGI introduces full turnkey PCBA services, enabling clients to source components, manufacture PCBs, assemble boards, and test finished electronics through a single coordinated workflow." },
          { title: "From Component Sourcing to Final Test", content: "The new service covers the complete electronics manufacturing cycle: BOM analysis, component procurement from authorized distributors, PCB fabrication, SMT and through-hole assembly, automated optical inspection, and functional testing." },
          { title: "Quality Assurance Integration", content: "Every PCBA project includes automated optical inspection (AOI), X-ray inspection for BGA components, in-circuit testing (ICT), and comprehensive functional testing. Quality reports and traceability documentation are included." },
          { title: "Flexible Volume Support", content: "The service supports prototype quantities through high-volume production runs. Quick-turn prototype services are available for rapid iteration, while production runs benefit from optimized pricing and consistent quality." },
          { title: "Benefits for Product Development Teams", content: "Product development teams can now access professional electronics manufacturing without managing multiple vendors. This reduces coordination overhead, shortens lead times, and ensures consistent quality from prototype to production." }
        ]
      },
      "manufacturing-coordination": {
        sections: [
          { title: "Project Overview: EV Component Scaling", content: "A leading electric vehicle company needed to scale production of precision mechanical components from prototype quantities to high-volume manufacturing. The project required tight tolerances, specialized materials, and consistent quality across thousands of units." },
          { title: "Engineering Review and DFM Optimization", content: "PGI's engineering team conducted comprehensive design review, identifying opportunities to improve manufacturability without compromising performance. Material selection was optimized, tolerances were rationalized, and manufacturing methods were selected for cost-effective scaling." },
          { title: "Vendor Selection and Qualification", content: "Multiple CNC facilities were evaluated and qualified for the project. Selection criteria included capability, capacity, quality systems, geographic location, and cost competitiveness. Three primary vendors were selected with backup capacity identified." },
          { title: "Production Coordination and Quality Management", content: "PGI managed the production schedule across facilities, coordinating material procurement, machining operations, surface finishing, and inspection. Quality verification included CMM reports, material certificates, and dimensional inspection for every batch." },
          { title: "Results and Outcomes", content: "The project successfully scaled from 50 prototype units to 5,000+ production units per month. Unit costs were reduced by 35% through DFM optimization and volume manufacturing. Quality remained consistent with zero field failures reported." }
        ]
      }
    };
    return contentMap[slug] || { sections: [] };
  };

  const content = getFullContent();

  return (
    <div>
      <section className="border-b border-white/[0.04] py-14 md:py-20 bg-gradient-to-b from-navy-950 to-navy-900">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25">
                {news.category}
              </span>
              <span className="text-xs text-white/50">{news.date}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {news.title}
            </h1>
            <p className="mt-6 text-lg text-white/80">{news.excerpt}</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/[0.04]">
        <Container className="py-8">
          <div className="rounded-2xl overflow-hidden aspect-video bg-navy-800/40">
            <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            {content.sections.map((section, idx) => (
              <div key={idx} className="mb-10">
                <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                <p className="text-white/80 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.04] py-16 md:py-20">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-sky-500/10 via-violet-500/5 to-cyan-500/5 p-8 md:p-12 ring-1 ring-sky-500/10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to scale your production?
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-8 text-sm">
              Contact our engineering team to discuss your manufacturing requirements.
            </p>
            <PrimaryButton to="/contact">Contact Engineering</PrimaryButton>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.04] py-16 md:py-20">
        <Container>
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-400 mb-2">More Updates</div>
            <h2 className="text-2xl font-bold text-white">Related News</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {newsItems.filter((n) => n.slug !== slug).slice(0, 3).map((n, idx) => (
              <Link
                key={idx}
                to={`/news/${n.slug}`}
                className="group rounded-2xl bg-navy-800/40 ring-1 ring-white/[0.06] overflow-hidden transition-all duration-300 hover:ring-sky-500/20 flex flex-col"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-semibold text-white group-hover:text-sky-400 transition-colors">{n.title}</h3>
                  <p className="mt-2 text-sm text-white/50 flex-1">{n.excerpt}</p>
                  <div className="mt-4 text-sky-400 text-sm font-medium">Read →</div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
