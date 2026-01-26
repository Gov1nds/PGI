import { ContentIndex } from "@/components/page-templates";
import { news } from "@/content/news";

export default function Page() {
  return (
    <ContentIndex
      title="News"
      description="Updates and announcements from Padanailath & Company."
      items={news}
    />
  );
}
