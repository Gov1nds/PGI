import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { outdoorWorks } from "../content/siteData.js";

export default function OutdoorWorks() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Outdoor works"
        title="Outdoor construction & infrastructure coordination"
        desc="Outdoor works need precise planning for drainage, durability and long-term performance. We help teams align design intent with execution realities."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {outdoorWorks.map((o) => (
          <ImageCard key={o.title} title={o.title} desc={o.desc} image={o.image} />
        ))}
      </div>

      <div className="mt-14 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-sm text-[rgba(var(--brand-500))]">Outdoor works checklist</div>
            <h3 className="mt-2 text-2xl font-semibold">What we focus on in Kerala conditions</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>Drainage and slope planning to avoid waterlogging and erosion.</li>
              <li>Material selection for humidity, salts, and long monsoon cycles.</li>
              <li>Utility routing: irrigation, lighting, and site services.</li>
              <li>Execution sequencing to prevent rework and finish damage.</li>
              <li>Hand-over documentation and maintenance guidance.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-black/30 p-6 ring-1 ring-white/10">
            <div className="text-lg font-semibold">Need help with an outdoor scope?</div>
            <p className="mt-2 text-sm text-white/70">
              Share photos, site location, and a rough timeline. We’ll respond with a plan and support options.
            </p>
            <div className="mt-5">
              <PrimaryButton to="/contact">Contact sales</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
