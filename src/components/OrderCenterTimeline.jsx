import React from "react";

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/[0.05] text-white/50 border-white/[0.08]",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-white/[0.06] text-white/70 border-white/[0.1]",
    amber: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    blue: "bg-white/[0.06] text-white/70 border-white/[0.1]",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

function Card({ title, children, tone = "neutral" }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f14] overflow-hidden">
      <div className="border-b border-white/[0.08] px-5 py-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">{title}</h3>
        {tone ? <Badge tone={tone}>{tone}</Badge> : null}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function OrderCenterTimeline({ context, project, canViewFulfillment = true, onRefresh, onNextAction }) {
  const hasFulfillmentData = Boolean(
    context?.purchase_order ||
    (context?.shipments || []).length ||
    (context?.invoices || []).length ||
    (context?.goods_receipts || []).length ||
    context?.payment_state
  );

  if (!canViewFulfillment) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f14] p-6 text-sm text-white/70 space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/25">Fulfillment timeline</p>
        <p className="text-white">Tracking opens after a vendor is selected and the PO is issued.</p>
        <p className="text-white/35">Once the order exists, carrier milestones, customs status, goods receipt, invoices, and payment updates appear here.</p>
        {onNextAction && (
          <button onClick={onNextAction} className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400">
            Continue to order
          </button>
        )}
      </div>
    );
  }

  if (!context || !hasFulfillmentData) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f14] p-6 text-sm text-white/70 space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/25">Fulfillment timeline</p>
        <p className="text-white">No fulfillment data yet.</p>
        <p className="text-white/35">This section stays empty until the PO, shipment, receipt, and invoice lifecycle begins.</p>
        {onNextAction && (
          <button onClick={onNextAction} className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]">
            Open order tab
          </button>
        )}
      </div>
    );
  }

  const po = context.purchase_order;
  const shipments = context.shipments || [];
  const invoices = context.invoices || [];
  const receipts = context.goods_receipts || [];
  const payment = context.payment_state;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f14] p-5 text-sm text-white/75">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/25">Fulfillment context</p>
            <p className="mt-1 text-white">PO → shipment → customs → receipt → invoice → payment</p>
          </div>
          {onNextAction && (
            <button onClick={onNextAction} className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]">
              Continue workflow
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Card title="PO number" tone="blue">
          <p className="text-lg font-semibold text-white">{context.po_number || po?.po_number || "—"}</p>
          <p className="text-xs text-white/35 mt-1">Issued {fmtDate(po?.issued_at)}</p>
        </Card>
        <Card title="Vendor confirmation" tone="amber">
          <p className="text-lg font-semibold text-white">{po?.vendor_confirmation_status || "pending"}</p>
          <p className="text-xs text-white/35 mt-1">{po?.vendor_confirmation_number || "—"}</p>
        </Card>
        <Card title="Tracking number" tone="blue">
          <p className="text-lg font-semibold text-white">{context.tracking_number || shipments?.[0]?.tracking_number || "—"}</p>
          <p className="text-xs text-white/35 mt-1">{context.carrier_name || shipments?.[0]?.carrier_name || "—"}</p>
        </Card>
        <Card title="ETA" tone="blue">
          <p className="text-lg font-semibold text-white">{fmtDate(context.eta || shipments?.[0]?.eta)}</p>
          <p className="text-xs text-white/35 mt-1">Current fulfillment target</p>
        </Card>
        <Card title="Delay reason" tone="red">
          <p className="text-sm font-semibold text-white">{context.delay_reason || shipments?.[0]?.delay_reason || "—"}</p>
          <p className="text-xs text-white/35 mt-1">{context.execution_state || "—"}</p>
        </Card>
        <Card title="Receipt confirmation" tone="green">
          <p className="text-lg font-semibold text-white">{context.receipt_confirmation || receipts?.[0]?.receipt_status || "—"}</p>
          <p className="text-xs text-white/35 mt-1">{receipts?.[0]?.receipt_number || "—"}</p>
        </Card>
      </div>

      <Card title="Fulfillment timeline" tone="blue">
        <div className="space-y-4">
          {(context.timeline || []).length === 0 ? (
            <p className="text-sm text-white/35">No timeline records yet.</p>
          ) : (
            context.timeline.map((item, idx) => (
              <div key={`${item.type || item.stage}-${item.id || idx}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-white/40 mt-1" />
                  {idx < context.timeline.length - 1 && <div className="w-px flex-1 bg-white/[0.08] mt-1" />}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      {item.type ? item.type.replace(/_/g, " ") : (item.stage || "stage").replace(/_/g, " ")}
                    </p>
                    <span className="text-[11px] text-white/30">
                      {item.created_at || item.occurred_at || item.issued_at || item.confirmed_at || item.shipped_at || "—"}
                    </span>
                    {item.status && <Badge tone="amber">{item.status}</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-white/40">
                    {item.label || item.status_message || item.event_type || item.milestone_name || item.invoice_number || item.receipt_number || ""}
                  </p>

                  <div className="mt-2 rounded-xl border border-white/[0.05] bg-white/[0.04] p-3 text-xs text-white/55">
                    <pre className="whitespace-pre-wrap break-words">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="Shipment milestones" tone="blue">
          {(context.carrier_milestones || []).length === 0 ? (
            <p className="text-sm text-white/35">No carrier milestones yet.</p>
          ) : (
            <div className="space-y-3">
              {context.carrier_milestones.map((m) => (
                <div key={m.id} className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">{m.milestone_name}</p>
                    <Badge tone={m.milestone_status === "completed" ? "green" : "amber"}>{m.milestone_status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-white/35">{m.milestone_code} · {m.location || "—"}</p>
                  <p className="mt-1 text-xs text-white/40">{m.description || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Shipment events" tone="blue">
          {(context.shipment_events || []).length === 0 ? (
            <p className="text-sm text-white/35">No shipment events yet.</p>
          ) : (
            <div className="space-y-3">
              {context.shipment_events.map((e) => (
                <div key={e.id} className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">{e.event_type}</p>
                    <Badge tone="blue">{e.event_status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-white/35">{e.location || "—"} · {e.occurred_at || "—"}</p>
                  <p className="mt-1 text-xs text-white/40">{e.message || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Invoice & payment" tone="green">
          {(invoices || []).length === 0 ? (
            <p className="text-sm text-white/35">No invoice yet.</p>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">{inv.invoice_number}</p>
                    <Badge tone={inv.invoice_status === "paid" ? "green" : "amber"}>{inv.invoice_status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-white/35">
                    {inv.currency} {inv.total_amount ?? "—"} · Due {fmtDate(inv.due_date)}
                  </p>
                  {inv.payment_state && (
                    <p className="mt-1 text-xs text-white/40">
                      Payment: {inv.payment_state.status} {inv.payment_state.paid_at ? `· ${fmtDate(inv.payment_state.paid_at)}` : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.05] p-3">
            <p className="text-xs uppercase tracking-wider text-white/25 mb-2">Goods receipt</p>
            {(receipts || []).length === 0 ? (
              <p className="text-sm text-white/35">No goods receipt recorded.</p>
            ) : (
              receipts.map((r) => (
                <p key={r.id} className="text-sm text-white/70">
                  {r.receipt_number} · {r.receipt_status} · {r.received_quantity ?? "—"}
                </p>
              ))
            )}
          </div>
        </Card>
      </div>

      {onRefresh && (
        <div className="flex justify-end">
          <button
            onClick={onRefresh}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
          >
            Refresh fulfillment context
          </button>
        </div>
      )}
    </div>
  );
}