import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { services } from "../content/siteData.js";

export default function Services() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="What we do"
        title="Procurement & Logistics Coordination Services"
        desc="End-to-end coordination across BOQ intake, RFQs, vendor follow-ups, dispatch planning, transport arrangement, delivery tracking, and structured reporting. Documentation and customs clearance are coordinated through trusted partners when applicable."
      />

      {/* Service cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <ImageCard key={s.title} title={s.title} desc={s.desc} image={s.image} />
        ))}
      </div>

      {/* Scope coverage */}
      <div className="mt-14 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="grid gap-8 md:grid-cols-3 md:items-start">
          <div>
            <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">Scope coverage</div>
            <div className="mt-2 text-xl font-semibold">What we can take ownership of</div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              We operate as your extended coordination team—reducing delays, improving visibility, and creating control
              across suppliers, transporters, and receiving teams.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  t: "Procurement control",
                  d: "BOQ structuring, RFQ coordination, quote comparison, lead-time validation, approval tracking, and escalation management."
                },
                {
                  t: "Vendor management",
                  d: "Supplier onboarding support, follow-ups for readiness/dispatch, issue resolution, and backup vendor options for critical items."
                },
                {
                  t: "Logistics coordination",
                  d: "Pickup scheduling, vehicle planning, transporter coordination, transit updates, delivery window alignment, and POD closure."
                },
                {
                  t: "Documentation & compliance",
                  d: "Dispatch documents checklist (invoice, packing list/dispatch note) + coordination guidance; customs clearance coordination via partners/CHA as needed."
                },
                {
                  t: "International logistics support",
                  d: "Coordination with freight forwarders/agents for shipment milestones, ETAs, documentation readiness, and clearance status updates (via partners)."
                },
                {
                  t: "Reporting & data visibility",
                  d: "Daily/weekly dashboards: pending approvals, delayed items, dispatch plan, delivery confirmations, and vendor performance signals."
                }
              ].map((x) => (
                <div key={x.t} className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                  <div className="text-sm font-semibold text-white/90">{x.t}</div>
                  <p className="mt-2 text-sm text-white/70">{x.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 text-xs text-white/50">
              Note: Customs clearance, regulated compliance, and specialized legal activities are coordinated through verified partners/agents as applicable.
            </div>
          </div>
        </div>
      </div>

      {/* How we work */}
      <div className="mt-12 grid gap-8 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">How we work</div>
          <div className="mt-2 text-xl font-semibold">A simple coordination system</div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            We run a clean workflow that converts BOQs and daily requirements into controlled execution with clear status,
            ownership, and reporting.
          </p>
        </div>

        <div className="md:col-span-2">
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              {
                t: "Intake & structure",
                d: "Collect BOQ/requirements, confirm specs/brands, quantities, delivery location, and required-by dates."
              },
              {
                t: "RFQ & comparison",
                d: "Coordinate quotations, compare price/lead time/availability, and share options for client approval."
              },
              {
                t: "Order follow-up",
                d: "Vendor follow-ups for confirmations, readiness, dispatch schedule, and issue escalation."
              },
              {
                t: "Dispatch & transport",
                d: "Plan pickup slots, arrange transporter, confirm loading readiness, and align delivery windows."
              },
              {
                t: "Shipment tracking",
                d: "Track transit, share ETAs, coordinate receiving, and close with delivery confirmation (POD)."
              },
              {
                t: "Reporting & improvement",
                d: "Daily/weekly dashboards: pending actions, delays, risks, and performance signals for better decisions."
              }
            ].map((x) => (
              <li key={x.t} className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                <div className="text-sm font-semibold">{x.t}</div>
                <p className="mt-2 text-sm text-white/70">{x.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Container>
  );
}
