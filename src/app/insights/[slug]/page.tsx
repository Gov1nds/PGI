import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/page-templates";
import { insights } from "@/content/insights";

export default function DetailPage({ params }: { params: { slug: string } }) {
  const item = insights.find((x) => x.slug === params.slug);
  if (!item) return notFound();
  return <ContentDetail item={item} backHref="/insights" />;
}
