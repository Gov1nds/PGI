import { ContentIndex } from "@/components/page-templates";
import { projects } from "@/content/projects";

export default function Page() {
  return (
    <ContentIndex
      title="Projects"
      description="Selected outdoor projects. Replace details and photos anytime."
      items={projects}
    />
  );
}
