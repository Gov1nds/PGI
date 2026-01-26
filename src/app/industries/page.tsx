import { TaxonomyIndex } from "@/components/page-templates";
import { industries } from "@/content/industries";

export default function IndustriesPage() {
  return (
    <TaxonomyIndex
      title="Industries"
      description="Where we build: homes, communities, hospitality, and durable public spaces."
      items={industries}
      hrefPrefix="/industries"
    />
  );
}
