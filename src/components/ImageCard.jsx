import { Link } from "react-router-dom";

export default function ImageCard({ title, desc, image, to, tag }) {
  const Wrapper = to ? Link : "div";
  const wrapperProps = to ? { to } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group block overflow-hidden rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.08] transition-all duration-300 hover:bg-white/[0.06] ${
        to ? "hover:ring-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5" : ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(10,14,28)] via-transparent to-transparent opacity-60" />
        {tag && (
          <div className="absolute left-3 top-3 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10">
            {tag}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="text-[15px] font-semibold text-white">{title}</div>
        <p className="mt-2 text-sm leading-relaxed text-white/85">{desc}</p>
        {to && <div className="mt-4 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">Read more →</div>}
      </div>
    </Wrapper>
  );
}
