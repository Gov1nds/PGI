import { PageHeader } from "@/components/page-templates";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <PageHeader title="Gallery / Updates" description="Use this page as a hub for photo updates and short posts. You can keep adding new pages anytime for project highlights, before/after, and client stories." />
      <section className="mt-10">
        <div className="container-page">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10 max-w-3xl">
            <p className="text-white/75 leading-relaxed">
              Use this page as a hub for photo updates and short posts. You can keep adding new pages anytime for project highlights, before/after, and client stories.
            </p>
            <div className="mt-6 flex gap-3">
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
