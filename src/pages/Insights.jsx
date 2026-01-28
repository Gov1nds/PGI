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

      <div className="mt-14 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="text-sm font-semibold text-white/80">How to update content</div>
        <p className="mt-2 text-sm text-white/70">
          Edit <span className="font-mono">src/content/siteData.js</span> to add new insights and update text.
          Replace images in <span className="font-mono">public/images</span>.
        </p>
      </div>
    </Container>
  );
}
