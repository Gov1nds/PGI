import { notFound } from "next/navigation";
import { TaxonomyDetail } from "@/components/page-templates";
import { capabilities } from "@/content/capabilities";

const playbooks: Record<string, { bullets: string[] }> = {
  "landscape-design": { bullets: [
    "Site survey (levels, drainage, sunlight, soil)",
    "Concept layout + material palette",
    "Planting plan for Kerala climate + maintenance needs",
    "BOQ + timeline so you can decide fast",
  ]},
  "outdoor-construction": { bullets: [
    "Hardscape planning: levels, base prep, and drainage",
    "Pathways, steps, seating, and outdoor structures",
    "Durable finishing and edge detailing",
    "Quality checks at each milestone",
  ]},
  "stone-paving": { bullets: [
    "Correct base preparation to avoid sinking and cracks",
    "Natural stone selection and pattern planning",
    "Slope/drainage alignment for monsoon",
    "Clean finishing and long-life durability",
  ]},
  "water-features": { bullets: [
    "Design options: fountain, pond, water wall",
    "Safe electrical, filtration, and water circulation",
    "Material selection for durability and easy cleaning",
    "Testing + handover guidance",
  ]},
  "garden-maintenance": { bullets: [
    "Planting, soil conditioning, and mulching",
    "Irrigation setup and seasonal schedule",
    "Trimming, pest prevention, and replacements",
    "Regular upkeep for consistent aesthetics",
  ]},
  "project-management": { bullets: [
    "BOQ + scheduling with milestone tracking",
    "Vendor coordination and material procurement",
    "Quality inspections and risk checks",
    "Clean handover with maintenance guidance",
  ]},
};

export default function CapabilityDetailPage({ params }: { params: { slug: string } }) {
  const item = capabilities.find((x) => x.slug === params.slug);
  if (!item) return notFound();
  const extra = playbooks[params.slug]?.bullets ?? [
    "Design + BOQ + timeline",
    "Disciplined execution",
    "Quality checks",
    "Sustainable finishing",
  ];
  return <TaxonomyDetail title={item.title} description={item.description} bullets={extra} />;
}
