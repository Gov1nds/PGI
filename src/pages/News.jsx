import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { newsItems } from "../content/siteData.js";

export default function News() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Network Updates"
        title="Manufacturing & operations news"
        desc="Announcements regarding expanded production capacity, new CNC and PCBA facility partnerships, and advancements in our engineering-driven supply chain."
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
    </Container>
  );
}