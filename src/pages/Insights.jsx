import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { insights } from "../content/siteData.js";

export default function Insights() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Insights"
        title="Latest thinking"
        desc="Practical insights on planning, budgeting, procurement, quality and outdoor works."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
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
    </Container>
  );
}
