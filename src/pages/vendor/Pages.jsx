import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingState, EmptyState, StatusBadge } from "../../components/Shared";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { vendorDashboard, vendorRFQs, vendorRFQDetail, vendorSubmitQuote, vendorOrders, vendorPerformance, vendorProductionUpdate } from "../../lib/api";

/* ═══ VENDOR LOGIN ═══ */
export function VendorLogin() {
  const [e, sE] = useState(""); const [p, sP] = useState(""); const [err, sErr] = useState(""); const [l, sL] = useState(false);
  const { vendorLogin } = useVendorAuth();
  const n = useNavigate();
  const sub = async ev => {
    ev.preventDefault(); sErr(""); sL(true);
    try { await vendorLogin(e, p); n("/vendor/dashboard"); }
    catch (x) { sErr(x.message); }
    sL(false);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Vendor Portal</h1>
        <form onSubmit={sub} className="space-y-4">
          <input value={e} onChange={x=>sE(x.target.value)} type="email" placeholder="Email" required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/>
          <input value={p} onChange={x=>sP(x.target.value)} type="password" placeholder="Password" required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <button type="submit" disabled={l} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 disabled:opacity-50 text-sm">{l?"Signing in...":"Sign In"}</button>
        </form>
      </div>
    </div>
  );
}

/* ═══ VENDOR DASHBOARD ═══ */
export function VendorDashboardPage() {
  const { vendorAccessToken } = useVendorAuth();
  const [d, sD] = useState(null); const [l, sL] = useState(true);
  useEffect(() => { vendorDashboard(vendorAccessToken).then(sD).catch(()=>{}).finally(()=>sL(false)); }, [vendorAccessToken]);
  if (l) return <LoadingState />;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Dashboard</h1>
      {d && <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="kpi-card"><div className="text-2xl font-bold">{d.open_rfqs}</div><div className="text-[11px] text-zinc-500">Open RFQs</div></div>
        <div className="kpi-card"><div className="text-2xl font-bold">{d.quotes_submitted}</div><div className="text-[11px] text-zinc-500">Quotes</div></div>
        <div className="kpi-card"><div className="text-2xl font-bold">{d.active_orders}</div><div className="text-[11px] text-zinc-500">Orders</div></div>
        <div className="kpi-card"><div className="text-2xl font-bold">{d.active_shipments||0}</div><div className="text-[11px] text-zinc-500">Shipments</div></div>
      </div>}
      {d?.recent_rfqs?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recent Invitations</h2>
          <div className="space-y-1.5">{d.recent_rfqs.map(r => (
            <div key={r.id} className="card flex items-center justify-between p-3.5">
              <div className="text-sm text-white">RFQ {r.rfq_batch_id?.slice(0,8)}</div>
              <StatusBadge status={r.status}/>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

/* ═══ VENDOR RFQs (expanded quote submission) ═══ */
export function VendorRFQsPage() {
  const { vendorAccessToken } = useVendorAuth();
  const [rfqs, sR] = useState([]); const [l, sL] = useState(true);
  const [detail, sD] = useState(null);
  const [lines, sLines] = useState([]);
  const [notes, sN] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [validityDays, setValidityDays] = useState("30");
  const [sub, sSub] = useState(false);

  useEffect(() => { vendorRFQs(vendorAccessToken).then(d => sR(d.items||d||[])).catch(()=>[]).finally(()=>sL(false)); }, [vendorAccessToken]);

  const open = async rid => {
    try {
      const d = await vendorRFQDetail(rid, vendorAccessToken);
      sD(d);
      sLines((d.items||[]).map(i => ({
        rfq_item_id: i.id, part_name: i.part_key || i.part_name, quantity: Number(i.quantity),
        unit_price: "", lead_time_days: "", moq: "", tooling_cost: "", notes: ""
      })));
    } catch {}
  };

  const submit = async () => {
    if (!detail) return;
    sSub(true);
    try {
      await vendorSubmitQuote(detail.rfq_id, {
        lines: lines.map(l => ({
          ...l,
          unit_price: Number(l.unit_price) || 0,
          lead_time_days: Number(l.lead_time_days) || null,
          moq: Number(l.moq) || null
        })),
        notes, currency, validity_days: Number(validityDays) || 30
      }, vendorAccessToken);
      sD(null); sN("");
      vendorRFQs(vendorAccessToken).then(d => sR(d.items||d||[])).catch(()=>[]);
    } catch {}
    sSub(false);
  };

  const upd = (i, f, v) => sLines(p => p.map((l, j) => j === i ? { ...l, [f]: v } : l));

  if (l) return <LoadingState />;

  if (detail) {
    // Compute deadline countdown
    const deadlineMs = detail.deadline ? new Date(detail.deadline).getTime() - Date.now() : 0;
    const deadlineHours = Math.max(0, Math.floor(deadlineMs / (1000 * 60 * 60)));
    const deadlineMins = Math.max(0, Math.floor((deadlineMs % (1000 * 60 * 60)) / (1000 * 60)));

    return (
      <div className="p-6">
        <button onClick={() => sD(null)} className="text-xs text-indigo-400 mb-4">← Back</button>
        <h2 className="text-xl font-bold text-white mb-2">RFQ {detail.rfq_id?.slice(0,8)}</h2>
        <div className="flex items-center gap-3 mb-4">
          <StatusBadge status={detail.status}/>
          {detail.deadline && <span className="text-[11px] text-zinc-500">Deadline: {detail.deadline.slice(0,16)} ({deadlineHours}h {deadlineMins}m remaining)</span>}
        </div>
        {detail.terms_snapshot && <div className="card p-4 mb-4"><h3 className="text-xs font-semibold text-zinc-500 mb-2">Terms</h3><pre className="text-[11px] text-zinc-400 whitespace-pre-wrap">{JSON.stringify(detail.terms_snapshot, null, 2)}</pre></div>}
        {detail.notes && <p className="text-sm text-zinc-400 mb-4">{detail.notes}</p>}

        {detail.quote_history?.length > 0 && (
          <div className="card p-4 mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">Previous Quotes</h3>
            {detail.quote_history.map(q => (
              <div key={q.id} className="flex items-center justify-between py-1">
                <span className="text-[11px] text-zinc-400">v{q.version}</span>
                <span className="text-xs text-zinc-300 font-mono">{q.total?`$${Number(q.total).toLocaleString()}`:"-"}</span>
                <StatusBadge status={q.status}/>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-sm font-semibold text-white mb-3">Submit Quote</h3>
        <div className="space-y-2 mb-4">
          {lines.map((ln, i) => (
            <div key={i} className="card p-3">
              <div className="text-sm text-zinc-300 mb-2">{ln.part_name} <span className="text-zinc-600">Qty: {ln.quantity}</span></div>
              <div className="grid grid-cols-3 gap-2">
                <input value={ln.unit_price} onChange={e => upd(i, "unit_price", e.target.value)} placeholder="Unit price" className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white placeholder:text-zinc-600"/>
                <input value={ln.lead_time_days} onChange={e => upd(i, "lead_time_days", e.target.value)} placeholder="Lead days" className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white placeholder:text-zinc-600"/>
                <input value={ln.moq} onChange={e => upd(i, "moq", e.target.value)} placeholder="MOQ" className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white placeholder:text-zinc-600"/>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <input value={ln.tooling_cost||""} onChange={e => upd(i, "tooling_cost", e.target.value)} placeholder="Tooling cost" className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white placeholder:text-zinc-600"/>
                <input value={ln.notes||""} onChange={e => upd(i, "notes", e.target.value)} placeholder="Notes for this line" className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white placeholder:text-zinc-600"/>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-white">
              {["USD","EUR","INR","CNY","JPY","GBP"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Validity (days)</label>
            <input value={validityDays} onChange={e => setValidityDays(e.target.value)} className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-white" />
          </div>
        </div>

        <textarea value={notes} onChange={e => sN(e.target.value)} placeholder="Notes..." rows={2} className="w-full px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 mb-4 resize-none"/>
        <button onClick={submit} disabled={sub} className="px-6 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-500 disabled:opacity-50 font-medium">{sub ? "Submitting..." : "Submit Quote"}</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">RFQ Inbox</h1>
      {rfqs.length === 0 ? <EmptyState title="No RFQs"/> :
        <div className="space-y-1.5">{rfqs.map(r => (
          <button key={r.invitation_id||r.id} onClick={() => open(r.rfq_id)} className="w-full text-left card flex items-center justify-between p-4 hover:border-white/10 transition">
            <div>
              <div className="text-sm text-white">RFQ {r.rfq_id?.slice(0,8)}</div>
              <div className="text-[11px] text-zinc-600">{r.item_count} items · {r.invited_at?.slice(0,10)}</div>
            </div>
            <StatusBadge status={r.status}/>
          </button>
        ))}</div>
      }
    </div>
  );
}

/* ═══ VENDOR ORDERS (with production updates — Task 15) ═══ */
export function VendorOrdersPage() {
  const { vendorAccessToken } = useVendorAuth();
  const [o, sO] = useState([]); const [l, sL] = useState(true);
  const [updateFor, setUpdateFor] = useState(null);
  const [updateText, setUpdateText] = useState("");
  const [updatePct, setUpdatePct] = useState("");
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  useEffect(() => { vendorOrders(vendorAccessToken).then(d => sO(d.items||d||[])).catch(()=>[]).finally(()=>sL(false)); }, [vendorAccessToken]);

  const submitUpdate = async () => {
    if (!updateFor) return;
    setSubmittingUpdate(true);
    try {
      await vendorProductionUpdate(updateFor, {
        update_text: updateText,
        percent_complete: Number(updatePct) || 0,
      }, vendorAccessToken);
      setUpdateFor(null); setUpdateText(""); setUpdatePct("");
    } catch {}
    setSubmittingUpdate(false);
  };

  if (l) return <LoadingState />;
  return (
    <div className="p-6"><h1 className="text-xl font-bold text-white mb-6">Orders</h1>
      {o.length===0?<EmptyState title="No orders"/>:
        <div className="space-y-2">{o.map(x=>(
          <div key={x.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div><div className="text-sm text-white">{x.po_number||x.id.slice(0,8)}</div><div className="text-[11px] text-zinc-600">{x.total?`$${Number(x.total).toLocaleString()}`:""}</div></div>
              <div className="flex items-center gap-2">
                <StatusBadge status={x.status}/>
                <button onClick={() => setUpdateFor(updateFor === x.id ? null : x.id)} className="text-[10px] text-indigo-400 hover:text-indigo-300">
                  {updateFor === x.id ? "Cancel" : "Update"}
                </button>
              </div>
            </div>
            {updateFor === x.id && (
              <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-2">
                <div className="text-xs font-medium text-white/60 mb-1">Production Update</div>
                <textarea value={updateText} onChange={e => setUpdateText(e.target.value)} rows={2} placeholder="Progress update..." className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-zinc-600 resize-none" />
                <div className="flex gap-2">
                  <input value={updatePct} onChange={e => setUpdatePct(e.target.value)} type="number" min="0" max="100" placeholder="% complete" className="w-24 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded text-xs text-white" />
                  <button onClick={submitUpdate} disabled={submittingUpdate} className="px-4 py-1.5 bg-indigo-600 text-white text-xs rounded-lg disabled:opacity-50">
                    {submittingUpdate ? "Sending..." : "Submit Update"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}</div>
      }
    </div>
  );
}

/* ═══ VENDOR PERFORMANCE ═══ */
export function VendorPerformancePage() {
  const { vendorAccessToken } = useVendorAuth();
  const [d, sD] = useState(null); const [l, sL] = useState(true);
  useEffect(() => { vendorPerformance(vendorAccessToken).then(sD).catch(()=>{}).finally(()=>sL(false)); }, [vendorAccessToken]);
  if (l) return <LoadingState />;
  return (
    <div className="p-6"><h1 className="text-xl font-bold text-white mb-6">Performance</h1>
      {d ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="kpi-card"><div className="text-2xl font-bold">{d.total_quotes}</div><div className="text-[11px] text-zinc-500">Quotes</div></div>
        <div className="kpi-card"><div className="text-2xl font-bold">{d.total_orders}</div><div className="text-[11px] text-zinc-500">Orders</div></div>
        <div className="kpi-card"><div className="text-2xl font-bold">{d.completed_orders}</div><div className="text-[11px] text-zinc-500">Completed</div></div>
        <div className="kpi-card"><div className="text-2xl font-bold">{d.completion_rate}%</div><div className="text-[11px] text-zinc-500">Rate</div></div>
      </div> : <EmptyState title="No data"/>}
    </div>
  );
}
