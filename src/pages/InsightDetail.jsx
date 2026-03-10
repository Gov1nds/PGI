import { useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import { insightBodyBySlug } from "../content/insightBody.js";

export default function InsightDetail() {
  const { slug } = useParams();
  const article = insightBodyBySlug[slug];

  if (!article) {
    return (
      <Container>
        <div className="py-20">
          <h1 className="text-2xl font-semibold">Article not found</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6">{article.title}</h1>

      <p className="text-gray-600 mb-8 leading-relaxed">
        {article.intro}
      </p>

      {article.sections.map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {section.title}
          </h2>

          {section.type === "ul" && (
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {section.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}

          {section.type === "ol" && (
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              {section.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </Container>
  );
}
 export const insightBodyBySlug = {
  "dfm-optimization": {
    title: "Design for Manufacturability (DFM) Optimization",

    intro:
      "Design for Manufacturability (DFM) is the most effective way to control production cost, reduce machining complexity, and improve reliability before manufacturing begins. Many production issues originate from designs that do not account for real machine capabilities, tooling constraints, or material behavior.",

    sections: [
      {
        title: "Why DFM Matters in Modern Manufacturing",
        type: "ul",
        items: [
          "Manufacturing cost is largely determined during the design phase.",
          "DFM reviews prevent issues such as unreachable features and deep pockets.",
          "Optimized designs reduce scrap rates and improve consistency.",
          "Engineering collaboration ensures designs remain manufacturable."
        ]
      },
      {
        title: "DFM Guidelines for CNC Machining",
        type: "ol",
        items: [
          "Avoid sharp internal corners.",
          "Maintain adequate wall thickness.",
          "Limit deep hole drilling operations.",
          "Apply tight tolerances only where necessary.",
          "Minimize complex multi-axis operations."
        ]
      }
    ]
  },

  "pcba-quality-control": {
    title: "PCBA Quality Control in Electronics Manufacturing",

    intro:
      "Electronics manufacturing requires strict control over component sourcing, assembly quality, and testing procedures. Fragmented supply chains introduce risks such as counterfeit components and BOM mismatches.",

    sections: [
      {
        title: "Why Turnkey PCBA Manufacturing Improves Reliability",
        type: "ul",
        items: [
          "Centralized component procurement reduces counterfeit risk.",
          "Integrated assembly ensures BOM alignment.",
          "Automated inspection reduces rework cost.",
          "Traceability improves long-term reliability."
        ]
      },
      {
        title: "Typical PCBA Manufacturing Workflow",
        type: "ol",
        items: [
          "Engineering review of Gerber files and BOM.",
          "Authorized distributor component sourcing.",
          "SMT assembly with pick-and-place machines.",
          "AOI and X-ray inspection.",
          "Functional testing before final assembly."
        ]
      }
    ]
  },

  "offshore-manufacturing-supply-chain": {
    title: "Managing Offshore Manufacturing Supply Chains",

    intro:
      "Scaling production across international manufacturing networks offers cost advantages but requires strong engineering oversight and quality verification.",

    sections: [
      {
        title: "Challenges in Offshore Manufacturing",
        type: "ul",
        items: [
          "Limited visibility into production processes.",
          "Communication barriers between teams.",
          "Material substitution risks.",
          "Logistics complexity across suppliers."
        ]
      },
      {
        title: "Building a Reliable Production Ecosystem",
        type: "ol",
        items: [
          "Match facilities to specific manufacturing processes.",
          "Centralize procurement of critical materials.",
          "Implement standardized inspection procedures.",
          "Consolidate components before shipment."
        ]
      }
    ]
  }
};