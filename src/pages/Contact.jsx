import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { site } from "../content/siteData.js";

export default function Contact() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Contact"
        title="Let’s talk about your project"
        desc="Send your scope, location, timeline, and any drawings/BOQ you already have."
      />

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Direct contact</div>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <div>
              <div className="text-white/50">Email</div>
              <a className="hover:text-white" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </div>
            <div>
              <div className="text-white/50">Phone</div>
              <a className="hover:text-white" href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>{site.contact.phone}</a>
            </div>
            <div>
              <div className="text-white/50">Location</div>
              {site.contact.location}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
            <div className="text-xs text-white/60">Fast option</div>
            <p className="mt-2 text-sm text-white/70">Click below to email us with your project details.</p>
            <a
              href={`mailto:${site.contact.email}?subject=Project%20Enquiry%20-%20Padanilath&body=Hello%20Padanilath%2C%0A%0AProject%20Location%3A%0AScope%3A%0ATimeline%3A%0ABudget%20Range%3A%0A%0ARegards%2C`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
            >
              Email sales
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Send a message</div>
          <p className="mt-2 text-sm text-white/70">
            This form is a template. Connect it to your preferred backend (Formspree, Google Forms, or a custom API).
          </p>

          <form className="mt-6 grid gap-4">
            <input className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-[rgba(var(--brand-500)/0.35)]" placeholder="Name" />
            <input className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-[rgba(var(--brand-500)/0.35)]" placeholder="Email" type="email" />
            <input className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-[rgba(var(--brand-500)/0.35)]" placeholder="Phone" />
            <textarea className="min-h-[140px] w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-[rgba(var(--brand-500)/0.35)]" placeholder="Tell us about your project (scope, location, timeline, budget range)" />
            <a
              href={`mailto:${site.contact.email}`}
              className="inline-flex items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-5 py-3 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
            >
              Send via email
            </a>
          </form>
        </div>
      </div>
    </Container>
  );
}
