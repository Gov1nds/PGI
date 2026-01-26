import type { ContentItem } from "./types";

export const projects: ContentItem[] = [
  // MODEL 1: FEATURE (big card)
  {
    type: "projects",
    model: "feature",
    title: "Sustainable outdoor spaces, built for Kerala",
    excerpt:
      "Eco-friendly landscaping with durable construction: natural stone paving, water features, and climate-suitable planting—managed end-to-end.",
    slug: "sustainable-outdoor-spaces-kerala",
    date: "2026-01-10",
    readingTime: "6 min read",
    tags: ["Landscape", "Stone Paving", "Sustainable"],
    image: "/images/feature-1.webp",
    author: "Padanailath & Company",
    body: [
      "Every outdoor space needs to survive sun, rain, and heavy use—especially in Kerala’s climate.",
      "We combine thoughtful design with strong execution: proper base preparation, drainage-aware slopes, durable materials, and a clean finish.",
      "From site visit to BOQ to handover, we manage the full project so you get a predictable outcome."
    ],
  },

  // MODEL 2: STANDARD (small card)
  {
    type: "projects",
    model: "standard",
    title: "From site visit to BOQ to execution",
    excerpt:
      "A simple, disciplined process that keeps timelines clear and quality high.",
    slug: "site-visit-boq-execution",
    date: "2026-01-12",
    readingTime: "4 min read",
    tags: ["Project Management", "Execution"],
    image: "/images/standard-1.webp",
    author: "Padanailath & Company",
    body: [
      "We start with a detailed site visit: levels, drainage, sunlight, soil, and usage needs.",
      "Then we share a clear BOQ and timeline—so you know exactly what is being built and when.",
      "Execution follows milestones with quality checks at every stage."
    ],
  },
];
