import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { site } from "../content/siteData.js";

export default function Contact() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[rgb(8,12,21)] to-[rgb(11,15,27)] py-20 md:py-24">
        <div className="section-divider mb-20" />
        <Container>
          <SectionHeading
            eyebrow="Contact Engineering"
            title="Ready to scale your production?"
            desc="Share your CAD models, engineering drawings, or Bill of Materials for a comprehensive DFM review and quotation."
          />
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* LEFT CARD */}
          <div className="rounded-2xl bg-white/[0.02] p-7 ring-1 ring-white/[0.06] shadow-card">
            <div className="text-base font-bold text-white">Direct contact</div>
            <p className="text-sm text-white/50 mt-1.5">Reach our engineering team directly</p>
            <div className="mt-6 space-y-4 text-sm text-white/70">
              <div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-white/40 mb-1.5 font-bold">Email</div>
                <a className="hover:text-sky-400 transition-colors" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-white/40 mb-1.5 font-bold">Phone</div>
                <a className="hover:text-sky-400 transition-colors" href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>{site.contact.phone}</a>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-white/40 mb-1.5 font-bold">Headquarters</div>
                {site.contact.location}
              </div>
            </div>
            <div className="mt-7 rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.04]">
              <div className="text-xs text-sky-400 font-bold">Fast option</div>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">Click below to email our engineering team directly with your specifications.</p>
              <a
                href={`mailto:${site.contact.email}?subject=Manufacturing%20Enquiry%20-%20PGI&body=Hello%20PGI%20Engineering%2C%0A%0AProject%2FPart%20Name%3A%0AManufacturing%20Process%20(CNC%2C%20Sheet%20Metal%2C%20PCBA)%3A%0AMaterial%20Requirements%3A%0AEstimated%20Quantity%3A%0ATarget%20Timeline%3A%0A%0A*Please%20attach%20your%20CAD%20files%20(STEP%2FIGES)%20or%20BOM.*%0A%0ARegards%2C`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-400 ring-1 ring-sky-500/20 hover:bg-sky-500/15 hover:ring-sky-500/30 transition-all duration-300"
              >
                Email engineering
              </a>
            </div>
          </div>

          {/* RIGHT CARD — Form */}
          <div className="rounded-2xl bg-white/[0.02] p-7 ring-1 ring-white/[0.06] shadow-card">
            <div className="text-base font-bold text-white">Request a Quote</div>
            <p className="mt-1.5 text-sm text-white/50">Share your manufacturing requirements and we'll respond quickly on WhatsApp.</p>
            <form
              className="mt-7 grid gap-4"
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
              <input name="name" className="w-full rounded-xl bg-white/[0.04] px-4 py-3.5 text-sm text-white ring-1 ring-white/[0.08] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all" placeholder="Name" required />
              <input name="email" type="email" className="w-full rounded-xl bg-white/[0.04] px-4 py-3.5 text-sm text-white ring-1 ring-white/[0.08] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all" placeholder="Email" />
              <input name="phone" className="w-full rounded-xl bg-white/[0.04] px-4 py-3.5 text-sm text-white ring-1 ring-white/[0.08] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all" placeholder="Phone (WhatsApp preferred)" required />
              <textarea name="details" className="min-h-[140px] w-full rounded-xl bg-white/[0.04] px-4 py-3.5 text-sm text-white ring-1 ring-white/[0.08] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all resize-none" placeholder="Describe your manufacturing requirements (e.g., CNC machining for 500 aluminum enclosures, or turnkey PCBA for 1000 units)" required />
              <button type="submit" className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white">
                Contact engineering on WhatsApp
              </button>
              <div className="text-[11px] text-white/40">Tip: You can share your CAD files (STEP/IGES) or BOMs directly in the WhatsApp chat.</div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
