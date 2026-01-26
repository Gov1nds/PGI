import { TaxonomyIndex } from "@/components/page-templates";
import { capabilities } from "@/content/capabilities";

export default function ServicesPage() {
  return (
    <TaxonomyIndex
      title="Services"
      description="Design + BOQ + execution for outdoor spaces—done with quality and sustainability."
      items={capabilities}
      hrefPrefix="/capabilities"
    />
  );
}
