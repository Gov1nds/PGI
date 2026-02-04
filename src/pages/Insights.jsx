import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { insights } from "../content/siteData.js";

export default function Insights() {
  return (
    <Container className="py-20">
      <SectionHeading
        eyebrow="Insights"
        title="Procurement & Logistics Intelligence"
        desc="Structured thinking and field-proven systems for BOQ management, vendor coordination, dispatch planning, shipment tracking, and documentation support — including customs coordination through trusted partners."
      />

      <div className="mt-14 grid gap-7 md:grid-cols-3">
        {insights.map((i) => (
          <ImageCard
            key={i.slug}
            title={i.title}
            desc={i.excerpt}
            image={i.image}
            to={`/insights/${i.slug}`}
            tag={i.category}
          />
        ))}
      </div>

      {/* Professional credibility footer note */}
      <div className="mt-16 max-w-3xl text-xs leading-relaxed text-white/50">
        Our insights are drawn from hands-on coordination across suppliers, transporters, project teams, and delivery locations. 
        The focus is always on improving visibility, preventing delays, strengthening compliance, and building dependable procurement and logistics workflows for growing businesses.
      </div>
    </Container>
  );
}
