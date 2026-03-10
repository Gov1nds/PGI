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
          <h1>Article not found</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6">{slug}</h1>

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
const insightBodyBySlug = {
  "dfm-optimization": {
    intro:
      "Design for Manufacturability (DFM) is the most effective way to control production cost, reduce machining complexity, and improve reliability before manufacturing begins. Many production issues originate from designs that do not account for real machine capabilities, tooling constraints, or material behavior. A structured DFM review aligns engineering design with the practical limits of CNC machining, sheet metal fabrication, and production assembly.",

    sections: [
      {
        title: "Why DFM Matters in Modern Manufacturing",
        type: "ul",
        items: [
          "Manufacturing cost is largely determined during the design phase. Small geometry changes can significantly reduce machining time and tooling complexity.",
          "DFM reviews prevent issues such as unreachable features, deep pockets, thin walls, and unnecessary tolerance stacking.",
          "Optimized designs reduce scrap rates, improve consistency across batches, and accelerate production lead times.",
          "Engineering collaboration between designers and manufacturing teams ensures that the final part is both functional and manufacturable."
        ]
      },

      {
        title: "DFM Guidelines for CNC Machining",
        type: "ol",
        items: [
          "Avoid sharp internal corners. CNC milling tools are round, so internal radii should match standard tool diameters.",
          "Maintain adequate wall thickness to prevent vibration, tool deflection, and structural weakness during machining.",
          "Limit hole depth relative to diameter to avoid deep drilling operations that increase cost and cycle time.",
          "Apply tight tolerances only where necessary. Critical interfaces require precision, but non-critical surfaces should use standard tolerances.",
          "Minimize complex multi-axis operations when possible to reduce machine setup and programming time."
        ]
      },

      {
        title: "DFM Guidelines for Sheet Metal Fabrication",
        type: "ul",
        items: [
          "Maintain consistent bend radii to simplify press brake setups.",
          "Ensure holes and slots are positioned away from bend lines to avoid deformation.",
          "Include relief cuts where required to prevent tearing during forming operations.",
          "Use hems and flanges strategically to increase rigidity without increasing material thickness."
        ]
      },

      {
        title: "How PGI Conducts Engineering Reviews",
        type: "ul",
        items: [
          "Engineering intake review of CAD files, technical drawings, and material specifications.",
          "Manufacturability analysis to identify machining challenges or cost drivers.",
          "Collaborative feedback with recommended geometry adjustments and production strategies.",
          "Prototype manufacturing and First Article Inspection (FAI) before scaling to production."
        ]
      }
    ]
  },

  "pcba-quality-control": {
    intro:
      "Electronics manufacturing requires strict control over component sourcing, assembly quality, and testing procedures. Fragmented supply chains often introduce risks such as counterfeit components, BOM mismatches, or inconsistent assembly quality. A structured PCBA workflow integrates sourcing, assembly, inspection, and testing into a single controlled process.",

    sections: [
      {
        title: "Why Turnkey PCBA Manufacturing Improves Reliability",
        type: "ul",
        items: [
          "Centralized component procurement reduces risk of counterfeit parts and mismatched revisions.",
          "Integrated assembly and testing ensures that design, sourcing, and manufacturing teams work with the same BOM and production files.",
          "Early-stage defect detection through automated inspection significantly reduces rework costs.",
          "Manufacturing traceability ensures long-term reliability and easier debugging in field deployments."
        ]
      },

      {
        title: "Typical PCBA Manufacturing Workflow",
        type: "ol",
        items: [
          "Engineering review of Gerber files and BOM to identify obsolete or long lead-time components.",
          "Authorized distributor sourcing to ensure traceable and genuine electronic components.",
          "Surface Mount Technology (SMT) assembly using automated pick-and-place systems.",
          "Through-hole component installation using wave soldering or selective soldering processes.",
          "Automated Optical Inspection (AOI) and X-ray inspection for complex packages such as BGAs.",
          "Functional testing and firmware validation before boards move to final assembly."
        ]
      },

      {
        title: "Common PCBA Defects and Prevention Methods",
        type: "ul",
        items: [
          "Tombstoning caused by uneven thermal profiles during reflow soldering.",
          "Solder bridges resulting from poor stencil design or excess solder paste.",
          "Component failures caused by moisture exposure in sensitive packages.",
          "Counterfeit integrated circuits entering the supply chain through unauthorized vendors."
        ]
      }
    ]
  },

  "offshore-manufacturing-supply-chain": {
    intro:
      "Scaling production across international manufacturing networks introduces both opportunities and operational challenges. While offshore manufacturing offers cost and capacity advantages, it also requires strong engineering oversight, supplier management, and quality verification to maintain consistent product performance.",

    sections: [
      {
        title: "Challenges in Offshore Manufacturing",
        type: "ul",
        items: [
          "Limited visibility into production processes and quality standards.",
          "Communication barriers between design teams and manufacturing facilities.",
          "Material substitution or process variations without proper documentation.",
          "Logistical complexity across multiple suppliers and production stages."
        ]
      },

      {
        title: "Building a Reliable Production Ecosystem",
        type: "ol",
        items: [
          "Match manufacturing facilities to specific processes such as precision machining, sheet metal fabrication, or electronics assembly.",
          "Centralize procurement of critical materials to ensure batch consistency.",
          "Implement standardized inspection procedures across all partner facilities.",
          "Consolidate mechanical, electronic, and assembly components before shipment to simplify logistics."
        ]
      },

      {
        title: "Quality Documentation Required for Global Manufacturing",
        type: "ul",
        items: [
          "Material certifications verifying alloy grade or polymer specifications.",
          "First Article Inspection reports confirming dimensional accuracy.",
          "Surface treatment verification including anodizing thickness or coating specifications.",
          "Compliance documentation such as RoHS or REACH declarations for electronic assemblies."
        ]
      },

      {
        title: "PGI's Manufacturing Coordination Model",
        type: "ul",
        items: [
          "Engineering oversight throughout the entire production lifecycle.",
          "Supplier network coordination across machining, fabrication, and electronics assembly partners.",
          "Structured quality verification before shipment approval.",
          "Centralized export documentation and global delivery coordination."
        ]
      }
    ]
  }
};