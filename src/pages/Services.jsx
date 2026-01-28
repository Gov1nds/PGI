import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { services } from "../content/siteData.js";

export default function Services() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="What we do"
        title="Services"
        desc="End-to-end project management support—from planning and BOQ to procurement and on-site governance."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <ImageCard key={s.title} title={s.title} desc={s.desc} image={s.image} />
        ))}
      </div>

      <div className="mt-14 grid gap-8 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">How we work</div>
          <div className="mt-2 text-xl font-semibold">A simple delivery system</div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            We keep execution predictable by using lightweight tools: schedules, checklists, logs, and weekly reporting.
          </p>
        </div>
        <div className="md:col-span-2">
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              { t: "Discover", d: "Understand scope, constraints, stakeholders and success criteria." },
              { t: "Plan", d: "WBS, timeline, BOQ, procurement plan, and risk register." },
              { t: "Mobilize", d: "Align contractors and vendors; finalize milestones and reporting." },
              { t: "Deliver", d: "Governance: quality checks, safety, progress tracking and issue resolution." },
            ].map((x) => (
              <li key={x.t} className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                <div className="text-sm font-semibold">{x.t}</div>
                <p className="mt-2 text-sm text-white/70">{x.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Container>
  );
}
