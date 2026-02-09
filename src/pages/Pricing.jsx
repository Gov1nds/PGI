import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { pricingPlans, pricingFeatures } from "../content/siteData.js";

function Check({ on }) {
  return (
    <span
      className={
        "inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 " +
        (on
          ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
          : "bg-white/5 text-white/25 ring-white/10")
      }
      aria-hidden="true"
    >
      {on ? "✓" : "–"}
    </span>
  );
}

export default function Pricing() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Pricing"
        title="Membership plans"
        desc="Choose the level of procurement and logistics coordination you need. Upgrade anytime as project load increases."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((p) => (
          <div
            key={p.key}
            className={
              "relative overflow-hidden rounded-3xl p-7 ring-1 " +
              (p.highlight
                ? "bg-white/8 ring-emerald-400/40 shadow-[0_0_0_1px_rgba(34,197,94,0.25)]"
                : "bg-white/5 ring-white/10")
            }
          >
            {p.highlight && (
              <div className="absolute right-4 top-4 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                POPULAR
              </div>
            )}

            <div className="text-2xl font-semibold">{p.name}</div>
            <div className="mt-2 text-sm text-white/80">{p.price}</div>
            <div className="mt-2 text-sm text-white/60">{p.note}</div>

            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton to={p.to}>{p.cta}</PrimaryButton>
              <SecondaryButton to="/contact">Ask a question</SecondaryButton>
            </div>

            <div className="mt-6 h-px bg-white/10" />

            <div className="mt-6 space-y-3 text-sm text-white/75">
              <div className="text-xs font-semibold text-white/60">PO SUPPORT</div>
              <div className="leading-relaxed">{p.poSupport}</div>

              <div className="pt-2 text-xs font-semibold text-white/60">ON-DEMAND TASK SUPPORT</div>
              <div className="leading-relaxed">
                <span className="font-semibold text-white/85">{p.demandTaskSupport}</span>{" "}
                <span className="text-white/55">(extra scope / urgent tasks)</span>
              </div>
            </div>

            <div className="mt-6 h-px bg-white/10" />

            <ul className="mt-6 space-y-3 text-sm">
              {pricingFeatures.map((f) => {
                const on =
                  p.key === "basic"
                    ? f.basic
                    : p.key === "standard"
                    ? f.standard
                    : f.premium;

                return (
                  <li key={f.label} className="flex items-start gap-3">
                    <Check on={on} />
                    <span className={on ? "text-white/85" : "text-white/40"}>{f.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-sm font-semibold text-[rgba(var(--brand-500))]">Need help choosing?</div>
            <h3 className="mt-2 text-2xl font-semibold">Share your BOQ + timeline</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              We’ll recommend the right plan based on item count, urgency, import exposure, and coordination complexity.
            </p>
          </div>
          <div className="md:flex md:justify-end">
            <PrimaryButton to="/contact">Send your BOQ</PrimaryButton>
          </div>
        </div>
      </div>
    </Container>
  );
}
