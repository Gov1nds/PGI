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
        title="Precision manufacturing and electromechanical integration"
        desc="From raw material sourcing and CNC machining to full PCBA and box-build assembly, we manage the entire production lifecycle through our vetted Indian manufacturing network."
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
            <div className="text-sm text-[rgba(var(--brand-500))]">Manufacturing framework</div>
            <h3 className="mt-2 text-2xl font-semibold">What we manage end-to-end</h3>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>
                <span className="font-semibold text-white/80">Engineering & DFM:</span>{" "}
                Comprehensive review of CAD models and drawings to evaluate manufacturability and optimize production costs.
              </li>
              <li>
                <span className="font-semibold text-white/80">Mechanical Manufacturing:</span>{" "}
                Precision 3-axis to 5-axis CNC machining, CNC turning, sheet metal fabrication, and custom surface finishing.
              </li>
              <li>
                <span className="font-semibold text-white/80">Electronic Assembly (PCBA):</span>{" "}
                Turnkey component sourcing, SMT & DIP assembly, Automated Optical Inspection (AOI), and functional board-level testing.
              </li>
              <li>
                <span className="font-semibold text-white/80">Electromechanical Box Builds:</span>{" "}
                Full integration of mechanical enclosures, wire harnesses, sensors, and PCBs into ready-to-ship products.
              </li>
              <li>
                <span className="font-semibold text-white/80">Quality Verification:</span>{" "}
                Strict adherence to tolerances, First Article Inspection (FAI), material certifications (CoC), and dimensional reporting.
              </li>
              <li>
                <span className="font-semibold text-white/80">Global Logistics & Export:</span>{" "}
                Custom packaging, freight forwarder coordination, export documentation, and global delivery tracking directly to your facility.
              </li>
            </ul>

            {/* Mini “how we work” chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "DFM Optimization",
                "ISO Compliant Network",
                "First Article Inspection",
                "Turnkey PCBA",
                "Electromechanical Integration",
                "Global Export Support"
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
            <div className="text-lg font-semibold">Ready to scale your production?</div>
            <p className="mt-2 text-sm text-white/70">
              Share your engineering drawings, 3D models, or Bill of Materials. We will review your requirements for manufacturability and provide a comprehensive quotation including lead times and optimal production routes.
            </p>

            {/* What to send */}
            <div className="mt-5 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/80">What to send for an accurate quote</div>
              <ul className="mt-2 list-disc pl-5 text-xs text-white/60 space-y-1">
                <li>3D CAD models (STEP / IGES)</li>
                <li>2D Drawings (PDF) with tolerances & material specs</li>
                <li>Bill of Materials (BOM) for assemblies/PCBA</li>
                <li>Target production quantities & expected timeline</li>
                <li>Specific quality, testing, or certification requirements</li>
              </ul>
            </div>

            <div className="mt-5">
              <PrimaryButton to="/contact">Request an engineering review</PrimaryButton>
            </div>

            <div className="mt-4 text-xs text-white/45">
              Note: Specialized testing and certification validations (e.g., UL, CE, RoHS) are coordinated through verified partner labs when applicable.
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}