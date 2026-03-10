import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { services } from "../content/siteData.js";

export default function Services() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Services"
        title="Engineering-led manufacturing solutions"
        desc="PGI coordinates the complete manufacturing lifecycle — from engineering review and prototyping to production scaling, assembly, quality verification, and global delivery."
      />

      {/* Service cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <ImageCard
            key={s.title}
            title={s.title}
            desc={s.desc}
            image={s.image}
          />
        ))}
      </div>

      {/* Capability coverage */}
      <div className="mt-16 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Left column */}
          <div>
            <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">
              Manufacturing capabilities
            </div>

            <h3 className="mt-2 text-xl font-semibold">
              Core production capabilities
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              PGI manages a distributed manufacturing network across specialized
              facilities. Our engineering team coordinates material sourcing,
              production scheduling, inspection protocols, and delivery logistics
              to ensure consistent product quality and reliable lead times.
            </p>
          </div>

          {/* Right column */}
          <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">

            {[
              {
                t: "Precision CNC Machining",
                d: "Multi-axis CNC milling and turning across aluminum, stainless steel, brass, titanium, and engineering plastics. Tight tolerances and complex geometries are supported for industrial and electromechanical components."
              },
              {
                t: "Sheet Metal Fabrication",
                d: "Laser cutting, precision bending, welding, and forming for custom brackets, housings, and structural components. Surface treatments include anodizing, powder coating, passivation, and electroplating."
              },
              {
                t: "Electronic Assembly (PCBA)",
                d: "Turnkey PCB assembly including component sourcing, SMT and through-hole assembly, automated optical inspection (AOI), X-ray inspection, and functional board-level testing."
              },
              {
                t: "Electromechanical Integration",
                d: "Full box-build assembly combining machined or fabricated enclosures with PCBs, wire harnesses, sensors, and connectors into fully integrated products."
              },
              {
                t: "Quality Assurance & Inspection",
                d: "Comprehensive quality control including First Article Inspection (FAI), dimensional measurement reports, material certificates, and documented inspection procedures."
              },
              {
                t: "Global Logistics & Export",
                d: "Secure packaging for sensitive components, freight coordination, export documentation management, and international shipment tracking to client facilities."
              }
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10"
              >
                <div className="text-sm font-semibold text-white">
                  {x.t}
                </div>

                <p className="mt-2 text-sm text-white/70">
                  {x.d}
                </p>
              </div>
            ))}

          </div>
        </div>

        <div className="mt-6 text-xs text-white/50">
          Note: Specialized testing certifications such as UL, CE, or RoHS
          compliance verification are coordinated through accredited third-party
          laboratories when required.
        </div>
      </div>

      {/* Production workflow */}
      <div className="mt-14 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="grid gap-8 md:grid-cols-3">

          {/* Left column */}
          <div>
            <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">
              Production workflow
            </div>

            <h3 className="mt-2 text-xl font-semibold">
              From design to delivered hardware
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Our structured workflow converts engineering designs into finished
              hardware by combining technical review, controlled manufacturing,
              and verified quality processes.
            </p>
          </div>

          {/* Steps */}
          <div className="md:col-span-2">
            <ol className="grid gap-4 sm:grid-cols-2">

              {[
                {
                  t: "1. Engineering Intake & DFM Review",
                  d: "Clients submit CAD models, technical drawings, and BOMs. Our engineering team performs Design for Manufacturability analysis to identify cost drivers, machining constraints, and tolerance requirements."
                },
                {
                  t: "2. Production Planning & Quotation",
                  d: "We prepare a detailed quotation including material specifications, manufacturing processes, tooling requirements, and estimated production timelines."
                },
                {
                  t: "3. Prototype Manufacturing",
                  d: "Initial prototypes are manufactured to validate dimensions, tolerances, and functional requirements prior to volume production."
                },
                {
                  t: "4. First Article Inspection (FAI)",
                  d: "Dimensional measurements and inspection reports are generated to confirm that the prototype meets engineering specifications."
                },
                {
                  t: "5. Production Scaling",
                  d: "Approved designs move into batch manufacturing across our specialized production facilities with centralized oversight."
                },
                {
                  t: "6. Assembly, Testing & Delivery",
                  d: "Products undergo final inspection, packaging, and export documentation processing before shipment to the client’s destination."
                }
              ].map((x) => (
                <li
                  key={x.t}
                  className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10"
                >
                  <div className="text-sm font-semibold text-white">
                    {x.t}
                  </div>

                  <p className="mt-2 text-sm text-white/70">
                    {x.d}
                  </p>
                </li>
              ))}

            </ol>
          </div>
        </div>
      </div>
    </Container>
  );
}