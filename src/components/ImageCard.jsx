import { Link } from "react-router-dom";

export default function ImageCard({ title, desc, image, to, tag }) {
  const Wrapper = to ? Link : "div";
  const wrapperProps = to ? { to } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group block overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10 ${
        to ? "hover:ring-[rgba(var(--brand-500)/0.35)]" : ""
      }`}
    >
      <div className="relative aspect-[16/10]">
        <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {tag ? (
          <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
            {tag}
          </div>
        ) : null}
      </div>
      <div className="p-5">
        <div className="text-base font-semibold">{title}</div>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>
        {to ? <div className="mt-4 text-sm font-semibold text-[rgba(var(--brand-500))]">Read more →</div> : null}
      </div>
    </Wrapper>
  );
}
