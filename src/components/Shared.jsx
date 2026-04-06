import { useAuth } from "../context/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="shadow-soft flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
        <span className="text-sm text-muted">{message}</span>
      </div>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="rounded-full border border-red-500/15 bg-red-500/10 px-4 py-2 text-sm text-red-200">
        {message}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="secondary-btn rounded-xl px-4 py-2 text-xs">
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-soft">
        <svg className="h-6 w-6 text-muted-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <div className="text-sm font-medium text-white">{title}</div>
      {description && <div className="mt-1 max-w-xs text-xs text-muted">{description}</div>}
      {action && (
        <button onClick={action} className="primary-btn mt-4 rounded-xl px-4 py-2 text-xs">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function Container({ children, className = "" }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function ProtectedRoute({ children, allowGuest = false }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState />;
  if (!user && !allowGuest) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted">Sign in to continue</p>
        <Link to="/login" className="primary-btn rounded-xl px-5 py-2.5 text-sm">
          Sign In
        </Link>
      </div>
    );
  }
  return children;
}

const SC = {
  draft: "bg-white/6 text-white/70 border border-white/10",
  analyzing: "bg-amber-500/10 text-amber-200 border border-amber-400/15",
  analyzed: "bg-sky-500/10 text-sky-200 border border-sky-400/15",
  strategy: "bg-indigo-500/10 text-indigo-200 border border-indigo-400/15",
  vendor_match: "bg-violet-500/10 text-violet-200 border border-violet-400/15",
  rfq_pending: "bg-purple-500/10 text-purple-200 border border-purple-400/15",
  rfq_sent: "bg-purple-500/10 text-purple-200 border border-purple-400/15",
  quote_compare: "bg-amber-500/10 text-amber-200 border border-amber-400/15",
  negotiation: "bg-orange-500/10 text-orange-200 border border-orange-400/15",
  vendor_selected: "bg-teal-500/10 text-teal-200 border border-teal-400/15",
  po_issued: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/15",
  in_production: "bg-lime-500/10 text-lime-200 border border-lime-400/15",
  qc_inspection: "bg-cyan-500/10 text-cyan-200 border border-cyan-400/15",
  shipped: "bg-sky-500/10 text-sky-200 border border-sky-400/15",
  in_transit: "bg-sky-500/10 text-sky-200 border border-sky-400/15",
  delivered: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/15",
  completed: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/15",
  cancelled: "bg-red-500/10 text-red-200 border border-red-400/15",
  invited: "bg-amber-500/10 text-amber-200 border border-amber-400/15",
  opened: "bg-sky-500/10 text-sky-200 border border-sky-400/15",
  partially_quoted: "bg-amber-500/10 text-amber-200 border border-amber-400/15",
  fully_quoted: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/15",
  awarded: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/15",
  expired: "bg-red-500/10 text-red-200 border border-red-400/15",
  received: "bg-sky-500/10 text-sky-200 border border-sky-400/15",
  submitted: "bg-sky-500/10 text-sky-200 border border-sky-400/15",
  issued: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/15",
  pending: "bg-amber-500/10 text-amber-200 border border-amber-400/15",
  active: "bg-sky-500/10 text-sky-200 border border-sky-400/15",
  created: "bg-white/6 text-white/70 border border-white/10",
  booked: "bg-indigo-500/10 text-indigo-200 border border-indigo-400/15",
  customs: "bg-orange-500/10 text-orange-200 border border-orange-400/15",
  promoted: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/15",
  saved: "bg-teal-500/10 text-teal-200 border border-teal-400/15",
  sent: "bg-purple-500/10 text-purple-200 border border-purple-400/15",
  quoted: "bg-sky-500/10 text-sky-200 border border-sky-400/15",
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${SC[status] || "bg-white/6 text-white/55 border border-white/10"}`}>
      {(status || "—").replace(/_/g, " ")}
    </span>
  );
}

export function ScoreBar({ score, label }) {
  const p = Math.round((score || 0) * 100);
  const c = p >= 70 ? "bg-emerald-400" : p >= 40 ? "bg-amber-300" : "bg-red-300";
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[11px] capitalize text-muted">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-white/6">
        <div className={`h-1.5 rounded-full ${c} transition-all`} style={{ width: `${p}%` }} />
      </div>
      <span className="w-8 text-right text-[11px] text-muted">{p}%</span>
    </div>
  );
}

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
          {rfq > 0 && <span className="badge-pill border-purple-400/15 bg-purple-500/10 text-purple-200">{rfq} RFQ</span>}
          {high > 0 && <span className="badge-pill border-red-400/15 bg-red-500/10 text-red-200">{high} risk</span>}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted">${cL.toLocaleString()} – ${cH.toLocaleString()}</span>
          <span className="text-xs text-muted-2">{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-white/[0.06] divide-y divide-white/[0.05]">
          {items.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 text-xs transition hover:bg-white/[0.015]">
              <div className="min-w-0 flex-1">
                <div className="truncate text-white/85">{c.description || c.raw_text}</div>
                <div className="mt-0.5 text-muted-2">{c.item_id} · Qty {c.quantity} · {c.procurement_class}</div>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-3">
                {c.cost_estimate && <span className="font-mono text-muted">${c.cost_estimate.unit_cost_mid}</span>}
                {c.risk_assessment && (
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                    c.risk_assessment.risk_level === "high"
                      ? "border border-red-400/15 bg-red-500/10 text-red-200"
                      : c.risk_assessment.risk_level === "medium"
                      ? "border border-amber-400/15 bg-amber-500/10 text-amber-200"
                      : "border border-emerald-400/15 bg-emerald-500/10 text-emerald-200"
                  }`}>
                    {c.risk_assessment.risk_level}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BrandLogo({ className = "h-10 w-auto" }) {
  return <img src="/logo.svg" alt="PGI Hub" className={className} />;
}

const NAV = [
  { l: "Home", to: "/" },
  { l: "Analyze", to: "/analyze" },
  { l: "Marketplace", to: "/marketplace" },
  { l: "Insights", to: "/insights" },
  { l: "Contact", to: "/contact" },
];

export function PublicNavbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [mo, setMo] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050510]/80 backdrop-blur-2xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo className="h-9 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-[13px] font-medium transition ${isActive ? "text-white" : "text-white/45 hover:text-white/85"}`
                }
              >
                {l.l}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link to="/dashboard" className="text-xs text-white/55 transition hover:text-white">Dashboard</Link>
                <button onClick={() => { logout(); nav("/"); }} className="text-xs text-white/35 transition hover:text-white">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs text-white/55 transition hover:text-white">Sign In</Link>
                <Link to="/register" className="primary-btn rounded-xl px-4 py-2 text-xs font-medium">Get Started</Link>
              </>
            )}
          </div>

          <button onClick={() => setMo(!mo)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 md:hidden">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </Container>

      {mo && (
        <div className="border-t border-white/[0.06] bg-[#050510]/95 px-4 pb-4 pt-3 md:hidden">
          <div className="space-y-1">
            {NAV.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMo(false)}
                className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm ${isActive ? "bg-white/8 text-white" : "text-white/55"}`}
              >
                {l.l}
              </NavLink>
            ))}
            {user ? (
              <button onClick={() => { logout(); nav("/"); setMo(false); }} className="block rounded-xl px-3 py-2 text-left text-sm text-white/55">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMo(false)} className="block rounded-xl px-3 py-2 text-sm text-white/55">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const links = useMemo(
    () => [
      { l: "Analyze", to: "/analyze" },
      { l: "Pricing", to: "/pricing" },
      { l: "Insights", to: "/insights" },
      { l: "Contact", to: "/contact" },
    ],
    []
  );

  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-black/20">
      <Container>
        <div className="grid gap-8 py-10 md:grid-cols-3">
          <div>
            <BrandLogo className="h-9 w-auto" />
            <p className="mt-4 max-w-sm text-sm text-muted">AI sourcing marketplace for BOM analysis, vendor discovery, RFQs, and procurement execution in one workflow.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm md:justify-self-center">
            {links.map((l) => (
              <Link key={l.l} to={l.to} className="text-white/55 transition hover:text-white">{l.l}</Link>
            ))}
          </div>
          <div className="md:justify-self-end">
            <div className="text-sm font-medium text-white">Contact</div>
            <div className="mt-2 text-sm text-muted">contact@pgihub.com</div>
          </div>
        </div>
        <div className="border-t border-white/[0.06] py-5 text-center text-[11px] text-white/35">© {new Date().getFullYear()} PGI Hub -AI Sourcing Marketplace</div>
      </Container>
    </footer>
  );
}
