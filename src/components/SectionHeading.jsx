export default function SectionHeading({ eyebrow, title, desc, center = false }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400 mb-4">
          <span className="w-8 h-px bg-sky-500/40" />
          {eyebrow}
          {center && <span className="w-8 h-px bg-sky-500/40" />}
        </div>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[2.5rem] leading-[1.1]">{title}</h2>
      {desc && <p className="mt-5 text-[15px] leading-[1.75] text-white/60">{desc}</p>}
    </div>
  );
}
