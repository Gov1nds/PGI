import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { insights } from "../content/siteData.js";

export default function InsightDetail() {
  const { slug } = useParams();
  const item = insights.find((i) => i.slug === slug);

  if (!item) {
    return (
      <Container className="py-14">
        <h1 className="text-2xl font-semibold">Insight not found</h1>
        <p className="mt-3 text-sm text-white/70">The link may be outdated. Please browse all insights.</p>
        <Link to="/insights" className="mt-6 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))]">
          ← Back to insights
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <Link to="/insights" className="text-sm text-white/60 hover:text-white">← Back to insights</Link>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <article className="md:col-span-2">
          <div className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
            {item.category} • {item.date}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{item.title}</h1>
          <p className="mt-3 text-sm text-white/70">{item.excerpt}</p>

          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>

          <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/75">
            <p>
              This is a detailed template article. Replace these sections with your real insight content for SEO and credibility.
            </p>
            <h2 className="text-lg font-semibold text-white">Key takeaways</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Start with scope clarity and acceptance criteria.</li>
              <li>Lock a realistic schedule with milestones and responsibilities.</li>
              <li>Use BOQ + procurement planning to protect budget and timeline.</li>
              <li>Track progress weekly: plan vs actual, risks, and next actions.</li>
            </ul>

            <h2 className="text-lg font-semibold text-white">Practical checklist</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Site visit + baseline measurements</li>
              <li>Drawings coordination (architect/engineer/contractor)</li>
              <li>BOQ and budget + value engineering options</li>
              <li>Procurement plan (vendors, lead times, delivery sequence)</li>
              <li>On-site governance (quality checks, safety, documentation)</li>
            </ol>
          </div>
        </article>

        <aside className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Work with us</div>
          <p className="mt-2 text-sm text-white/70">
            Share project location, scope and target timeline. We’ll advise on planning, budgeting and execution governance.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
          >
            Contact sales
          </Link>
          <div className="mt-8 text-xs text-white/50">
            Tip: add more insights by duplicating objects in src/content/siteData.js
          </div>
        </aside>
      </div>
    </Container>
  );
}
