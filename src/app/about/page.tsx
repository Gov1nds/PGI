import { PageHeader } from "@/components/page-templates";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <PageHeader title="About Us" description="Padanailath & Company is an outdoor construction and landscape execution firm. We build eco-friendly gardens, fountains, and outdoor landscaping designed for Kerala\u2019s climate\u2014delivered with disciplined project management and durable finishing." />
      <section className="mt-10">
        <div className="container-page">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10 max-w-3xl">
            <p className="text-white/75 leading-relaxed">
              Padanailath & Company is an outdoor construction and landscape execution firm. We build eco-friendly gardens, fountains, and outdoor landscaping designed for Kerala’s climate—delivered with disciplined project management and durable finishing.
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
