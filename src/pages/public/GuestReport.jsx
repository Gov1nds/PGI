import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "../../context/LocationContext";
import { useAuth } from "../../context/AuthContext";
import { getGuestIntelligenceReport } from "../../lib/api";
import FreeReportCard from "../../components/FreeReportCard";
import VendorRedactedCard from "../../components/VendorRedactedCard";
import LockedFeatureTeaser from "../../components/LockedFeatureTeaser";
import StaleBadge from "../../components/StaleBadge";

function getCookie(name) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? m[2] : null;
}

function setCookie(name, value, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function HeroSearch({ components, setComponents, onRun, loading }) {
  const [input, setInput] = useState("");

  const addComponents = () => {
    if (!input.trim()) return;
    const items = input
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((raw_text) => ({ raw_text, qty: 1 }));
    setComponents((prev) => [...prev, ...items]);
    setInput("");
  };

  const remove = (i) => setComponents((prev) => prev.filter((_, j) => j !== i));

  return (
    <div className="hero-surface p-5 md:p-6">
      <h2 className="text-lg font-semibold text-[#0A0A0A] mb-1">
        Free Intelligence Report
      </h2>
      <p className="text-sm text-[#0A0A0A]/45 mb-4">
        Enter components to get pricing, strategy, and risk analysis — no sign-up required.
      </p>
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter components — one per line or comma-separated&#10;e.g. STM32F407, 10uF capacitor, M3 steel bolt"
          rows={3}
          className="glass-textarea flex-1 rounded-2xl px-4 py-3 text-sm resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              addComponents();
              onRun();
            }
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={addComponents}
          className="secondary-btn rounded-xl px-4 py-2 text-xs"
        >
          + Add
        </button>
        <button
          onClick={onRun}
          disabled={loading || components.length === 0}
          className="primary-btn rounded-xl px-5 py-2 text-xs font-medium disabled:opacity-40"
        >
          {loading ? "Analyzing…" : `Run Report (${components.length} item${components.length !== 1 ? "s" : ""})`}
        </button>
      </div>
      {components.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {components.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-xs text-[#0A0A0A]"
            >
              {c.raw_text}
              <button
                onClick={() => remove(i)}
                className="text-[#374151]/50 hover:underline ml-0.5"
                aria-label={`Remove ${c.raw_text}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function FreshnessFooter({ freshness }) {
  if (!freshness) return null;
  return (
    <div className="flex items-center gap-2 text-[10px] text-[#0A0A0A]/30 pt-3 border-t border-[#F0F0F0]">
      <svg className="w-3 h-3 text-[#0A0A0A]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        Data freshness: {freshness.computed_at ? new Date(freshness.computed_at).toLocaleString() : "—"}
        {freshness.sources_consulted && ` · ${freshness.sources_consulted} sources`}
      </span>
    </div>
  );
}

function VendorShortlist({ vendors }) {
  if (!vendors?.length) return null;
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-[#0A0A0A] mb-3">
        Vendor Shortlist
        <span className="ml-2 text-xs text-[#0A0A0A]/30 font-normal">
          (limited preview)
        </span>
      </h3>
      <div className="space-y-2">
        {vendors.map((v, i) => (
          <VendorRedactedCard key={v.vendor_id || i} vendor={v} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

function CTASigninPanel() {
  return (
    <div className="card p-5 border-indigo-500/15 bg-blue-50/50">
      <div className="text-sm font-semibold text-[#0A0A0A] mb-2">
        Unlock full intelligence
      </div>
      <p className="text-xs text-[#0A0A0A]/45 mb-4 leading-5">
        Sign in to access vendor contact info, detailed score breakdowns,
        RFQ dispatch, order tracking, and more.
      </p>
      <Link
        to="/register"
        className="primary-btn block text-center rounded-xl px-5 py-2.5 text-sm font-medium"
      >
        Create Free Account
      </Link>
      <p className="text-center mt-2 text-[11px] text-[#0A0A0A]/30">
        Already have an account?{" "}
        <Link to="/login" className="text-[#374151] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function GuestReport() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const { loc } = useLocation();
  const { user } = useAuth();

  // Check for previous guest search
  const [previousSearch, setPreviousSearch] = useState(null);
  useEffect(() => {
    try {
      const saved = getCookie("pgi_guest_search");
      if (saved) setPreviousSearch(JSON.parse(decodeURIComponent(saved)));
    } catch {}
  }, []);

  async function runReport() {
    if (components.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const body = {
        components: components.map((c) => c.raw_text),
        delivery_location: {
          country: loc.country,
          city: loc.city,
          country_code: loc.country_code,
        },
        currency: loc.currency,
        session_token: getCookie("pgi_guest") || undefined,
      };
      const res = await getGuestIntelligenceReport(body);
      setReport(res);

      // Save search to cookie
      try {
        setCookie(
          "pgi_guest_search",
          encodeURIComponent(JSON.stringify(components.map((c) => c.raw_text).slice(0, 5))),
          7
        );
      } catch {}
    } catch (e) {
      setError(e.message || "Failed to generate report");
    }
    setLoading(false);
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Welcome back */}
        {previousSearch && !report && (
          <div className="mb-4 card p-4 flex items-center gap-3 border-indigo-500/10">
            <span className="text-xs text-[#0A0A0A]/50">
              Welcome back — your previous search for{" "}
              <strong className="text-[#0A0A0A]/70">
                {previousSearch.slice(0, 3).join(", ")}
              </strong>{" "}
              is saved.
            </span>
            <button
              onClick={() => {
                setComponents(previousSearch.map((t) => ({ raw_text: t, qty: 1 })));
              }}
              className="text-xs text-[#374151] hover:underline shrink-0"
            >
              Restore
            </button>
          </div>
        )}

        <HeroSearch
          components={components}
          setComponents={setComponents}
          onRun={runReport}
          loading={loading}
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/15 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {report && (
          <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6 animate-fade-in">
            <div className="space-y-4">
              {report.computed_at && (
                <StaleBadge computedAt={report.computed_at} onRefresh={runReport} />
              )}

              {/* Strategy summary */}
              {report.strategy_summary && (
                <div className="card p-5 border-l-2 border-indigo-500/30">
                  <div className="text-xs text-[#374151]/60 uppercase tracking-wider mb-1">
                    Strategy Summary
                  </div>
                  <p className="text-sm text-[#0A0A0A]/80 leading-6">
                    {report.strategy_summary}
                  </p>
                </div>
              )}

              {/* Component cards */}
              {report.components?.map((c, i) => (
                <FreeReportCard
                  key={c.raw_text || i}
                  component={c}
                  strategy={report.strategy_summary}
                  currency={loc.currency}
                />
              ))}

              {/* Vendor shortlist */}
              <VendorShortlist vendors={report.vendor_shortlist} />

              {/* Freshness */}
              <FreshnessFooter freshness={report.freshness_report || { computed_at: report.computed_at }} />
            </div>

            <div className="space-y-3">
              {/* Locked features */}
              {(report.locked_features || [
                { feature: "Full Vendor Contacts", description: "Phone, email, and direct messaging with matched vendors." },
                { feature: "Score Decomposition", description: "See exactly how each vendor was scored across 8 dimensions." },
                { feature: "RFQ Dispatch", description: "Send structured RFQs to multiple vendors in one click." },
                { feature: "Quote Comparison Matrix", description: "Side-by-side TLC comparison with tariff and freight breakdown." },
                { feature: "Order Tracking", description: "12-state PO timeline with logistics and delivery confirmation." },
              ]).map((f) => (
                <LockedFeatureTeaser key={f.feature} feature={f} />
              ))}
              <CTASigninPanel />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
