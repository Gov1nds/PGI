import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { insights } from "../content/siteData.js";

export default function InsightDetail() {
  const { slug } = useParams();
  const insight = insights.find((i) => i.slug === slug);

  if (!insight) {
    return <Navigate to="/insights" replace />;
  }

  const getFullContent = () => {
    const contentMap = {
      "scale-manufacturing-without-factories": {
        sections: [
          { title: "The Challenge of Manufacturing Scale", content: "Traditional hardware companies built their own factories to control production. This approach required massive capital investment, long lead times, and inflexible capacity planning. Modern hardware startups face a different reality: they need to scale production quickly without the burden of factory ownership and operational complexity." },
          { title: "The Distributed Manufacturing Model", content: "A distributed manufacturing network connects specialized facilities—CNC shops, electronics manufacturers, fabrication centers, and assembly partners—into a coordinated ecosystem. Rather than owning factories, companies leverage this network to manufacture products more efficiently than traditional vertically integrated models." },
          { title: "Cost Advantages", content: "By using a distributed network, startups avoid the massive capex required to build factories. This capital can be reinvested in product development, sales, and customer acquisition. Additionally, specialized facilities operate at higher efficiency for their specific processes, reducing waste and per-unit costs." },
          { title: "Flexibility and Scalability", content: "Manufacturing volume can be adjusted rapidly by distributing orders across the network. If one facility reaches capacity, orders shift to others. This flexibility is impossible in traditional factory models and allows companies to respond to market demand efficiently." },
          { title: "Quality and Consistency", content: "Distributed networks only include vetted, qualified manufacturers. Centralized quality assurance ensures consistency across all production. This approach often delivers better quality than managing a single large factory." },
          { title: "The Future of Hardware Manufacturing", content: "The shift toward distributed manufacturing is accelerating. Companies like Apple, Tesla, and emerging hardware startups all rely on distributed networks rather than owning their own factories. This model is becoming the industry standard for efficient, scalable hardware production." }
        ]
      },
      "electronics-supply-chains": {
        sections: [
          { title: "Electronics Supply Chain Complexity", content: "Electronics supply chains are among the most complex in manufacturing. From semiconductors to connectors to power management ICs, each component has unique sourcing challenges, lead times, and availability constraints." },
          { title: "Semiconductor Sourcing Strategy", content: "Semiconductors are the most critical and often most difficult component to source. Building relationships with authorized distributors, understanding global supply constraints, and diversifying suppliers are essential strategies for reducing risk." },
          { title: "PCB and Manufacturing Partner Selection", content: "Choosing the right PCB manufacturer and assembly partner is critical. Factors include capability, quality certifications, lead times, and geographic location. Early engagement in the supply chain selection process prevents costly delays later." },
          { title: "Managing Lead Times and Inventory", content: "Electronics components have highly variable lead times. Strategic inventory planning, safety stock calculations, and early ordering are essential. Working with partners who have visibility into component availability helps prevent production delays." },
          { title: "Supply Chain Resilience", content: "Recent global supply chain disruptions have highlighted the importance of resilience. Multi-source strategies, geographic diversification, and backup suppliers reduce vulnerability to single-point failures." },
          { title: "Cost Optimization Without Quality Compromise", content: "Effective electronics sourcing balances cost with quality and reliability. Volume commitments, long-term relationships, and smart component selection reduce costs while maintaining product reliability." }
        ]
      },
      "distributed-manufacturing-model": {
        sections: [
          { title: "Why Distributed Manufacturing is the Future", content: "Centralized factory models dominated manufacturing for over a century. Today's market demands—speed, flexibility, quality, and cost efficiency—increasingly favor distributed networks of specialized manufacturers working in coordination." },
          { title: "Specialization and Efficiency", content: "A CNC shop doesn't need electronics assembly capabilities, and an electronics manufacturer doesn't need precision machining. By focusing on their core competencies, specialized facilities achieve higher efficiency and quality than general-purpose factories." },
          { title: "Capital Efficiency", content: "Building a factory requires hundreds of millions in capital investment. Distributed manufacturing requires no factory capex. Companies can allocate resources to product development, marketing, and customer acquisition instead." },
          { title: "Risk Reduction Through Diversification", content: "A single factory represents a single point of failure. Distributed networks eliminate this risk. If one facility experiences disruption, production can shift to alternatives without halting the entire operation." },
          { title: "Rapid Scaling to Market Demand", content: "Scaling production in a traditional factory is slow and requires forecasting accuracy. Distributed networks scale elastically—adding capacity is as simple as distributing more orders across the network." },
          { title: "Building the Right Ecosystem", content: "Success in distributed manufacturing requires careful partner selection, clear quality standards, transparent communication, and strong coordination. Companies that master this approach gain significant competitive advantages." }
        ]
      }
    };
    return contentMap[slug] || { sections: [] };
  };

  const content = getFullContent();

  return (
    <div>
      <section className="border-b border-white/[0.08] py-14 md:py-20 bg-gradient-to-b from-[rgb(10,14,28)] to-[rgb(12,18,34)]">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25">
                {insight.category}
              </span>
              <span className="text-xs text-white/50">{insight.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {insight.title}
            </h1>
            <p className="mt-6 text-lg text-white/80">{insight.excerpt}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">P</div>
              <div>
                <p className="text-sm font-semibold text-white">{insight.author}</p>
                <p className="text-xs text-white/50">Manufacturing Insights</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/[0.08]">
        <Container className="py-8">
          <div className="rounded-2xl overflow-hidden aspect-video bg-white/[0.04]">
            <img src={insight.image} alt={insight.title} className="w-full h-full object-cover" />
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            {content.sections.map((section, idx) => (
              <div key={idx} className="mb-10">
                <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
                <p className="text-white/80 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.08] py-16 md:py-20">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/5 p-8 md:p-12 ring-1 ring-violet-500/15 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Ready to optimize your manufacturing?
            </h2>
            <p className="text-white/75 max-w-xl mx-auto mb-8 text-sm">
              Let our engineering team review your product and manufacturing strategy.
            </p>
            <PrimaryButton to="/contact">Request Engineering Review</PrimaryButton>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.08] py-16 md:py-20">
        <Container>
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-400 mb-2">More Insights</div>
            <h2 className="text-2xl font-semibold text-white">Related Articles</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {insights.filter((i) => i.slug !== slug).slice(0, 3).map((i, idx) => (
              <Link
                key={idx}
                to={`/insights/${i.slug}`}
                className="group rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] overflow-hidden transition-all duration-300 hover:ring-violet-500/20 flex flex-col"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img src={i.image} alt={i.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-semibold text-white group-hover:text-violet-400 transition-colors">{i.title}</h3>
                  <p className="mt-2 text-sm text-white/75 flex-1">{i.excerpt}</p>
                  <div className="mt-4 text-violet-400 text-sm font-medium">Read →</div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
