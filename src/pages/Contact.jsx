import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { site } from "../content/siteData.js";

export default function Contact() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Contact Engineering"
        title="Ready to scale your production?"
        desc="Share your CAD models, engineering drawings, or Bill of Materials for a comprehensive DFM review and quotation."
      />

      {/* GRID WRAPPER */}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* LEFT CARD */}
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Direct contact</div>

          <div className="mt-4 space-y-3 text-sm text-white/70">
            <div>
              <div className="text-white/50">Email</div>
              <a className="hover:text-white" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </div>

            <div>
              <div className="text-white/50">Phone</div>
              <a className="hover:text-white" href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>
                {site.contact.phone}
              </a>
            </div>

            <div>
              <div className="text-white/50">Headquarters</div>
              {site.contact.location}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
            <div className="text-xs text-white/60">Fast option</div>
            <p className="mt-2 text-sm text-white/70">
              Click below to email our engineering team directly with your specifications.
            </p>

            <a
              href={`mailto:${site.contact.email}?subject=Manufacturing%20Enquiry%20-%20PGI&body=Hello%20PGI%20Engineering%2C%0A%0AProject%2FPart%20Name%3A%0AManufacturing%20Process%20(CNC%2C%20Sheet%20Metal%2C%20PCBA)%3A%0AMaterial%20Requirements%3A%0AEstimated%20Quantity%3A%0ATarget%20Timeline%3A%0A%0A*Please%20attach%20your%20CAD%20files%20(STEP%2FIGES)%20or%20BOM.*%0A%0ARegards%2C`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
            >
              Email engineering
            </a>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Request a Quote</div>
          <p className="mt-2 text-sm text-white/70">
            Share your manufacturing requirements and we’ll respond quickly on WhatsApp.
          </p>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();

              const name = e.currentTarget.name.value || "";
              const email = e.currentTarget.email.value || "";
              const phone = e.currentTarget.phone.value || "";
              const details = e.currentTarget.details.value || "";

              const msg =
                `Hi PGI Engineering, I want to request a quote.%0A%0A` +
                `Name: ${encodeURIComponent(name)}%0A` +
                `Email: ${encodeURIComponent(email)}%0A` +
                `Phone: ${encodeURIComponent(phone)}%0A%0A` +
                `Manufacturing details:%0A${encodeURIComponent(details)}`;

              const waPhone = "918921983250"; // no +, no spaces
              const url = `https://wa.me/${waPhone}?text=${msg}`;

              alert("Redirecting to WhatsApp…");
              window.open(url, "_blank");
            }}
          >
            <input
              name="name"
              className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-[rgba(var(--brand-500)/0.35)]"
              placeholder="Name"
              required
            />

            <input
              name="email"
              type="email"
              className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-[rgba(var(--brand-500)/0.35)]"
              placeholder="Email"
            />

            <input
              name="phone"
              className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-[rgba(var(--brand-500)/0.35)]"
              placeholder="Phone (WhatsApp preferred)"
              required
            />

            <textarea
              name="details"
              className="min-h-[140px] w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-[rgba(var(--brand-500)/0.35)]"
              placeholder="Describe your manufacturing requirements (e.g., CNC machining for 500 aluminum enclosures, or turnkey PCBA for 1000 units)"
              required
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-5 py-3 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
            >
              Contact engineering on WhatsApp
            </button>

            <div className="text-xs text-white/50">
              Tip: You can share your CAD files (STEP/IGES) or BOMs directly in the WhatsApp chat.
            </div>
          </form>
        </div>
      </div>
      {/* END GRID WRAPPER */}
    </Container>
  );
}