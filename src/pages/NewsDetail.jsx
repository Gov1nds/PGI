import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { newsItems } from "../content/siteData.js";
import { Link } from "react-router-dom";

export default function NewsDetail() {
  const { slug } = useParams();
  const news = newsItems.find((n) => n.slug === slug);

  if (!news) {
    return <Navigate to="/news" replace />;
  }

  // Generate full content based on slug
  const getFullContent = () => {
    const contentMap = {
      "cnc-network-expansion": {
        sections: [
          {
            title: "Strategic Growth in Precision Manufacturing",
            content:
              "PGI announces major expansion of its CNC manufacturing network with three new partner facilities across key geographic regions. This expansion strengthens our ability to handle complex precision machining projects with reduced lead times and increased capacity."
          },
          {
            title: "New Facilities and Capabilities",
            content:
              "The newly integrated facilities bring advanced multi-axis CNC capabilities, custom surface finishing, and specialized processes including aerospace-grade material handling. Combined, they add 40% additional production capacity for precision components."
          },
          {
            title: "Geographic Diversification",
            content:
              "The new locations reduce manufacturing dependency on any single region and provide better logistics efficiency for our clients across different markets. This diversification also improves supply chain resilience."
          },
          {
            title: "Quality Standards Maintained",
            content:
              "All new partner facilities meet PGI's stringent quality standards, ISO certifications, and material traceability requirements. Existing clients will see no change in quality assurance processes."
          },
          {
            title: "Impact on Client Projects",
            content:
              "Existing and new clients benefit immediately through faster turnaround times, increased production capacity, and more flexible manufacturing options. Complex projects can now be executed more efficiently."
          }
        ]
      },
      "supply-chain-resilience": {
        sections: [
          {
            title: "Building Resilient Supply Chains",
            content:
              "Following recent global supply chain disruptions, PGI has implemented comprehensive supply chain resilience strategies to ensure uninterrupted manufacturing operations for all clients."
          },
          {
            title: "Multi-Source Strategy",
            content:
              "Critical components are now sourced from multiple qualified suppliers in different geographic regions. This eliminates single points of failure and ensures continuous supply even during regional disruptions."
          },
          {
            title: "Strategic Inventory Planning",
            content:
              "Long-lead components are identified early in projects, and strategic inventory is maintained for components with volatile availability. This protects project timelines from supply shocks."
          },
          {
            title: "Supplier Relationship Management",
            content:
              "Strengthened relationships with primary suppliers include early notification of capacity constraints and priority access during tight supply periods. Backup suppliers ensure alternative sources when needed."
          },
          {
            title: "Real-Time Supply Visibility",
            content:
              "Clients now have visibility into component sourcing status and supply chain risks through regular status updates. Proactive notifications alert clients to potential delays before they impact production."
          },
          {
            title: "Commitment to Reliability",
            content:
              "Supply chain resilience is now a core competitive advantage. PGI's commitment to reliability gives hardware companies confidence to scale production without supply chain anxiety."
          }
        ]
      },
      "manufacturing-coordination": {
        sections: [
          {
            title: "Advanced Coordination Capabilities",
            content:
              "PGI launches enhanced manufacturing coordination tools and processes to improve visibility and control across distributed production networks."
          },
          {
            title: "Real-Time Production Tracking",
            content:
              "Clients can now track their production in real-time across all manufacturing facilities. Status updates, quality reports, and milestone achievements are visible through a unified dashboard."
          },
          {
            title: "Improved Communication Workflows",
            content:
              "Streamlined communication between engineering, procurement, manufacturing, and quality teams reduces bottlenecks and accelerates decision-making. Issues are identified and resolved faster."
          },
          {
            title: "Predictive Scheduling",
            content:
              "Advanced scheduling algorithms optimize facility utilization and production sequences. This reduces lead times while maintaining quality and cost efficiency."
          },
          {
            title: "Quality Documentation Integration",
            content:
              "Quality reports, material certificates, inspection data, and compliance documentation are automatically consolidated and delivered to clients, simplifying compliance and audit processes."
          },
          {
            title: "Partnership Benefits",
            content:
              "These enhancements reflect our commitment to transparency and partnership with clients. As PGI's capabilities evolve, client benefits improve directly."
          }
        ]
      }
    };
    return contentMap[slug] || { sections: [] };
  };

  const content = getFullContent();

  return (
    <div>
      {/* HERO SECTION */}
      <section className="border-b border-white/10 py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                {news.category}
              </span>
              <span className="text-xs text-white/50">{news.date}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              {news.title}
            </h1>
            <p className="mt-6 text-lg text-white/75">{news.excerpt}</p>
            <div className="mt-6 flex items-center gap-4">
              <div>
                <p className="text-sm font-semibold text-white">PGI Network</p>
                <p className="text-xs text-white/50">Manufacturing Updates</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURED IMAGE */}
      <section className="border-b border-white/10">
        <Container className="py-8">
          <div className="rounded-2xl overflow-hidden aspect-video bg-black/40">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Container>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            {content.sections.map((section, idx) => (
              <div key={idx} className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {section.title}
                </h2>
                <p className="text-white/75 leading-relaxed text-base">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="border-t border-white/10 py-16 md:py-20 bg-gradient-to-b from-transparent to-blue-500/5">
        <Container>
          <div className="rounded-3xl bg-gradient-to-r from-blue-500/15 to-blue-500/5 p-8 md:p-12 ring-1 ring-blue-500/20 text-center">
            <h2 className="text-3xl font-semibold text-white mb-3">
              Ready to partner with PGI?
            </h2>
            <p className="text-white/75 max-w-xl mx-auto mb-8">
              Discover how our manufacturing network can scale your production efficiently.
            </p>
            <PrimaryButton to="/contact">Get in Touch</PrimaryButton>
          </div>
        </Container>
      </section>

      {/* RELATED NEWS */}
      <section className="border-t border-white/10 py-16 md:py-20">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm text-blue-400 font-semibold">More Updates</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Related News</h2>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {newsItems
              .filter((n) => n.slug !== slug)
              .slice(0, 3)
              .map((n, idx) => (
                <Link
                  key={idx}
                  to={`/news/${n.slug}`}
                  className="group rounded-2xl bg-white/5 hover:bg-white/8 ring-1 ring-white/10 hover:ring-blue-500/30 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="relative overflow-hidden aspect-video bg-black/40">
                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition">
                      {n.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 flex-1">{n.excerpt}</p>
                    <div className="mt-4 text-blue-400 text-sm group-hover:text-blue-300 transition">
                      Read update →
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </div>
  );
}