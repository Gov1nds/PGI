import { PageHeader } from "@/components/page-templates";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        description="Share your location and requirement. We’ll respond with a simple plan and BOQ direction."
      />

      <section className="mt-10">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10">
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm text-white/75">Name</label>
                  <input className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent-600" placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-white/75">Phone</label>
                  <input className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent-600" placeholder="+91…" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-white/75">Location</label>
                  <input className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent-600" placeholder="Alappuzha / Kochi / Kollam…" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-white/75">What do you want to build?</label>
                  <textarea className="min-h-[140px] rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent-600" placeholder="Garden, paving, fountain, outdoor construction, maintenance…" />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium hover:bg-accent-500"
                    title="This template is UI-only. Connect Formspree / Resend / a backend later."
                  >
                    Send request
                  </button>
                  <a
                    href="mailto:hello@padanilathu.com"
                    className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
                  >
                    Email directly
                  </a>
                </div>

                <p className="text-xs text-white/55">
                  Note: This form is UI-only. To make it live quickly, use Formspree or an email API.
                </p>
              </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-6">
              <div className="text-sm font-semibold">What happens next</div>
              <ul className="mt-4 grid gap-3 text-sm text-white/75">
                <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-accent-600" />Site visit + requirement capture</li>
                <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-accent-600" />Design direction + BOQ + timeline</li>
                <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-accent-600" />Execution with quality checks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </>
  );
}
