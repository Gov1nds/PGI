import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { services } from "../content/siteData.js";

export default function Services() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="What we do"
        title="Engineering-Led Manufacturing & Global Supply"
        desc="End-to-end manufacturing solutions across precision mechanical components, sheet metal fabrication, and PCB assembly. We handle everything from DFM reviews and prototyping to scaled production, final assembly, and global dispatch."
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
            <div className="mt-2 text-xl font-semibold">What we take ownership of</div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              We operate as your dedicated manufacturing partner—reducing overhead, ensuring strict quality control, and delivering finished assemblies directly to your doorstep.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  t: "Precision CNC Machining",
                  d: "3-axis, 4-axis, and 5-axis milling and turning. We achieve tight tolerances for complex geometries across aluminum, steel, brass, and engineered plastics."
                },
                {
                  t: "Sheet Metal Fabrication",
                  d: "Laser cutting, precision bending, welding, and surface treatments (anodizing, powder coating, plating) for custom enclosures and brackets."
                },
                {
                  t: "Electronic Assembly (PCBA)",
                  d: "Turnkey PCB assembly including SMT, DIP, component sourcing, AOI (Automated Optical Inspection), and functional board-level testing."
                },
                {
                  t: "Electromechanical Box Builds",
                  d: "Complete product integration. We assemble your mechanical enclosures, route wire harnesses, install PCBs, and perform system-level testing."
                },
                {
                  t: "Quality Assurance (QA)",
                  d: "Strict quality control protocols including First Article Inspection (FAI), material certifications (CoC), and dimensional reports prior to shipping."
                },
                {
                  t: "Global Logistics & Export",
                  d: "Custom, secure packaging for sensitive components, freight forwarder coordination, and export documentation to ensure smooth global delivery."
                }
              ].map((x) => (
                <div key={x.t} className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                  <div className="text-sm font-semibold text-white/90">{x.t}</div>
                  <p className="mt-2 text-sm text-white/70">{x.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 text-xs text-white/50">
              Note: Specialized testing certifications (e.g., UL, CE, RoHS compliance validation) and customs clearance are coordinated through verified third-party labs and agents as applicable.
            </div>
          </div>
        </div>
      </div>

      {/* How we work */}
      <div className="mt-12 grid gap-8 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">How we work</div>
          <div className="mt-2 text-xl font-semibold">A streamlined production system</div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            We run a rigorous engineering workflow that converts your CAD files and BOMs into manufactured, tested, and delivered hardware.
          </p>
        </div>

        <div className="md:col-span-2">
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              {
                t: "1. Engineering Intake & DFM",
                d: "Collect CAD files (STEP/IGES), 2D drawings, and BOMs. Our engineers review for manufacturability (DFM) to optimize costs and tolerances."
              },
              {
                t: "2. Quotation & Planning",
                d: "Provide transparent pricing, tooling costs (if any), material selection confirmation, and a structured production timeline."
              },
              {
                t: "3. Prototyping & FAI",
                d: "Manufacture initial prototypes. We conduct First Article Inspection (FAI) and share samples or detailed reports for your final approval."
              },
              {
                t: "4. Scaled Production",
                d: "Allocate production across our vetted network of specialized facilities, managing material procurement and daily manufacturing schedules."
              },
              {
                t: "5. Assembly & Quality Control",
                d: "Integrate mechanical and electronic components. Perform visual, dimensional, and functional testing to ensure 100% spec compliance."
              },
              {
                t: "6. Dispatch & Tracking",
                d: "Pack components securely, arrange optimal freight options, handle export documentation, and track shipments until final delivery."
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