import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { insights } from "../content/siteData.js";

const insightBodyBySlug = {
  "cost-control": {
    intro:
      "Cost overruns in construction usually come from unclear scope, late decisions, and unmanaged procurement lead-times. This insight explains a practical system to keep budgets stable—without compromising quality—using BOQ discipline, vendor planning, and weekly cost tracking.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Freeze scope early and control changes through a simple approval process.",
          "Create a BOQ-based procurement plan with lead times and delivery sequence.",
          "Track cost weekly using planned vs. committed vs. actual spend.",
          "Use value engineering to reduce cost without reducing performance or durability.",
          "Avoid “site stoppage” costs by planning materials and cashflow together."
        ]
      },
      {
        title: "A simple cost-control system (that works on site)",
        type: "ol",
        items: [
          "Scope lock: define what is included/excluded + acceptance criteria.",
          "BOQ baseline: prepare BOQ with clear specs (brand, grade, thickness, finish).",
          "Procurement map: list vendors, lead times, transport, and storage needs.",
          "Cost tracker: weekly update (Budget vs Committed vs Paid vs Pending).",
          "Change control: any change must include cost + schedule impact before approval."
        ]
      },
      {
        title: "Common causes of overruns (Kerala projects)",
        type: "ul",
        items: [
          "Last-minute design changes after work starts",
          "Price volatility in cement/steel/tiles and transport",
          "Material mismatch (spec not followed, rework happens)",
          "Poor sequencing—finishes get damaged and repeated",
          "Rain delays without buffer planning and drainage readiness"
        ]
      }
    ]
  },

  "outdoor-drainage": {
    intro:
      "Outdoor works fail when drainage is treated as an afterthought. In Kerala, monsoon cycles demand slope planning, water flow control, and material choices that handle moisture. This insight outlines a practical approach to outdoor project planning for long-term performance.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Drainage planning must come before paving, landscaping and outdoor finishes.",
          "Always confirm slope direction and outlet points (where water exits).",
          "Separate surface runoff from wastewater lines and avoid mixing flows.",
          "Choose materials for humidity, algae growth and long monsoon exposure.",
          "Document maintenance: cleaning points, drains, grates, and irrigation checks."
        ]
      },
      {
        title: "Outdoor drainage checklist (before execution)",
        type: "ol",
        items: [
          "Site levels: measure existing ground levels and identify low points.",
          "Water path: map how rainwater flows today and where it gets stuck.",
          "Slope plan: ensure correct slope away from structures (paving/paths).",
          "Outlets: confirm drain outlets (stormwater line, soak pit, natural exit).",
          "Construction sequence: drainage first → sub-base → paving → finishes."
        ]
      },
      {
        title: "Typical outdoor failures we prevent",
        type: "ul",
        items: [
          "Waterlogging on pavers or near compound walls",
          "Erosion and soil washout during heavy rain",
          "Cracks due to weak sub-base and poor compaction",
          "Algae/slippery surfaces because of shade + moisture",
          "Planting failure due to wrong soil prep and irrigation placement"
        ]
      }
    ]
  },

  "quality-systems": {
    intro:
      "Quality doesn’t improve with more rules—it improves with simple checks done consistently. This insight shares a lightweight quality system for small-to-medium construction projects: clear checklists, inspection points, documentation, and a daily routine that reduces rework.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Quality problems are expensive because rework affects time, labor and finishes.",
          "Define hold points (inspection before covering work).",
          "Use checklists for each stage: civil, waterproofing, electrical, finishing.",
          "Keep photo records and daily site notes to avoid disputes.",
          "Fix root causes (training + materials + method), not just the visible defect."
        ]
      },
      {
        title: "Simple quality system you can run weekly",
        type: "ol",
        items: [
          "Stage checklist: define what “good” looks like for each item.",
          "Hold points: inspect before plastering, tiling, waterproofing cover-up etc.",
          "Site diary: daily notes + progress photos + issues log.",
          "Non-conformance log: record defects, responsible party, deadline to fix.",
          "Weekly review: verify closure, update risks, plan next week’s inspections."
        ]
      },
      {
        title: "High-impact checks (most common rework areas)",
        type: "ul",
        items: [
          "Waterproofing slope and curing before tile/finish",
          "Electrical conduits placement before plastering",
          "Tile alignment, spacers, adhesive method, and edge finishing",
          "Plaster thickness uniformity and curing schedule",
          "Door/window level alignment before final fixing"
        ]
      }
    ]
  }
};

function Section({ title, type, items }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {type === "ul" ? (
        <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-white/75">
          {items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      ) : (
        <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm text-white/75">
          {items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function InsightDetail() {
  const { slug } = useParams();
  const item = insights.find((i) => i.slug === slug);
  const body = insightBodyBySlug[slug];

  if (!item) {
    return (
      <Container className="py-14">
        <h1 className="text-2xl font-semibold">Insight not found</h1>
        <p className="mt-3 text-sm text-white/70">
          The link may be outdated. Please browse all insights.
        </p>
        <Link
          to="/insights"
          className="mt-6 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))]"
        >
          ← Back to insights
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <Link to="/insights" className="text-sm text-white/60 hover:text-white">
        ← Back to insights
      </Link>

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

          <div className="mt-8 text-sm leading-relaxed text-white/75">
            <p>{body?.intro || "Update this insight content in InsightDetail.jsx."}</p>

            {(body?.sections || []).map((s) => (
              <Section key={s.title} title={s.title} type={s.type} items={s.items} />
            ))}

            <div className="mt-10 rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-white">Need support on a live project?</div>
              <p className="mt-2 text-sm text-white/70">
                We can help with planning, BOQ, procurement scheduling, quality routines and weekly reporting to keep delivery stable.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))] hover:underline"
              >
                Contact sales →
              </Link>
            </div>
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
            Tip: You can add more insights by adding new objects in src/content/siteData.js and creating matching content in insightBodyBySlug.
          </div>
        </aside>
      </div>
    </Container>
  );
}
