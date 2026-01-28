import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { newsItems, site } from "../content/siteData.js";

export default function NewsDetail() {
  const { slug } = useParams();
  const item = newsItems.find((n) => n.slug === slug);

  if (!item) {
    return (
      <Container className="py-14">
        <h1 className="text-2xl font-semibold">News item not found</h1>
        <Link className="mt-6 inline-flex text-[rgba(var(--brand-500))] hover:underline" to="/news">
          ← Back to news
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <Link className="text-sm text-white/60 hover:text-white" to="/news">← Back to news</Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{item.title}</h1>
      <p className="mt-2 text-sm text-white/70">{item.date}</p>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>

      <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-white/75">
        <p>{item.excerpt}</p>
        <p>
          Replace this placeholder with your real news update. Keep it short and factual, and link to projects/insights where relevant.
        </p>
      </div>

      <div className="mt-10 max-w-3xl rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-sm font-semibold">Contact</div>
        <p className="mt-2 text-sm text-white/70">For partnerships and new work enquiries:</p>
        <div className="mt-4 text-sm text-white/70">
          <div>{site.contact.email}</div>
          <div className="mt-1">{site.contact.phone}</div>
        </div>
      </div>
    </Container>
  );
}
