import { ContentIndex } from "@/components/page-templates";
import { articles } from "@/content/articles";

export default function Page() {
  return (
    <ContentIndex
      title="Articles"
      description="Short reads and frameworks you can use to plan your outdoor project."
      items={articles}
    />
  );
}
