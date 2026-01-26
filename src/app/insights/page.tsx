import { ContentIndex } from "@/components/page-templates";
import { insights } from "@/content/insights";

export default function Page() {
  return (
    <ContentIndex
      title="Insights"
      description="Practical ideas for outdoor design, durability, and Kerala-climate execution."
      items={insights}
    />
  );
}
