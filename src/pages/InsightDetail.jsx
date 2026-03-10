import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { insights } from "../content/siteData.js";

/**
 * Keep slugs here aligned with `insights` in siteData.js
 * Suggested slugs for the new manufacturing focus:
 * - dfm-optimization
 * - pcba-quality-control
 * - offshore-manufacturing-supply-chain
 */
const insightBodyBySlug = {
  "dfm-optimization": {
    intro:
      "Most manufacturing cost overruns and delays happen before a single machine is turned on. When CAD models are sent directly to production without a Design for Manufacturability (DFM) review, you risk high tooling costs, impossible tolerances, and high scrap rates. This guide covers practical steps to optimize your designs for precision CNC and sheet metal fabrication.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Always run a DFM review to align your 3D models with the actual capabilities of the target machines (3-axis vs 5-axis CNC, laser cutting vs punching).",
          "Avoid unnecessarily tight tolerances. Apply tight tolerances only to critical mating surfaces to drastically reduce machining time and cost.",
          "Standardize hole sizes, threads, and bend radii to utilize standard tooling, preventing custom tool purchases.",
          "Design for assembly: minimize part counts by combining components where possible, or use interlocking sheet metal tabs.",
          "Consult with your manufacturing partner on material selection—sometimes a slightly more expensive raw material machines so much faster that the final part cost drops."
        ]
      },
      {
        title: "DFM Checklist: CNC Machining",
        type: "ol",
        items: [
          "Internal Corners: Add radii to all internal vertical corners. Sharp internal corners require slow, expensive EDM processes.",
          "Wall Thickness: Maintain a minimum wall thickness of 0.8mm for metals and 1.5mm for plastics to prevent warping and vibration during milling.",
          "Hole Depth: Keep hole depths under 4x the diameter. Deeper holes require specialized deep-hole drilling tools and slow feed rates.",
          "Tolerances: Default to standard tolerances (e.g., ISO 2768-m) unless a specific fit is required. Highlight critical dimensions on your 2D PDF drawing.",
          "Text & Lettering: Engrave text rather than embossing it. Embossing requires milling away all surrounding material, which wastes time."
        ]
      },
      {
        title: "DFM Checklist: Sheet Metal Fabrication",
        type: "ul",
        items: [
          "Bend Radii: Keep the bend radius consistent across the entire part to prevent multiple machine setups.",
          "Hole Placement: Keep holes and slots at least 2x the material thickness away from any bend lines to prevent distortion.",
          "Relief Cuts: Add bend relief cuts next to flanges to prevent material tearing during the folding process.",
          "Hemming: Use hems to eliminate sharp edges and add stiffness without increasing material thickness."
        ]
      },
      {
        title: "The PGI Engineering Review Process",
        type: "ul",
        items: [
          "Intake: Client shares CAD (STEP/IGES) and 2D PDFs with material specs.",
          "Simulation: PGI engineers simulate the toolpaths to identify deep pockets, unreachable features, or thin walls.",
          "Feedback loop: We provide a marked-up drawing suggesting minor geometry changes to lower costs.",
          "Approval & Prototyping: Once DFM adjustments are approved, we run the First Article Inspection (FAI) prototype."
        ]
      }
    ]
  },

  "pcba-quality-control": {
    intro:
      "Managing electronic assembly (PCBA) by sourcing components from five different vendors and sending them to a separate assembly house is a recipe for mismatched BOMs, counterfeit parts, and delayed production. A turnkey approach—where one partner handles component sourcing, SMT assembly, and testing—creates a closed-loop system for quality control.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Consolidate your BOM. Letting your manufacturing partner handle component procurement prevents 'line-down' situations caused by missing parts.",
          "Allow for approved alternates. Rigid BOMs with zero acceptable alternates lead to massive delays during global chip shortages.",
          "Bake testing into the assembly line. Catching a short circuit during ICT (In-Circuit Testing) costs pennies; catching it after the box-build costs dollars.",
          "Specify your PCB stack-up, copper weight, and surface finish (e.g., ENIG vs HASL) clearly in your fabrication files (Gerbers)."
        ]
      },
      {
        title: "The Turnkey PCBA Workflow",
        type: "ol",
        items: [
          "BOM & Gerber Analysis: Scrubbing the Bill of Materials for obsolete or long-lead-time components.",
          "Component Sourcing: Procuring ICs, passives, and bare boards through authorized global distributors to prevent counterfeits.",
          "SMT Assembly (Surface Mount): Automated solder paste application, pick-and-place, and reflow soldering for high-density boards.",
          "THT Assembly (Through-Hole): Wave soldering or selective soldering for larger connectors and power components.",
          "AOI & X-Ray Inspection: Automated Optical Inspection for surface defects, and X-Ray for hidden solder joints (like BGA components).",
          "Functional Testing & Conformal Coating: Powering the board to verify firmware/function, followed by protective coating for harsh environments."
        ]
      },
      {
        title: "Common PCBA Failures (and how to prevent them)",
        type: "ul",
        items: [
          "Tombstoning (components standing on end): Fixed by balancing the thermal mass of the copper pads and tweaking the reflow oven profile.",
          "Solder Bridging (shorts): Prevented by ensuring proper solder mask expansion and using high-quality solder paste stencils.",
          "Counterfeit ICs: Eliminated by strictly sourcing through franchised distributors or requiring full traceability/CoC (Certificate of Conformity).",
          "Moisture Damage: Prevented by baking moisture-sensitive components (MSL tracking) before reflow soldering."
        ]
      }
    ]
  },

  "offshore-manufacturing-supply-chain": {
    intro:
      "Transitioning from local prototyping to offshore production scaling is challenging. Quality fade, communication barriers, and logistical black holes can erase any cost savings. A managed manufacturing network in India provides the scalable capacity of offshore production, but with centralized engineering oversight, strict IP protection, and reliable delivery schedules.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Don't manage individual factories offshore; partner with a network manager who takes accountability for the final delivered product.",
          "Enforce First Article Inspection (FAI) on every new batch or tooling change before full production scales.",
          "Require material certifications (CoC) and dimensional inspection reports before the shipment ever leaves the port.",
          "Integrate electromechanical builds (box-builds) at the source. Shipping bare PCBs and metal enclosures separately to assemble them locally wastes time and money."
        ]
      },
      {
        title: "Building a Resilient Production Ecosystem",
        type: "ol",
        items: [
          "Facility Matching: Not every CNC shop is right for every part. Match high-mix/low-volume jobs to agile shops, and high-volume jobs to automated lines.",
          "Centralized Procurement: Bulk order raw materials (aluminum billets, steel sheets) centrally to maintain material consistency across multiple machining partners.",
          "Standardized Quality Gates: Implement identical inspection standards (CMM checks, go/no-go gauges) across all facilities.",
          "Consolidated Shipping: Pack mechanical components, wiring harnesses, and PCB assemblies into single, optimized sea or air freight shipments."
        ]
      },
      {
        title: "Quality Control Documentation to Demand",
        type: "ul",
        items: [
          "Material Mill Certificates (ensuring you got 6061-T6 Aluminum, not a cheap substitute).",
          "First Article Inspection (FAI) Report (verifying all dimensions against the 2D drawing).",
          "Surface Treatment Reports (e.g., anodizing thickness, salt spray testing for corrosion resistance).",
          "RoHS / REACH compliance declarations for electronic components."
        ]
      },
      {
        title: "How PGI Manages the Risk",
        type: "ul",
        items: [
          "We act as your single point of contact. You speak to our engineering team; we handle the factory floor.",
          "We physically inspect products in our Indian network before authorizing export.",
          "We handle the complexities of export documentation, customs clearance coordination, and freight forwarding to your door."
        ]
      }
    ]
  }
};

function Section({ title, type, items }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {type === "ul" ? (
        <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-white/75">
          {items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      ) : (
        <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm text-white/75">
          {items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function InsightDetail() {
  const { slug } = useParams();
  const item = insights.find((i) => i.slug === slug);
  const body = insightBodyBySlug[slug];

  if (!item) {
    return (
      <Container className="py-14">
        <Link to="/insights" className="text-sm text-white/60 hover:text-white">
          ← Back to insights
        </Link>
        <div className="mt-6">
          <h1 className="text-2xl font-semibold">Insight not found</h1>
          <p className="mt-3 text-sm text-white/70">
            The link may be outdated, or the content has not been published yet.
          </p>
          <Link
            to="/insights"
            className="mt-6 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))]"
          >
            Browse all insights
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <Link to="/insights" className="text-sm text-white/60 hover:text-white">
        ← Back to insights
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <article className="md:col-span-2">
          <div className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
            {item.category} • {item.date}
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{item.title}</h1>
          <p className="mt-3 text-sm text-white/70">{item.excerpt}</p>

          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>

          <div className="mt-8 text-sm leading-relaxed text-white/75">
            <p>
              {body?.intro ||
                "This insight is published, but the detailed body is not added yet. Add content for this slug in InsightDetail.jsx."}
            </p>

            {(body?.sections || []).map((s) => (
              <Section key={s.title} title={s.title} type={s.type} items={s.items} />
            ))}

            <div className="mt-10 rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-white">
                Ready to optimize your manufacturing workflow?
              </div>
              <p className="mt-2 text-sm text-white/70">
                Share your CAD files, BOMs, and technical requirements. Our engineering team will review your designs for manufacturability, provide a transparent quotation, and manage the entire production lifecycle through our vetted Indian network.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))] hover:underline"
              >
                Request an engineering review →
              </Link>
            </div>
          </div>
        </article>

        <aside className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 h-fit sticky top-24">
          <div className="text-sm font-semibold">Work with PGI Engineering</div>
          <p className="mt-2 text-sm text-white/70">
            Send your 3D models (STEP/IGES), 2D drawings, or Bill of Materials. We’ll respond with DFM feedback and a structured production plan.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
          >
            Contact engineering
          </Link>

          <div className="mt-8 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-white/80">What to include</div>
            <ul className="mt-2 list-disc pl-5 text-xs text-white/60 space-y-1">
              <li>CAD Models (STEP / IGES)</li>
              <li>2D Drawings (PDF) with tolerances</li>
              <li>Bill of Materials (BOM)</li>
              <li>Material & finishing specs</li>
              <li>Expected production quantities</li>
            </ul>
          </div>
        </aside>
      </div>
    </Container>
  );
}