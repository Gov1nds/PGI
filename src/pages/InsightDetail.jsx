import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { insights } from "../content/siteData.js";

const insightBodyBySlug = {
  "cost-control": {
    intro:
      "Outdoor and landscaping budgets go out of control when scope keeps changing, materials are selected late, or execution happens without a clear sequence. This guide shows a practical way to control cost in landscaping projects—without reducing quality—using item-wise budgeting, vendor planning, and simple weekly tracking.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Freeze your outdoor scope early (areas, materials, finishes, plants) and control changes with approvals.",
          "Budget item-wise: paving, drainage, irrigation, lighting, plants, soil, edging, and labor separately.",
          "Track weekly: Planned vs Ordered vs Installed vs Paid (so you spot overruns early).",
          "Choose value engineering options that preserve durability (sub-base, slopes, jointing) not just looks.",
          "Avoid rework costs by finalizing levels, slopes, and drainage before any paving or turf."
        ]
      },
      {
        title: "A simple outdoor cost-control system (works on site)",
        type: "ol",
        items: [
          "Scope lock: define areas, finishes, and clear inclusions/exclusions (pavers type, turf type, plant list).",
          "Material baseline: list specs (thickness, grade, brand) for pavers, kerbs, geotextile, soil, pipes, lights.",
          "Sequence plan: drainage → sub-base → compaction → edging → paving/turf → planting → lighting.",
          "Weekly tracker: budget vs committed (ordered) vs installed vs paid vs balance.",
          "Change control: any change must show cost + time impact before you approve."
        ]
      },
      {
        title: "Common reasons landscaping budgets overrun",
        type: "ul",
        items: [
          "Changing paver style/size after sub-base is done (layout changes waste material)",
          "No clear plant list—extra plants keep getting added mid-way",
          "Irrigation added late (lines cut through completed paving)",
          "Lighting changes after finishing (trenching damages completed areas)",
          "No drainage plan (waterlogging forces redesign and rework)"
        ]
      }
    ]
  },

  "outdoor-drainage": {
    intro:
      "Outdoor works fail when drainage is treated as an afterthought. In Kerala’s monsoon conditions, slope planning, outlet confirmation, and sub-base preparation decide whether paving stays strong and lawns stay healthy. This guide explains a practical drainage-first approach for long-term performance.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Drainage must be planned before paving, turf, and landscaping finishes.",
          "Always confirm slope directions and outlet points (where water safely exits).",
          "Separate rainwater runoff from wastewater; never mix flows.",
          "Choose outdoor materials for humidity, algae growth, and long monsoon exposure.",
          "Document maintenance points: inspection chambers, grates, irrigation filters, and cleaning access."
        ]
      },
      {
        title: "Outdoor drainage checklist (before execution)",
        type: "ol",
        items: [
          "Site levels: identify low points and existing water collection zones.",
          "Water path: map how rainwater moves today and where it stagnates.",
          "Slope plan: ensure slopes away from structures and toward drains/outlets.",
          "Outlets: confirm stormwater outlets (soak pit, drain line, natural exit).",
          "Execution order: drainage first → sub-base → compaction → paving/turf → planting."
        ]
      },
      {
        title: "Typical outdoor failures we prevent",
        type: "ul",
        items: [
          "Waterlogging on pavers or near compound walls",
          "Erosion and soil washout during heavy rain",
          "Cracked pavers due to weak sub-base and poor compaction",
          "Algae/slippery surfaces from shade + moisture",
          "Plant/turf failure from poor soil prep and wrong irrigation placement"
        ]
      }
    ]
  },

  "quality-systems": {
    intro:
      "Outdoor quality doesn’t come from more rules—it comes from a few high-impact checks done consistently. This guide shares a lightweight quality system for landscaping works: levels, compaction, sub-base thickness, drainage checks, and planting standards that reduce rework and improve long-term durability.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Outdoor rework is expensive because it damages finished surfaces and delays completion.",
          "Define hold points: inspect before covering sub-base, before laying pavers, before planting soil is finalized.",
          "Use simple checklists for: drainage, compaction, paving, turf, planting, and lighting.",
          "Keep photo records + daily notes to avoid disputes and ensure accountability.",
          "Fix root causes: poor compaction, wrong slope, low-quality materials, or bad sequencing."
        ]
      },
      {
        title: "Simple quality system you can run weekly",
        type: "ol",
        items: [
          "Stage checklist: define what “good” looks like (levels, thickness, joint spacing, slope).",
          "Hold points: inspect drainage lines, sub-base compaction, and levels before paving starts.",
          "Site diary: daily notes + photos + issues list (helps control quality and scope).",
          "Defect log: record issues, owner, and closure date (cracks, uneven paving, weak turf spots).",
          "Weekly review: verify closure + plan inspections for next week’s activities."
        ]
      },
      {
        title: "High-impact outdoor checks (most common rework areas)",
        type: "ul",
        items: [
          "Sub-base thickness + compaction (pavers last only if the base is strong)",
          "Slope confirmation before paving (water should flow to drains, not stagnate)",
          "Edging/kerb alignment (prevents paver movement and edge collapse)",
          "Joint filling method (sand/polymeric) to avoid weed growth and shifting",
          "Soil preparation + plant spacing + irrigation coverage (plants fail without basics)"
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
              <div className="text-sm font-semibold text-white">Need help with outdoor works or landscaping?</div>
              <p className="mt-2 text-sm text-white/70">
                Share your site location and scope. We can help with planning, material selection, drainage-first execution,
                paving/turf quality checks, and delivery coordination for a clean finish that lasts.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))] hover:underline"
              >
                Contact us →
              </Link>
            </div>
          </div>
        </article>

        <aside className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Work with us</div>
          <p className="mt-2 text-sm text-white/70">
            Send your outdoor scope (paving/turf/planting/irrigation/lighting), site location, and target timeline.
            We’ll suggest a practical execution plan.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
          >
            Contact sales
          </Link>

          <div className="mt-8 text-xs text-white/50">
          </div>
        </aside>
      </div>
    </Container>
  );
}
