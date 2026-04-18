import { useAuth } from "../context/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStatusMeta } from "../lib/statusMaps";
import { ApiValidationError, ApiForbiddenError } from "../lib/apiErrors";

/* ─── Loading ─── */
export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="shadow-soft flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
        <span className="text-sm text-muted">{message}</span>
      </div>
    </div>
  );
}

/* ─── Error (typed) ─── */
export function ErrorState({ message = "Something went wrong", error, onRetry }) {
  if (error instanceof ApiValidationError && error.details?.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="rounded-2xl border border-red-500/15 bg-red-500/10 p-4 text-sm text-red-200">
          <div className="mb-2 font-medium">{error.message || "Validation failed"}</div>
          <ul className="space-y-1 text-left text-xs">
            {error.details.map((d, i) => <li key={i} className="text-red-300">{d.field ? `${d.field}: ` : ""}{d.message || d}</li>)}
          </ul>
          {error.traceId && <div className="mt-2 text-[10px] text-red-400/60">Ref: {error.traceId}</div>}
        </div>
        {onRetry && <button onClick={onRetry} className="secondary-btn rounded-xl px-4 py-2 text-xs">Retry</button>}
      </div>
    );
  }
  if (error instanceof ApiForbiddenError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="rounded-full border border-orange-500/15 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
          Insufficient permissions
        </div>
        <p className="text-xs text-muted">You don't have access to this resource. Contact your organization admin.</p>
        {error.traceId && <div className="text-[10px] text-zinc-600">Ref: {error.traceId}</div>}
      </div>
    );
  }
  const msg = error?.message || message;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="rounded-full border border-red-500/15 bg-red-500/10 px-4 py-2 text-sm text-red-200">{msg}</div>
      {error?.traceId && <div className="text-[10px] text-zinc-600">Ref: {error.traceId}</div>}
      {onRetry && <button onClick={onRetry} className="secondary-btn rounded-xl px-4 py-2 text-xs">Retry</button>}
    </div>
  );
}

/* ─── Empty ─── */
export function EmptyState({ title = "Nothing here yet", description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-soft">
        <svg className="h-6 w-6 text-muted-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <div className="text-sm font-medium text-white">{title}</div>
      {description && <div className="mt-1 max-w-xs text-xs text-muted">{description}</div>}
      {action && <button onClick={action} className="primary-btn mt-4 rounded-xl px-4 py-2 text-xs">{actionLabel}</button>}
    </div>
  );
}

/* ─── Container ─── */
export function Container({ children, className = "" }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/* ─── ProtectedRoute ─── */
export function ProtectedRoute({ children, allowGuest = false, requiredPermission }) {
  const { user, loading, refreshAuth } = useAuth();
  const [refreshAttempted, setRefreshAttempted] = useState(false);

  useEffect(() => {
    if (!user && !loading && !refreshAttempted) {
      refreshAuth().finally(() => setRefreshAttempted(true));
    }
  }, [user, loading, refreshAttempted, refreshAuth]);

  if (loading || (!user && !refreshAttempted && !allowGuest)) return <LoadingState />;
  if (!user && !allowGuest) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted">Sign in to continue</p>
        <Link to="/login" className="primary-btn rounded-xl px-5 py-2.5 text-sm">Sign In</Link>
      </div>
    );
  }
  if (user && requiredPermission && !user.permissions?.[requiredPermission]) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full border border-orange-500/15 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">Insufficient permissions</div>
        <p className="text-xs text-muted">You need the "{requiredPermission}" permission to access this page.</p>
      </div>
    );
  }
  return children;
}

/* ─── StatusBadge ─── */
export function StatusBadge({ status }) {
  const meta = getStatusMeta(status);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${meta.color}`}>
      {meta.label}
    </span>
  );
}

/* ─── ScoreBar ─── */
export function ScoreBar({ score, label }) {
  const p = Math.round((score || 0) * 100);
  const c = p >= 70 ? "bg-emerald-400" : p >= 40 ? "bg-amber-300" : "bg-red-300";
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[11px] capitalize text-muted">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className={`h-1.5 rounded-full ${c} transition-all`} style={{ width: `${p}%` }} />
      </div>
      <span className="w-8 text-right text-[11px] text-muted">{p}%</span>
    </div>
  );
}

/* ─── BOMCategoryGroup ─── */
export function BOMCategoryGroup({ category, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const rfq = items.filter((c) => c.rfq_required).length;
  const cL = items.reduce((s, c) => s + (c.cost_estimate?.total_cost_low || 0), 0);
  const cH = items.reduce((s, c) => s + (c.cost_estimate?.total_cost_high || 0), 0);
  const high = items.filter((c) => c.risk_assessment?.risk_level === "high").length;
  return (
    <div className="card mb-3 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between p-4 text-left transition hover:bg-white/[0.02]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold capitalize text-white">{category}</span>
          <span className="text-[11px] text-muted">{items.length} items</span>
          {rfq > 0 && <span className="badge-pill">{rfq} RFQ</span>}
          {high > 0 && <span className="badge-pill border-red-400/15 bg-red-500/10 text-red-200">{high} risk</span>}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted">${cL.toLocaleString()} – ${cH.toLocaleString()}</span>
          <span className="text-xs text-muted-2">{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-white/[0.05] divide-y divide-white/[0.04]">
          {items.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 text-xs transition hover:bg-white/[0.015]">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-white/85">{c.description || c.raw_text}</span>
                  {c.status && <StatusBadge status={c.status} />}
                </div>
                <div className="mt-0.5 text-muted-2">{c.item_id || c.bom_line_id} · Qty {c.quantity} · {c.procurement_class || c.category}</div>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-3">
                {c.cost_estimate && <span className="font-mono text-muted">${c.cost_estimate.unit_cost_mid}</span>}
                {c.risk_assessment && (
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                    c.risk_assessment.risk_level === "high" ? "border border-red-400/15 bg-red-500/10 text-red-200"
                    : c.risk_assessment.risk_level === "medium" ? "border border-amber-400/15 bg-amber-500/10 text-amber-200"
                    : "border border-emerald-400/15 bg-emerald-500/10 text-emerald-200"
                  }`}>{c.risk_assessment.risk_level}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Brand ─── */
function BrandLogo({ className = "h-8 w-auto" }) {
  // Text wordmark with a small glyph; if you want the uploaded SVG logo, it still exists at /logo.svg
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-[9px] border border-white/15 bg-white/[0.04]">
        <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none">
          <path d="M3 5.5L9 2l6 3.5v7L9 16l-6-3.5v-7z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M9 9.5v6.5M3 5.5l6 4 6-4" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={`font-semibold tracking-tight text-white ${className.includes("text-") ? "" : "text-[15px]"}`}>
        PGI<span className="text-white/55 font-semibold">Hub</span>
      </span>
    </div>
  );
}

/* ─── Public Navbar ─── */
const NAV = [
  { l: "Product",   to: "/" },
  { l: "Analyze",   to: "/analyze" },
  { l: "Marketplace", to: "/marketplace" },
  { l: "Customers", to: "/customers" },
  { l: "Pricing",   to: "/pricing" },
  { l: "Insights",  to: "/insights" },
  { l: "Changelog", to: "/changelog" },
];

export function PublicNavbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [mo, setMo] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/[0.06] bg-black/70 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-[13px] font-medium tracking-tight rounded-lg transition-colors ${
                    isActive ? "text-white bg-white/[0.045]" : "text-white/55 hover:text-white/92 hover:bg-white/[0.03]"
                  }`
                }
              >
                {l.l}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/contact" className="text-[13px] font-medium text-white/55 transition hover:text-white px-3 py-2">Contact sales</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-[13px] font-medium text-white/75 transition hover:text-white px-3 py-2">Dashboard</Link>
                <button onClick={() => { logout(); nav("/"); }} className="text-[13px] font-medium text-white/45 transition hover:text-white px-3 py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[13px] font-medium text-white/55 transition hover:text-white px-3 py-2">Sign in</Link>
                <Link to="/register" className="primary-btn rounded-full px-4 py-1.5 text-[12.5px]">Get started</Link>
              </>
            )}
          </div>

          <button onClick={() => setMo(!mo)} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-white/70 md:hidden">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mo
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {mo && (
        <div className="border-t border-white/[0.06] bg-black/95 px-4 pb-5 pt-3 md:hidden">
          <div className="space-y-0.5">
            {NAV.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMo(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-white/[0.07] text-white" : "text-white/55"
                  }`
                }
              >
                {l.l}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-white/[0.05] mt-2 space-y-0.5">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMo(false)} className="block rounded-lg px-3 py-2.5 text-sm text-white">Dashboard</Link>
                  <button onClick={() => { logout(); nav("/"); setMo(false); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-white/55">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMo(false)} className="block rounded-lg px-3 py-2.5 text-sm text-white/55">Sign in</Link>
                  <Link to="/register" onClick={() => setMo(false)} className="block rounded-lg px-3 py-2.5 text-sm text-white">Get started →</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Footer ─── */
const FOOTER_LINKS = {
  Product: [
    { l: "Analyze BOM", to: "/analyze" },
    { l: "Marketplace", to: "/marketplace" },
    { l: "Pricing", to: "/pricing" },
    { l: "Changelog", to: "/changelog" },
  ],
  Company: [
    { l: "Customers", to: "/customers" },
    { l: "Insights", to: "/insights" },
    { l: "Contact", to: "/contact" },
    { l: "Security", to: "/security" },
  ],
  Resources: [
    { l: "Documentation", to: "/insights" },
    { l: "Sourcing Guide", to: "/insights" },
    { l: "Vendor Portal", to: "/vendor/login" },
  ],
  Account: [
    { l: "Sign in", to: "/login" },
    { l: "Register", to: "/register" },
    { l: "Dashboard", to: "/dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.055] bg-black">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-[260px] text-[13.5px] leading-6 text-white/55">
              The AI sourcing marketplace. Upload a BOM, describe your sourcing need — get suppliers, quotes, and cost insight instantly.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { label: "Twitter/X", icon: "𝕏", href: "#" },
                { label: "LinkedIn", icon: "in", href: "#" },
                { label: "GitHub", icon: "⌥", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[12px] font-semibold text-white/50 transition hover:bg-white/[0.07] hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-white/38">{group}</div>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.l}>
                    <Link to={l.to} className="text-[13.5px] text-white/55 transition-colors duration-150 hover:text-white">
                      {l.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.052] py-6 sm:flex-row">
          <div className="flex items-center gap-3 text-[12px] text-white/35">
            <span>© {new Date().getFullYear()} PGI Hub</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>AI Sourcing Marketplace</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-blink" /> All systems operational
            </span>
          </div>
          <div className="flex items-center gap-5">
            {[
              { l: "Privacy Policy", to: "/privacy" },
              { l: "Terms of Service", to: "/terms" },
              { l: "Sitemap", to: "/sitemap.xml" },
            ].map((l) => (
              <Link key={l.l} to={l.to} className="text-[12px] text-white/35 transition hover:text-white/70">
                {l.l}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
