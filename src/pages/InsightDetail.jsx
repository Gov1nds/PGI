import { useParams, Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { insights } from "../content/siteData.js";

/**
 * Keep slugs here aligned with `insights` in siteData.js
 * Suggested slugs (from our updated content):
 * - boq-to-delivery
 * - vendor-transport-coordination
 * - delivery-delay-prevention
 */
const insightBodyBySlug = {
  "boq-to-delivery": {
    intro:
      "Most procurement delays happen because BOQ items are not converted into an actionable control system. People quote late, approvals are unclear, orders are not tracked, and dispatch updates are scattered across calls and WhatsApp. This guide shows a simple, practical BOQ-to-Delivery system you can run daily—without expensive software.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Turn every BOQ into a live tracker with one status per line item (Quoted → Approved → Ordered → Ready → Dispatched → Delivered).",
          "Separate responsibility: client approves + pays vendors, you coordinate follow-ups + logistics to ensure delivery.",
          "Create a single ‘truth sheet’ that everyone follows (avoid multiple versions on WhatsApp).",
          "Track 4 critical dates per item: quote received, approval, expected dispatch, expected delivery.",
          "Use escalation rules: if vendor misses a date, you switch to backup vendor or alternate transporter fast."
        ]
      },
      {
        title: "The BOQ to Delivery control workflow",
        type: "ol",
        items: [
          "BOQ intake: capture item name, spec/brand, unit, qty, required-by date, delivery location.",
          "Quote collection: get at least 2–3 quotes for key items (price + lead time + dispatch terms).",
          "Comparison sheet: compare price, availability, lead time, payment terms, warranty, delivery scope.",
          "Approval checkpoint: client selects option + approves (record approval date and final spec).",
          "Order release: vendor receives confirmed order details + expected dispatch date.",
          "Dispatch readiness: confirm packing, loading plan, invoice/ewaybill readiness (if applicable), and pickup timing.",
          "Transport arrangement: allocate vehicle, share pickup contact, share delivery contact, fix delivery window.",
          "Shipment tracking: check-in at critical milestones (pickup → transit midpoint → delivery gate).",
          "Delivery confirmation: POD/photo/receipt confirmation + close item status in tracker."
        ]
      },
      {
        title: "What your tracker must include (minimum columns)",
        type: "ul",
        items: [
          "Item code / line no.",
          "Item description + spec/brand",
          "Qty + unit",
          "Vendor name + contact",
          "Quoted rate + quote date",
          "Approved rate + approval date",
          "Order date",
          "Expected dispatch date",
          "Transporter + vehicle no.",
          "Expected delivery date + delivery location",
          "Status (Quoted / Approved / Ordered / Ready / Dispatched / Delivered)",
          "Remarks (issues, changes, pending actions)"
        ]
      },
      {
        title: "Common failure points (and how to prevent them)",
        type: "ul",
        items: [
          "BOQ lacks specs: fix by adding brand/grade/thickness/model before quotation.",
          "Approvals happen on phone: fix by confirming approval on email/WhatsApp with final rate + delivery date.",
          "Vendor says ‘tomorrow dispatch’ repeatedly: fix with a confirmed dispatch slot + escalation if missed.",
          "Transport arranged late: fix by pre-booking vehicle once item is ‘Ready’ (not after invoice generation).",
          "No delivery window coordination: fix by confirming site receiving time + unloading constraints in advance."
        ]
      },
      {
        title: "Simple reporting format (daily / weekly)",
        type: "ul",
        items: [
          "Today dispatch list (items + vehicle + ETA)",
          "Pending approvals list (items + decision required)",
          "Vendor follow-up list (items + next action)",
          "Delayed items list (reason + revised dispatch/delivery)",
          "Next 7 days requirement plan (high-risk items needing early action)"
        ]
      }
    ]
  },

  "vendor-transport-coordination": {
    intro:
      "Procurement succeeds when vendors and transporters are aligned on dispatch readiness, pickup timing, documents, and delivery window. Without a system, you get last-minute calls, missed pickups, demurrage risk, and blame-shifting. This guide provides a clean coordination system you can run with WhatsApp + a tracker.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Vendor readiness must be confirmed before booking vehicle: packing + loading + invoice readiness.",
          "Transport booking must include: pickup address, loading hours, material type/weight, delivery window.",
          "Use a ‘Dispatch Confirmation Message’ template to avoid misunderstandings.",
          "Create a single communication thread per dispatch (vendor + transporter + client/site contact).",
          "Build backups: at least 2 alternate vendors and 2 alternate transport options for key items."
        ]
      },
      {
        title: "Dispatch confirmation checklist (vendor side)",
        type: "ol",
        items: [
          "Material packed and ready? (yes/no, time)",
          "Loading support available? (forklift/manual, manpower)",
          "Invoice/dispatch note ready? (yes/no)",
          "Any special handling required? (fragile, moisture-sensitive, stacking limits)",
          "Pickup contact name + phone confirmed",
          "Gate/entry rules at pickup location confirmed",
          "Final pickup slot agreed (date + time window)"
        ]
      },
      {
        title: "Transport booking checklist (transporter side)",
        type: "ol",
        items: [
          "Vehicle type (pickup/LCV/mini-truck/lorry/container) decided based on volume/weight",
          "Pickup address + pin + landmark + loading time window shared",
          "Delivery address + receiving time window shared",
          "Material details shared (weight/packaging/stacking)",
          "Rate + payment terms agreed (advance/balance, toll, unloading)",
          "Driver name + phone + vehicle number captured",
          "Transit ETA plan agreed (including night halt if long route)"
        ]
      },
      {
        title: "A simple 3-message system that reduces chaos",
        type: "ul",
        items: [
          "Message 1 (Vendor): 'Confirm material readiness + exact pickup slot + loading support.'",
          "Message 2 (Transporter): 'Vehicle details + driver + pickup time + delivery ETA.'",
          "Message 3 (Client/Site): 'Dispatch details + vehicle + ETA + receiving coordination.'"
        ]
      },
      {
        title: "Common coordination issues (and fixes)",
        type: "ul",
        items: [
          "Vehicle reaches before material is ready → confirm ‘Ready’ status before booking vehicle.",
          "Vendor changes pickup timing last minute → set a firm slot + escalation after 1 reschedule.",
          "Wrong vehicle size booked → maintain a quick reference table for item categories and vehicle types.",
          "No unloading manpower at site → confirm unloading responsibility before dispatch.",
          "Driver unreachable mid-transit → share alternate driver number + transporter office number."
        ]
      },
      {
        title: "Quality control during dispatch (practical)",
        type: "ul",
        items: [
          "Verify quantity by count/weight before loading where possible.",
          "Take photos of packing + loaded vehicle (proof for disputes).",
          "Ensure labeling for multi-item loads (avoid missing items on delivery).",
          "Confirm fragile items are protected (corner guards, wrap, pallets if needed)."
        ]
      }
    ]
  },

  "delivery-delay-prevention": {
    intro:
      "Delivery delays rarely happen ‘suddenly’. They build up from small misses: late approvals, vendor dispatch uncertainty, transport availability, traffic windows, and receiving constraints. This guide gives a practical delay-prevention playbook you can use for daily procurement and logistics coordination.",
    sections: [
      {
        title: "Key takeaways",
        type: "ul",
        items: [
          "Treat lead time as a risk: confirm realistic dispatch dates, not optimistic promises.",
          "Maintain a 7-day lookahead plan for high-risk items (long lead, imported, custom, limited stock).",
          "Use buffers: dispatch buffer + delivery buffer + receiving buffer.",
          "Always confirm receiving constraints: unloading time, gate entry, permits, holiday blocks, labor availability.",
          "Create a delay escalation ladder (vendor → vendor owner → alternate vendor → client decision)."
        ]
      },
      {
        title: "The 7-day lookahead system (simple and powerful)",
        type: "ol",
        items: [
          "List items needed in the next 7 days (required-by date).",
          "Mark risk level: High (lead time > 3 days or limited stock), Medium, Low.",
          "For High-risk items: confirm vendor readiness date + backup vendor option.",
          "Pre-book transport when item is within 48 hours of readiness.",
          "Send daily status to client: what is safe, what is at risk, what needs decision today."
        ]
      },
      {
        title: "Top reasons deliveries get delayed",
        type: "ul",
        items: [
          "Late approvals on quotations",
          "Vendor stock mismatch (they quote without confirming stock)",
          "Packing/loading not ready on pickup day",
          "Transport shortage / wrong vehicle choice",
          "Receiving team not ready (no unloading / gate delays / wrong delivery window)",
          "Documentation delays (invoice, e-waybill, dispatch note where applicable)"
        ]
      },
      {
        title: "Delay prevention checklist (run this before dispatch)",
        type: "ol",
        items: [
          "Approval confirmed? (yes/no) + final spec locked",
          "Payment status clear? (client/vendor confirmation if required)",
          "Material ready time confirmed? (not just 'tomorrow')",
          "Transport booked with correct vehicle? (yes/no)",
          "Pickup + delivery windows confirmed? (yes/no)",
          "Unloading responsibility confirmed? (yes/no)",
          "Driver contact + live location sharing setup? (optional but useful)"
        ]
      },
      {
        title: "Escalation rules (make it professional)",
        type: "ul",
        items: [
          "If vendor misses dispatch once → ask for revised dispatch date + reason + confirmation.",
          "If vendor misses twice → activate backup vendor quote + inform client of impact.",
          "If transporter fails pickup slot → switch transporter from backup list immediately.",
          "If receiving issue causes delay → confirm revised delivery window + share with driver to prevent waiting charges."
        ]
      }
    ]
  }
};

function Section({ title, type, items }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {type === "ul" ? (
        <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-white/75">
          {items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      ) : (
        <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm text-white/75">
          {items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function InsightDetail() {
  const { slug } = useParams();
  const item = insights.find((i) => i.slug === slug);
  const body = insightBodyBySlug[slug];

  if (!item) {
    return (
      <Container className="py-14">
        <h1 className="text-2xl font-semibold">Insight not found</h1>
        <p className="mt-3 text-sm text-white/70">
          The link may be outdated. Please browse all insights.
        </p>
        <Link
          to="/insights"
          className="mt-6 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))]"
        >
          ← Back to insights
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <Link to="/insights" className="text-sm text-white/60 hover:text-white">
        ← Back to insights
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <article className="md:col-span-2">
          <div className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
            {item.category} • {item.date}
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{item.title}</h1>
          <p className="mt-3 text-sm text-white/70">{item.excerpt}</p>

          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>

          <div className="mt-8 text-sm leading-relaxed text-white/75">
            <p>
              {body?.intro ||
                "This insight is published, but the detailed body is not added yet. Add content for this slug in InsightDetail.jsx."}
            </p>

            {(body?.sections || []).map((s) => (
              <Section key={s.title} title={s.title} type={s.type} items={s.items} />
            ))}

            <div className="mt-10 rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-white">
                Need help with procurement and logistics coordination?
              </div>
              <p className="mt-2 text-sm text-white/70">
                Share your BOQ or daily requirements, delivery location, and timeline. We’ll coordinate quotations,
                vendor follow-ups, dispatch planning, transport arrangement, and delivery tracking—so materials arrive
                on time without daily chaos.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))] hover:underline"
              >
                Contact us →
              </Link>
            </div>
          </div>
        </article>

        <aside className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Work with us</div>
          <p className="mt-2 text-sm text-white/70">
            Send your BOQ (or item list), preferred brands/specs, delivery location, and required dates.
            We’ll share a clear coordination plan and reporting format.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
          >
            Contact sales
          </Link>

          <div className="mt-8 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-white/80">What to send</div>
            <ul className="mt-2 list-disc pl-5 text-xs text-white/60 space-y-1">
              <li>BOQ / item list (qty + unit)</li>
              <li>Specs / brands (if any)</li>
              <li>Required-by dates</li>
              <li>Pickup & delivery locations</li>
              <li>Any constraints (receiving time, unloading)</li>
            </ul>
          </div>
        </aside>
      </div>
    </Container>
  );
}
