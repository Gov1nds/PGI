import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "./Container.jsx";
import Logo from "./Logo.jsx";
import { navLinks } from "../content/siteData.js";
import { useAuth } from "../context/AuthContext";

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `nav-link text-[13px] font-medium transition-all duration-300 ${
          isActive ? "text-white active" : "text-white/45 hover:text-white/90"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(9,9,11,0.88)] backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/30"
          : "bg-transparent border-b border-white/[0.04]"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.filter(l => l.label !== "Contact").map((l) => (
            <NavItem key={l.to} to={l.to} label={l.label} />
          ))}
          {user && <NavItem to="/dashboard" label="Projects" />}
        </nav>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/bom-analyzer"
            className="rounded-lg bg-white/[0.06] px-4 py-2 text-[13px] font-semibold text-white/70 ring-1 ring-white/[0.08] transition-all duration-300 hover:bg-white/[0.1] hover:ring-white/[0.12] hover:text-white"
          >
            Analyze BOM
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-white/[0.1] flex items-center justify-center text-[10px] font-bold text-white/70">
                  {(user.full_name || user.email || "U")[0].toUpperCase()}
                </div>
                <span className="text-white/60 text-xs font-medium max-w-[100px] truncate">
                  {user.full_name || user.email?.split("@")[0]}
                </span>
                <svg className={`w-3 h-3 text-white/25 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111115] border border-white/[0.08] shadow-xl shadow-black/50 overflow-hidden z-50 backdrop-blur-xl">
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-white text-xs font-medium truncate">{user.full_name || "User"}</p>
                    <p className="text-white/35 text-[11px] truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
                    My Projects
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"
                className="text-[13px] font-medium text-white/50 hover:text-white transition-all duration-300">
                Login
              </Link>
              <Link to="/register"
                className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#09090b] hover:bg-white/90 transition-all duration-300">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-3 lg:hidden">
          {user ? (
            <Link to="/dashboard"
              className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/70 ring-1 ring-white/[0.08]">
              Projects
            </Link>
          ) : (
            <Link to="/login"
              className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/60 border border-white/[0.06]">
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative rounded-lg bg-white/[0.04] p-2 ring-1 ring-white/[0.08] transition-all duration-300 hover:bg-white/[0.08]"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <div className="h-5 w-5 flex flex-col justify-center items-center">
              <span className={`block h-[1.5px] w-4 bg-white/70 transition-all duration-300 ${open ? "rotate-45 translate-y-[0.5px]" : "-translate-y-1"}`} />
              <span className={`block h-[1.5px] w-4 bg-white/70 transition-all duration-300 ${open ? "opacity-0 scale-0" : "opacity-100"}`} />
              <span className={`block h-[1.5px] w-4 bg-white/70 transition-all duration-300 ${open ? "-rotate-45 -translate-y-[0.5px]" : "translate-y-1"}`} />
            </div>
          </button>
        </div>
      </Container>

      {/* Mobile fullscreen menu */}
      <div className={`lg:hidden fixed inset-x-0 top-16 bottom-0 z-[70] transition-all duration-400 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-[rgba(9,9,11,0.97)] backdrop-blur-2xl" />
        <div className="relative h-full overflow-y-auto">
          <Container className="py-8">
            <div className="flex flex-col gap-1">
              {navLinks.map((l, idx) => (
                <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all duration-200 ${
                      isActive ? "text-white bg-white/[0.06]" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`
                  }
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {({ isActive }) => (
                    <>
                      <span>{l.label}</span>
                      <svg className={`w-4 h-4 ${isActive ? "text-white/60" : "text-white/15"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </NavLink>
              ))}

              {user && (
                <NavLink to="/dashboard" onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all duration-200 ${
                      isActive ? "text-white bg-white/[0.06]" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`
                  }>
                  {({ isActive }) => (
                    <>
                      <span>My Projects</span>
                      <svg className={`w-4 h-4 ${isActive ? "text-white/60" : "text-white/15"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </NavLink>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
              <Link to="/bom-analyzer" onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#09090b] w-full transition-all duration-300 hover:bg-white/90">
                Analyze Your BOM
              </Link>

              {user ? (
                <button onClick={() => { handleLogout(); setOpen(false); }}
                  className="w-full rounded-xl px-5 py-3 text-sm font-medium text-red-400/60 hover:text-red-400 bg-red-500/[0.04] border border-red-500/[0.08] transition-all duration-300">
                  Sign Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white/60 bg-white/[0.04] border border-white/[0.06]">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-[#09090b] bg-white border border-white/[0.1]">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
