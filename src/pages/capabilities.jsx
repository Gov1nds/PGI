import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { outdoorWorks } from "../content/siteData.js";

export default function Capabilities() {
  return (
    <Container className="py-16">

      <SectionHeading
        eyebrow="Capabilities"
        title="Engineering-driven manufacturing coordination"
        desc="PGI manages the complete manufacturing lifecycle for complex hardware products. From engineering review and material procurement to production coordination and final quality verification, we ensure reliable execution across our distributed manufacturing network."
      />

      {/* capability cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {outdoorWorks.map((o) => (
          <ImageCard
            key={o.title}
            title={o.title}
            desc={o.desc}
            image={o.image}
          />
        ))}
      </div>


      {/* Core Capabilities */}
      <div className="mt-16 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">

        <div className="grid gap-10 md:grid-cols-2 md:items-start">

          {/* left side */}
          <div>

            <div className="text-sm text-[rgba(var(--brand-500))]">
              Manufacturing Framework
            </div>

            <h3 className="mt-2 text-2xl font-semibold">
              Capabilities across the entire production lifecycle
            </h3>

            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              PGI integrates engineering expertise with a carefully managed
              network of manufacturing partners. By controlling procurement,
              technical review, and quality verification, we ensure that
              production remains consistent, scalable, and aligned with
              customer requirements.
            </p>


            <ul className="mt-6 list-disc space-y-3 pl-5 text-sm text-white/70">

              <li>
                <span className="font-semibold text-white/80">
                  Engineering & Manufacturability Review
                </span>{" "}
                Our engineering team evaluates CAD files, drawings, and
                specifications to confirm manufacturability, optimize
                production methods, and identify opportunities for cost
                reduction before manufacturing begins.
              </li>

              <li>
                <span className="font-semibold text-white/80">
                  Raw Material & Component Procurement
                </span>{" "}
                PGI directly sources metals, electronic components, and
                specialized materials from qualified suppliers to ensure
                traceability, quality control, and stable supply availability.
              </li>

              <li>
                <span className="font-semibold text-white/80">
                  Mechanical Manufacturing
                </span>{" "}
                Our partner facilities provide precision CNC machining,
                turning, sheet metal fabrication, casting, forging,
                and specialized surface finishing for industrial-grade
                mechanical components.
              </li>

              <li>
                <span className="font-semibold text-white/80">
                  Electronic Manufacturing Services
                </span>{" "}
                We coordinate full PCBA production including component
                sourcing, SMT and through-hole assembly, optical inspection,
                and functional testing for electronic subsystems.
              </li>

              <li>
                <span className="font-semibold text-white/80">
                  Electromechanical Integration
                </span>{" "}
                PGI supports full product integration including mechanical
                enclosures, PCB assemblies, wire harnesses, connectors,
                sensors, and electromechanical subsystems.
              </li>

              <li>
                <span className="font-semibold text-white/80">
                  Quality Verification & Documentation
                </span>{" "}
                Each production batch undergoes dimensional inspection,
                tolerance verification, and quality reporting including
                material certifications and First Article Inspection
                documentation.
              </li>

              <li>
                <span className="font-semibold text-white/80">
                  Export Logistics & Global Delivery
                </span>{" "}
                Finished products are packaged according to international
                shipping standards and delivered through coordinated freight
                logistics directly to client facilities worldwide.
              </li>

            </ul>


            {/* capability chips */}
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "Engineering Review",
                "BOM & Component Sourcing",
                "Precision CNC Machining",
                "PCBA Assembly",
                "Electromechanical Box Build",
                "Dimensional Inspection",
                "Global Logistics Coordination",
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


          {/* Right side CTA */}
          <div className="rounded-2xl bg-black/30 p-6 ring-1 ring-white/10">

            <div className="text-lg font-semibold">
              Start your manufacturing project
            </div>

            <p className="mt-2 text-sm text-white/70">
              Share your product documentation with our engineering team.
              We will review the design, evaluate manufacturability, and
              propose the optimal production approach across our
              manufacturing network.
            </p>


            {/* requirements */}
            <div className="mt-5 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">

              <div className="text-xs font-semibold text-white/80">
                Documents required for quotation
              </div>

              <ul className="mt-2 list-disc pl-5 text-xs text-white/60 space-y-1">

                <li>3D CAD files (STEP / IGES / Solid formats)</li>
                <li>2D manufacturing drawings with tolerances</li>
                <li>Bill of Materials for assemblies or PCBA</li>
                <li>Required production quantities</li>
                <li>Expected delivery timelines</li>
                <li>Testing or certification requirements</li>

              </ul>

            </div>

            <div className="mt-5">
              <PrimaryButton to="/contact">
                Request Engineering Review
              </PrimaryButton>
            </div>

            <div className="mt-4 text-xs text-white/45">
              PGI can also coordinate compliance validation such as CE,
              RoHS, and safety testing through accredited partner labs
              when required.
            </div>

          </div>

        </div>

      </div>

    </Container>
  );
}