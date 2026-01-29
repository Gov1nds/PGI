import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import Container from "./Container.jsx";
import Logo from "./Logo.jsx";
import { navLinks } from "../content/siteData.js";

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm transition ${isActive ? "text-white" : "text-white/70 hover:text-white"}`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
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

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/contact"
            className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
          >
            Contact
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl bg-white/5 p-2 ring-1 ring-white/10"
            aria-label="Open menu"
          >
            {/* simple hamburger */}
            <div className="h-5 w-6 flex flex-col justify-between">
              <span className="block h-[2px] w-full bg-white/80" />
              <span className="block h-[2px] w-full bg-white/80" />
              <span className="block h-[2px] w-full bg-white/80" />
            </div>
          </button>
        </div>
      </Container>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur">
          <Container className="py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((l) => (
                <NavItem
                  key={l.to}
                  to={l.to}
                  label={l.label}
                  onClick={() => setOpen(false)}
                />
              ))}
              <NavItem to="/about" label="About" onClick={() => setOpen(false)} />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
