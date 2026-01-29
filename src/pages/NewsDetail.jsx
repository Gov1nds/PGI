import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { newsItems, site } from "../content/siteData.js";

const newsBodyBySlug = {
  "outdoor-works-practice": {
    intro:
      "Padanilath & Company has launched a dedicated Outdoor Works practice to support clients planning outdoor construction, site development, and infrastructure coordination across Kerala. This update expands our capability in drainage-first planning, material durability, and execution governance.",
    highlights: [
      "Outdoor construction planning: sequencing, schedule and vendor alignment",
      "Drainage-first approach for monsoon conditions and long-term performance",
      "Better coordination for utilities: irrigation, lighting, water lines and site services",
      "Quality checklists and inspection points for outdoor finishing works",
      "Clear reporting: weekly updates, risks, and next actions"
    ],
    whyItMatters: [
      "Outdoor works often fail due to weak sub-base, poor slope planning, and incorrect material selection.",
      "A dedicated team and process reduces rework, waterlogging, cracks, and early deterioration.",
      "Clients get predictable timelines because materials and sequencing are planned properly."
    ],
    nextSteps: [
      "Share site location + photos + rough scope (paths, paving, drainage, landscaping etc.)",
      "We will propose a planning and execution approach with milestones",
      "If needed, we can support BOQ, procurement and on-site governance"
    ]
  },

  "weekly-reporting": {
    intro:
      "We introduced a new weekly project reporting format to make progress clearer for clients, contractors, and vendors. The goal is simple: reduce confusion, document decisions, and prevent delays caused by missed actions.",
    highlights: [
      "Plan vs Actual progress summary (weekly)",
      "Material and procurement status (lead time + delivery readiness)",
      "Open issues list with owners and deadlines",
      "Risk log: what can delay the project and mitigation actions",
      "Photo-based site updates for transparency"
    ],
    whyItMatters: [
      "Many delays happen not on site—but because decisions and follow-ups aren’t tracked.",
      "A structured update helps stakeholders align quickly and solve problems before they become expensive.",
      "Weekly documentation reduces disputes and improves accountability."
    ],
    nextSteps: [
      "If you’re starting a new build or outdoor project, request our reporting template",
      "We can set up weekly governance calls + on-site inspection routines",
      "You’ll receive a consistent dashboard: progress, risks, procurement, and next actions"
    ]
  }
};

function BulletList({ items }) {
  return (
    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-white/75">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

function NumberList({ items }) {
  return (
    <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm text-white/75">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ol>
  );
}

export default function NewsDetail() {
  const { slug } = useParams();
  const item = newsItems.find((n) => n.slug === slug);
  const body = newsBodyBySlug[slug];

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
      <Link className="text-sm text-white/60 hover:text-white" to="/news">
        ← Back to news
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{item.title}</h1>
      <p className="mt-2 text-sm text-white/70">{item.date}</p>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>

      <div className="mt-8 max-w-3xl space-y-6 text-sm leading-relaxed text-white/75">
        <p className="text-white/80">{item.excerpt}</p>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Update overview</div>
          <p className="mt-3 text-sm text-white/75">
            {body?.intro || "Update this news content in NewsDetail.jsx (newsBodyBySlug)."}
          </p>
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Highlights</div>
          <BulletList items={body?.highlights || ["Add highlights for this update."]} />
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Why this matters</div>
          <BulletList items={body?.whyItMatters || ["Explain why this update matters to clients."]} />
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Next steps</div>
          <NumberList items={body?.nextSteps || ["Add next steps for interested clients."]} />
        </div>

        <div className="rounded-3xl bg-black/30 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Talk to us</div>
          <p className="mt-2 text-sm text-white/70">
            For partnerships and new work enquiries, reach us directly:
          </p>
          <div className="mt-4 text-sm text-white/75 space-y-1">
            <div>
              Email:{" "}
              <a className="text-[rgba(var(--brand-500))] hover:underline" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </div>
            <div>
              Phone:{" "}
              <a className="text-[rgba(var(--brand-500))] hover:underline" href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>
                {site.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
