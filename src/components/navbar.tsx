"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";

const nav = [
  { label: "Industries", href: "/industries", columns: [
    ["Residential Villas", "/industries/residential-villas"],
    ["Apartments & Communities", "/industries/apartments"],
    ["Commercial & Offices", "/industries/commercial"],
    ["Resorts & Homestays", "/industries/hospitality"],
    ["Public & Institutional", "/industries/institutional"],
    ["Renovation & Upgrades", "/industries/renovation"],
  ]},
  { label: "Services", href: "/capabilities", columns: [
    ["Landscape Design & Planning", "/capabilities/landscape-design"],
    ["Outdoor Construction (Hardscape)", "/capabilities/outdoor-construction"],
    ["Natural Stone Paving", "/capabilities/stone-paving"],
    ["Water Features & Fountains", "/capabilities/water-features"],
    ["Garden Installation & Maintenance", "/capabilities/garden-maintenance"],
    ["Project Management & Execution", "/capabilities/project-management"],
  ]},
  { label: "Projects", href: "/projects" },
  { label: "Insights", href: "/insights", columns: [
    ["News", "/news"],
    ["Insights", "/insights"],
    ["Articles", "/articles"],
    ["Projects", "/projects"],
  ]},
  { label: "About", href: "/about" },
  { label: "Gallery / Updates", href: "/blog" },
];

function useOutsideClick(ref: React.RefObject<HTMLElement>, onOutside: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

export function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  useOutsideClick(panelRef, () => setOpen(null));

  const activeItem = useMemo(() => nav.find((n) => n.label === open), [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-900/80 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full border border-white/15 bg-white/5 grid place-items-center font-semibold">
                P
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Padanailath & Company</div>
                <div className="text-[11px] text-white/60">Sustainable outdoor construction</div>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const hasMega = Boolean(item.columns);
              return (
                <div key={item.label} className="relative">
                  <button
                    className="rounded-xl px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                    onMouseEnter={() => hasMega && setOpen(item.label)}
                    onFocus={() => hasMega && setOpen(item.label)}
                    onClick={() => (hasMega ? setOpen(item.label) : null)}
                  >
                    <Link href={item.href} className="outline-none">
                      {item.label}
                    </Link>
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden sm:inline-flex rounded-xl px-3 py-2 text-sm bg-white/10 hover:bg-white/15"
            >
              Contact
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {activeItem?.columns ? (
        <div className="hidden lg:block border-t border-white/10 bg-white text-black" onMouseLeave={() => setOpen(null)}>
          <div ref={panelRef} className="container-page py-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">{activeItem.label}</h3>
              <Link href={activeItem.href} className="text-accent-700 hover:text-accent-600 font-medium">
                View all →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-8">
              {activeItem.columns.map(([label, href]) => (
                <Link key={href} href={href} className="group text-sm text-black/75 hover:text-black">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{label}</span>
                    <span className="text-accent-700 opacity-0 transition group-hover:opacity-100">→</span>
                  </div>
                  <div className="mt-2 h-px w-full bg-black/10" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="lg:hidden border-t border-white/10 bg-ink-900">
          <div className="container-page py-4">
            <div className="grid gap-2">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-sm text-white/85 hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="hr-soft my-2" />
              <Link href="/contact" className="rounded-xl px-3 py-3 text-sm bg-accent-600 hover:bg-accent-500">
                Contact
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
          <div className="container-page">
            <div className="mt-20 rounded-2xl border border-white/10 bg-ink-900 shadow-soft">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="text-sm font-semibold">Search</div>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5">
                <input
                  autoFocus
                  placeholder="Search news, insights, articles, projects…"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-accent-600"
                />
                <p className="mt-3 text-xs text-white/55">
                  Tip: This demo search is UI-only. For real search, connect a CMS or add an API route.
                </p>
              </div>
            </div>
          </div>
          <button className="absolute inset-0 -z-10" onClick={() => setSearchOpen(false)} aria-label="Close" />
        </div>
      ) : null}
    </header>
  );
}
