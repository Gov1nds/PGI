import { notFound } from "next/navigation";
import { TaxonomyDetail } from "@/components/page-templates";
import { industries } from "@/content/industries";

const playbooks: Record<string, { bullets: string[] }> = {
  "residential-villas": { bullets: [
    "Site visit + requirement capture (style, usage, budget)",
    "Layout plan: circulation, levels, drainage, and focal points",
    "Material plan: natural stone, lighting, water features, planting",
    "Execution with clear milestones and quality checks",
  ]},
  apartments: { bullets: [
    "Master plan for common areas (walkways, greens, amenities)",
    "Low-maintenance plant palette and irrigation planning",
    "Durable hardscape and safety-first edges/levels",
    "Maintenance plan and handover checklist",
  ]},
  commercial: { bullets: [
    "Brand-friendly entry landscape and visitor flow",
    "Drainage and hardscape durability for high footfall",
    "Low-maintenance planting and irrigation automation",
    "Execution with minimal disruption to operations",
  ]},
  hospitality: { bullets: [
    "Guest experience design: ambience, lighting, and focal points",
    "Photo-worthy zones with durable pathways and seating",
    "Water feature planning (safety, filtration, maintenance)",
    "On-time execution and premium finishing",
  ]},
  institutional: { bullets: [
    "Safety, drainage, and accessibility planning",
    "Durable materials and easy upkeep choices",
    "Clear BOQ and execution timeline",
    "Quality checks and documentation for handover",
  ]},
  renovation: { bullets: [
    "Audit existing garden/hardscape and identify quick wins",
    "Repair/upgrade stone paving and drainage where needed",
    "Refresh planting with climate-suitable, sustainable options",
    "Phase-wise execution to match your budget",
  ]},
};

export default function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const item = industries.find((x) => x.slug === params.slug);
  if (!item) return notFound();
  const extra = playbooks[params.slug]?.bullets ?? [
    "Site visit and requirement capture",
    "Design + BOQ + timeline",
    "Execution with quality checks",
    "Sustainable choices and clean handover",
  ];
  return <TaxonomyDetail title={item.title} description={item.description} bullets={extra} />;
}
