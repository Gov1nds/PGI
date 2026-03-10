import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { newsItems, site } from "../content/siteData.js";

/* News article bodies */
const newsBodyBySlug = {
  "cnc-network-expansion": {
    intro:
      "PGI has expanded its precision mechanical manufacturing network by onboarding multiple new ISO-compliant CNC facilities across India. This expansion strengthens our ability to support complex mechanical components, larger production volumes, and tighter delivery schedules while maintaining strict engineering oversight and quality verification.",

    highlights: [
      "Expanded access to advanced 5-axis CNC milling and high-precision CNC turning centers.",
      "Integration of automated CMM inspection systems across partner facilities for dimensional verification.",
      "Support for specialized engineering materials including aerospace-grade aluminum, stainless steel alloys, and titanium.",
      "Centralized raw material procurement to maintain batch consistency and traceability.",
      "Improved export logistics coordination for faster global deliveries."
    ],

    whyItMatters: [
      "Manufacturing through a distributed network improves production resilience.",
      "Engineering oversight ensures consistent tolerances across facilities.",
      "Clients gain scale advantages without managing multiple suppliers.",
      "Faster lead times enable smoother prototype-to-production transitions."
    ],

    nextSteps: [
      "Share your 3D CAD models (STEP or IGES) along with technical drawings.",
      "PGI engineers perform a Design for Manufacturability (DFM) review.",
      "Receive a structured quotation including production timelines.",
      "Approve the First Article Inspection (FAI) before scaling production."
    ],

    extras: [
      "Material mill certificates and inspection reports accompany every batch.",
      "Surface finishing options include anodizing, powder coating, and passivation.",
      "Dimensional inspection reports are generated using CMM systems.",
      "Export documentation and freight coordination are managed by PGI."
    ]
  },

  "turnkey-pcba-launch": {
    intro:
      "PGI has introduced turnkey PCB assembly (PCBA) services to support clients developing advanced electromechanical products.",

    highlights: [
      "Component sourcing through authorized global distributors.",
      "High-precision SMT assembly supporting 0201 components.",
      "Automated Optical Inspection (AOI) and X-ray inspection.",
      "Functional testing and firmware programming.",
      "Integration with mechanical enclosures for full box-build assemblies."
    ],

    whyItMatters: [
      "Managing multiple suppliers introduces delays.",
      "Turnkey manufacturing ensures BOM control.",
      "Integrated mechanical + electronics improves reliability.",
      "Clients receive fully tested assemblies."
    ],

    nextSteps: [
      "Provide Gerber files and BOM.",
      "PGI reviews components and supply risks.",
      "Prototype boards assembled and tested.",
      "Production scaling through PGI electronics partners."
    ],

    extras: [
      "IPC-A-610 assembly quality standards.",
      "Moisture-sensitive component control.",
      "Conformal coating options.",
      "Full component traceability."
    ]
  }
};

export default function NewsDetail() {
  const { slug } = useParams();

  const article = newsBodyBySlug[slug];
  const meta = newsItems.find((n) => n.slug === slug);

  if (!article) {
    return (
      <Container className="py-20">
        <h1 className="text-2xl font-semibold">News article not found</h1>
      </Container>
    );
  }

  return (
    <Container className="py-16 max-w-4xl">

      {/* Title */}
      <h1 className="text-3xl font-semibold mb-4">
        {meta?.title}
      </h1>

      {/* Intro */}
      <p className="text-gray-600 mb-10 leading-relaxed">
        {article.intro}
      </p>

      {/* Highlights */}
      <Section title="Highlights" items={article.highlights} />

      {/* Why it matters */}
      <Section title="Why This Matters" items={article.whyItMatters} />

      {/* Next Steps */}
      <Section title="Next Steps" items={article.nextSteps} />

      {/* Additional details */}
      <Section title="Additional Details" items={article.extras} />

      {/* Back link */}
      <div className="mt-12">
        <Link to="/news" className="text-blue-500">
          ← Back to News
        </Link>
      </div>

    </Container>
  );
}

/* reusable section */
function Section({ title, items }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <ul className="list-disc list-inside space-y-2 text-gray-600">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}