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
    text-white btn-primary
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
    inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold
    text-white/90 bg-white/5 backdrop-blur-sm
    ring-1 ring-white/10
    hover:bg-white/10 hover:ring-white/20 transition-all duration-300
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
