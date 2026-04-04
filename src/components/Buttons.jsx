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
    inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold
    text-[#09090b] bg-white hover:bg-white/90
    shadow-[0_4px_16px_rgba(255,255,255,0.06)]
    hover:shadow-[0_6px_24px_rgba(255,255,255,0.1)]
    hover:-translate-y-[1px]
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
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
    inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold
    text-white/70 bg-white/[0.04] backdrop-blur-sm
    ring-1 ring-white/[0.08]
    hover:bg-white/[0.08] hover:ring-white/[0.14] hover:text-white
    hover:-translate-y-[1px]
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
