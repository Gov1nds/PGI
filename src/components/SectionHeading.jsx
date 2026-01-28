export default function SectionHeading({ eyebrow, title, desc }) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <div className="text-sm text-[rgba(var(--brand-500))]">{eyebrow}</div> : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {desc ? <p className="mt-3 text-sm leading-relaxed text-white/70">{desc}</p> : null}
    </div>
  );
}
