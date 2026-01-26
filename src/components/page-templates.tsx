import Image from "next/image";
import Link from "next/link";
import type { ContentItem, TaxonomyItem } from "@/content/types";
import { ContentCard } from "@/components/cards";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <section className="border-b border-white/10 bg-ink-900">
      <div className="container-page py-12">
        <h1 className="text-3xl sm:text-5xl font-semibold">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-white/70">{description}</p> : null}
      </div>
    </section>
  );
}

export function ContentIndex({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: ContentItem[];
}) {
  const featureFirst = [...items].sort((a, b) => (a.model === "feature" ? -1 : 1) - (b.model === "feature" ? -1 : 1));
  return (
    <>
      <PageHeader title={title} description={description} />
      <section className="mt-10">
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-3">
            {featureFirst.map((item) => (
              <ContentCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>
      <div className="h-16" />
    </>
  );
}

export function ContentDetail({ item, backHref }: { item: ContentItem; backHref: string }) {
  return (
    <>
      <section className="border-b border-white/10 bg-ink-900">
        <div className="container-page py-10">
          <Link href={backHref} className="text-sm text-accent-500 hover:text-accent-400">
            ← Back
          </Link>
          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight">{item.title}</h1>
          <p className="mt-4 max-w-3xl text-white/75">{item.excerpt}</p>
          <div className="mt-4 text-sm text-white/60">
            {item.date} • {item.readingTime}{item.author ? ` • ${item.author}` : ""}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="relative aspect-[16/9]">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </div>
          </div>

          <article className="prose-dark mt-8 max-w-3xl">
            {item.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">Plan your project</div>
            <p className="mt-2 text-sm text-white/70">
              We’ll visit the site and propose a simple design + BOQ + timeline.
            </p>
            <div className="mt-4 flex gap-3">
              <Link href="/contact" className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium hover:bg-accent-500">
                Contact
              </Link>
              <Link href="/projects" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15">
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </>
  );
}

export function TaxonomyIndex({
  title,
  description,
  items,
  hrefPrefix,
}: {
  title: string;
  description?: string;
  items: TaxonomyItem[];
  hrefPrefix: string;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <section className="mt-10">
        <div className="container-page">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((x) => (
              <Link
                key={x.slug}
                href={`${hrefPrefix}/${x.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition"
              >
                <div className="text-base font-semibold">{x.title}</div>
                <div className="mt-2 text-sm text-white/70">{x.description}</div>
                <div className="mt-4 text-sm text-accent-500">Explore →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="h-16" />
    </>
  );
}

export function TaxonomyDetail({
  title,
  description,
  bullets,
}: {
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <section className="mt-10">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <h2 className="text-xl font-semibold">What we do</h2>
              <ul className="mt-4 grid gap-3 text-sm text-white/75">
                {bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-6">
              <div className="text-sm font-semibold">Next step</div>
              <p className="mt-2 text-sm text-white/70">
                Share your site and requirement. We’ll propose a simple plan.
              </p>
              <Link href="/contact" className="mt-4 inline-flex rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium hover:bg-accent-500">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="h-16" />
    </>
  );
}
