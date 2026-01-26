import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/page-templates";
import { articles } from "@/content/articles";

export default function DetailPage({ params }: { params: { slug: string } }) {
  const item = articles.find((x) => x.slug === params.slug);
  if (!item) return notFound();
  return <ContentDetail item={item} backHref="/articles" />;
}
