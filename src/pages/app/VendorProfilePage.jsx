import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiCall } from "../../lib/api";
import { LoadingState, ErrorState, StatusBadge, ScoreBar } from "../../components/Shared";
import StaleBadge from "../../components/StaleBadge";

const TABS = ["Capabilities", "Certifications", "Commercial Terms", "Performance", "Transactions"];

function VendorHeader({ vendor, onAction }) {
  const completion = vendor.profile_completion_pct || 0;
  return (
    <div className="card p-5 mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{vendor.name}</h1>
            {vendor.verified && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/15 text-[10px] text-emerald-300 font-medium">
                ✓ Verified
              </span>
            )}
            <StatusBadge status={vendor.status || "STANDARD"} />
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
            <span>{vendor.country || "—"}</span>
            {vendor.region && <span>· {vendor.region}</span>}
            {vendor.commodity_groups?.length > 0 && (
              <span>· {vendor.commodity_groups.join(", ")}</span>
            )}
          </div>
          {vendor.overall_score != null && (
            <div className="mt-3">
              <ScoreBar score={vendor.overall_score} label="Overall Score" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <div className="text-[11px] text-white/30">{completion}% complete</div>
            <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${completion}%` }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAction?.("rfq")} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 font-medium">
              Send RFQ
            </button>
            <button onClick={() => onAction?.("chat")} className="px-3 py-2 bg-white/[0.04] text-white text-xs rounded-lg border border-white/[0.06] hover:bg-white/[0.07]">
              Start Chat
            </button>
            <button onClick={() => onAction?.("prefer")} className="px-3 py-2 bg-white/[0.04] text-white/60 text-xs rounded-lg border border-white/[0.06] hover:bg-white/[0.07]">
              + Preferred
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CapabilitiesTab({ data }) {
  return (
    <div className="space-y-4">
      {data?.capabilities && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Manufacturing Capabilities</h3>
          <p className="text-sm text-white/60 leading-6">{data.capabilities}</p>
        </div>
      )}
      {data?.equipment?.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Equipment</h3>
          <div className="flex flex-wrap gap-1.5">
            {data.equipment.map((e, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-white/50">{e}</span>
            ))}
          </div>
        </div>
      )}
      {data?.capacity && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Capacity</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(data.capacity).map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] text-white/25 uppercase tracking-wider">{k.replace(/_/g, " ")}</div>
                <div className="text-sm font-medium text-white mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CertificationsTab({ data }) {
  const certs = data?.certifications || [];
  if (!certs.length) return <div className="text-xs text-white/30 py-6 text-center">No certifications on file.</div>;
  return (
    <div className="space-y-2">
      {certs.map((c, i) => (
        <div key={i} className="card flex items-center justify-between p-4">
          <div>
            <div className="text-sm font-medium text-white">{c.name || c.type}</div>
            <div className="text-[11px] text-white/30 mt-0.5">
              {c.issued_date && `Issued: ${c.issued_date.slice(0, 10)}`}
              {c.expiry_date && ` · Expires: ${c.expiry_date.slice(0, 10)}`}
            </div>
          </div>
          <StatusBadge status={c.status || "active"} />
        </div>
      ))}
    </div>
  );
}

function CommercialTab({ data }) {
  const terms = data?.commercial_terms || {};
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-white mb-3">Commercial Terms</h3>
      <div className="space-y-2">
        {Object.entries(terms).map(([k, v]) => (
          <div key={k} className="flex justify-between py-1.5 border-b border-white/[0.03]">
            <span className="text-xs text-white/40 capitalize">{k.replace(/_/g, " ")}</span>
            <span className="text-xs text-white/70">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceTab({ data }) {
  const scores = data?.score_decomposition || {};
  const history = data?.score_history || [];
  return (
    <div className="space-y-4">
      {Object.keys(scores).length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Score Decomposition</h3>
          <div className="space-y-2">
            {Object.entries(scores).map(([k, v]) => (
              <ScoreBar key={k} score={v} label={k.replace(/_/g, " ")} />
            ))}
          </div>
        </div>
      )}
      {history.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Score History</h3>
          <div className="space-y-1">
            {history.slice(0, 10).map((h, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-white/[0.03] text-xs">
                <span className="text-white/40">{h.date?.slice(0, 10)}</span>
                <span className="text-white/70">{Math.round((h.score || 0) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionsTab({ data }) {
  const txns = data?.transactions || [];
  if (!txns.length) return <div className="text-xs text-white/30 py-6 text-center">No transaction history.</div>;
  return (
    <div className="space-y-1.5">
      {txns.map((t, i) => (
        <div key={i} className="card flex items-center justify-between p-3.5">
          <div>
            <div className="text-sm text-white">{t.type || "Order"} — {t.reference || t.po_number || "—"}</div>
            <div className="text-[11px] text-white/30">{t.date?.slice(0, 10)} · {t.total ? `$${Number(t.total).toLocaleString()}` : ""}</div>
          </div>
          <StatusBadge status={t.status || "completed"} />
        </div>
      ))}
    </div>
  );
}

export default function VendorProfilePage() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [v, intel] = await Promise.all([
          apiCall(`/api/v1/vendors/${id}`, {}, accessToken),
          apiCall(`/api/v1/vendors/${id}/intelligence`, {}, accessToken).catch(() => null),
        ]);
        setVendor(v);
        setIntelligence(intel);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    })();
  }, [id, accessToken]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!vendor) return <ErrorState message="Vendor not found" />;

  const combined = { ...vendor, ...(intelligence || {}) };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <VendorHeader vendor={combined} />
      {intelligence?.computed_at && <StaleBadge computedAt={intelligence.computed_at} />}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} className={`tab-chip whitespace-nowrap ${activeTab === i ? "active" : ""}`}>
            {t}
          </button>
        ))}
      </div>
      {activeTab === 0 && <CapabilitiesTab data={combined} />}
      {activeTab === 1 && <CertificationsTab data={combined} />}
      {activeTab === 2 && <CommercialTab data={combined} />}
      {activeTab === 3 && <PerformanceTab data={combined} />}
      {activeTab === 4 && <TransactionsTab data={combined} />}
    </div>
  );
}
