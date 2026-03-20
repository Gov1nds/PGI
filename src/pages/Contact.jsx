import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { site } from "../content/siteData.js";

export default function Contact() {
  return (
    <div>
      <section className="border-b border-white/[0.04] bg-gradient-to-b from-[rgb(10,15,26)] to-[rgb(13,18,30)] py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Contact Engineering"
            title="Ready to scale your production?"
            desc="Share your CAD models, engineering drawings, or Bill of Materials for a comprehensive DFM review and quotation."
          />
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {/* LEFT CARD */}
          <div className="rounded-xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06]">
            <div className="text-sm font-semibold text-white">Direct contact</div>
            <div className="mt-5 space-y-4 text-sm text-white/80">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1">Email</div>
                <a className="hover:text-sky-400 transition-colors" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1">Phone</div>
                <a className="hover:text-sky-400 transition-colors" href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>{site.contact.phone}</a>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1">Headquarters</div>
                {site.contact.location}
              </div>
            </div>
            <div className="mt-6 rounded-lg bg-white/[0.03] p-4 ring-1 ring-white/[0.04]">
              <div className="text-xs text-sky-400 font-medium">Fast option</div>
              <p className="mt-2 text-sm text-white/75">Click below to email our engineering team directly with your specifications.</p>
              <a
                href={`mailto:${site.contact.email}?subject=Manufacturing%20Enquiry%20-%20PGI&body=Hello%20PGI%20Engineering%2C%0A%0AProject%2FPart%20Name%3A%0AManufacturing%20Process%20(CNC%2C%20Sheet%20Metal%2C%20PCBA)%3A%0AMaterial%20Requirements%3A%0AEstimated%20Quantity%3A%0ATarget%20Timeline%3A%0A%0A*Please%20attach%20your%20CAD%20files%20(STEP%2FIGES)%20or%20BOM.*%0A%0ARegards%2C`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-400 ring-1 ring-sky-500/20 hover:bg-sky-500/20 transition-all"
              >
                Email engineering
              </a>
            </div>
          </div>

          {/* RIGHT CARD — Form */}
          <div className="rounded-xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06]">
            <div className="text-sm font-semibold text-white">Request a Quote</div>
            <p className="mt-2 text-sm text-white/75">Share your manufacturing requirements and we'll respond quickly on WhatsApp.</p>
            <form
              className="mt-6 grid gap-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                const name = e.currentTarget.name.value || "";
                const email = e.currentTarget.email.value || "";
                const phone = e.currentTarget.phone.value || "";
                const details = e.currentTarget.details.value || "";
                const msg = `Hi PGI Engineering, I want to request a quote.%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0APhone: ${encodeURIComponent(phone)}%0A%0AManufacturing details:%0A${encodeURIComponent(details)}`;
                window.open(`https://wa.me/918921983250?text=${msg}`, "_blank");
              }}
            >
              <input name="name" className="w-full rounded-lg bg-white/[0.04] px-4 py-3 text-sm text-white ring-1 ring-white/[0.08] placeholder:text-white/50 focus:outline-none focus:ring-sky-500/30 transition-all" placeholder="Name" required />
              <input name="email" type="email" className="w-full rounded-lg bg-white/[0.04] px-4 py-3 text-sm text-white ring-1 ring-white/[0.08] placeholder:text-white/50 focus:outline-none focus:ring-sky-500/30 transition-all" placeholder="Email" />
              <input name="phone" className="w-full rounded-lg bg-white/[0.04] px-4 py-3 text-sm text-white ring-1 ring-white/[0.08] placeholder:text-white/50 focus:outline-none focus:ring-sky-500/30 transition-all" placeholder="Phone (WhatsApp preferred)" required />
              <textarea name="details" className="min-h-[130px] w-full rounded-lg bg-white/[0.04] px-4 py-3 text-sm text-white ring-1 ring-white/[0.08] placeholder:text-white/50 focus:outline-none focus:ring-sky-500/30 transition-all resize-none" placeholder="Describe your manufacturing requirements (e.g., CNC machining for 500 aluminum enclosures, or turnkey PCBA for 1000 units)" required />
              <button type="submit" className="btn-primary inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white">
                Contact engineering on WhatsApp
              </button>
              <div className="text-[11px] text-white/50">Tip: You can share your CAD files (STEP/IGES) or BOMs directly in the WhatsApp chat.</div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
