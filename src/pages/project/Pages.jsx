import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { LoadingState, ErrorState, EmptyState, StatusBadge, ScoreBar, BOMCategoryGroup } from "../../components/Shared";
import { useAuth } from "../../context/AuthContext";
import { useRealTime } from "../../hooks/useRealTime";
import StaleBadge from "../../components/StaleBadge";
import Pagination from "../../components/Pagination";
import { BOMStatusTabs, BOMGroupBy, BOMBulkBar, AttentionQueue } from "../../components/bom/BOMDashboard";
import VendorShortlistTable from "../../components/bom/VendorShortlistTable";
import POTimeline from "../../components/orders/POTimeline";
import {
  getProject, getBOMLines, getBOMLineRecommendations,
  matchVendors, listProjectRFQs, createRFQ, getComparisonMatrix,
  acceptQuote, rejectQuote, listProjectPOs, createPurchaseOrder,
  decideApproval, getProjectShipments, getProjectAnalytics,
  getProjectEvents, getWeightProfile, setWeightProfile,
  getChatThreads, createChatThread, getChatMessages, sendChatMessage,
  bulkBOMAction, getBOMAttentionQueue
} from "../../lib/api";

/* ═══ OVERVIEW (Enhanced: BOM dashboard with tabs, bulk, attention queue, vendor shortlist) ═══ */
export function ProjectOverview() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [project, setProject] = useState(null);
  const [bomLines, setBomLines] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [groupBy, setGroupBy] = useState("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [expandedLine, setExpandedLine] = useState(null);
  const [attentionItems, setAttentionItems] = useState([]);

  const fetchProject = useCallback(async () => {
    try { setProject(await getProject(id, accessToken)); } catch (e) { setError(e); }
  }, [id, accessToken]);

  const fetchLines = useCallback(async (cursor) => {
    try {
      const d = await getBOMLines(id, accessToken, cursor, 50, statusFilter);
      setBomLines(d.items || d || []);
      setPagination(d.pagination);
    } catch {}
    setLoading(false);
  }, [id, accessToken, statusFilter]);

  useEffect(() => { fetchProject(); fetchLines(); }, [fetchProject, fetchLines]);
  useEffect(() => {
    getBOMAttentionQueue(id, accessToken).then(d => setAttentionItems(d.items || d || [])).catch(() => {});
  }, [id, accessToken]);

  useRealTime("bom_line.status_changed", useCallback((data) => {
    if (data.project_id === id) fetchLines();
  }, [id, fetchLines]));

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => { fetchProject(); fetchLines(); }} />;
  const p = project || {};
  const bom = p.bom_summary || {};

  // Count statuses for tabs
  const statusCounts = useMemo(() => {
    const counts = {};
    bomLines.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
    return counts;
  }, [bomLines]);

  const toggleSelect = (lineId) => setSelected(prev => {
    const next = new Set(prev);
    next.has(lineId) ? next.delete(lineId) : next.add(lineId);
    return next;
  });

  const selectAll = () => setSelected(new Set(bomLines.map(l => l.bom_line_id || l.id)));

  const handleBulk = async (action) => {
    try {
      await bulkBOMAction(id, [...selected], action, {}, accessToken);
      setSelected(new Set());
      fetchLines();
    } catch {}
  };

  // Group lines
  const grouped = useMemo(() => {
    if (groupBy === "none") return null;
    const map = {};
    bomLines.forEach(l => {
      const key = groupBy === "category" ? (l.category || "Uncategorized")
        : groupBy === "vendor" ? (l.matched_vendor_name || "Unassigned")
        : groupBy === "lead_time_risk" ? (l.lead_time_risk || "Unknown")
        : (l.tags?.[0] || "Untagged");
      if (!map[key]) map[key] = [];
      map[key].push(l);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [bomLines, groupBy]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-[#0A0A0A]">{p.name}</h1><div className="flex items-center gap-2 mt-1"><StatusBadge status={p.status} /><span className="text-[11px] text-[#6B7280]">{bom.total_lines || p.total_parts || bomLines.length} parts</span></div></div>
        <div className="flex gap-2"><Link to={`/project/${id}/vendors`} className="px-4 py-2 bg-[#0A0A0A] text-white text-xs rounded-lg hover:bg-[#1A1A1A] font-medium">Match Vendors</Link><Link to={`/project/${id}/rfq`} className="px-4 py-2 bg-[#FAFAFA] text-[#0A0A0A] text-xs rounded-lg border border-[#E5E5E5] hover:bg-[#F5F5F5]">Send RFQ</Link></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="kpi-card"><div className="text-xl font-bold">{bom.total_lines || p.total_parts || bomLines.length}</div><div className="text-[11px] text-[#6B7280]">Total Lines</div></div>
        <div className="kpi-card"><div className="text-xl font-bold">{bom.scored_count || statusCounts.SCORED || 0}</div><div className="text-[11px] text-[#6B7280]">Scored</div></div>
        <div className="kpi-card"><div className="text-xl font-bold">{bom.needs_review_count || statusCounts.NEEDS_REVIEW || 0}</div><div className="text-[11px] text-[#6B7280]">Needs Review</div></div>
        <div className="kpi-card"><div className="text-xl font-bold">{(statusCounts.NORMALIZING||0)+(statusCounts.ENRICHING||0)+(statusCounts.SCORING||0)}</div><div className="text-[11px] text-[#6B7280]">In Progress</div></div>
        <div className="kpi-card"><div className="text-xl font-bold">{statusCounts.ERROR || 0}</div><div className="text-[11px] text-[#6B7280]">Errors</div></div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          {/* Tabs + controls */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <BOMStatusTabs activeFilter={statusFilter} onChange={(v) => { setStatusFilter(v); setLoading(true); }} counts={statusCounts} />
            <div className="flex items-center gap-2">
              <BOMGroupBy value={groupBy} onChange={setGroupBy} />
              <button onClick={selectAll} className="text-[11px] text-[#374151] hover:underline">Select All</button>
            </div>
          </div>

          {/* BOM Lines */}
          <div className="space-y-1.5">
            {(grouped ? grouped.flatMap(([group, items]) => [
              <div key={`g-${group}`} className="text-xs font-semibold text-[#0A0A0A]/30 uppercase tracking-wider pt-3 pb-1 flex items-center gap-2">
                <span>{group}</span><span className="text-[#0A0A0A]/15">({items.length})</span>
              </div>,
              ...items.map(line => renderBOMLine(line))
            ]) : bomLines.map(line => renderBOMLine(line)))}
          </div>
          <Pagination pagination={pagination} onPageChange={fetchLines} currentCount={bomLines.length} />
          <BOMBulkBar selectedCount={selected.size} totalInTab={bomLines.length} onAction={handleBulk} />
        </div>

        {/* Attention Queue (left sidebar on desktop) */}
        <AttentionQueue items={attentionItems} onItemClick={(item) => setExpandedLine(item.bom_line_id || item.id)} />
      </div>

      {/* Expanded vendor shortlist */}
      {expandedLine && (
        <div className="card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#0A0A0A]">Vendor Shortlist</h3>
            <button onClick={() => setExpandedLine(null)} className="text-xs text-[#0A0A0A]/30 hover:text-[#0A0A0A]/60">✕ Close</button>
          </div>
          <VendorShortlistTable lineId={expandedLine} projectId={id} />
        </div>
      )}
    </div>
  );

  function renderBOMLine(line) {
    const lineId = line.bom_line_id || line.id;
    const isSelected = selected.has(lineId);
    return (
      <div key={lineId} className={`card p-3.5 transition ${isSelected ? "border-[#D4D4D4] bg-indigo-500/[0.02]" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(lineId)} className="rounded border-[#E5E5E5] bg-[#FAFAFA]" aria-label={`Select ${line.part_name || line.raw_text}`} />
            <button onClick={() => setExpandedLine(expandedLine === lineId ? null : lineId)} className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#0A0A0A] truncate">{line.part_name || line.raw_text || line.description}</span>
                <StatusBadge status={line.status} />
              </div>
              <div className="text-[11px] text-[#6B7280] mt-0.5">
                {line.category && <span className="capitalize">{line.category}</span>}
                {line.quantity && <span> · Qty {line.quantity}</span>}
                {line.normalization_confidence != null && <span> · Conf: {(line.normalization_confidence*100).toFixed(0)}%</span>}
              </div>
            </button>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {line.is_processing && <div className="h-3 w-3 animate-spin rounded-full border border-[#0A0A0A]/30 border-t-indigo-400" />}
            {line.processing_stage && <span className="text-[10px] text-amber-600">{line.processing_stage}</span>}
            {line.status === "NEEDS_REVIEW" && <span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">Review</span>}
            <button onClick={() => setExpandedLine(expandedLine === lineId ? null : lineId)} className="text-[10px] text-[#0A0A0A] hover:text-[#374151]">
              {expandedLine === lineId ? "▾" : "▸"} Vendors
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/* ═══ STRATEGY ═══ */
export function ProjectStrategy() {
  const { id } = useParams(); const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { getWeightProfile(id, accessToken).then(setProfile).catch(()=>{}).finally(()=>setLoading(false)); }, [id, accessToken]);
  const PROFILES = ["balanced","cost_first","speed_first","quality_first"];
  const changeProfile = async (p) => { try { await setWeightProfile(id, { profile: p }, accessToken); setProfile({ ...profile, profile: p }); } catch {} };
  if (loading) return <LoadingState />;
  return (<div className="p-6"><h2 className="text-xl font-bold text-[#0A0A0A] mb-6">Sourcing Strategy</h2><div className="card p-5 mb-6"><h3 className="text-sm font-semibold text-[#0A0A0A] mb-3">Weight Profile</h3><div className="flex flex-wrap gap-2">{PROFILES.map(p => (<button key={p} onClick={() => changeProfile(p)} className={`tab-chip capitalize ${profile?.profile === p ? "active" : ""}`}>{p.replace("_"," ")}</button>))}</div>{profile?.weights && <div className="mt-4 space-y-2">{Object.entries(profile.weights).map(([k,v]) => <ScoreBar key={k} label={k.replace(/_/g," ")} score={v} />)}</div>}</div>{!profile && <EmptyState title="No strategy data" description="Run vendor matching to generate strategy insights" />}</div>);
}

/* ═══ VENDORS ═══ */
export function ProjectVendors() {
  const { id } = useParams(); const { accessToken } = useAuth();
  const [m, sM] = useState(null); const [l, sL] = useState(false); const [e, sE] = useState("");
  const run = async () => { sL(true); sE(""); try { sM(await matchVendors(id, accessToken)); } catch (x) { sE(x.message); } sL(false); };
  return (<div className="p-6"><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-[#0A0A0A]">Vendor Matching</h2><button onClick={run} disabled={l} className="px-4 py-2 bg-[#0A0A0A] text-white text-xs rounded-lg hover:bg-[#1A1A1A] disabled:opacity-50 font-medium">{l?"Matching...":"Run Match"}</button></div>{e&&<ErrorState message={e} onRetry={run}/>}{m&&<div className="space-y-3"><p className="text-[11px] text-[#6B7280]">{m.total_considered} vendors evaluated</p>{(m.matches||[]).map(v=>(<div key={v.vendor_id} className="card p-5"><div className="flex items-center justify-between mb-3"><div><span className="text-xs text-[#0A0A0A] font-bold mr-2">#{v.rank}</span><span className="text-sm font-semibold text-[#0A0A0A]">{v.vendor_name}</span></div><div className="text-right"><span className="text-lg font-bold text-[#0A0A0A]">{(v.total_score*100).toFixed(0)}%</span></div></div><div className="space-y-1.5">{Object.entries(v.breakdown||{}).map(([k,s])=><ScoreBar key={k} label={k.replace(/_/g," ")} score={s}/>)}</div><p className="text-[11px] text-[#6B7280] mt-3">{v.explanation}</p></div>))}</div>}{!m&&!l&&<EmptyState title="Run vendor match to find suppliers"/>}</div>);
}

/* ═══ RFQ (with creation wizard) ═══ */
export function ProjectRFQ() {
  const { id } = useParams();
  // Delegate to full RFQ Wizard (Task 7)
  const RFQWizard = useState(null)[0] || null;
  return (
    <div>
      <RFQWizardLazy projectId={id} />
    </div>
  );
}

// Lazy-load the full wizard
function RFQWizardLazy({ projectId }) {
  const [Wizard, setWizard] = useState(null);
  useEffect(() => {
    import("./RFQWizard").then(m => setWizard(() => m.default));
  }, []);
  if (!Wizard) return <LoadingState />;
  return <Wizard />;
}

/* ═══ COMPARE (full quote matrix — Task 8-9) ═══ */
export function ProjectCompare() {
  const [Matrix, setMatrix] = useState(null);
  useEffect(() => {
    import("./QuoteMatrix").then(m => setMatrix(() => m.default));
  }, []);
  if (!Matrix) return <LoadingState />;
  return <Matrix />;
}

/* ═══ CHAT (WebSocket + offer composer — Task 11) ═══ */
export function ProjectChat() {
  const { id } = useParams();
  const [ChatPage, setChatPage] = useState(null);
  useEffect(() => {
    import("./ChatPage").then(m => setChatPage(() => m.default));
  }, []);
  if (!ChatPage) return <LoadingState />;
  return <ChatPage projectId={id} />;
}

/* ═══ ORDERS (with PO creation + approval + timeline — Task 10) ═══ */
export function ProjectOrders() {
  const { id } = useParams(); const { accessToken, user } = useAuth();
  const [pos, setPOs] = useState([]); const [l, sL] = useState(true);
  const [showCreate, setShowCreate] = useState(false); const [creating, setCreating] = useState(false);
  const [expandedPO, setExpandedPO] = useState(null);

  const fetchPOs = useCallback(async () => { try { const d = await listProjectPOs(id, accessToken); setPOs(d.items||d||[]); } catch {} sL(false); }, [id, accessToken]);
  useEffect(() => { fetchPOs(); }, [fetchPOs]);

  const handleCreate = async () => {
    setCreating(true);
    try { await createPurchaseOrder(id, { delivery_terms: "CIF", payment_terms: "net_30" }, accessToken); setShowCreate(false); fetchPOs(); } catch {}
    setCreating(false);
  };

  const handleApproval = async (approvalId, decision) => {
    try { await decideApproval(approvalId, { decision, notes: "" }, accessToken); fetchPOs(); } catch {};
  };

  if (l) return <LoadingState />;
  return (<div className="p-6">
    <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-[#0A0A0A]">Purchase Orders</h2>{user?.permissions?.can_create_po !== false && <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-[#0A0A0A] text-white text-xs rounded-lg font-medium">Create PO</button>}</div>
    {showCreate && (<div className="card p-5 mb-6"><h3 className="text-sm font-semibold text-[#0A0A0A] mb-3">Create Purchase Order</h3><p className="text-xs text-[#6B7280] mb-3">Creates a PO from accepted quotes. Approval may be required.</p><button onClick={handleCreate} disabled={creating} className="px-4 py-2 bg-[#0A0A0A] text-white text-xs rounded-lg disabled:opacity-50">{creating ? "Creating..." : "Create PO"}</button></div>)}
    {pos.length===0?<EmptyState title="No POs yet"/>:<div className="space-y-3">{pos.map(p=>{
      const poId = p.id||p.po_id;
      return (<div key={poId} className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-[#0A0A0A]">{p.po_number||poId.slice(0,8)}</div>
            <div className="text-[11px] text-[#9CA3AF]">{p.vendor_name||""} · {p.total?`$${Number(p.total).toLocaleString()}`:""}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={p.status}/>
            <button onClick={() => setExpandedPO(expandedPO === poId ? null : poId)} className="text-[10px] text-[#0A0A0A] hover:text-[#374151]">
              {expandedPO === poId ? "▾ Hide" : "▸ Timeline"}
            </button>
            {p.approval_id && p.approval_status === "PENDING" && user?.permissions?.can_approve && (<><button onClick={() => handleApproval(p.approval_id, "APPROVED")} className="px-2 py-1 bg-emerald-600 text-white text-[10px] rounded">Approve</button><button onClick={() => handleApproval(p.approval_id, "REJECTED")} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] rounded border border-red-200">Reject</button></>)}
          </div>
        </div>
        {expandedPO === poId && (
          <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
            <POTimeline poId={poId} onRefresh={fetchPOs} />
          </div>
        )}
      </div>);
    })}</div>}
  </div>);
}

/* ═══ TRACKING (with POTimeline — Task 10) ═══ */
export function ProjectTracking() {
  const { id } = useParams(); const { accessToken } = useAuth();
  const [pos, setPOs] = useState([]); const [loading, setLoading] = useState(true);

  const fetchPOs = useCallback(async () => {
    try {
      const poData = await listProjectPOs(id, accessToken);
      setPOs(poData.items || poData || []);
    } catch {}
    setLoading(false);
  }, [id, accessToken]);

  useEffect(() => { fetchPOs(); }, [fetchPOs]);

  useRealTime("shipment.milestone", useCallback(() => { fetchPOs(); }, [fetchPOs]));

  if (loading) return <LoadingState />;
  return (<div className="p-6">
    <h2 className="text-xl font-bold text-[#0A0A0A] mb-6">Order Tracking</h2>
    {pos.length === 0 ? <EmptyState title="No orders yet" description="Tracking appears when purchase orders are created" /> :
      <div className="space-y-4">{pos.map(po => {
        const poId = po.id || po.po_id;
        return (
          <div key={poId} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-[#0A0A0A]">{po.po_number || poId.slice(0,8)}</div>
                <div className="text-[11px] text-[#6B7280]">{po.vendor_name || ""} · {po.total ? `$${Number(po.total).toLocaleString()}` : ""}</div>
              </div>
              <StatusBadge status={po.status} />
            </div>
            <POTimeline poId={poId} onRefresh={fetchPOs} />
          </div>
        );
      })}</div>
    }
  </div>);
}

/* ═══ ANALYTICS (project-scoped) ═══ */
export function ProjectAnalytics() {
  const { id } = useParams(); const { accessToken } = useAuth();
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { getProjectAnalytics(id, accessToken).then(setData).catch(()=>{}).finally(()=>setLoading(false)); }, [id, accessToken]);
  if (loading) return <LoadingState />;
  if (!data) return <EmptyState title="No analytics data" />;
  return (<div className="p-6"><h2 className="text-xl font-bold text-[#0A0A0A] mb-6">Project Analytics</h2>{data.computed_at && <StaleBadge computedAt={data.computed_at} />}<div className="grid md:grid-cols-2 gap-4 mt-4">{data.spend_by_category && <div className="card p-5"><h3 className="text-sm font-semibold text-[#0A0A0A] mb-3">Spend by Category</h3>{Object.entries(data.spend_by_category).map(([k,v])=><div key={k} className="flex justify-between py-1.5 border-b border-[#F0F0F0]"><span className="text-xs text-[#9CA3AF] capitalize">{k}</span><span className="text-xs text-[#0A0A0A] font-mono">${v.toLocaleString()}</span></div>)}</div>}{data.vendor_performance && <div className="card p-5"><h3 className="text-sm font-semibold text-[#0A0A0A] mb-3">Vendor Performance</h3>{data.vendor_performance.map(v => <div key={v.vendor_id} className="flex justify-between py-1.5 border-b border-[#F0F0F0]"><span className="text-xs text-[#9CA3AF]">{v.vendor_name}</span><span className="text-xs text-[#0A0A0A]">{(v.score*100).toFixed(0)}%</span></div>)}</div>}{data.savings_vs_baseline != null && <div className="card p-5"><h3 className="text-sm font-semibold text-[#0A0A0A] mb-3">Savings vs Baseline</h3><div className="text-2xl font-bold text-emerald-600">${data.savings_vs_baseline.toLocaleString()}</div></div>}</div></div>);
}

/* ═══ HISTORY (paginated events) ═══ */
export function ProjectHistory() {
  const { id } = useParams(); const { accessToken } = useAuth();
  const [events, setEvents] = useState([]); const [loading, setLoading] = useState(true); const [pagination, setPagination] = useState(null);
  const fetch = useCallback(async (cursor) => { setLoading(true); try { const d = await getProjectEvents(id, accessToken, cursor); setEvents(d.items||d||[]); setPagination(d.pagination); } catch {} setLoading(false); }, [id, accessToken]);
  useEffect(() => { fetch(); }, [fetch]);
  if (loading) return <LoadingState />;
  return (<div className="p-6"><h2 className="text-xl font-bold text-[#0A0A0A] mb-6">History</h2>{events.length===0?<EmptyState title="No events"/>:<div className="space-y-2">{events.map((e,i)=><div key={e.event_id||i} className="card flex items-center gap-4 p-3.5"><div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"/><div className="flex-1"><div className="text-sm text-[#0A0A0A]">{e.event_type}</div>{(e.from_state||e.old_status)&&<div className="text-[11px] text-[#9CA3AF]">{e.from_state||e.old_status} → {e.to_state||e.new_status}</div>}{e.actor && <div className="text-[10px] text-[#9CA3AF]">by {e.actor}</div>}</div><div className="text-[11px] text-[#9CA3AF]">{(e.timestamp||e.created_at)?.slice(0,16)}</div></div>)}</div>}<Pagination pagination={pagination} onPageChange={fetch} currentCount={events.length} /></div>);
}
