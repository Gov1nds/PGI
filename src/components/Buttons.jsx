import { Link } from "react-router-dom";

export function PrimaryButton({
  to,
  onClick,
  children,
  className = "",
  disabled = false,
  type = "button"
}) {
  const baseStyle = `
    inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold
    text-white btn-primary tracking-[-0.01em]
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `.trim();

  if (to) {
    return (
      <Link to={to} className={baseStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyle}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ to, children, className = "" }) {
  const baseStyle = `
    inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold
    text-white/80 bg-white/[0.04] backdrop-blur-sm
    ring-1 ring-white/[0.08]
    hover:bg-white/[0.08] hover:ring-white/[0.14] hover:text-white
    active:scale-[0.98]
    transition-all duration-300
    ${className}
  `.trim();

  if (to) {
    return (
      <Link to={to} className={baseStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseStyle}>
      {children}
    </button>
  );
}
