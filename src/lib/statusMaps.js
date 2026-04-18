const COLOR = {
  processing: "bg-amber-50 text-amber-700 border border-amber-200",
  success:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  error:      "bg-red-50 text-red-700 border border-red-200",
  waiting:    "bg-sky-50 text-sky-700 border border-sky-200",
  review:     "bg-violet-50 text-violet-700 border border-violet-200",
  draft:      "bg-gray-50 text-gray-600 border border-gray-200",
  info:       "bg-blue-50 text-blue-700 border border-blue-200",
  purple:     "bg-purple-50 text-purple-700 border border-purple-200",
  teal:       "bg-teal-50 text-teal-700 border border-teal-200",
  orange:     "bg-orange-50 text-orange-700 border border-orange-200",
  cyan:       "bg-cyan-50 text-cyan-700 border border-cyan-200",
  lime:       "bg-lime-50 text-lime-700 border border-lime-200",
};

const FALLBACK = "bg-gray-50 text-gray-500 border border-gray-200";

export const BOM_LINE_STATES = {
  RAW:          { label: "Raw",            color: COLOR.draft,      order: 0 },
  NORMALIZING:  { label: "Normalizing",    color: COLOR.processing, order: 1 },
  NORMALIZED:   { label: "Normalized",     color: COLOR.waiting,    order: 2 },
  NEEDS_REVIEW: { label: "Needs Review",   color: COLOR.review,     order: 3 },
  ENRICHING:    { label: "Enriching",      color: COLOR.processing, order: 4 },
  ENRICHED:     { label: "Enriched",       color: COLOR.waiting,    order: 5 },
  SCORING:      { label: "Scoring",        color: COLOR.processing, order: 6 },
  SCORED:       { label: "Scored",         color: COLOR.success,    order: 7 },
  RFQ_PENDING:  { label: "RFQ Pending",    color: COLOR.purple,     order: 8 },
  RFQ_SENT:     { label: "RFQ Sent",       color: COLOR.purple,     order: 9 },
  QUOTED:       { label: "Quoted",         color: COLOR.waiting,    order: 10 },
  AWARDED:      { label: "Awarded",        color: COLOR.teal,       order: 11 },
  ORDERED:      { label: "Ordered",        color: COLOR.success,    order: 12 },
  DELIVERED:    { label: "Delivered",       color: COLOR.success,    order: 13 },
  CLOSED:       { label: "Closed",         color: COLOR.draft,      order: 14 },
  CANCELLED:    { label: "Cancelled",      color: COLOR.error,      order: 15 },
  ERROR:        { label: "Error",          color: COLOR.error,      order: 16 },
};

export const PROJECT_STATES = {
  DRAFT:                   { label: "Draft",                 color: COLOR.draft,      order: 0 },
  INTAKE_COMPLETE:         { label: "Intake Complete",       color: COLOR.waiting,    order: 1 },
  ANALYSIS_IN_PROGRESS:    { label: "Analyzing",             color: COLOR.processing, order: 2 },
  ANALYSIS_COMPLETE:       { label: "Analysis Complete",     color: COLOR.success,    order: 3 },
  SOURCING_ACTIVE:         { label: "Sourcing Active",       color: COLOR.info,       order: 4 },
  ORDERING_IN_PROGRESS:    { label: "Ordering",              color: COLOR.processing, order: 5 },
  EXECUTION_ACTIVE:        { label: "Execution Active",      color: COLOR.teal,       order: 6 },
  PARTIALLY_DELIVERED:     { label: "Partially Delivered",   color: COLOR.waiting,    order: 7 },
  FULLY_DELIVERED:         { label: "Fully Delivered",       color: COLOR.success,    order: 8 },
  CLOSED:                  { label: "Closed",                color: COLOR.draft,      order: 9 },
  CANCELLED:               { label: "Cancelled",             color: COLOR.error,      order: 10 },
  ARCHIVED:                { label: "Archived",              color: COLOR.draft,      order: 11 },
};

export const SESSION_STATES = {
  ACTIVE:              { label: "Active",              color: COLOR.waiting,    order: 0 },
  RFQ_SENT:            { label: "RFQ Sent",            color: COLOR.purple,     order: 1 },
  QUOTED:              { label: "Quoted",               color: COLOR.waiting,    order: 2 },
  ORDERED:             { label: "Ordered",              color: COLOR.success,    order: 3 },
  DELIVERED:           { label: "Delivered",             color: COLOR.success,    order: 4 },
  CLOSED:              { label: "Closed",               color: COLOR.draft,      order: 5 },
  PROMOTED_TO_PROJECT: { label: "Promoted to Project", color: COLOR.success,    order: 6 },
};

export const RFQ_STATES = {
  DRAFT:               { label: "Draft",               color: COLOR.draft,      order: 0 },
  SENT:                { label: "Sent",                color: COLOR.purple,     order: 1 },
  PARTIALLY_RESPONDED: { label: "Partially Responded", color: COLOR.processing, order: 2 },
  FULLY_RESPONDED:     { label: "Fully Responded",     color: COLOR.success,    order: 3 },
  CLOSED:              { label: "Closed",              color: COLOR.draft,      order: 4 },
  EXPIRED:             { label: "Expired",             color: COLOR.error,      order: 5 },
  CANCELLED:           { label: "Cancelled",           color: COLOR.error,      order: 6 },
};

export const QUOTE_STATES = {
  PENDING:             { label: "Pending",             color: COLOR.processing, order: 0 },
  DRAFT:               { label: "Draft",               color: COLOR.draft,      order: 1 },
  SUBMITTED:           { label: "Submitted",           color: COLOR.waiting,    order: 2 },
  REVISION_REQUESTED:  { label: "Revision Requested",  color: COLOR.review,     order: 3 },
  REVISED:             { label: "Revised",             color: COLOR.waiting,    order: 4 },
  ACCEPTED:            { label: "Accepted",            color: COLOR.success,    order: 5 },
  REJECTED:            { label: "Rejected",            color: COLOR.error,      order: 6 },
  EXPIRED:             { label: "Expired",             color: COLOR.error,      order: 7 },
  WITHDRAWN:           { label: "Withdrawn",           color: COLOR.draft,      order: 8 },
};

export const PO_STATES = {
  PO_APPROVED:           { label: "Approved",            color: COLOR.success,    order: 0 },
  PO_SENT:               { label: "Sent",                color: COLOR.purple,     order: 1 },
  VENDOR_ACCEPTED:       { label: "Vendor Accepted",     color: COLOR.teal,       order: 2 },
  PRODUCTION_STARTED:    { label: "In Production",       color: COLOR.lime,       order: 3 },
  QUALITY_CHECK:         { label: "Quality Check",       color: COLOR.cyan,       order: 4 },
  PACKED:                { label: "Packed",               color: COLOR.waiting,    order: 5 },
  SHIPPED:               { label: "Shipped",              color: COLOR.waiting,    order: 6 },
  CUSTOMS:               { label: "Customs",              color: COLOR.orange,     order: 7 },
  IN_TRANSIT:            { label: "In Transit",           color: COLOR.waiting,    order: 8 },
  DELIVERED:             { label: "Delivered",             color: COLOR.success,    order: 9 },
  GR_CONFIRMED:          { label: "GR Confirmed",         color: COLOR.success,    order: 10 },
  CLOSED:                { label: "Closed",               color: COLOR.draft,      order: 11 },
  CANCELLED:             { label: "Cancelled",            color: COLOR.error,      order: 12 },
  ON_HOLD:               { label: "On Hold",              color: COLOR.orange,     order: 13 },
  CHANGE_ORDER_PENDING:  { label: "Change Order Pending", color: COLOR.review,     order: 14 },
};

export const SHIPMENT_STATES = {
  BOOKED:           { label: "Booked",            color: COLOR.info,       order: 0 },
  PICKED_UP:        { label: "Picked Up",         color: COLOR.processing, order: 1 },
  IN_TRANSIT:       { label: "In Transit",        color: COLOR.waiting,    order: 2 },
  CUSTOMS_HOLD:     { label: "Customs Hold",      color: COLOR.orange,     order: 3 },
  CUSTOMS_CLEARED:  { label: "Customs Cleared",   color: COLOR.teal,       order: 4 },
  OUT_FOR_DELIVERY: { label: "Out for Delivery",  color: COLOR.processing, order: 5 },
  DELIVERED:        { label: "Delivered",          color: COLOR.success,    order: 6 },
  DELIVERY_FAILED:  { label: "Delivery Failed",   color: COLOR.error,      order: 7 },
  RETURNED:         { label: "Returned",           color: COLOR.error,      order: 8 },
};

export const INVOICE_STATES = {
  RECEIVED:           { label: "Received",           color: COLOR.waiting,    order: 0 },
  VALIDATING:         { label: "Validating",         color: COLOR.processing, order: 1 },
  VALIDATED:          { label: "Validated",           color: COLOR.success,    order: 2 },
  VALIDATION_FAILED:  { label: "Validation Failed",  color: COLOR.error,      order: 3 },
  APPROVED:           { label: "Approved",            color: COLOR.success,    order: 4 },
  DISPUTED:           { label: "Disputed",            color: COLOR.orange,     order: 5 },
  DISPUTE_RESOLVED:   { label: "Dispute Resolved",   color: COLOR.teal,       order: 6 },
  PAYMENT_PENDING:    { label: "Payment Pending",    color: COLOR.processing, order: 7 },
  PAYMENT_INITIATED:  { label: "Payment Initiated",  color: COLOR.waiting,    order: 8 },
  PAID:               { label: "Paid",               color: COLOR.success,    order: 9 },
  CANCELLED:          { label: "Cancelled",           color: COLOR.error,      order: 10 },
};

export const VENDOR_STATES = {
  GHOST:        { label: "Ghost",        color: COLOR.draft,      order: 0 },
  INVITED:      { label: "Invited",      color: COLOR.processing, order: 1 },
  CLAIM_PENDING:{ label: "Claim Pending",color: COLOR.review,     order: 2 },
  BASIC:        { label: "Basic",        color: COLOR.waiting,    order: 3 },
  STANDARD:     { label: "Standard",     color: COLOR.teal,       order: 4 },
  PREMIUM:      { label: "Premium",      color: COLOR.success,    order: 5 },
  SUSPENDED:    { label: "Suspended",    color: COLOR.orange,     order: 6 },
  DEACTIVATED:  { label: "Deactivated",  color: COLOR.error,      order: 7 },
};

const ALL_STATES = { ...BOM_LINE_STATES, ...PROJECT_STATES, ...SESSION_STATES, ...RFQ_STATES, ...QUOTE_STATES, ...PO_STATES, ...SHIPMENT_STATES, ...INVOICE_STATES, ...VENDOR_STATES };

export function getStatusMeta(status) {
  if (!status) return { label: "—", color: FALLBACK };
  const upper = status.toUpperCase();
  const meta = ALL_STATES[upper];
  if (meta) return meta;
  const lower = status.toLowerCase();
  for (const [key, val] of Object.entries(ALL_STATES)) {
    if (key.toLowerCase() === lower) return val;
  }
  return { label: status.replace(/_/g, " "), color: FALLBACK };
}

export { FALLBACK };
