import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { outdoorWorks } from "../content/siteData.js";

export default function Capabilities() {

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Capabilities"
        title="Procurement & logistics coordination — local and international"
        desc="We coordinate sourcing, vendor follow-ups, dispatch planning, transport, and delivery tracking. For cross-border shipments, we support documentation and customs clearance coordination through trusted partners."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {outdoorWorks.map((o) => (
          <ImageCard key={o.title} title={o.title} desc={o.desc} image={o.image} />
        ))}
      </div>

      {/* Capabilities checklist + CTA */}
      <div className="mt-14 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-sm text-[rgba(var(--brand-500))]">Coordination framework</div>
            <h3 className="mt-2 text-2xl font-semibold">What we manage end-to-end</h3>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>
                <span className="font-semibold text-white/80">BOQ & daily requirement control:</span>{" "}
                Convert unorganized needs into a live tracker (Quoted → Approved → Ordered → Ready → Dispatched → Delivered).
              </li>
              <li>
                <span className="font-semibold text-white/80">Vendor management:</span>{" "}
                RFQ coordination, quote comparison, lead-time validation, follow-ups, escalation, and backup vendor options.
              </li>
              <li>
                <span className="font-semibold text-white/80">Dispatch & transport coordination:</span>{" "}
                Pickup scheduling, vehicle planning, loading readiness checks, delivery window alignment, and POD closure.
              </li>
              <li>
                <span className="font-semibold text-white/80">International logistics coordination:</span>{" "}
                Support for freight coordination (air/sea), shipment milestones, ETAs, and alignment with forwarders/agents.
              </li>
              <li>
                <span className="font-semibold text-white/80">Customs & compliance support (via partners):</span>{" "}
                Documentation checklist, readiness follow-ups, and coordination with CHA/freight partners for clearance status.
              </li>
              <li>
                <span className="font-semibold text-white/80">Digital tracking & data insight:</span>{" "}
                Simple dashboards for pending approvals, delays, vendor performance, cost trends, and weekly status reports.
              </li>
            </ul>

            {/* Mini “how we work” chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Single tracker system",
                "Daily follow-ups",
                "Clear escalation rules",
                "Delivery confirmation (POD)",
                "Compliance checklist",
                "Weekly dashboards"
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-black/30 p-6 ring-1 ring-white/10">
            <div className="text-lg font-semibold">Need control over procurement and deliveries?</div>
            <p className="mt-2 text-sm text-white/70">
              Share your BOQ or item list, preferred specs/brands, required-by dates, and pickup & delivery locations.
              We’ll respond with a coordination plan and reporting format. For international shipments, we’ll also guide
              documentation and customs coordination through trusted partners.
            </p>

            {/* What to send */}
            <div className="mt-5 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/80">What to send</div>
              <ul className="mt-2 list-disc pl-5 text-xs text-white/60 space-y-1">
                <li>BOQ / item list (qty + unit)</li>
                <li>Specs / brands (if any)</li>
                <li>Required-by dates</li>
                <li>Pickup & delivery locations</li>
                <li>Any constraints (receiving time, unloading, documentation)</li>
              </ul>
            </div>

            <div className="mt-5">
              <PrimaryButton to="/contact">Contact sales</PrimaryButton>
            </div>

            <div className="mt-4 text-xs text-white/45">
              Note: Customs clearance and regulated compliance activities are coordinated through verified partners/agents as applicable.
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
