import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { newsItems } from "../content/siteData.js";

export default function News() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Network Updates"
        title="Manufacturing network & operations updates"
        desc="Updates on new manufacturing partnerships, expanded CNC and electronics production capacity, engineering initiatives, and operational milestones across the PGI manufacturing network."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {newsItems.map((n) => (
          <ImageCard
            key={n.slug}
            title={n.title}
            desc={n.excerpt}
            image={n.image}
            to={`/news/${n.slug}`}
            tag={n.date}
          />
        ))}
      </div>

      {/* credibility note */}
      <div className="mt-14 max-w-3xl text-xs leading-relaxed text-white/50">
        Our network updates highlight developments across PGI’s manufacturing ecosystem,
        including new supplier partnerships, production capability expansions,
        quality initiatives, and improvements in engineering-driven manufacturing coordination.
      </div>
    </Container>
  );
}