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
    inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold
    text-white bg-[rgba(var(--brand-700))]
    shadow-[0_12px_30px_rgba(22,163,74,0.25)]
    hover:bg-[rgba(var(--brand-600))] transition
    ${className}
  `;

  // 👉 If navigation link
  if (to) {
    return (
      <Link to={to} className={baseStyle}>
        {children}
      </Link>
    );
  }

  // 👉 If button (CLICK ACTION)
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

export function SecondaryButton({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold
                 text-slate-900 bg-white/70 backdrop-blur
                 ring-1 ring-black/10
                 hover:bg-white/90 hover:ring-black/20 transition"
    >
      {children}
    </Link>
  );
}