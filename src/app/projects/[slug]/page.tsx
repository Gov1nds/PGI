import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/page-templates";
import { projects } from "@/content/projects";

export default function DetailPage({ params }: { params: { slug: string } }) {
  const item = projects.find((x) => x.slug === params.slug);
  if (!item) return notFound();
  return <ContentDetail item={item} backHref="/projects" />;
}
