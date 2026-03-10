import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { newsItems, site } from "../content/siteData.js";

const newsBodyBySlug = {
  "cnc-network-expansion": {
    intro:
      "PGI Manufacturing Network has officially expanded its precision mechanical manufacturing capacity by integrating 12 new ISO-certified CNC facilities into our Indian supply ecosystem. This expansion allows us to handle high-volume production runs of complex machined components with reduced lead times and enhanced quality control.",
    highlights: [
      "Added capacity for 5-axis CNC milling and high-speed CNC turning.",
      "Integration of automated CMM (Coordinate Measuring Machine) inspection at partner facilities.",
      "Expanded material handling capabilities, including specialized aerospace-grade aluminum and titanium.",
      "Centralized raw material procurement to ensure batch consistency and traceability.",
      "Streamlined export logistics for faster global dispatch from Indian ports."
    ],
    whyItMatters: [
      "Relying on a single factory creates bottlenecks. A distributed, managed network guarantees that production can pivot if one facility reaches capacity.",
      "Centralized engineering oversight ensures that DFM (Design for Manufacturing) standards and tight tolerances are strictly maintained across all partner facilities.",
      "Clients benefit from the cost efficiencies of offshore manufacturing without sacrificing the communication and accountability of a local partner."
    ],
    nextSteps: [
      "Share your 3D CAD models (STEP/IGES) and 2D PDF drawings with required tolerances.",
      "Our engineering team will conduct a DFM review and provide a comprehensive quotation.",
      "Approve the First Article Inspection (FAI) report before we initiate full-scale production."
    ],
    extras: [
      "We provide full material certifications (Mill Certificates) and dimensional inspection reports with every batch.",
      "Surface treatments—including hard anodizing, powder coating, and electroless nickel plating—are managed within the network.",
      "We handle all export documentation and global freight forwarding directly to your facility."
    ]
  },

  "turnkey-pcba-launch": {
    intro:
      "To better support our clients developing complex electromechanical products, PGI has officially launched Turnkey PCB Assembly (PCBA) services. This closes the loop between mechanical enclosures and electronic controls, allowing clients to source fully integrated, tested 'box-builds' from a single dedicated partner.",
    highlights: [
      "End-to-end component sourcing through franchised global distributors to eliminate counterfeit risks.",
      "Automated SMT (Surface Mount Technology) lines capable of placing ultra-fine pitch components (0201 size).",
      "Inline AOI (Automated Optical Inspection) and X-Ray inspection for BGA and leadless packages.",
      "Functional board-level testing and IC programming capabilities.",
      "Seamless integration: We now manufacture the mechanical enclosure, assemble the PCB, and deliver the final integrated product."
    ],
    whyItMatters: [
      "Managing separate suppliers for bare boards, electronic components, and SMT assembly frequently leads to BOM mismatches and 'line-down' delays.",
      "A turnkey approach shifts the burden of inventory management and vendor coordination entirely to PGI.",
      "Testing the PCBA immediately alongside the mechanical enclosure catches integration issues before the product ships across the globe."
    ],
    nextSteps: [
      "Send us your complete Bill of Materials (BOM), Gerber files, and Pick & Place (Centroid) data.",
      "We will scrub the BOM for obsolete or long-lead-time components and suggest available alternates.",
      "We build and test prototype boards for your approval before scaling to volume production."
    ],
    extras: [
      "We strictly adhere to IPC-A-610 Class 2 and Class 3 assembly standards based on client requirements.",
      "Moisture-sensitive components are strictly managed (baking and vacuum sealing) prior to reflow.",
      "Conformal coating and potting services are available for boards operating in harsh industrial or marine environments."
    ]
  }
};

function BulletList({ items }) {
  return (
    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-white/75">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

function NumberList({ items }) {
  return (
    <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm text-white/75">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ol>
  );
}

export default function NewsDetail() {
  const { slug } = useParams();
  const item = newsItems.find((n) => n.slug === slug);
  const body = newsBodyBySlug[slug];

  if (!item) {
    return (
      <Container className="py-14">
        <Link className="text-sm text-white/60 hover:text-white" to="/news">
          ← Back to news
        </Link>
        <div className="mt-6">
          <h1 className="text-2xl font-semibold">News item not found</h1>
          <p className="mt-3 text-sm text-white/70">
            The link may be outdated, or the content has not been published yet.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <Link className="text-sm text-white/60 hover:text-white" to="/news">
        ← Back to news
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{item.title}</h1>
      <p className="mt-2 text-sm text-white/70">{item.date}</p>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>

      <div className="mt-8 max-w-3xl space-y-6 text-sm leading-relaxed text-white/75">
        <p className="text-white/80">{item.excerpt}</p>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Update overview</div>
          <p className="mt-3 text-sm text-white/75">
            {body?.intro || "This update is published, but detailed content is not added yet. Add content for this slug in newsBodyBySlug."}
          </p>
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Highlights</div>
          <BulletList items={body?.highlights || ["Add highlights for this update."]} />
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Why this matters</div>
          <BulletList items={body?.whyItMatters || ["Explain why this update matters to clients."]} />
        </div>

        {/* Extra detail block */}
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">How we ensure quality</div>
          <BulletList
            items={
              body?.extras || [
                "Strict engineering oversight and DFM review.",
                "First Article Inspection (FAI) before production scaling.",
                "Material certifications and dimensional reports provided.",
                "Global delivery managed directly to your facility."
              ]
            }
          />
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Next steps for clients</div>
          <NumberList items={body?.nextSteps || ["Add next steps for interested clients."]} />
        </div>

        <div className="rounded-3xl bg-black/30 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Talk to our engineering team</div>
          <p className="mt-2 text-sm text-white/70">
            For manufacturing enquiries, DFM reviews, or electromechanical assembly projects, contact us:
          </p>
          <div className="mt-4 text-sm text-white/75 space-y-1">
            <div>
              Email:{" "}
              <a className="text-[rgba(var(--brand-500))] hover:underline" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </div>
            <div>
              Phone:{" "}
              <a
                className="text-[rgba(var(--brand-500))] hover:underline"
                href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}
              >
                {site.contact.phone}
              </a>
            </div>
          </div>

          <div className="mt-4 text-xs text-white/50">
            Note: Specialized testing certifications (e.g., CE, UL) are coordinated through verified third-party labs as required.
          </div>
        </div>
      </div>
    </Container>
  );
}