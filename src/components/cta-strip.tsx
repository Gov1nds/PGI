import Link from "next/link";

export function CtaStrip() {
  return (
    <section className="mt-16">
      <div className="container-page">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/6 to-white/3 p-6 sm:p-10">
          <div className="text-xs font-semibold tracking-[0.18em] text-white/60">
            HOW WE WORK
          </div>
          <div className="mt-3 text-2xl sm:text-4xl font-semibold leading-tight">
            Let’s turn your outdoor vision into a finished space—on time and on budget.
          </div>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            From site visit to BOQ to execution, we manage every step with clear timelines, quality checks, and sustainability-first choices.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium hover:bg-accent-500">
              Get a Site Visit
            </Link>
            <Link href="/projects" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15">
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
