import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-accent-600 hover:bg-accent-500 text-white"
      : variant === "secondary"
      ? "bg-white/10 hover:bg-white/15 text-white"
      : "bg-transparent hover:bg-white/10 text-white/90";

  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
        styles,
        className
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  href,
  linkLabel = "Explore",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        {eyebrow ? (
          <div className="text-xs font-semibold tracking-[0.18em] text-white/60">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">{title}</h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 text-sm font-medium text-accent-500 hover:text-accent-400"
        >
          {linkLabel}
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition group-hover:bg-white/10">
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      ) : null}
    </div>
  );
}
