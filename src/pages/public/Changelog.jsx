import { Container } from "../../components/Shared";
import Seo from "../../components/Seo";

const ENTRIES = [
  {
    version: "v4.1.0",
    date: "April 12, 2026",
    tag: "Major release",
    title: "Unified intake + Lunor-style dashboard",
    bullets: [
      "New hero intake: part number, paste BOM, upload file, and free intelligence report in one surface.",
      "Rebuilt dashboard with time-series charts, pipeline breakdown, and action queue prioritization.",
      "Pure-black Cursor-style theme across every surface — consistent type, spacing, and motion.",
    ],
  },
  {
    version: "v4.0.3",
    date: "March 28, 2026",
    tag: "Improvements",
    title: "Quote matrix with TLC by default",
    bullets: [
      "Total Landed Cost now baked into every quote comparison (tariff + freight + MOQ).",
      "Side-by-side quote comparison re-designed with sticky deviations column.",
      "Performance: vendor search P95 down from 640ms to 210ms.",
    ],
  },
  {
    version: "v4.0.0",
    date: "February 14, 2026",
    tag: "Major release",
    title: "Purchase orders & 12-state shipment timeline",
    bullets: [
      "Promote winning quote → PO in a single action. Every status change is audited.",
      "Carrier milestones, ETA variance, and exception alerts natively on each project.",
      "Vendor portal: vendors can respond to RFQs and confirm PO acceptance without a PGI account.",
    ],
  },
  {
    version: "v3.5.0",
    date: "January 8, 2026",
    tag: "Improvements",
    title: "Explainable vendor scoring",
    bullets: [
      "Every shortlist now shows the decomposition: price, lead time, reliability, compliance, capacity, proximity, responsiveness, fit.",
      "Hover any vendor row to see why it ranked where it ranked.",
      "API: `/vendors/search` returns `score_breakdown` by default.",
    ],
  },
  {
    version: "v3.2.0",
    date: "December 2, 2025",
    tag: "New",
    title: "Free intelligence report",
    bullets: [
      "Guest users can drop components into a single surface and get vendor shortlists, price bands, and risk flags without signing up.",
      "Cookie-based session resume so returning guests keep their work.",
    ],
  },
  {
    version: "v3.0.0",
    date: "September 18, 2025",
    tag: "Major release",
    title: "AI BOM parsing engine v2",
    bullets: [
      "Multi-format ingest: CSV, XLSX, XLS, TSV, and plain text.",
      "Automatic taxonomy mapping + RFQ/commodity split.",
      "Handles 150-line BOMs end-to-end in under 90 seconds on standard plans.",
    ],
  },
];

const tagColor = (t) =>
  t === "Major release" ? "border-white/25 bg-white text-black"
  : t === "New" ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
  : "border-white/10 bg-white/[0.04] text-white/70";

export default function Changelog() {
  return (
    <>
      <Seo title="Changelog | PGI Hub" description="Every PGI Hub release, improvement, and fix." canonical="https://pgihub.com/changelog" />

      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <div className="section-label mb-5">Changelog</div>
            <h1 className="hero-title text-4xl md:text-6xl font-semibold">
              Every ship, <span className="gradient-text">in plain sight.</span>
            </h1>
            <p className="hero-subtitle mt-5 text-base leading-7 max-w-xl">
              New features, improvements, and fixes. Delivered weekly.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.055] py-14">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="relative space-y-10 border-l border-white/[0.07] pl-8">
              {ENTRIES.map((e) => (
                <article key={e.version} className="relative">
                  <div className="absolute -left-[34px] top-1.5 h-3 w-3 rounded-full bg-white border-2 border-black" />
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-mono text-sm font-semibold text-white">{e.version}</span>
                    <span className="text-[12px] text-white/45">{e.date}</span>
                    <span className={`badge-pill ${tagColor(e.tag)}`}>{e.tag}</span>
                  </div>
                  <h2 className="text-[22px] md:text-[26px] font-semibold text-white leading-tight tracking-tight mb-4">
                    {e.title}
                  </h2>
                  <ul className="space-y-2.5">
                    {e.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-[14px] leading-6 text-white/75">
                        <span className="mt-2 h-1 w-1 rounded-full bg-white/40 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center">
              <p className="text-sm text-muted">
                Want new entries delivered to your inbox?
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex justify-center gap-2 max-w-md mx-auto">
                <input type="email" placeholder="you@company.com" className="glass-input rounded-xl px-4 py-2 text-sm flex-1" />
                <button className="primary-btn rounded-xl px-4 py-2 text-sm">Subscribe</button>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
