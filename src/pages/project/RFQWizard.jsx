import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBOMLines, listVendors, createRFQ } from "../../lib/api";

const STEPS = ["Select Vendors", "Select Lines", "Set Terms", "Review & Send"];

function StepIndicator({ current, steps }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition ${
              i === current
                ? "bg-[#0A0A0A] text-white"
                : i < current
                ? "bg-emerald-500/20 text-emerald-600 border border-emerald-200"
                : "bg-[#FAFAFA] text-[#0A0A0A]/25 border border-[#E5E5E5]"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </div>
          <span className={`text-xs hidden sm:inline ${i === current ? "text-[#0A0A0A]" : "text-[#0A0A0A]/30"}`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px ${i < current ? "bg-emerald-500/30" : "bg-[#F5F5F5]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* Step 1: Vendor selection */
function VendorSelector({ selected, setSelected, projectId, accessToken }) {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listVendors(search, accessToken)
      .then((d) => setVendors(d.items || d || []))
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [search, accessToken]);

  const toggle = (v) => {
    setSelected((prev) =>
      prev.find((s) => s.id === v.id) ? prev.filter((s) => s.id !== v.id) : [...prev, v]
    );
  };

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search vendors..."
        className="w-full max-w-md px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg text-sm text-[#0A0A0A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0A0A0A] mb-4"
      />
      <p className="text-xs text-[#0A0A0A]/30 mb-3">
        Select at least 3 vendors per line. Selected: <strong className="text-[#0A0A0A]/60">{selected.length}</strong>
      </p>
      {loading ? (
        <div className="text-xs text-[#0A0A0A]/30 py-4">Loading vendors…</div>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {vendors.map((v) => {
            const isSelected = selected.find((s) => (s.id || s.vendor_id) === (v.id || v.vendor_id));
            return (
              <button
                key={v.id || v.vendor_id}
                onClick={() => toggle(v)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  isSelected ? "border-indigo-500/30 bg-indigo-500/[0.05]" : "card hover:border-[#E5E5E5]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#0A0A0A]">{v.name}</span>
                    <span className="text-[11px] text-[#0A0A0A]/30 ml-2">{v.country || ""}</span>
                  </div>
                  {isSelected && <span className="text-emerald-600 text-xs">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Step 2: Line selection */
function LineSelector({ selected, setSelected, projectId, accessToken }) {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBOMLines(projectId, accessToken, null, 200)
      .then((d) => {
        const items = d.items || d || [];
        setLines(items);
        setSelected(items.filter((l) => l.status === "SCORED" || l.status === "RFQ_PENDING"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, accessToken]);

  const toggle = (line) => {
    setSelected((prev) =>
      prev.find((s) => s.bom_line_id === line.bom_line_id)
        ? prev.filter((s) => s.bom_line_id !== line.bom_line_id)
        : [...prev, line]
    );
  };

  const total = selected.reduce(
    (s, l) => s + (l.cost_estimate?.total_cost_mid || 0),
    0
  );

  if (loading) return <div className="text-xs text-[#0A0A0A]/30 py-4">Loading BOM lines…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[#0A0A0A]/30">
          {selected.length} lines selected · Est. value: <strong className="text-[#0A0A0A]/60">${total.toLocaleString()}</strong>
        </p>
        <button
          onClick={() => setSelected(lines)}
          className="text-[11px] text-[#374151] hover:underline"
        >
          Select All
        </button>
      </div>
      <div className="space-y-1 max-h-72 overflow-y-auto">
        {lines.map((l) => {
          const isSelected = selected.find((s) => s.bom_line_id === l.bom_line_id);
          return (
            <button
              key={l.bom_line_id || l.id}
              onClick={() => toggle(l)}
              className={`w-full text-left p-2.5 rounded-lg border transition text-xs ${
                isSelected ? "border-[#D4D4D4] bg-blue-50/50" : "border-[#F0F0F0] hover:border-[#E5E5E5]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[#0A0A0A]/80 truncate">{l.part_name || l.raw_text || l.description}</span>
                <span className="text-[#0A0A0A]/30 font-mono ml-2">Qty {l.quantity}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Step 3: Terms */
function TermsEditor({ terms, setTerms }) {
  const upd = (k, v) => setTerms((prev) => ({ ...prev, [k]: v }));
  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="text-[11px] text-[#0A0A0A]/40 block mb-1">Response Deadline</label>
        <input
          type="datetime-local"
          value={terms.deadline || ""}
          onChange={(e) => upd("deadline", e.target.value)}
          className="glass-input rounded-lg px-3 py-2 text-sm w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] text-[#0A0A0A]/40 block mb-1">Incoterm</label>
          <select value={terms.incoterm || "CIF"} onChange={(e) => upd("incoterm", e.target.value)} className="glass-input rounded-lg px-3 py-2 text-sm w-full">
            {["EXW","FCA","CPT","CIP","DAP","DPU","DDP","FAS","FOB","CFR","CIF"].map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] text-[#0A0A0A]/40 block mb-1">Payment Terms</label>
          <select value={terms.payment_terms || "net_30"} onChange={(e) => upd("payment_terms", e.target.value)} className="glass-input rounded-lg px-3 py-2 text-sm w-full">
            {["net_15","net_30","net_45","net_60","net_90","advance","cad","lc"].map((p) => <option key={p} value={p}>{p.replace(/_/g, " ").toUpperCase()}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={terms.nda_required || false}
            onChange={(e) => upd("nda_required", e.target.checked)}
            className="rounded border-[#E5E5E5] bg-[#FAFAFA]"
          />
          <span className="text-xs text-[#0A0A0A]/60">Require NDA</span>
        </label>
      </div>
      <div>
        <label className="text-[11px] text-[#0A0A0A]/40 block mb-1">Additional Notes</label>
        <textarea
          value={terms.notes || ""}
          onChange={(e) => upd("notes", e.target.value)}
          rows={3}
          className="glass-textarea rounded-lg px-3 py-2 text-sm w-full resize-none"
          placeholder="Shipping requirements, quality standards, etc."
        />
      </div>
    </div>
  );
}

/* Main Wizard */
export default function RFQWizard() {
  const { id: projectId } = useParams();
  const { accessToken } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [lines, setLines] = useState([]);
  const [terms, setTerms] = useState({ incoterm: "CIF", payment_terms: "net_30", nda_required: false });
  const [dispatching, setDispatching] = useState(false);
  const [error, setError] = useState(null);

  const canNext = () => {
    if (step === 0) return vendors.length >= 3;
    if (step === 1) return lines.length > 0;
    if (step === 2) return !!terms.deadline;
    return true;
  };

  const dispatch = async () => {
    setDispatching(true);
    setError(null);
    try {
      const payload = {
        vendor_ids: vendors.map((v) => v.id || v.vendor_id),
        line_ids: lines.map((l) => l.bom_line_id || l.id),
        terms: {
          deadline: terms.deadline,
          incoterm: terms.incoterm,
          payment_terms: terms.payment_terms,
          nda_required: terms.nda_required,
          notes: terms.notes,
        },
      };
      const result = await createRFQ(projectId, payload, accessToken);
      nav(`/project/${projectId}/compare`);
    } catch (e) {
      setError(e.message);
    }
    setDispatching(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Create RFQ</h2>
      <p className="text-xs text-[#0A0A0A]/35 mb-6">Configure and dispatch a request for quotation to vendors.</p>

      <StepIndicator current={step} steps={STEPS} />

      <div className="card p-5 min-h-[300px]">
        {step === 0 && <VendorSelector selected={vendors} setSelected={setVendors} projectId={projectId} accessToken={accessToken} />}
        {step === 1 && <LineSelector selected={lines} setSelected={setLines} projectId={projectId} accessToken={accessToken} />}
        {step === 2 && <TermsEditor terms={terms} setTerms={setTerms} />}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#0A0A0A]">Review</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#F0F0F0]">
                <div className="text-[10px] uppercase tracking-wider text-[#0A0A0A]/25 mb-1">Vendors</div>
                <div className="text-lg font-bold text-[#0A0A0A]">{vendors.length}</div>
                <div className="text-[11px] text-[#0A0A0A]/30 mt-1">{vendors.slice(0, 3).map((v) => v.name).join(", ")}{vendors.length > 3 ? "…" : ""}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#F0F0F0]">
                <div className="text-[10px] uppercase tracking-wider text-[#0A0A0A]/25 mb-1">Lines</div>
                <div className="text-lg font-bold text-[#0A0A0A]">{lines.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#F0F0F0]">
                <div className="text-[10px] uppercase tracking-wider text-[#0A0A0A]/25 mb-1">Deadline</div>
                <div className="text-sm font-medium text-[#0A0A0A]">{terms.deadline ? new Date(terms.deadline).toLocaleDateString() : "—"}</div>
                <div className="text-[11px] text-[#0A0A0A]/30 mt-1">{terms.incoterm} · {terms.payment_terms}</div>
              </div>
            </div>
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-xs text-[#0A0A0A]/50 hover:text-[#0A0A0A] disabled:opacity-30 transition"
        >
          ← Back
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="primary-btn rounded-xl px-5 py-2 text-xs font-medium disabled:opacity-40"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={dispatch}
            disabled={dispatching}
            className="primary-btn rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {dispatching ? "Dispatching…" : "Dispatch RFQ"}
          </button>
        )}
      </div>
    </div>
  );
}
