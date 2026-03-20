import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "./Container.jsx";
import Logo from "./Logo.jsx";
import { navLinks } from "../content/siteData.js";

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `nav-link text-[13px] font-medium transition-colors duration-200 ${
          isActive ? "text-sky-400 active" : "text-white/60 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(10,15,26,0.8)] backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent border-b border-white/[0.04]"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.filter(l => l.label !== "Contact").map((l) => (
            <NavItem key={l.to} to={l.to} label={l.label} />
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/bom-analyzer"
            className="rounded-lg bg-sky-500/10 px-4 py-2 text-[13px] font-semibold text-sky-400 ring-1 ring-sky-500/20 transition-all duration-300 hover:bg-sky-500/20 hover:ring-sky-500/40 hover:shadow-lg hover:shadow-sky-500/10"
          >
            Analyze BOM
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/bom-analyzer"
            className="rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/20"
          >
            BOM
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative rounded-lg bg-white/5 p-2 ring-1 ring-white/10 transition-colors hover:bg-white/10"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <div className="h-5 w-5 flex flex-col justify-center items-center">
              <span
                className={`block h-[1.5px] w-4 bg-white/80 transition-all duration-300 ${
                  open ? "rotate-45 translate-y-[0.5px]" : "-translate-y-1"
                }`}
              />
              <span
                className={`block h-[1.5px] w-4 bg-white/80 transition-all duration-300 ${
                  open ? "opacity-0 scale-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-[1.5px] w-4 bg-white/80 transition-all duration-300 ${
                  open ? "-rotate-45 -translate-y-[0.5px]" : "translate-y-1"
                }`}
              />
            </div>
          </button>
        </div>
      </Container>

      {/* Mobile fullscreen menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 transition-all duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[rgba(10,15,26,0.95)] backdrop-blur-xl" />
        <div className="relative h-full overflow-y-auto">
          <Container className="py-8">
            <div className="flex flex-col gap-1">
              {navLinks.map((l, idx) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all duration-200 ${
                      isActive
                        ? "text-sky-400 bg-sky-500/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`
                  }
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {({ isActive }) => (
                    <>
                      <span>{l.label}</span>
                      <svg className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <Link
                to="/bom-analyzer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl btn-primary px-5 py-3.5 text-sm font-semibold text-white w-full"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Analyze Your BOM
              </Link>
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
