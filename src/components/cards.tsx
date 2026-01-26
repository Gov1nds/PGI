import Image from "next/image";
import Link from "next/link";
import type { ContentItem } from "@/content/types";

export function ContentCard({ item }: { item: ContentItem }) {
  const href = `/${item.type}/${item.slug}`;
  const isFeature = item.model === "feature";

  return (
    <Link
      href={href}
      className={[
        "group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition",
        isFeature ? "md:col-span-2" : "",
      ].join(" ")}
    >
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover opacity-95 transition group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/90">
          {item.type.toUpperCase()}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-white/60">
          <span>{item.date}</span>
          <span>•</span>
          <span>{item.readingTime}</span>
        </div>
        <h3 className={["mt-2 font-semibold leading-snug", isFeature ? "text-xl" : "text-base"].join(" ")}>
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-white/70 line-clamp-3">{item.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-white/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
