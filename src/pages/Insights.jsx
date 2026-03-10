import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { insights } from "../content/siteData.js";

export default function Insights() {
  return (
    <Container className="py-20">
      <SectionHeading
        eyebrow="Insights"
        title="Engineering & Manufacturing Intelligence"
        desc="Practical insights on scaling hardware production — from engineering optimization and supplier coordination to precision manufacturing, quality control, and global delivery."
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

      <div className="mt-16 max-w-3xl text-xs leading-relaxed text-white/50">
        These insights are based on real manufacturing coordination across CNC machining facilities,
        electronics assembly partners, fabrication workshops, and global logistics providers.
        Our focus is on improving manufacturability, ensuring production reliability,
        and helping companies scale hardware manufacturing through structured engineering
        and supplier network management.
      </div>
    </Container>
  );
}