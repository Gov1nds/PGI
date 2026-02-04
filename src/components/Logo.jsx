import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img
        src="/images/logo.png"
        alt="PGI"
        className="h-11 w-11 rounded-2xl bg-white/10 p-2 object-contain"
      />
      <div className="leading-tight">
        <div className="text-sm font-semibold text-white">Padanilath Global Integrated</div>
        <div className="text-xs text-white/60">Integrated Supply Chain & Strategic Sourcing</div>
      </div>
    </Link>
  );
}
