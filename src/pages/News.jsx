import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { newsItems } from "../content/siteData.js";

export default function News() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Updates"
        title="News & operations updates"
        desc="Announcements on procurement coordination, logistics tracking improvements, and documentation/customs coordination support (via partners) for smoother deliveries."
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
