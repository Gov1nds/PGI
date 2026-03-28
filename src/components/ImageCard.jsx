import { Link } from "react-router-dom";

export default function ImageCard({ title, desc, image, to, tag }) {
  const Wrapper = to ? Link : "div";
  const wrapperProps = to ? { to } : {};
  return (
    <Wrapper {...wrapperProps}
      className={`group block overflow-hidden rounded-2xl bg-navy-800/50 ring-1 ring-white/[0.06] transition-all duration-300 hover:bg-navy-700/50 ${to ? "hover:ring-sky-500/25 hover:shadow-glass-hover hover:-translate-y-1" : ""}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60" />
        {tag && <div className="absolute left-3 top-3 rounded-full bg-navy-950/60 backdrop-blur-md px-3 py-1 text-[10px] font-semibold text-white/80 ring-1 ring-white/10">{tag}</div>}
      </div>
      <div className="p-5">
        <div className="text-[15px] font-semibold text-white group-hover:text-sky-400 transition-colors">{title}</div>
        <p className="mt-2.5 text-sm leading-relaxed text-white/55">{desc}</p>
        {to && <div className="mt-4 text-sm font-semibold text-sky-400 group-hover:text-sky-300 transition-colors">Read more →</div>}
      </div>
    </Wrapper>
  );
}
