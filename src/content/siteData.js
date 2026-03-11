/* ======================================================
SITE INFORMATION
====================================================== */

export const site = {
  name: "PGI",
  tagline:
    "Manufacturing Operating Partner for Hardware Startups, Robotics, EV & Industrial Products",
  description:
    "PGI coordinates electronics sourcing, machining, fabrication, assembly, and quality verification through a distributed manufacturing network.",
  contact: {
    email: "info@pgihub.com",
    phone: "+91 8921983250",
    location: "Kerala, India"
  }
};

/* ======================================================
NAVIGATION
====================================================== */

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Capabilities", to: "/capabilities" },
  { label: "Insights", to: "/insights" },
  { label: "News", to: "/news" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];

/* ======================================================
HERO STATS
====================================================== */

export const heroStats = [
  { kpi: "12,200+", label: "Components manufactured" },
  { kpi: "300+", label: "Manufacturing partners" },
  { kpi: "92%", label: "Production reliability" },
  { kpi: "17+ years", label: "Engineering experience" }
];

/* ======================================================
SERVICES (6 UNIQUE SERVICES WITH 6 UNIQUE IMAGES)
====================================================== */

export const services = [
  {
    title: "Product Manufacturing Coordination",
    desc: "Engineering-led coordination of product manufacturing from prototype to scaled production.",
    image: "/images/service-product-coordination.jpg",
    fullDesc: "We coordinate every aspect of manufacturing-from initial design review through prototype validation, material sourcing, production scheduling, and final delivery.",
    benefits: ["Prototype to production transitions", "Cost optimization through DFM", "Consistent quality across batches"]
  },
  {
    title: "Electronics Components & PCB Sourcing",
    desc: "Global sourcing of semiconductors, connectors, sensors, and PCB manufacturing partners.",
    image: "/images/service-electronics-sourcing.jpg",
    fullDesc: "Access to global electronics suppliers with quality validation, counterfeit prevention, and supply chain resilience strategies.",
    benefits: ["Authorized component sourcing", "Supply chain resilience", "Component traceability"]
  },
  {
    title: "Precision Machining & Fabrication",
    desc: "Coordination of CNC machining, sheet metal fabrication, and custom mechanical components.",
    image: "/images/service-machining-fabrication.jpg",
    fullDesc: "Network of CNC facilities supporting complex geometries, tight tolerances, and specialized materials including aerospace-grade alloys.",
    benefits: ["Multi-axis CNC capabilities", "Tight tolerance control", "Custom surface finishing"]
  },
  {
    title: "Assembly & Production Management",
    desc: "Managing production schedules, assembly lines, and manufacturing integration.",
    image: "/images/service-assembly-production.jpg",
    fullDesc: "End-to-end production management including scheduling, line coordination, and just-in-time delivery logistics.",
    benefits: ["Production planning & scheduling", "Just-in-time delivery", "Inventory optimization"]
  },
  {
    title: "Quality Control & Inspection",
    desc: "Dimensional inspection, engineering validation, and quality assurance before shipment.",
    image: "/images/service-quality-inspection.jpg",
    fullDesc: "Comprehensive quality verification including First Article Inspection, CMM reports, material certificates, and functional testing.",
    benefits: ["First Article Inspection (FAI)", "CMM dimensional reports", "Functional testing"]
  },
  {
    title: "Supply Chain & Vendor Network",
    desc: "Building a distributed manufacturing ecosystem to ensure reliable production capacity.",
    image: "/images/service-supply-chain.jpg",
    fullDesc: "Strategic vendor relationships and supply chain integration to reduce single-source dependencies and improve resilience.",
    benefits: ["Vendor diversification", "Supply chain resilience", "Cost optimization"]
  }
];

/* ======================================================
CAPABILITIES / MANUFACTURING NETWORK (4 UNIQUE IMAGES)
====================================================== */

export const outdoorWorks = [
  {
    title: "Distributed Manufacturing Network",
    desc: "Coordinated ecosystem of CNC facilities, fabrication shops, and electronics assembly partners to scale production efficiently.",
    image: "/images/capability-distributed-network.jpg",
    details: "Our network spans precision machining centers, sheet metal fabrication shops, and electronics assembly facilities across multiple locations."
  },
  {
    title: "Electronics Manufacturing Ecosystem",
    desc: "Global sourcing, PCB assembly, component testing, and electronics integration through trusted manufacturing partners.",
    image: "/images/capability-electronics-ecosystem.jpg",
    details: "Turnkey PCBA services with component sourcing, SMT assembly, automated inspection, and functional testing capabilities."
  },
  {
    title: "Mechanical & Precision Manufacturing",
    desc: "Advanced CNC machining, sheet metal fabrication, custom casting, and precision fabrication capabilities.",
    image: "/images/capability-mechanical-precision.jpg",
    details: "Multi-axis CNC, precision turning, laser cutting, metal bending, welding, and custom surface finishing options."
  },
  {
    title: "Engineering Review & Production Optimization",
    desc: "Design for manufacturability (DFM) analysis, cost optimization, and production readiness assessment.",
    image: "/images/capability-engineering-review.jpg",
    details: "Technical review services including DFM analysis, tolerance optimization, material selection, and manufacturing method selection."
  }
];

/* ======================================================
INSIGHTS / ARTICLES
====================================================== */

export const insights = [
  {
    title: "How hardware startups scale manufacturing without owning factories",
    excerpt: "Product companies increasingly use distributed manufacturing networks to scale efficiently.",
    desc: "Distributed manufacturing networks offer startups cost-effective scaling without capital investment in factory infrastructure.",
    category: "Manufacturing Strategy",
    image: "/images/insight-1.jpg",
    slug: "scale-manufacturing-without-factories",
    author: "PGI Engineering",
    readTime: "5 min read"
  },
  {
    title: "Managing electronics supply chains for new product development",
    excerpt: "Strategies for securing semiconductors, PCBs, and electronics components.",
    desc: "Electronics supply chain complexity requires strategic sourcing, vendor qualification, and supply resilience planning.",
    category: "Supply Chain",
    image: "/images/insight-2.jpg",
    slug: "electronics-supply-chains",
    author: "PGI Engineering",
    readTime: "6 min read"
  },
  {
    title: "The distributed manufacturing model for modern hardware companies",
    excerpt: "Why supplier ecosystems are replacing traditional vertically integrated factories.",
    desc: "Distributed manufacturing provides flexibility, cost efficiency, and scalability that traditional factory models cannot match.",
    category: "Industry Trends",
    image: "/images/insight-3.jpg",
    slug: "distributed-manufacturing-model",
    author: "PGI Engineering",
    readTime: "7 min read"
  }
];

/* ======================================================
PRICING
====================================================== */

export const pricingPlans = [
  {
    name: "Prototype",
    price: "Custom",
    desc: "For early stage hardware startups building prototypes.",
    note: "Per project basis",
    key: "basic",
    cta: "Start prototype",
    to: "/contact",
    poSupport: "Ad-hoc engineering review and vendor identification for prototype batches.",
    demandTaskSupport: "Additional support available",
    features: [
      "Component sourcing",
      "Engineering review",
      "Vendor identification",
      "Prototype manufacturing coordination"
    ]
  },
  {
    name: "Production",
    price: "Custom",
    desc: "For companies scaling from prototype to production.",
    note: "Volume-based pricing",
    key: "standard",
    cta: "Scale to production",
    to: "/contact",
    highlight: true,
    poSupport: "Dedicated production management, quality oversight, and logistics coordination.",
    demandTaskSupport: "Priority support for urgent changes",
    features: [
      "Electronics sourcing",
      "PCB manufacturing",
      "Machining partners",
      "Assembly coordination",
      "Quality inspection"
    ]
  },
  {
    name: "Scale",
    price: "Custom",
    desc: "Full manufacturing operating partner with dedicated support.",
    note: "Dedicated team",
    key: "premium",
    cta: "Full partnership",
    to: "/contact",
    poSupport: "Full supply chain management, production planning, and vendor coordination.",
    demandTaskSupport: "24/7 dedicated support team",
    features: [
      "Full supply chain coordination",
      "Production planning",
      "Vendor network management",
      "Quality verification",
      "Logistics coordination"
    ]
  }
];

export const pricingFeatures = [
  {
    label: "Engineering Design Review (DFM)",
    basic: true,
    standard: true,
    premium: true
  },
  {
    label: "Component & Material Sourcing",
    basic: true,
    standard: true,
    premium: true
  },
  {
    label: "Vendor Management & Coordination",
    basic: false,
    standard: true,
    premium: true
  },
  {
    label: "Production Planning & Scheduling",
    basic: false,
    standard: true,
    premium: true
  },
  {
    label: "Quality Inspection & Testing",
    basic: false,
    standard: true,
    premium: true
  },
  {
    label: "Dedicated Production Manager",
    basic: false,
    standard: false,
    premium: true
  }
];

/* ======================================================
NEWS / ARTICLES
====================================================== */

export const newsItems = [
  {
    title: "CNC Network Expansion: New Precision Machining Facilities Onboarded",
    excerpt: "PGI expands its precision mechanical manufacturing network with multiple new ISO-compliant CNC facilities.",
    desc: "Expanded access to advanced 5-axis CNC and high-precision centers for tight tolerance work.",
    date: "March 15, 2024",
    category: "Network Expansion",
    image: "/images/news-1.jpg",
    slug: "cnc-network-expansion"
  },
  {
    title: "Turnkey PCBA Launch: Full Electronics Manufacturing Services",
    excerpt: "PGI introduces comprehensive PCB assembly services for electromechanical product development.",
    desc: "Turnkey PCB assembly including sourcing, SMT assembly, inspection, and functional testing.",
    date: "March 10, 2024",
    category: "Service Launch",
    image: "/images/news-2.jpg",
    slug: "turnkey-pcba-launch"
  },
  {
    title: "Manufacturing Coordination Case Study: Scaling EV Component Production",
    excerpt: "Engineering review, vendor coordination, and production verification for high-volume EV components.",
    desc: "Successful scaling of specialized mechanical components for electric vehicle manufacturing.",
    date: "March 1, 2024",
    category: "Case Study",
    image: "/images/news-3.jpg",
    slug: "manufacturing-coordination"
  }
];

/* ======================================================
KEY DIFFERENTIATORS / WHY CHOOSE PGI
====================================================== */

export const differentiators = [
  {
    icon: "🔧",
    title: "Engineering-Led Approach",
    desc: "Every project starts with detailed engineering review and design optimization before manufacturing begins."
  },
  {
    icon: "🌐",
    title: "Distributed Network",
    desc: "Access to multiple manufacturing facilities reduces dependency on single suppliers and improves resilience."
  },
  {
    icon: "✓",
    title: "Quality Assurance",
    desc: "Comprehensive inspection protocols, CMM reports, and material certificates ensure consistent quality."
  },
  {
    icon: "⚡",
    title: "Fast Scaling",
    desc: "Move seamlessly from prototypes to small batches to high-volume production with proven processes."
  },
  {
    icon: "💰",
    title: "Cost Optimization",
    desc: "Design for manufacturability reviews and smart supplier selection reduce per-unit costs significantly."
  },
  {
    icon: "🚀",
    title: "Global Logistics",
    desc: "Secure packaging, export documentation, and worldwide shipping coordination handled end-to-end."
  }
];

/* ======================================================
MANUFACTURING PROCESS STEPS
====================================================== */

export const processSteps = [
  {
    number: "01",
    title: "Engineering Review",
    desc: "CAD analysis, DFM assessment, tolerance review, and material selection optimization.",
    color: "emerald"
  },
  {
    number: "02",
    title: "Sourcing & Procurement",
    desc: "Component sourcing, vendor identification, price negotiation, and supply chain planning.",
    color: "emerald"
  },
  {
    number: "03",
    title: "Manufacturing",
    desc: "Production execution across our network of qualified facilities with real-time tracking.",
    color: "emerald"
  },
  {
    number: "04",
    title: "Quality Verification",
    desc: "Inspection, testing, documentation, and compliance verification before shipment.",
    color: "emerald"
  },
  {
    number: "05",
    title: "Global Logistics",
    desc: "Secure packaging, export documentation, and worldwide delivery coordination.",
    color: "emerald"
  }
];

/* ======================================================
TESTIMONIALS / CASE STUDIES
====================================================== */

export const testimonials = [
  {
    quote: "PGI transformed our manufacturing from managing 5 different suppliers to a single coordinated operation.",
    company: "Robotics Startup",
    person: "Engineering Lead",
    metric: "50% cost reduction"
  },
  {
    quote: "Their engineering team caught design issues early that would have caused expensive rework.",
    company: "EV Component Manufacturer",
    person: "Production Manager",
    metric: "30% faster scaling"
  },
  {
    quote: "The quality reports and traceability gave us confidence to scale to high-volume production.",
    company: "IoT Hardware Company",
    person: "CTO",
    metric: "Zero quality issues at scale"
  }
];

/* ======================================================
MANUFACTURING SPECIALTIES
====================================================== */

export const specialties = [
  {
    category: "Materials",
    items: ["Aluminum & Alloys", "Stainless Steel", "Titanium", "Brass & Copper", "Engineering Plastics", "Carbon Fiber"]
  },
  {
    category: "Mechanical Processes",
    items: ["CNC Machining", "Sheet Metal", "Injection Molding", "Die Casting", "Precision Turning", "Custom Fabrication"]
  },
  {
    category: "Electronics",
    items: ["PCB Design Support", "Component Sourcing", "SMT Assembly", "Through-Hole Assembly", "PCBA Testing", "Conformal Coating"]
  },
  {
    category: "Finishing & Assembly",
    items: ["Anodizing", "Powder Coating", "Plating", "Wire Harnesses", "Box Assembly", "Final Testing"]
  }
];