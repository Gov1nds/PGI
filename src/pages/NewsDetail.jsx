import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { newsItems, site } from "../content/siteData.js";

const newsBodyBySlug = {
  "procurement-logistics-expansion": {
    intro:
      "Padanilath has formally launched Procurement & Logistics Coordination Services to help businesses manage BOQs, daily requirements, vendor follow-ups, dispatch planning, transport arrangement, and delivery tracking. We operate as a service team that brings structure, speed, and visibility—without clients needing to add internal headcount.",
    highlights: [
      "BOQ intake + daily requirement structuring (turn unorganized requests into an actionable tracker)",
      "Quotation coordination and comparison (rates, lead times, availability, delivery scope)",
      "Vendor follow-ups for readiness, dispatch dates, and issue resolution",
      "Dispatch planning + transport coordination (pickup slots, vehicle planning, delivery windows)",
      "Shipment tracking + proof of delivery (POD) confirmation",
      "Documentation coordination support (invoice/dispatch docs + compliance guidance; customs support via partners where needed)"
    ],
    whyItMatters: [
      "Most delays are not caused by suppliers alone—delays happen due to missed follow-ups, unclear approvals, and transport misalignment.",
      "Businesses lose money when urgent requirements are handled on calls/WhatsApp without a single tracker and escalation system.",
      "A structured coordination layer improves delivery predictability, reduces last-minute firefighting, and helps prevent cost overruns from delays and rework."
    ],
    nextSteps: [
      "Share your BOQ or requirement list (qty + unit), preferred brands/specs, and required-by dates",
      "Send pickup & delivery locations and receiving constraints (timings, unloading, site contact)",
      "We’ll propose a coordination workflow + reporting format (daily/weekly) and start with a pilot scope"
    ],
    extras: [
      "We do not replace your existing vendors—we coordinate them and maintain backup options to reduce risk.",
      "Client payments can remain direct to vendors; our role is coordination, tracking, and delivery control.",
      "For imports/port-side movements, we can coordinate with your CHA/freight partners or connect you to verified partners for documentation and customs processes."
    ]
  },

  "live-delivery-tracking": {
    intro:
      "We introduced a clearer delivery tracking and reporting system to reduce confusion across vendors, transporters, and receiving teams. Clients now get a single source of truth showing what’s quoted, approved, ordered, ready, dispatched, and delivered—with ETAs and pending actions.",
    highlights: [
      "Single tracker view: Quoted → Approved → Ordered → Ready → Dispatched → Delivered",
      "Dispatch details captured: vehicle number, driver contact, pickup time slot, ETA",
      "Pending actions list: approvals required, payment confirmation pending, vendor readiness pending",
      "Delay flags with reason + revised dates (so teams can act early)",
      "Proof of delivery capture (POD/photo/receipt confirmation) for closure"
    ],
    whyItMatters: [
      "Delivery delays usually build up quietly; a tracker catches risk early and enables escalation before deadlines are missed.",
      "A single reporting format reduces repeated calls and prevents wrong information spreading across teams.",
      "Documented updates reduce disputes and improve accountability between supplier, transporter, and receiving team."
    ],
    nextSteps: [
      "Request our reporting format (daily or weekly) and we’ll set it up for your project",
      "Start with 10–20 BOQ lines as a pilot to demonstrate control and speed",
      "Scale to full requirements once the workflow is stable"
    ],
    extras: [
      "For compliance-sensitive shipments, we include a documentation checklist (invoice/dispatch documents, transport documents, and coordination notes).",
      "Where customs is involved, we coordinate status updates and document readiness through your CHA/freight team or verified partners.",
      "If your receiving site has time restrictions, we plan delivery windows to avoid waiting charges and re-routing."
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
        <h1 className="text-2xl font-semibold">News item not found</h1>
        <Link className="mt-6 inline-flex text-[rgba(var(--brand-500))] hover:underline" to="/news">
          ← Back to news
        </Link>
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
          <div className="text-sm font-semibold text-white">How we typically work</div>
          <BulletList
            items={
              body?.extras || [
                "Share BOQ / requirements and required-by dates.",
                "We coordinate quotations and follow-ups and propose dispatch/delivery plan.",
                "Client pays vendors directly; we track readiness, transport, and delivery.",
                "You receive daily/weekly reports and a single tracker view."
              ]
            }
          />
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Next steps</div>
          <NumberList items={body?.nextSteps || ["Add next steps for interested clients."]} />
        </div>

        <div className="rounded-3xl bg-black/30 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Talk to us</div>
          <p className="mt-2 text-sm text-white/70">
            For partnerships, procurement support, transport coordination, or documentation/customs coordination enquiries:
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
            Note: Customs and specialized compliance activities are coordinated through verified partners/agents as applicable.
          </div>
        </div>
      </div>
    </Container>
  );
}
