import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/page-templates";
import { news } from "@/content/news";

export default function DetailPage({ params }: { params: { slug: string } }) {
  const item = news.find((x) => x.slug === params.slug);
  if (!item) return notFound();
  return <ContentDetail item={item} backHref="/news" />;
}
