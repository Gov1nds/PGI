import { Hero } from "@/components/hero";
import { SectionTitle } from "@/components/ui";
import { ContentCard } from "@/components/cards";
import { CtaStrip } from "@/components/cta-strip";
import { insights } from "@/content/insights";
import { projects } from "@/content/projects";
import { capabilities } from "@/content/capabilities";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mt-14">
        <div className="container-page">
          <SectionTitle title="Latest Insights" href="/insights" linkLabel="Explore Insights" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {insights.slice(0, 2).map((item) => (
              <ContentCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="container-page">
          <SectionTitle title="Featured Projects" href="/projects" linkLabel="Explore Projects" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {projects.slice(0, 2).map((item) => (
              <ContentCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <CtaStrip />

      <section className="mt-16">
        <div className="container-page">
          <SectionTitle title="Services" href="/capabilities" linkLabel="View all" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <Link
                key={c.slug}
                href={`/capabilities/${c.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition"
              >
                <div className="text-base font-semibold">{c.title}</div>
                <div className="mt-2 text-sm text-white/70">{c.description}</div>
                <div className="mt-4 text-sm text-accent-500">Explore →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="container-page">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10">
            <div className="text-2xl font-semibold">Ready to build your outdoor space?</div>
            <p className="mt-2 text-sm text-white/70 max-w-2xl">
              We start with a site visit and a simple plan: design, BOQ, timeline, and execution steps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium hover:bg-accent-500">
                Contact
              </Link>
              <Link href="/projects" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15">
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </>
  );
}
