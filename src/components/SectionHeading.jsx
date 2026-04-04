export default function SectionHeading({ eyebrow, title, desc, center }) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/45 mb-4">
          <span className="w-6 h-px bg-white/20" />{eyebrow}<span className="w-6 h-px bg-white/20" />
        </div>
      )}
      {title && <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>}
      {desc && <p className="mt-4 text-white/55 leading-relaxed max-w-2xl">{desc}</p>}
    </div>
  );
}
