import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";

export default function About() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-white/10 bg-black/20">
        <Container className="py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <SectionHeading
                eyebrow="About PGI"
                title="Built for procurement and delivery execution"
                desc="PGI (Padanilath Global Integrated) supports businesses with structured procurement coordination, vendor management, dispatch planning, shipment tracking, and documentation support—so materials arrive on time, specs match, and operations stay under control."
              />

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton to="/contact">Contact sales</PrimaryButton>
              </div>

              {/* Quick credibility chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "BOQ → RFQ → PO support",
                  "Vendor follow-ups",
                  "Pickup & dispatch planning",
                  "Shipment tracking",
                  "Documentation & compliance",
                  "Customs support via partners",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white/75 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
              {/* Update image later if needed */}
              <img src="/images/about-hero.jpg" alt="About PGI" className="h-full w-full object-cover" />
            </div>
          </div>
        </Container>
      </section>

      {/* CORE BLOCKS */}
      <section>
        <Container className="py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                t: "Mission",
                d: "Reduce delivery delays and procurement confusion by running a disciplined coordination system—clear requirements, controlled follow-ups, and reliable dispatch-to-delivery tracking.",
              },
              {
                t: "Vision",
                d: "To become a trusted execution partner for supply-chain coordination in construction, MEP, industrial buying, and project procurement especially when timelines and technical specs matter.",
              },
              {
                t: "Values",
                d: "Clarity, integrity, accountability, and speed. We document decisions, keep stakeholders aligned, and escalate risks early—before they become expensive.",
              },
            ].map((b) => (
              <div key={b.t} className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">{b.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{b.d}</p>
              </div>
            ))}
          </div>

          {/* How we operate */}
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <div className="text-sm font-semibold">What we actually do</div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                PGI operates as an external coordination layer between your site team, purchase team, vendors, transporters,
                and (when applicable) customs/documentation partners. We don’t replace ERP, we keep execution moving with
                trackers, follow-ups, and structured reporting.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-white/70">
                <li>• BOQ structuring and requirement control (versions, quantities, priorities)</li>
                <li>• RFQ coordination and quote comparison (brands, specs, lead time, terms)</li>
                <li>• Vendor management (confirmations, readiness, delays, alternatives)</li>
                <li>• Dispatch planning and transporter coordination (pickup slots, loading, POD)</li>
                <li>• Shipment tracking and delivery confirmation (ETAs, exceptions, resolution)</li>
                <li>• Documentation support (invoice packs, e-waybill, basic compliance)</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <div className="text-sm font-semibold">Technical sourcing support</div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                For technical items—electronics, mechanical parts, engineering components we support spec matching and vendor
                shortlisting. Our goal is simple: reduce wrong material purchases and prevent failures during installation.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Electronics & control items",
                  "Mechanical & MRO supplies",
                  "Engineering/industrial components",
                  "Spec validation & substitutions",
                  "Vendor discovery & RFQ packs",
                  "Alternative vendors for urgency",
                ].map((x) => (
                  <div key={x} className="rounded-2xl bg-black/30 p-4 text-sm text-white/70 ring-1 ring-white/10">
                    {x}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-white">Reporting you’ll receive</div>
                <p className="mt-2 text-sm text-white/70">
                  A clean weekly view: order status, pending actions, expected dispatches, delivery confirmations, and a risk
                  log with mitigation steps.
                </p>
              </div>
            </div>
          </div>

          {/* Who we serve */}
          <div className="mt-14 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
            <div className="grid gap-8 md:grid-cols-3 md:items-start">
              <div>
                <div className="text-sm font-semibold">Who we serve</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Teams that need reliable buying + delivery execution without building a large procurement/logistics
                  department.
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Construction & project sites",
                    "MEP contractors",
                    "SME manufacturers",
                    "Facility maintenance teams",
                    "Retail / distribution",
                    "Import-driven procurement",
                  ].map((x) => (
                    <div key={x} className="rounded-2xl bg-black/30 p-4 text-sm text-white/70 ring-1 ring-white/10">
                      {x}
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-white">When clients use PGI</div>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                      <li>• Multiple vendors, tight timelines, frequent follow-ups</li>
                      <li>• Technical items where spec mismatch is costly</li>
                      <li>• Dispatch planning across routes and transporters</li>
                      <li>• Visibility needed for owners/management</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-white">What success looks like</div>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                      <li>• Fewer delays due to missing materials</li>
                      <li>• Better cost control via quote clarity</li>
                      <li>• Faster resolution when a vendor fails</li>
                      <li>• Clear accountability and documentation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-white/70">
                Want to see how our BOQ tracker + weekly reporting looks?
              </div>
              <PrimaryButton to="/contact">Request a sample</PrimaryButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
