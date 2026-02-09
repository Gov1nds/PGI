// siteData.js

export const site = {
  name: "PGI",
  tagline: "Procurement & Logistics Coordination Services",
  contact: {
    email: "sales@padanilathu.com",
    phone: "+91 8921983250",
    location: "Kerala, India",
  },
};

export const navLinks = [
  { to: "/insights", label: "Insights" },
  { to: "/services", label: "What we do" },
  { to: "/capabilities", label: "Capabilities" },
  { to: "/news", label: "Updates" },
  { to: "/pricing", label: "Pricing" },

  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const heroStats = [
  { kpi: "BOQ", label: "Requirement → Order Control" },
  { kpi: "Vendors", label: "Follow-ups Managed" },
  { kpi: "Logistics", label: "Pickup → Delivery Tracking" },
  { kpi: "E2E", label: "Sourcing → Dispatch → Delivery" },
];

export const services = [
  {
    title: "Procurement Requirement Planning",
    desc: "Receive BOQs and daily requirements, structure items, define quantities, and plan procurement timelines.",
    image: "/images/service-boq.jpg",
  },
  {
    title: "Quotation, Comparison & Sourcing Support",
    desc: "Collect quotations, compare brands/specifications/lead times, and provide clear purchase options.",
    image: "/images/service-quotes.jpg",
  },
  {
    title: "Vendor Coordination & Order Follow-ups",
    desc: "Continuous vendor follow-ups for confirmations, production readiness, dispatch planning, and issue resolution.",
    image: "/images/service-vendor.jpg",
  },
  {
    title: "Dispatch Planning & Transport Arrangement",
    desc: "Schedule material pickups, arrange transporters, coordinate loading, and manage dispatch documentation.",
    image: "/images/service-dispatch.jpg",
  },
  {
    title: "Shipment Tracking & Delivery Coordination",
    desc: "Track goods in transit, share live status updates, coordinate unloading, and confirm delivery completion.",
    image: "/images/service-logistics.jpg",
  },
  {
    title: "Procurement & Logistics Reporting",
    desc: "Daily and weekly reports showing order status, pending items, expected dispatches, and delivery confirmations.",
    image: "/images/service-reporting.jpg",
  },
];

export const outdoorWorks = [

  {
    title: "Procurement Process Management",
    desc: "BOQ tracking, vendor alignment, rate comparison, and purchase coordination for timely supply.",
    image: "/images/capability-procurement.jpg",
  },
  {
    title: "Logistics & Transport Coordination",
    desc: "Vehicle arrangement, pickup scheduling, transit monitoring, and last-mile delivery coordination.",
    image: "/images/capability-logistics.jpg",
  },
  {
    title: "Vendor & Transport Network",
    desc: "Access to multiple suppliers and transporters to reduce delays and manage urgent requirements.",
    image: "/images/capability-network.jpg",
  },
  {
    title: "Systems, Documentation & Control",
    desc: "Trackers, checklists, dispatch records, and structured reporting for businesses with unorganized daily needs.",
    image: "/images/capability-systems.jpg",
  },
];

export const insights = [
  {
    slug: "boq-to-delivery",
    title: "From BOQ to Delivery: controlling the full supply process",
    category: "Procurement & Logistics",
    date: "2026-01-18",
    excerpt: "How structured tracking from requirement stage to delivery prevents delays and confusion.",
    image: "/images/insight-1.jpg",
  },
  {
    slug: "vendor-transport-coordination",
    title: "Coordinating vendors and transporters without chaos",
    category: "Operations",
    date: "2026-01-09",
    excerpt: "A simple communication system that keeps suppliers, drivers, and site teams aligned.",
    image: "/images/insight-2.jpg",
  },
  {
    slug: "delivery-delay-prevention",
    title: "Preventing delivery delays through logistics planning",
    category: "Logistics",
    date: "2025-12-22",
    excerpt: "Pickup planning, buffer time, and transport follow-ups that keep projects on schedule.",
    image: "/images/insight-3.jpg",
  },
];

export const newsItems = [
  {
    slug: "procurement-logistics-expansion",
    title: "PGI launches Procurement & Logistics Coordination Services",
    date: "2026-01-25",
    excerpt: "Now offering structured vendor follow-up, transport coordination, and delivery tracking for business clients.",
    image: "/images/news-1.jpg",
  },
  {
    slug: "live-delivery-tracking",
    title: "New live delivery tracking and reporting system introduced",
    date: "2026-01-06",
    excerpt: "Clients now receive clearer updates on pending orders, dispatch schedules, and delivery confirmations.",
    image: "/images/news-2.jpg",
  },
];
export const pricingPlans = [
  {
    key: "basic",
    name: "Basic",
    price: "₹25,000 + GST / month",
    note: "For small contractors and small project buyers.",
    cta: "Get started",
    to: "/contact",
    highlight: false,
    poSupport: "Option A — Standard: Client issues PO in ERP; PGI coordinates and follows up.",
    demandTaskSupport: "₹30,000 / month",
  },
  {
    key: "standard",
    name: "Standard",
    price: "₹50,000 + GST / month",
    note: "For MSMEs and growing construction teams.",
    cta: "Choose Standard",
    to: "/contact",
    highlight: true, // POPULAR
    poSupport: "Option B — SME Fast-Track: Client shares PO format; PGI drafts PO for approval and release.",
    demandTaskSupport: "₹60,000 / month",
  },
  {
    key: "premium",
    name: "Premium",
    price: "₹1,00,000 + GST / month",
    note: "For large projects with higher risk and urgency.",
    cta: "Talk to us",
    to: "/contact",
    highlight: false,
    poSupport:
      "Option C — Assisted ERP Drafting: PGI drafts PO in client ERP/vendor portal (if access allowed); purchase manager approves.",
    demandTaskSupport: "₹1,00,000 / month",
  },
];

// feature matrix based on your Excel
export const pricingFeatures = [
  { label: "BOQ-based Sourcing", basic: true, standard: true, premium: true },
  { label: "Vendor Identification & Comparison", basic: true, standard: true, premium: true },
  { label: "Rate Analysis & Negotiation", basic: true, standard: true, premium: true },
  { label: "PO Preparation Support", basic: true, standard: true, premium: true },
  { label: "Vendor Follow-up till Dispatch", basic: true, standard: true, premium: true },

  { label: "Datasheet Matching", basic: true, standard: true, premium: true },
  { label: "Equivalent Brand Suggestions", basic: true, standard: true, premium: true },
  { label: "Certification & Compatibility Checks", basic: true, standard: true, premium: true },

  { label: "Procurement Planning", basic: true, standard: true, premium: true },
  { label: "Logistics & Delivery Coordination", basic: true, standard: true, premium: true },
  { label: "Pan-India Logistics Support", basic: true, standard: true, premium: true },
  { label: "Customs & Import Documentation Support", basic: true, standard: true, premium: true },

  { label: "Weekly + Monthly Reports", basic: false, standard: true, premium: true },
  { label: "Inventory Movement & Purchase Insights", basic: false, standard: true, premium: true },
  { label: "Global Vendor Network Access", basic: false, standard: true, premium: true },

  { label: "Daily Status Dashboard (shared sheet)", basic: false, standard: true, premium: true },
  { label: "Backup Vendor Strategy (Primary + Secondary)", basic: false, standard: true, premium: true },
  { label: "Cost Saving Log (proof of value)", basic: false, standard: true, premium: true },
  { label: "SLA-Based Execution", basic: false, standard: true, premium: true },
{ to: "/pricing", label: "Pricing" },

  { label: "Risk Alerts (delay/port/docs)", basic: false, standard: false, premium: true },
];
