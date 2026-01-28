import { NavLink, Link } from "react-router-dom";
import Container from "./Container.jsx";
import Logo from "./Logo.jsx";
import { navLinks } from "../content/siteData.js";

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm transition ${isActive ? "text-white" : "text-white/70 hover:text-white"}`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <NavItem key={l.to} to={l.to} label={l.label} />
          ))}
          <Link
            to="/contact"
            className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/10"
          >
            Contact
          </Link>
        </nav>

        <div className="md:hidden">
          <Link
            to="/contact"
            className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
          >
            Contact
          </Link>
        </div>
      </Container>
    </header>
  );
}
