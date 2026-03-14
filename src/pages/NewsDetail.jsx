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
      "turnkey-pcba-launch": {
        sections: [
          {
            title: "Comprehensive Electronics Manufacturing Services",
            content:
              "PGI launches turnkey PCBA services, bringing complete end-to-end electronics manufacturing capabilities to our manufacturing ecosystem. This addition enables companies to handle complex electromechanical products with a single coordinated partner."
          },
          {
            title: "What is Turnkey PCBA?",
            content:
              "Turnkey PCBA means we handle everything: component sourcing, PCB manufacturing, assembly, inspection, and testing. Companies provide us with design files and we deliver finished, tested boards ready for integration into their products."
          },
          {
            title: "Component Sourcing Excellence",
            content:
              "Our established relationships with authorized distributors and component suppliers ensure access to quality semiconductors, connectors, and passive components. We maintain supply chain resilience through multi-source strategies and advance procurement."
          },
          {
            title: "Advanced Assembly Capabilities",
            content:
              "State-of-the-art SMT assembly equipment, through-hole soldering, and automated optical inspection ensure consistent quality. We handle everything from simple 2-layer boards to complex multi-layer designs."
          },
          {
            title: "Quality and Testing Standards",
            content:
              "Every PCBA undergoes functional testing, and we provide detailed test reports and documentation. For high-reliability applications, we offer conformal coating and enhanced testing protocols."
          },
          {
            title: "Seamless Integration",
            content:
              "PCBA services integrate seamlessly with our mechanical manufacturing and assembly services, enabling companies to manufacture complete products through a single coordinated partner."
          }
        ]
      },
      "manufacturing-coordination": {
        sections: [
          {
            title: "Scaling EV Component Production",
            content:
              "This case study demonstrates how PGI's manufacturing coordination capabilities enabled successful scaling of specialized mechanical components for electric vehicle manufacturing from prototype to high-volume production."
          },
          {
            title: "The Challenge",
            content:
              "The client needed to scale production of precision-engineered EV components from 100 units to 5,000 units within 6 months. Components required tight tolerances, multiple manufacturing processes (machining, surface treatment, assembly), and quality verification at scale."
          },
          {
            title: "Engineering Review and Optimization",
            content:
              "Our engineering team conducted comprehensive DFM analysis, identifying cost reduction opportunities and optimizing the design for high-volume manufacturing. We recommended manufacturing method changes that reduced per-unit costs by 18% while improving quality."
          },
          {
            title: "Vendor Network Coordination",
            content:
              "We leveraged our network of CNC facilities, surface treatment partners, and assembly operations to create a coordinated production flow. Each facility handled their specialty process, enabling parallel processing and faster turnaround times."
          },
          {
            title: "Quality Verification at Scale",
            content:
              "We implemented comprehensive quality protocols including first-article inspection, statistical process control at each facility, and final product verification. Zero quality issues were recorded across all 5,000 units."
          },
          {
            title: "Results and Lessons",
            content:
              "The project achieved 18% cost reduction, 20% faster production cycles, and zero quality failures. This case demonstrates the power of coordinated manufacturing networks in scaling production efficiently while maintaining quality and controlling costs."
          }
        ]
      }
    };
    return contentMap[slug] || { sections: [] };
  };

  const content = getFullContent();

  return (
    <div>
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