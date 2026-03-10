import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { newsItems, site } from "../content/siteData.js";

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
      "Manufacturing through a distributed, managed network reduces dependency on a single facility and improves production resilience.",
      "Engineering oversight ensures consistent tolerances and manufacturing standards across all partner facilities.",
      "Clients gain the scale advantages of a large production ecosystem without managing multiple suppliers.",
      "Faster lead times and scalable production capacity enable companies to transition smoothly from prototype to full-scale manufacturing."
    ],

    nextSteps: [
      "Share your 3D CAD models (STEP or IGES) along with technical drawings.",
      "PGI engineers perform a detailed Design for Manufacturability (DFM) review.",
      "Receive a structured quotation including production timelines and quality verification plans.",
      "Approve the First Article Inspection (FAI) before scaling production."
    ],

    extras: [
      "Material mill certificates and inspection reports accompany every production batch.",
      "Surface finishing options include anodizing, powder coating, electroless nickel plating, and passivation.",
      "Dimensional inspection reports are generated through CMM measurement systems.",
      "Export documentation and freight coordination are managed directly through PGI’s logistics partners."
    ]
  },

  "turnkey-pcba-launch": {
    intro:
      "PGI has introduced turnkey PCB assembly (PCBA) services to support clients developing advanced electromechanical products. By integrating electronic manufacturing with mechanical enclosure production, PGI now enables customers to source complete hardware assemblies through a single coordinated manufacturing partner.",

    highlights: [
      "Component sourcing through authorized global distributors to eliminate counterfeit risks.",
      "High-precision SMT assembly lines capable of placing fine-pitch components down to 0201 packages.",
      "Automated Optical Inspection (AOI) and X-ray inspection for advanced component packages including BGA.",
      "Functional board-level testing and firmware programming services.",
      "Integration of electronics with mechanical enclosures for complete electromechanical box-build assemblies."
    ],

    whyItMatters: [
      "Managing multiple suppliers for PCB fabrication, components, and assembly often introduces coordination delays.",
      "Turnkey manufacturing ensures consistent BOM control and supply chain visibility.",
      "Integrated mechanical and electronic production improves product reliability and reduces assembly errors.",
      "Clients receive fully tested assemblies rather than separate components that require local integration."
    ],

    nextSteps: [
      "Provide Gerber files, Bill of Materials (BOM), and pick-and-place data.",
      "PGI engineering reviews the BOM for obsolete components and long lead-time risks.",
      "Prototype boards are assembled and tested for functional validation.",
      "Once approved, production scales through PGI’s electronics manufacturing network."
    ],

    extras: [
      "Assembly processes follow IPC-A-610 quality standards based on product requirements.",
      "Moisture-sensitive components are handled with strict MSL control procedures.",
      "Conformal coating and environmental protection options are available for harsh industrial environments.",
      "Full traceability is maintained for components and production batches."
    ]
  }
};