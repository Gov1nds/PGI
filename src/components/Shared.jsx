import { useAuth } from "../context/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { getStatusMeta } from "../lib/statusMaps";
import { ApiValidationError, ApiForbiddenError } from "../lib/apiErrors";

/* ─── Loading ─── */
export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 shadow-sm">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-[#0A0A0A]" />
        <span className="text-sm text-[#6B7280]">{message}</span>
      </div>
    </div>
  );
}

/* ─── Error ─── */
export function ErrorState({ message = "Something went wrong", error, onRetry }) {
  if (error instanceof ApiValidationError && error.details?.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="mb-2 font-medium">{error.message || "Validation failed"}</div>
          <ul className="space-y-1 text-left text-xs">
            {error.details.map((d, i) => <li key={i} className="text-red-600">{d.field ? `${d.field}: ` : ""}{d.message || d}</li>)}
          </ul>
          {error.traceId && <div className="mt-2 text-[10px] text-red-400">Ref: {error.traceId}</div>}
        </div>
        {onRetry && <button onClick={onRetry} className="secondary-btn rounded-lg px-4 py-2 text-xs">Retry</button>}
      </div>
    );
  }
  if (error instanceof ApiForbiddenError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700">Insufficient permissions</div>
        <p className="text-xs text-[#6B7280]">You don't have access to this resource. Contact your organization admin.</p>
        {error.traceId && <div className="text-[10px] text-[#9CA3AF]">Ref: {error.traceId}</div>}
      </div>
    );
  }
  const msg = error?.message || message;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{msg}</div>
      {error?.traceId && <div className="text-[10px] text-[#9CA3AF]">Ref: {error.traceId}</div>}
      {onRetry && <button onClick={onRetry} className="secondary-btn rounded-lg px-4 py-2 text-xs">Retry</button>}
    </div>
  );
}

/* ─── Empty ─── */
export function EmptyState({ title = "Nothing here yet", description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F5F5F5]">
        <svg className="h-6 w-6 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <div className="text-sm font-medium text-[#0A0A0A]">{title}</div>
      {description && <div className="mt-1 max-w-xs text-xs text-[#6B7280]">{description}</div>}
      {action && <button onClick={action} className="primary-btn mt-4 rounded-lg px-4 py-2 text-xs">{actionLabel}</button>}
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
        <p className="text-[#6B7280]">Sign in to continue</p>
        <Link to="/login" className="primary-btn rounded-lg px-5 py-2.5 text-sm">Sign In</Link>
      </div>
    );
  }
  if (user && requiredPermission && !user.permissions?.[requiredPermission]) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700">Insufficient permissions</div>
        <p className="text-xs text-[#6B7280]">You need the "{requiredPermission}" permission to access this page.</p>
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
  const c = p >= 70 ? "bg-emerald-500" : p >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[11px] capitalize text-[#6B7280]">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-[#F5F5F5]">
        <div className={`h-1.5 rounded-full ${c} transition-all`} style={{ width: `${p}%` }} />
      </div>
      <span className="w-8 text-right text-[11px] text-[#6B7280]">{p}%</span>
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
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between p-4 text-left transition hover:bg-[#FAFAFA]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold capitalize text-[#0A0A0A]">{category}</span>
          <span className="text-[11px] text-[#6B7280]">{items.length} items</span>
          {rfq > 0 && <span className="badge-pill border-purple-200 bg-purple-50 text-purple-700">{rfq} RFQ</span>}
          {high > 0 && <span className="badge-pill border-red-200 bg-red-50 text-red-700">{high} risk</span>}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#6B7280]">${cL.toLocaleString()} – ${cH.toLocaleString()}</span>
          <span className="text-xs text-[#9CA3AF]">{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-[#E5E5E5] divide-y divide-[#F0F0F0]">
          {items.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 text-xs transition hover:bg-[#FAFAFA]">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[#0A0A0A]">{c.description || c.raw_text}</span>
                  {c.status && <StatusBadge status={c.status} />}
                </div>
                <div className="mt-0.5 text-[#9CA3AF]">{c.item_id || c.bom_line_id} · Qty {c.quantity} · {c.procurement_class || c.category}</div>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-3">
                {c.cost_estimate && <span className="font-mono text-[#6B7280]">${c.cost_estimate.unit_cost_mid}</span>}
                {c.risk_assessment && (
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                    c.risk_assessment.risk_level === "high" ? "border border-red-200 bg-red-50 text-red-700"
                    : c.risk_assessment.risk_level === "medium" ? "border border-amber-200 bg-amber-50 text-amber-700"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700"
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

/* ─── BrandLogo ─── */
function BrandLogo({ className = "h-10 w-auto" }) {
  return <img src="/logo.svg" alt="PGI Hub" className={className} />;
}

const NAV = [
  { l: "Product", to: "/" },
  { l: "Analyze", to: "/analyze" },
  { l: "Marketplace", to: "/marketplace" },
  { l: "Pricing", to: "/pricing" },
  { l: "Insights", to: "/insights" },
  { l: "Contact", to: "/contact" },
];

/* ─── Public Navbar (Cursor-style) ─── */
export function PublicNavbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [mo, setMo] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "border-b border-[#E5E5E5] bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]" : "bg-white"}`}>
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo className="h-7 w-auto" />
            <span className="text-base font-semibold tracking-tight text-[#0A0A0A]">PGI Hub</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => `px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors duration-150 ${isActive ? "text-[#0A0A0A] bg-[#F5F5F5]" : "text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F5F5F5]"}`}>{l.l}</NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2.5 md:flex">
            {user ? (
              <>
                <Link to="/dashboard" className="text-[13px] font-medium text-[#6B7280] transition hover:text-[#0A0A0A]">Dashboard</Link>
                <button onClick={() => { logout(); nav("/"); }} className="text-[13px] text-[#9CA3AF] transition hover:text-[#0A0A0A]">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[13px] font-medium text-[#6B7280] transition hover:text-[#0A0A0A]">Sign In</Link>
                <Link to="/register" className="primary-btn rounded-lg px-4 py-2 text-[12.5px] font-semibold">Get Started</Link>
              </>
            )}
          </div>
          <button onClick={() => setMo(!mo)} className="rounded-lg border border-[#E5E5E5] bg-white p-2 text-[#6B7280] md:hidden">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mo ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </Container>
      {mo && (
        <div className="border-t border-[#E5E5E5] bg-white px-4 pb-5 pt-3 md:hidden">
          <div className="space-y-0.5">
            {NAV.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setMo(false)} className={({ isActive }) => `block rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-[#F5F5F5] text-[#0A0A0A]" : "text-[#6B7280]"}`}>{l.l}</NavLink>
            ))}
            <div className="pt-2 border-t border-[#E5E5E5] mt-2">
              {user ? (
                <button onClick={() => { logout(); nav("/"); setMo(false); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#6B7280]">Logout</button>
              ) : (
                <Link to="/login" onClick={() => setMo(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[#6B7280]">Sign In</Link>
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
  Platform: [{ l: "Analyze", to: "/analyze" }, { l: "Marketplace", to: "/marketplace" }, { l: "Insights", to: "/insights" }],
  Company: [{ l: "Pricing", to: "/pricing" }, { l: "Contact", to: "/contact" }],
  Legal: [{ l: "Privacy Policy", to: "/privacy" }, { l: "Terms of Service", to: "/terms" }],
  Account: [{ l: "Sign In", to: "/login" }, { l: "Register", to: "/register" }],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#E5E5E5] bg-[#FAFAFA]">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <BrandLogo className="h-7 w-auto" />
              <span className="text-base font-semibold tracking-tight text-[#0A0A0A]">PGI Hub</span>
            </div>
            <p className="mt-4 max-w-[240px] text-[13.5px] leading-6 text-[#6B7280]">AI sourcing marketplace for BOM analysis, vendor discovery, RFQs, and procurement execution.</p>
            <div className="mt-6 flex items-center gap-2.5">
              {[{ label: "Twitter/X", icon: "𝕏" }, { label: "LinkedIn", icon: "in" }, { label: "GitHub", icon: "⌥" }].map((s) => (
                <button key={s.label} aria-label={s.label} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[12px] font-semibold text-[#9CA3AF] transition hover:bg-[#F5F5F5] hover:text-[#0A0A0A]">{s.icon}</button>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">{group}</div>
              <ul className="space-y-2.5">{links.map((l) => (<li key={l.l}><Link to={l.to} className="text-[13.5px] text-[#6B7280] transition-colors duration-150 hover:text-[#0A0A0A]">{l.l}</Link></li>))}</ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E5E5E5] py-5 sm:flex-row">
          <div className="text-[12px] text-[#9CA3AF]">© {new Date().getFullYear()} PGI Hub · AI Sourcing Marketplace</div>
          <div className="flex items-center gap-5">
            {[{ l: "Privacy", to: "/privacy" }, { l: "Terms", to: "/terms" }, { l: "Sitemap", to: "/sitemap.xml" }].map((l) => (
              <Link key={l.l} to={l.to} className="text-[12px] text-[#9CA3AF] transition hover:text-[#6B7280]">{l.l}</Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
