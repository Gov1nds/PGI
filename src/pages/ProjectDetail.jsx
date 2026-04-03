import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import {
  createRFQ,
  getProject,
  getProjectEvents,
  getProjectSnapshots,
  getRFQ,
  getStrategyRuns,
  getTracking,
  uploadDrawing,
  getRFQQuotes,
  getRFQComparison,
  selectRFQVendor,
  rejectRFQVendor,
  sendRFQ,
  getFulfillmentTracking,
  createPurchaseOrder,
  confirmPurchaseOrder,
  createShipment,
  addShipmentEvent,
  addCarrierMilestone,
  addCustomsEvent,
  confirmGoodsReceipt,
  createInvoice,
  updatePaymentState,
  getVendorMatch,
} from "../lib/api";
import ProjectEventTimeline from "../components/ProjectEventTimeline.jsx";
import RFQComparisonMatrix from "../components/RFQComparisonMatrix.jsx";
import ProjectChatDrawer from "../components/ProjectChatDrawer.jsx";
import OrderCenterTimeline from "../components/OrderCenterTimeline.jsx";

const STATUS_STYLES = {
  draft: "bg-white/[0.06] text-white/60",
  guest_preview: "bg-violet-500/15 text-violet-400",
  project_hydrated: "bg-blue-500/15 text-blue-400",
  strategy: "bg-violet-500/15 text-violet-400",
  vendor_match: "bg-cyan-500/15 text-cyan-400",
  rfq_pending: "bg-indigo-500/15 text-indigo-400",
  rfq_sent: "bg-indigo-500/15 text-indigo-400",
  quote_compare: "bg-violet-500/15 text-violet-400",
  negotiation: "bg-pink-500/15 text-pink-400",
  vendor_selected: "bg-emerald-500/15 text-emerald-400",
  po_issued: "bg-blue-500/15 text-blue-400",
  in_production: "bg-blue-500/15 text-blue-400",
  qc_inspection: "bg-violet-500/15 text-violet-400",
  shipped: "bg-cyan-500/15 text-cyan-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  spend_recorded: "bg-emerald-500/15 text-emerald-400",
  completed: "bg-emerald-500/15 text-emerald-400",
  error: "bg-red-500/15 text-red-400",
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "strategy", label: "Strategy" },
  { id: "vendor-match", label: "Vendor match" },
  { id: "rfq", label: "RFQ" },
  { id: "comparison", label: "Comparison" },
  { id: "chat", label: "Chat" },
  { id: "order", label: "Order" },
  { id: "tracking", label: "Tracking" },
  { id: "analytics", label: "Analytics" },
  { id: "history", label: "History" },
];

const fmt = (n, d = 2) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
      <p className="text-[10px] uppercase tracking-wider text-white/25">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/35">{hint}</p>}
    </div>
  );
}

function Panel({ title, children, action }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#111827] overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="block text-[10px] uppercase tracking-wider text-white/25">{label}</span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/[0.08] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 ${props.className || ""}`}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-white/[0.08] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 ${props.className || ""}`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-white/[0.08] bg-[#06060a] px-4 py-3 text-sm text-white outline-none ${props.className || ""}`}
    />
  );
}

function parseMaybeJSON(value, fallback = []) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return value;
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : fallback;
    return parsed || fallback;
  } catch {
    return fallback;
  }
}

function resolveFirstId(obj, keys = ["id", "po_id", "shipment_id", "invoice_id"]) {
  if (!obj || typeof obj !== "object") return null;
  for (const key of keys) {
    if (obj[key]) return obj[key];
  }
  return null;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [events, setEvents] = useState([]);
  const [trackingData, setTrackingData] = useState([]);
  const [rfqData, setRfqData] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [strategyRuns, setStrategyRuns] = useState([]);
  const [vendorMatch, setVendorMatch] = useState(null);

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [rfqLoading, setRfqLoading] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);
  const [drawingFile, setDrawingFile] = useState(null);
  const [drawingUploading, setDrawingUploading] = useState(false);
  const [rfqQuotes, setRfqQuotes] = useState(null);
  const [rfqComparison, setRfqComparison] = useState(null);
  const [comparisonSortBy, setComparisonSortBy] = useState("total_cost");
  const [comparisonFilters, setComparisonFilters] = useState({
    minVendorScore: "",
    maxCost: "",
    maxLeadTime: "",
    maxMoq: "",
    maxRisk: "",
  });
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);

  const [fulfillmentContext, setFulfillmentContext] = useState(null);
  const [fulfillmentLoading, setFulfillmentLoading] = useState(false);

  const [vendorFilters, setVendorFilters] = useState({
    search: "",
    regions: "",
    certifications: "",
    maxMoq: "",
    maxLeadTime: "",
    maxPrice: "",
    limit: 20,
  });

  const [rfqForm, setRfqForm] = useState({
    notes: "",
    vendorIds: "",
    deadlineDays: 7,
  });

  const [orderForm, setOrderForm] = useState({
    poNumber: "",
    vendorConfirmationNumber: "",
    carrierName: "",
    carrierCode: "",
    trackingNumber: "",
    eta: "",
    shipmentStatus: "in_transit",
    shipmentLocation: "",
    shipmentMessage: "",
    milestoneCode: "",
    milestoneName: "",
    milestoneStatus: "pending",
    milestoneDescription: "",
    milestoneLocation: "",
    customsCountry: "",
    customsStatus: "pending",
    customsMessage: "",
    customsHeldReason: "",
    receiptNumber: "",
    receiptStatus: "received",
    receivedQuantity: "",
    invoiceNumber: "",
    invoiceDate: "",
    invoiceDueDate: "",
    invoiceStatus: "issued",
    invoiceCurrency: "USD",
    invoiceSubtotal: "",
    invoiceTaxes: "",
    invoiceTotal: "",
    paymentStatus: "paid",
    paymentReference: "",
    paymentNotes: "",
    paymentPaidAt: "",
  });

  const [creatingPO, setCreatingPO] = useState(false);
  const [confirmingPO, setConfirmingPO] = useState(false);
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [addingShipmentEvent, setAddingShipmentEvent] = useState(false);
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [addingCustoms, setAddingCustoms] = useState(false);
  const [confirmingReceipt, setConfirmingReceipt] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const currentRfqId =
    project?.current_rfq_id ||
    rfqData?.id ||
    rfqData?.rfq_id ||
    rfqData?.current_rfq_id ||
    null;

  const currentPoId =
    resolveFirstId(fulfillmentContext?.purchase_order, ["id", "po_id"]) ||
    resolveFirstId(fulfillmentContext?.current_purchase_order, ["id", "po_id"]) ||
    project?.current_po_id ||
    null;

  const currentShipmentId =
    resolveFirstId(safeArray(fulfillmentContext?.shipments)[0], ["id", "shipment_id"]) ||
    project?.current_shipment_id ||
    null;

  const currentInvoiceId =
    resolveFirstId(safeArray(fulfillmentContext?.invoices)[0], ["id", "invoice_id"]) ||
    project?.current_invoice_id ||
    null;

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProject(id);
      setProject(data);
    } catch (err) {
      setError(err.message || "Project not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadOperationalData = useCallback(
    async (rfqId) => {
      try {
        const nextEvents = await getProjectEvents(id);
        setEvents(nextEvents || []);

        if (rfqId) {
          try {
            const rfq = await getRFQ(rfqId);
            setRfqData(rfq);
          } catch {
            setRfqData(null);
          }

          try {
            const tracking = await getTracking(rfqId);
            setTrackingData(tracking || []);
          } catch {
            setTrackingData([]);
          }
        }
      } catch {
        setEvents([]);
      }
    },
    [id]
  );

  const loadHistory = useCallback(async () => {
    if (historyLoading) return;
    setHistoryLoading(true);
    try {
      const [snaps, runs] = await Promise.all([
        getProjectSnapshots(id),
        getStrategyRuns(id),
      ]);
      setSnapshots(snaps || []);
      setStrategyRuns(runs || []);
    } catch (err) {
      setError(err.message || "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }, [historyLoading, id]);

  const loadVendorMatch = useCallback(
    async (overrideFilters = null) => {
      if (vendorLoading) return;
      if (!project?.id) return;

      setVendorLoading(true);
      try {
        const filters = overrideFilters || vendorFilters;
        const data = await getVendorMatch(project.id, {
          search: filters.search || "",
          regions: filters.regions || "",
          certifications: filters.certifications || "",
          max_moq: filters.maxMoq || "",
          max_lead_time: filters.maxLeadTime || "",
          max_price: filters.maxPrice || "",
          limit: filters.limit || 20,
        });
        setVendorMatch(data || null);
      } catch (err) {
        setError(err.message || "Failed to load vendor shortlist");
      } finally {
        setVendorLoading(false);
      }
    },
    [project?.id, vendorFilters, vendorLoading]
  );

  const loadComparison = useCallback(async () => {
    if (comparisonLoading) return;
    if (!currentRfqId) return;

    setComparisonLoading(true);
    try {
      const filters = {
        sort_by: comparisonSortBy,
        min_vendor_score: comparisonFilters.minVendorScore,
        max_cost: comparisonFilters.maxCost,
        max_lead_time: comparisonFilters.maxLeadTime,
        max_moq: comparisonFilters.maxMoq,
        max_risk: comparisonFilters.maxRisk,
      };
      const [quotes, comparison] = await Promise.all([
        getRFQQuotes(currentRfqId),
        getRFQComparison(currentRfqId, filters),
      ]);
      setRfqQuotes(quotes);
      setRfqComparison(comparison);
    } catch (err) {
      setError(err.message || "Failed to load RFQ comparison");
    } finally {
      setComparisonLoading(false);
    }
  }, [
    comparisonLoading,
    currentRfqId,
    comparisonSortBy,
    comparisonFilters,
  ]);

  const loadFulfillment = useCallback(async () => {
    if (!currentRfqId) return;
    setFulfillmentLoading(true);
    try {
      const data = await getFulfillmentTracking(currentRfqId);
      setFulfillmentContext(data || null);
    } catch (err) {
      setError(err.message || "Failed to load fulfillment context");
    } finally {
      setFulfillmentLoading(false);
    }
  }, [currentRfqId]);

  useEffect(() => {
    if (authLoading) return;
    loadProject();
  }, [authLoading, loadProject]);

  useEffect(() => {
    if (!project) return;
    loadOperationalData(project.current_rfq_id || project.current_rfq_batch_id || project.rfq_id || null);
  }, [project, loadOperationalData]);

  useEffect(() => {
    if (activeTab === "history") loadHistory();
  }, [activeTab, loadHistory]);

  useEffect(() => {
    if (activeTab === "vendor-match") loadVendorMatch();
  }, [activeTab, loadVendorMatch]);

  useEffect(() => {
    if (activeTab === "comparison") loadComparison();
  }, [activeTab, loadComparison]);

  useEffect(() => {
    if (activeTab === "order" || activeTab === "tracking") loadFulfillment();
  }, [activeTab, loadFulfillment]);

  useEffect(() => {
    if (!project?.current_rfq_id) return;
    if (activeTab === "rfq") {
      loadFulfillment();
    }
  }, [activeTab, project?.current_rfq_id, loadFulfillment]);

  const cardClass = "rounded-2xl border border-white/[0.08] bg-[#111827] overflow-hidden";

  const stage = (
    project?.workflow_stage ||
    project?.status ||
    "draft"
  ).toLowerCase();

  const report = project?.analyzer_report || {};
  const strategy = project?.strategy || {};
  const s1 = report.section_1_executive_summary || {};
  const s2 = parseMaybeJSON(report.section_2_component_breakdown, []);
  const currency =
    s1.currency ||
    strategy.currency ||
    (project?.metadata || {}).currency ||
    "USD";

  const groupedComponents = useMemo(() => {
    const groups = {};
    for (const item of safeArray(s2)) {
      const key = item.category || item.part_type || "standard";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  }, [s2]);

  const vendorCandidates = useMemo(() => {
    const items =
      safeArray(vendorMatch?.items) ||
      safeArray(vendorMatch?.vendors) ||
      safeArray(vendorMatch?.results) ||
      [];
    return items;
  }, [vendorMatch]);

  const handleRequestRFQ = async () => {
    if (rfqLoading) return;
    setRfqLoading(true);
    try {
      const rfq = await createRFQ(project?.bom_id || id, rfqForm.notes || "");
      setRfqSuccess(true);
      await loadProject();
      await loadOperationalData(rfq?.id || rfq?.rfq_id || project?.current_rfq_id || null);
      setActiveTab("rfq");
    } catch (err) {
      setError(err.message || "Failed to create RFQ");
    } finally {
      setRfqLoading(false);
    }
  };

  const handleSendRFQ = async () => {
    if (!currentRfqId) return;
    try {
      const vendorIds = rfqForm.vendorIds
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      await sendRFQ(currentRfqId, {
        vendor_ids: vendorIds,
        vendor_response_deadline_days: Number(rfqForm.deadlineDays) || 7,
        notes: rfqForm.notes || "",
      });
      await loadOperationalData(currentRfqId);
      setActiveTab("comparison");
    } catch (err) {
      setError(err.message || "Failed to send RFQ");
    }
  };

  const handleUploadDrawing = async () => {
    if (!drawingFile || !currentRfqId) return;
    setDrawingUploading(true);
    try {
      await uploadDrawing(currentRfqId, drawingFile, "", "", null);
      setDrawingFile(null);
      await loadOperationalData(currentRfqId);
    } catch (err) {
      setError(err.message || "Drawing upload failed");
    } finally {
      setDrawingUploading(false);
    }
  };

  const handleSelectVendor = async (payload) => {
    if (!currentRfqId) return;
    try {
      await selectRFQVendor(currentRfqId, {
        vendor_id: payload?.vendor_id || payload,
        quote_id: payload?.quote_id || null,
        reason: payload?.reason || "Selected from project workspace",
      });
      await loadComparison();
      await loadProject();
      await loadFulfillment();
    } catch (err) {
      setError(err.message || "Failed to select vendor");
    }
  };

  const handleRejectVendor = async (payload) => {
    if (!currentRfqId) return;
    try {
      await rejectRFQVendor(currentRfqId, {
        vendor_id: payload?.vendor_id || payload,
        quote_id: payload?.quote_id || null,
        reason: payload?.reason || "Rejected from project workspace",
      });
      await loadComparison();
      await loadProject();
    } catch (err) {
      setError(err.message || "Failed to reject vendor");
    }
  };

  const refreshFulfillment = async () => {
    if (!currentRfqId) return;
    await loadFulfillment();
  };

  const handleCreatePO = async () => {
    if (!currentRfqId) return;
    setCreatingPO(true);
    try {
      await createPurchaseOrder(currentRfqId, {
        vendor_id: project?.current_vendor_id || null,
        po_number: orderForm.poNumber || "",
        currency,
        subtotal: strategy?.total_cost || null,
        freight: null,
        taxes: null,
        total_amount: strategy?.total_cost || null,
        notes: `Created from workspace for project ${project?.name || project?.project_name || id}`,
        metadata: {
          project_id: id,
          source: "project_workspace",
        },
      });
      await loadFulfillment();
      await loadProject();
      setActiveTab("tracking");
    } catch (err) {
      setError(err.message || "Failed to create purchase order");
    } finally {
      setCreatingPO(false);
    }
  };

  const handleConfirmPO = async () => {
    if (!currentPoId) return;
    setConfirmingPO(true);
    try {
      await confirmPurchaseOrder(currentPoId, {
        vendor_confirmation_number: orderForm.vendorConfirmationNumber || "",
        notes: "Confirmed from project workspace",
      });
      await loadFulfillment();
    } catch (err) {
      setError(err.message || "Failed to confirm purchase order");
    } finally {
      setConfirmingPO(false);
    }
  };

  const handleCreateShipment = async () => {
    if (!currentPoId) return;
    setCreatingShipment(true);
    try {
      await createShipment(currentPoId, {
        carrier_name: orderForm.carrierName || "",
        carrier_code: orderForm.carrierCode || "",
        tracking_number: orderForm.trackingNumber || "",
        status: orderForm.shipmentStatus || "in_transit",
        eta: orderForm.eta || null,
        origin: project?.recommended_location || "",
        destination: project?.delivery_location || project?.project_metadata?.delivery_location || "",
        delay_reason: null,
        metadata: {
          project_id: id,
          source: "project_workspace",
        },
      });
      await loadFulfillment();
    } catch (err) {
      setError(err.message || "Failed to create shipment");
    } finally {
      setCreatingShipment(false);
    }
  };

  const handleAddShipmentEvent = async () => {
    if (!currentShipmentId) return;
    setAddingShipmentEvent(true);
    try {
      await addShipmentEvent(currentShipmentId, {
        event_type: orderForm.shipmentEventType || "status_update",
        event_status: orderForm.shipmentStatus || "in_transit",
        location: orderForm.shipmentLocation || "",
        message: orderForm.shipmentMessage || "",
        occurred_at: new Date().toISOString(),
        metadata: {
          project_id: id,
          source: "project_workspace",
        },
      });
      await loadFulfillment();
    } catch (err) {
      setError(err.message || "Failed to add shipment event");
    } finally {
      setAddingShipmentEvent(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!currentShipmentId) return;
    setAddingMilestone(true);
    try {
      await addCarrierMilestone(currentShipmentId, {
        milestone_code: orderForm.milestoneCode || "milestone",
        milestone_name: orderForm.milestoneName || "Carrier milestone",
        milestone_status: orderForm.milestoneStatus || "pending",
        description: orderForm.milestoneDescription || "",
        location: orderForm.milestoneLocation || "",
        estimated_at: null,
        actual_at: null,
        metadata: {
          project_id: id,
          source: "project_workspace",
        },
      });
      await loadFulfillment();
    } catch (err) {
      setError(err.message || "Failed to add carrier milestone");
    } finally {
      setAddingMilestone(false);
    }
  };

  const handleAddCustomsEvent = async () => {
    if (!currentShipmentId) return;
    setAddingCustoms(true);
    try {
      await addCustomsEvent(currentShipmentId, {
        country: orderForm.customsCountry || project?.delivery_location || "",
        status: orderForm.customsStatus || "pending",
        message: orderForm.customsMessage || "",
        held_reason: orderForm.customsHeldReason || "",
        released_at: null,
        metadata: {
          project_id: id,
          source: "project_workspace",
        },
      });
      await loadFulfillment();
    } catch (err) {
      setError(err.message || "Failed to add customs event");
    } finally {
      setAddingCustoms(false);
    }
  };

  const handleConfirmReceipt = async () => {
    if (!currentPoId) return;
    setConfirmingReceipt(true);
    try {
      await confirmGoodsReceipt(currentPoId, {
        receipt_number: orderForm.receiptNumber || "",
        receipt_status: orderForm.receiptStatus || "received",
        received_quantity: orderForm.receivedQuantity === "" ? null : Number(orderForm.receivedQuantity),
        confirmed_at: new Date().toISOString(),
        notes: "Confirmed from project workspace",
        metadata: {
          project_id: id,
          source: "project_workspace",
        },
      });
      await loadFulfillment();
      await loadProject();
    } catch (err) {
      setError(err.message || "Failed to confirm receipt");
    } finally {
      setConfirmingReceipt(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!currentPoId) return;
    setCreatingInvoice(true);
    try {
      await createInvoice(currentPoId, {
        vendor_id: project?.current_vendor_id || null,
        invoice_number: orderForm.invoiceNumber || "",
        invoice_date: orderForm.invoiceDate || null,
        due_date: orderForm.invoiceDueDate || null,
        invoice_status: orderForm.invoiceStatus || "issued",
        currency: orderForm.invoiceCurrency || currency || "USD",
        subtotal: orderForm.invoiceSubtotal === "" ? null : Number(orderForm.invoiceSubtotal),
        taxes: orderForm.invoiceTaxes === "" ? null : Number(orderForm.invoiceTaxes),
        total_amount: orderForm.invoiceTotal === "" ? null : Number(orderForm.invoiceTotal),
        matched_at: null,
        metadata: {
          project_id: id,
          source: "project_workspace",
        },
      });
      await loadFulfillment();
    } catch (err) {
      setError(err.message || "Failed to create invoice");
    } finally {
      setCreatingInvoice(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!currentInvoiceId) return;
    setUpdatingPayment(true);
    try {
      await updatePaymentState(currentInvoiceId, {
        status: orderForm.paymentStatus || "paid",
        paid_at: orderForm.paymentPaidAt || new Date().toISOString(),
        payment_reference: orderForm.paymentReference || "",
        notes: orderForm.paymentNotes || "",
        metadata: {
          project_id: id,
          source: "project_workspace",
        },
      });
      await loadFulfillment();
      await loadProject();
    } catch (err) {
      setError(err.message || "Failed to update payment state");
    } finally {
      setUpdatingPayment(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading project workspace...</div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-[#06060a]">
        <Container className="py-10">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-300">
            {error}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060a]">
      <section className="border-b border-white/[0.08]">
        <Container className="py-8">
          <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
            <Link to="/dashboard" className="hover:text-white/60 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link to={`/project/${id}/workspace`} className="hover:text-white/60 transition-colors">
              Workspace
            </Link>
            <span>/</span>
            <span className="text-white/60">{project?.name || project?.project_name || "Project"}</span>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {project?.name || project?.project_name || "Project workspace"}
              </h1>
              <p className="text-white/35 mt-2 max-w-3xl">
                Full source-to-pay control tower: analysis, strategy, vendor matching, RFQ, comparison, negotiation, order execution, tracking, and analytics.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[stage] || STATUS_STYLES.draft}`}>
                  {stage.replace(/_/g, " ")}
                </span>
                {project?.current_vendor_id && (
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                    Vendor selected
                  </span>
                )}
                {currentRfqId && (
                  <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-400">
                    RFQ active
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowChatDrawer(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                Open collaboration
              </button>
              <Link
                to={`/project/${id}/vendors`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                Vendor discovery
              </Link>
              <Link
                to="/analytics"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400"
              >
                Analytics
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat label="Parts" value={project?.total_parts ?? s2.length ?? "—"} hint="BOM lines in current project" />
          <Stat label="Currency" value={currency} hint="Analysis currency" />
          <Stat label="Current RFQ" value={currentRfqId || "—"} hint="RFQ lifecycle anchor" />
          <Stat label="Current vendor" value={project?.current_vendor_id || "—"} hint="Awarded supplier if selected" />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeTab === tab.id
                  ? "bg-violet-500 text-white"
                  : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Panel
                title="Executive summary"
                action={
                  <button
                    onClick={loadProject}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.08]"
                  >
                    Refresh
                  </button>
                }
              >
                <div className="space-y-4 text-sm text-white/75">
                  <p>{s1.summary || s1.description || report.decision_summary || "No executive summary available yet."}</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Recommended location</p>
                      <p className="mt-2 text-white">{strategy.recommended_location || project?.recommended_location || s1.recommended_location || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Estimated cost</p>
                      <p className="mt-2 text-white">{fmt(strategy.total_cost || s1.total_cost || s1.average_cost || 0)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Lead time</p>
                      <p className="mt-2 text-white">{fmt(strategy.lead_time_days || s1.lead_time_days || 0, 0)} days</p>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Component breakdown">
                <div className="space-y-4">
                  {Object.keys(groupedComponents).length === 0 ? (
                    <p className="text-sm text-white/35">No component breakdown available.</p>
                  ) : (
                    Object.entries(groupedComponents).map(([group, items]) => (
                      <div key={group} className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-sm font-semibold text-white capitalize">{group.replace(/_/g, " ")}</h4>
                          <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/50">{items.length} line(s)</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {items.slice(0, 4).map((item, idx) => (
                            <div key={`${group}-${idx}`} className="rounded-xl border border-white/[0.05] bg-[#06060a] p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-white">{item.description || item.item_name || item.name || "Unnamed line"}</p>
                                  <p className="mt-1 text-xs text-white/35">
                                    Qty {fmt(item.quantity, 0)} · {item.material || item.part_type || "—"} · {item.procurement_class || "—"}
                                  </p>
                                </div>
                                <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/60">
                                  {fmt(item.classification_confidence || item.confidence || 0, 2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "strategy" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Panel title="Strategy summary">
                <div className="space-y-4 text-sm text-white/75">
                  <p>{strategy.decision_summary || report.decision_summary || "No strategy summary available."}</p>
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/25">Recommended action</p>
                    <p className="mt-2 text-white">{strategy.recommended_action || strategy.action || "Review vendor shortlist and send RFQ."}</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/25">Priority</p>
                    <p className="mt-2 text-white">{project?.priority || "cost"}</p>
                  </div>
                </div>
              </Panel>

              <Panel title="Cost / lead-time">
                <div className="space-y-3">
                  <Stat label="Average cost" value={fmt(strategy.average_cost || s1.average_cost || 0)} />
                  <Stat label="Cost range" value={`${fmt(strategy.cost_range_low || s1.cost_range_low || 0)} – ${fmt(strategy.cost_range_high || s1.cost_range_high || 0)}`} />
                  <Stat label="Lead time" value={`${fmt(strategy.lead_time_days || s1.lead_time_days || 0, 0)} days`} />
                </div>
              </Panel>

              <Panel title="Next steps">
                <div className="space-y-3 text-sm text-white/75">
                  <p>1. Validate vendor shortlist.</p>
                  <p>2. Send RFQ to matched suppliers.</p>
                  <p>3. Compare quotes and select vendor.</p>
                  <p>4. Issue PO and track fulfillment.</p>
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "vendor-match" && (
            <div className="space-y-6">
              <Panel
                title="Vendor matching"
                action={
                  <Link
                    to={`/project/${id}/vendors`}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.08]"
                  >
                    Open dedicated vendor discovery
                  </Link>
                }
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
                  <Input
                    placeholder="Search capability"
                    value={vendorFilters.search}
                    onChange={(e) => setVendorFilters((p) => ({ ...p, search: e.target.value }))}
                  />
                  <Input
                    placeholder="Regions"
                    value={vendorFilters.regions}
                    onChange={(e) => setVendorFilters((p) => ({ ...p, regions: e.target.value }))}
                  />
                  <Input
                    placeholder="Certifications"
                    value={vendorFilters.certifications}
                    onChange={(e) => setVendorFilters((p) => ({ ...p, certifications: e.target.value }))}
                  />
                  <Input
                    placeholder="Max MOQ"
                    type="number"
                    value={vendorFilters.maxMoq}
                    onChange={(e) => setVendorFilters((p) => ({ ...p, maxMoq: e.target.value }))}
                  />
                  <Input
                    placeholder="Max lead time"
                    type="number"
                    value={vendorFilters.maxLeadTime}
                    onChange={(e) => setVendorFilters((p) => ({ ...p, maxLeadTime: e.target.value }))}
                  />
                  <Input
                    placeholder="Max price"
                    type="number"
                    value={vendorFilters.maxPrice}
                    onChange={(e) => setVendorFilters((p) => ({ ...p, maxPrice: e.target.value }))}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => loadVendorMatch()}
                    className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400"
                  >
                    Refresh shortlist
                  </button>
                  <button
                    onClick={() => loadVendorMatch(vendorFilters)}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
                  >
                    Apply filters
                  </button>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
                <Panel title="Ranked shortlist">
                  {vendorLoading ? (
                    <p className="text-sm text-white/35">Loading vendor shortlist...</p>
                  ) : vendorCandidates.length === 0 ? (
                    <p className="text-sm text-white/35">No vendors returned for the current filters.</p>
                  ) : (
                    <div className="space-y-3">
                      {vendorCandidates.map((vendor) => (
                        <div key={vendor.vendor_id || vendor.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-semibold text-white">{vendor.vendor_name || vendor.name || "Vendor"}</h4>
                              <p className="mt-1 text-xs text-white/35">
                                {vendor.vendor_id || vendor.id} · {vendor.region || vendor.location || "—"}
                              </p>
                            </div>
                            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                              Score {fmt(vendor.vendor_score || vendor.score || 0, 2)}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-white/70">
                            {vendor.reason || vendor.match_reason || vendor.explanation || "Matched from project sourcing context."}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              onClick={() => handleSelectVendor({ vendor_id: vendor.vendor_id || vendor.id, reason: "Selected from vendor match tab" })}
                              className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-400"
                            >
                              Select vendor
                            </button>
                            <button
                              onClick={() => handleRejectVendor({ vendor_id: vendor.vendor_id || vendor.id, reason: "Rejected from vendor match tab" })}
                              className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                            >
                              Reject vendor
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Summary">
                  <div className="space-y-4 text-sm text-white/75">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Matched vendors</p>
                      <p className="mt-2 text-white">{vendorCandidates.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Delivery region</p>
                      <p className="mt-2 text-white">{project?.recommended_location || project?.delivery_location || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Currency</p>
                      <p className="mt-2 text-white">{currency}</p>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {activeTab === "rfq" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
              <Panel title="RFQ workflow">
                <div className="space-y-4">
                  <Textarea
                    rows={4}
                    placeholder="RFQ notes / packaging / delivery / compliance requirements"
                    value={rfqForm.notes}
                    onChange={(e) => setRfqForm((p) => ({ ...p, notes: e.target.value }))}
                  />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Input
                      placeholder="Vendor IDs (comma-separated)"
                      value={rfqForm.vendorIds}
                      onChange={(e) => setRfqForm((p) => ({ ...p, vendorIds: e.target.value }))}
                    />
                    <Input
                      placeholder="Deadline days"
                      type="number"
                      value={rfqForm.deadlineDays}
                      onChange={(e) => setRfqForm((p) => ({ ...p, deadlineDays: e.target.value }))}
                    />
                    <div className="flex items-end">
                      <button
                        onClick={handleRequestRFQ}
                        disabled={rfqLoading}
                        className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
                      >
                        {rfqLoading ? "Creating..." : currentRfqId ? "Refresh RFQ" : "Create RFQ"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleSendRFQ}
                      disabled={!currentRfqId}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50"
                    >
                      Send RFQ
                    </button>
                    <button
                      onClick={() => loadOperationalData(currentRfqId)}
                      disabled={!currentRfqId}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50"
                    >
                      Refresh RFQ
                    </button>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold text-white">Current RFQ</h4>
                      {rfqSuccess && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">Created</span>}
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      {currentRfqId || "No RFQ created yet."}
                    </p>
                    {rfqData && (
                      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <Stat label="Status" value={rfqData.status || "—"} />
                        <Stat label="Estimated cost" value={fmt(rfqData.total_estimated_cost || 0)} />
                        <Stat label="Final cost" value={fmt(rfqData.total_final_cost || 0)} />
                        <Stat label="Currency" value={rfqData.currency || currency} />
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <Panel title="Drawings">
                <div className="space-y-4">
                  <Input
                    type="file"
                    onChange={(e) => setDrawingFile(e.target.files?.[0] || null)}
                  />
                  <button
                    onClick={handleUploadDrawing}
                    disabled={!drawingFile || drawingUploading || !currentRfqId}
                    className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
                  >
                    {drawingUploading ? "Uploading..." : "Upload drawing"}
                  </button>
                  <p className="text-sm text-white/45">
                    Drawings attach to the active RFQ and can be used for custom parts, machining, or sheet metal quotes.
                  </p>
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "comparison" && (
            <div className="space-y-6">
              <Panel title="Quote comparison controls">
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-6">
                  <Select value={comparisonSortBy} onChange={(e) => setComparisonSortBy(e.target.value)}>
                    <option value="total_cost">Sort: total cost</option>
                    <option value="lead_time">Sort: lead time</option>
                    <option value="vendor_score">Sort: vendor score</option>
                    <option value="moq">Sort: MOQ</option>
                    <option value="risk">Sort: risk</option>
                  </Select>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Min vendor score"
                    value={comparisonFilters.minVendorScore}
                    onChange={(e) => setComparisonFilters((p) => ({ ...p, minVendorScore: e.target.value }))}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Max cost"
                    value={comparisonFilters.maxCost}
                    onChange={(e) => setComparisonFilters((p) => ({ ...p, maxCost: e.target.value }))}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Max lead time"
                    value={comparisonFilters.maxLeadTime}
                    onChange={(e) => setComparisonFilters((p) => ({ ...p, maxLeadTime: e.target.value }))}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Max MOQ"
                    value={comparisonFilters.maxMoq}
                    onChange={(e) => setComparisonFilters((p) => ({ ...p, maxMoq: e.target.value }))}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Max risk"
                    value={comparisonFilters.maxRisk}
                    onChange={(e) => setComparisonFilters((p) => ({ ...p, maxRisk: e.target.value }))}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={loadComparison}
                    disabled={!currentRfqId || comparisonLoading}
                    className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
                  >
                    {comparisonLoading ? "Loading..." : "Reload comparison"}
                  </button>
                  <button
                    onClick={() => {
                      setComparisonFilters({
                        minVendorScore: "",
                        maxCost: "",
                        maxLeadTime: "",
                        maxMoq: "",
                        maxRisk: "",
                      });
                      setComparisonSortBy("total_cost");
                    }}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
                  >
                    Reset filters
                  </button>
                </div>
              </Panel>

              <RFQComparisonMatrix
                comparison={rfqComparison}
                sortBy={comparisonSortBy}
                setSortBy={setComparisonSortBy}
                filters={comparisonFilters}
                setFilters={setComparisonFilters}
                onSelectVendor={handleSelectVendor}
                onRejectVendor={handleRejectVendor}
                selectedVendorId={project?.current_vendor_id}
              />

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Panel title="RFQ quotes snapshot">
                  <pre className="max-h-[420px] overflow-auto rounded-2xl border border-white/[0.08] bg-[#06060a] p-4 text-xs text-white/70">
                    {JSON.stringify(rfqQuotes || {}, null, 2)}
                  </pre>
                </Panel>
                <Panel title="Comparison snapshot">
                  <pre className="max-h-[420px] overflow-auto rounded-2xl border border-white/[0.08] bg-[#06060a] p-4 text-xs text-white/70">
                    {JSON.stringify(rfqComparison || {}, null, 2)}
                  </pre>
                </Panel>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
              <Panel
                title="Negotiation hub"
                action={
                  <button
                    onClick={() => setShowChatDrawer(true)}
                    className="rounded-xl bg-violet-500 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-400"
                  >
                    Open chat drawer
                  </button>
                }
              >
                <div className="space-y-4 text-sm text-white/75">
                  <p>
                    Collaboration is now backed by a real thread and message model. Use the drawer to start vendor discussions, internal notes, and approval flows.
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Unread messages</p>
                      <p className="mt-2 text-white">{project?.chat_unread_count ?? 0}</p>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Pending approvals</p>
                      <p className="mt-2 text-white">{project?.pending_approvals ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowChatDrawer(true)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
                    >
                      Open collaboration drawer
                    </button>
                    <Link
                      to={`/project/${id}/vendors`}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
                    >
                      Continue with vendor discovery
                    </Link>
                  </div>
                </div>
              </Panel>

              <Panel title="Thread summary">
                <div className="space-y-3 text-sm text-white/70">
                  {(events || []).slice(0, 8).map((event, idx) => (
                    <div key={`${event.id || idx}`} className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-3">
                      <p className="text-white">{event.event_type || event.title || "Event"}</p>
                      <p className="mt-1 text-xs text-white/35">{event.created_at || event.updated_at || "—"}</p>
                    </div>
                  ))}
                  {(!events || events.length === 0) && (
                    <p className="text-sm text-white/35">No collaboration events yet.</p>
                  )}
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "order" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
              <Panel title="Order creation and execution">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="PO number">
                      <Input value={orderForm.poNumber} onChange={(e) => setOrderForm((p) => ({ ...p, poNumber: e.target.value }))} />
                    </Field>
                    <Field label="Vendor confirmation number">
                      <Input value={orderForm.vendorConfirmationNumber} onChange={(e) => setOrderForm((p) => ({ ...p, vendorConfirmationNumber: e.target.value }))} />
                    </Field>
                    <Field label="Carrier name">
                      <Input value={orderForm.carrierName} onChange={(e) => setOrderForm((p) => ({ ...p, carrierName: e.target.value }))} />
                    </Field>
                    <Field label="Carrier code">
                      <Input value={orderForm.carrierCode} onChange={(e) => setOrderForm((p) => ({ ...p, carrierCode: e.target.value }))} />
                    </Field>
                    <Field label="Tracking number">
                      <Input value={orderForm.trackingNumber} onChange={(e) => setOrderForm((p) => ({ ...p, trackingNumber: e.target.value }))} />
                    </Field>
                    <Field label="ETA">
                      <Input type="datetime-local" value={orderForm.eta} onChange={(e) => setOrderForm((p) => ({ ...p, eta: e.target.value }))} />
                    </Field>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleCreatePO}
                      disabled={!currentRfqId || creatingPO}
                      className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
                    >
                      {creatingPO ? "Creating PO..." : "Create PO"}
                    </button>
                    <button
                      onClick={handleConfirmPO}
                      disabled={!currentPoId || confirmingPO}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50"
                    >
                      {confirmingPO ? "Confirming..." : "Confirm PO"}
                    </button>
                    <button
                      onClick={handleCreateShipment}
                      disabled={!currentPoId || creatingShipment}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50"
                    >
                      {creatingShipment ? "Creating shipment..." : "Create shipment"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Shipment status">
                      <Select value={orderForm.shipmentStatus} onChange={(e) => setOrderForm((p) => ({ ...p, shipmentStatus: e.target.value }))}>
                        <option value="pending">Pending</option>
                        <option value="in_production">In production</option>
                        <option value="packed">Packed</option>
                        <option value="in_transit">In transit</option>
                        <option value="customs">Customs</option>
                        <option value="delivered">Delivered</option>
                      </Select>
                    </Field>
                    <Field label="Shipment location">
                      <Input value={orderForm.shipmentLocation} onChange={(e) => setOrderForm((p) => ({ ...p, shipmentLocation: e.target.value }))} />
                    </Field>
                    <Field label="Shipment message">
                      <Input value={orderForm.shipmentMessage} onChange={(e) => setOrderForm((p) => ({ ...p, shipmentMessage: e.target.value }))} />
                    </Field>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAddShipmentEvent}
                      disabled={!currentShipmentId || addingShipmentEvent}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50"
                    >
                      {addingShipmentEvent ? "Adding..." : "Add shipment event"}
                    </button>
                    <button
                      onClick={handleAddMilestone}
                      disabled={!currentShipmentId || addingMilestone}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50"
                    >
                      {addingMilestone ? "Adding..." : "Add carrier milestone"}
                    </button>
                    <button
                      onClick={handleAddCustomsEvent}
                      disabled={!currentShipmentId || addingCustoms}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] disabled:opacity-50"
                    >
                      {addingCustoms ? "Adding..." : "Add customs event"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Milestone code">
                      <Input value={orderForm.milestoneCode} onChange={(e) => setOrderForm((p) => ({ ...p, milestoneCode: e.target.value }))} />
                    </Field>
                    <Field label="Milestone name">
                      <Input value={orderForm.milestoneName} onChange={(e) => setOrderForm((p) => ({ ...p, milestoneName: e.target.value }))} />
                    </Field>
                    <Field label="Milestone status">
                      <Select value={orderForm.milestoneStatus} onChange={(e) => setOrderForm((p) => ({ ...p, milestoneStatus: e.target.value }))}>
                        <option value="pending">Pending</option>
                        <option value="in_transit">In transit</option>
                        <option value="completed">Completed</option>
                        <option value="delayed">Delayed</option>
                      </Select>
                    </Field>
                    <Field label="Milestone location">
                      <Input value={orderForm.milestoneLocation} onChange={(e) => setOrderForm((p) => ({ ...p, milestoneLocation: e.target.value }))} />
                    </Field>
                    <Field label="Customs country">
                      <Input value={orderForm.customsCountry} onChange={(e) => setOrderForm((p) => ({ ...p, customsCountry: e.target.value }))} />
                    </Field>
                    <Field label="Customs status">
                      <Select value={orderForm.customsStatus} onChange={(e) => setOrderForm((p) => ({ ...p, customsStatus: e.target.value }))}>
                        <option value="pending">Pending</option>
                        <option value="held">Held</option>
                        <option value="released">Released</option>
                      </Select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Customs message">
                      <Textarea rows={3} value={orderForm.customsMessage} onChange={(e) => setOrderForm((p) => ({ ...p, customsMessage: e.target.value }))} />
                    </Field>
                    <Field label="Customs held reason">
                      <Textarea rows={3} value={orderForm.customsHeldReason} onChange={(e) => setOrderForm((p) => ({ ...p, customsHeldReason: e.target.value }))} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Receipt number">
                      <Input value={orderForm.receiptNumber} onChange={(e) => setOrderForm((p) => ({ ...p, receiptNumber: e.target.value }))} />
                    </Field>
                    <Field label="Receipt status">
                      <Select value={orderForm.receiptStatus} onChange={(e) => setOrderForm((p) => ({ ...p, receiptStatus: e.target.value }))}>
                        <option value="received">Received</option>
                        <option value="partial">Partial</option>
                        <option value="rejected">Rejected</option>
                      </Select>
                    </Field>
                    <Field label="Received quantity">
                      <Input type="number" value={orderForm.receivedQuantity} onChange={(e) => setOrderForm((p) => ({ ...p, receivedQuantity: e.target.value }))} />
                    </Field>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleConfirmReceipt}
                      disabled={!currentPoId || confirmingReceipt}
                      className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
                    >
                      {confirmingReceipt ? "Confirming..." : "Confirm goods receipt"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <Field label="Invoice number">
                      <Input value={orderForm.invoiceNumber} onChange={(e) => setOrderForm((p) => ({ ...p, invoiceNumber: e.target.value }))} />
                    </Field>
                    <Field label="Invoice date">
                      <Input type="date" value={orderForm.invoiceDate} onChange={(e) => setOrderForm((p) => ({ ...p, invoiceDate: e.target.value }))} />
                    </Field>
                    <Field label="Due date">
                      <Input type="date" value={orderForm.invoiceDueDate} onChange={(e) => setOrderForm((p) => ({ ...p, invoiceDueDate: e.target.value }))} />
                    </Field>
                    <Field label="Invoice status">
                      <Select value={orderForm.invoiceStatus} onChange={(e) => setOrderForm((p) => ({ ...p, invoiceStatus: e.target.value }))}>
                        <option value="issued">Issued</option>
                        <option value="matched">Matched</option>
                        <option value="paid">Paid</option>
                        <option value="disputed">Disputed</option>
                      </Select>
                    </Field>
                    <Field label="Currency">
                      <Input value={orderForm.invoiceCurrency} onChange={(e) => setOrderForm((p) => ({ ...p, invoiceCurrency: e.target.value }))} />
                    </Field>
                    <Field label="Subtotal">
                      <Input type="number" value={orderForm.invoiceSubtotal} onChange={(e) => setOrderForm((p) => ({ ...p, invoiceSubtotal: e.target.value }))} />
                    </Field>
                    <Field label="Taxes">
                      <Input type="number" value={orderForm.invoiceTaxes} onChange={(e) => setOrderForm((p) => ({ ...p, invoiceTaxes: e.target.value }))} />
                    </Field>
                    <Field label="Total amount">
                      <Input type="number" value={orderForm.invoiceTotal} onChange={(e) => setOrderForm((p) => ({ ...p, invoiceTotal: e.target.value }))} />
                    </Field>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleCreateInvoice}
                      disabled={!currentPoId || creatingInvoice}
                      className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
                    >
                      {creatingInvoice ? "Creating invoice..." : "Create invoice"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Payment status">
                      <Select value={orderForm.paymentStatus} onChange={(e) => setOrderForm((p) => ({ ...p, paymentStatus: e.target.value }))}>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="partially_paid">Partially paid</option>
                        <option value="failed">Failed</option>
                      </Select>
                    </Field>
                    <Field label="Payment reference">
                      <Input value={orderForm.paymentReference} onChange={(e) => setOrderForm((p) => ({ ...p, paymentReference: e.target.value }))} />
                    </Field>
                    <Field label="Payment paid at">
                      <Input type="datetime-local" value={orderForm.paymentPaidAt} onChange={(e) => setOrderForm((p) => ({ ...p, paymentPaidAt: e.target.value }))} />
                    </Field>
                  </div>

                  <Field label="Payment notes">
                    <Textarea rows={3} value={orderForm.paymentNotes} onChange={(e) => setOrderForm((p) => ({ ...p, paymentNotes: e.target.value }))} />
                  </Field>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleUpdatePayment}
                      disabled={!currentInvoiceId || updatingPayment}
                      className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
                    >
                      {updatingPayment ? "Updating..." : "Update payment state"}
                    </button>
                  </div>
                </div>
              </Panel>

              <Panel title="Execution summary">
                <div className="space-y-4 text-sm text-white/75">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/25">Current PO</p>
                    <p className="mt-2 text-white">{currentPoId || "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/25">Current shipment</p>
                    <p className="mt-2 text-white">{currentShipmentId || "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/25">Current invoice</p>
                    <p className="mt-2 text-white">{currentInvoiceId || "—"}</p>
                  </div>
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "tracking" && (
            <OrderCenterTimeline context={fulfillmentContext} onRefresh={refreshFulfillment} />
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Panel title="Project analytics">
                <div className="space-y-3 text-sm text-white/75">
                  <p>Spend, trend, category, and supplier analytics are available in the main analytics surface.</p>
                  <Link
                    to="/analytics"
                    className="inline-flex rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400"
                  >
                    Open analytics
                  </Link>
                </div>
              </Panel>
              <Panel title="Current insight">
                <div className="space-y-3 text-sm text-white/75">
                  <p>Workflow stage: {stage.replace(/_/g, " ")}</p>
                  <p>RFQ: {currentRfqId || "not created"}</p>
                  <p>Vendor: {project?.current_vendor_id || "not selected"}</p>
                </div>
              </Panel>
              <Panel title="Operational summary">
                <div className="space-y-3 text-sm text-white/75">
                  <p>Use the order and tracking tabs to turn quote outcomes into measurable spend records.</p>
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "history" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
              <ProjectEventTimeline events={events} title="Project event timeline" emptyText="No project events yet." />
              <Panel title="Snapshots and strategy runs">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Snapshots</h4>
                    <div className="space-y-2">
                      {safeArray(snapshots).length ? snapshots.map((snap, idx) => (
                        <div key={snap.id || idx} className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 text-sm text-white/70">
                          <p className="text-white">{snap.version || snap.snapshot_version || `Snapshot ${idx + 1}`}</p>
                          <p className="text-xs text-white/35">{snap.created_at || "—"}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-white/35">No snapshots available.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Strategy runs</h4>
                    <div className="space-y-2">
                      {safeArray(strategyRuns).length ? strategyRuns.map((run, idx) => (
                        <div key={run.id || idx} className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 text-sm text-white/70">
                          <p className="text-white">{run.strategy_name || run.label || `Run ${idx + 1}`}</p>
                          <p className="text-xs text-white/35">{run.created_at || "—"}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-white/35">No strategy runs available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          )}
        </div>
      </Container>

      <ProjectChatDrawer
        open={showChatDrawer}
        project={project}
        user={user}
        onClose={() => setShowChatDrawer(false)}
      />
    </div>
  );
}