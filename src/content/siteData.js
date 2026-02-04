// siteData.js

export const site = {
  name: "Padanilath",
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
    title: "Padanilath launches Procurement & Logistics Coordination Services",
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
