import { Link } from "react-router-dom";

export function PrimaryButton({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-5 py-3 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
    >
      {children}
    </Link>
  );
}

export function SecondaryButton({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
