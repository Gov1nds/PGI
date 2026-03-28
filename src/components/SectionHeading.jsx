export default function SectionHeading({ eyebrow, title, desc, center = false }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-sky-400 mb-3">
          <span className="w-6 h-px bg-sky-500/50" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl leading-[1.15]">{title}</h2>
      {desc && <p className="mt-4 text-[15px] leading-relaxed text-white/85">{desc}</p>}
    </div>
  );
}
