import { useEffect, useState } from "react";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import {
  getSpendAnalytics,
  getVendorAnalytics,
  getCategoryAnalytics,
  getTrendAnalytics,
  getSavingsAnalytics,
} from "../lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";

const fmt = (n, d = 2) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};

function Card({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
      <p className="text-xs uppercase tracking-wider text-white/35">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-2 text-xs text-white/35">{hint}</p>}
    </div>
  );
}

const COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#fb7185", "#22d3ee"];

export default function Analytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [spend, setSpend] = useState(null);
  const [vendors, setVendors] = useState(null);
  const [categories, setCategories] = useState(null);
  const [trends, setTrends] = useState(null);
  const [savings, setSavings] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const filters = { projectId: projectId || null, startDate: startDate || null, endDate: endDate || null };
      const [sp, vd, cat, tr, sv] = await Promise.all([
        getSpendAnalytics(filters),
        getVendorAnalytics(filters),
        getCategoryAnalytics(filters),
        getTrendAnalytics(filters),
        getSavingsAnalytics(filters),
      ]);
      setSpend(sp);
      setVendors(vd);
      setCategories(cat);
      setTrends(tr);
      setSavings(sv);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const vendorChart = (vendors?.vendors || []).slice(0, 10).map((v) => ({
    name: v.vendor_name || v.vendor_id || "Vendor",
    spend: v.paid_spend || 0,
    on_time_rate: v.on_time_rate != null ? Number(v.on_time_rate) * 100 : 0,
  }));

  const categoryChart = (categories?.categories || []).slice(0, 10).map((c) => ({
    name: c.category,
    spend: c.paid_spend || 0,
  }));

  const regionChart = (spend?.by_region || []).slice(0, 8).map((r) => ({
    name: r.region,
    value: r.total_spend || 0,
  }));

  const trendChart = (trends?.monthly || []).map((m) => ({
    month: m.month,
    committed: m.committed_spend || 0,
    invoiced: m.invoiced_spend || 0,
    paid: m.paid_spend || 0,
    savings: m.savings_realized || 0,
  }));

  return (
    <div className="min-h-screen bg-[#010409]">
      <section className="border-b border-white/[0.06]">
        <Container className="py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics Center</h1>
              <p className="mt-2 text-white/35">
                Spend ledger, savings realized, vendor performance, and execution trends.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard" className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm text-white hover:bg-white/[0.08]">
                Dashboard
              </Link>
              <button onClick={load} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Card title="Committed spend" value={fmt(spend?.totals?.committed_spend || 0)} />
            <Card title="Invoiced spend" value={fmt(spend?.totals?.invoiced_spend || 0)} />
            <Card title="Paid spend" value={fmt(spend?.totals?.paid_spend || 0)} />
            <Card title="Savings realized" value={fmt(spend?.totals?.savings_realized || 0)} />
            <Card title="Quote → order" value={spend?.quote_to_order_conversion != null ? `${fmt(spend.quote_to_order_conversion * 100, 1)}%` : "—"} />
            <Card title="On-time rate" value={spend?.vendor_on_time_rate != null ? `${fmt(spend.vendor_on_time_rate * 100, 1)}%` : "—"} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project ID filter" className="rounded-xl border border-white/[0.06] bg-[#0d1117] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25" />
            <input value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start date (YYYY-MM-DD)" className="rounded-xl border border-white/[0.06] bg-[#0d1117] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25" />
            <input value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End date (YYYY-MM-DD)" className="rounded-xl border border-white/[0.06] bg-[#0d1117] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25" />
          </div>
        </Container>
      </section>

      <Container className="py-8 space-y-8">
        {loading ? (
          <div className="text-sm text-white/35">Loading analytics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/55">Spend by vendor</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vendorChart}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                      <XAxis dataKey="name" tick={{ fill: "#fff", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#fff", fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="spend" fill="#38bdf8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/55">Spend by category</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChart}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                      <XAxis dataKey="name" tick={{ fill: "#fff", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#fff", fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="spend" fill="#a78bfa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/55">Spend by region</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={regionChart} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} label>
                        {regionChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/55">Lead-time and spend trend</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendChart}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                      <XAxis dataKey="month" tick={{ fill: "#fff", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#fff", fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="committed" stroke="#38bdf8" />
                      <Line type="monotone" dataKey="paid" stroke="#34d399" />
                      <Line type="monotone" dataKey="savings" stroke="#fbbf24" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/55">Vendor on-time rate</h2>
                <div className="space-y-3">
                  {(vendors?.vendors || []).slice(0, 10).map((v) => (
                    <div key={v.vendor_id || v.vendor_name} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white">{v.vendor_name || v.vendor_id}</p>
                        <p className="text-sm text-emerald-400">{v.on_time_rate != null ? `${fmt(v.on_time_rate * 100, 1)}%` : "—"}</p>
                      </div>
                      <p className="mt-1 text-xs text-white/35">
                        Paid spend {fmt(v.paid_spend || 0)} · Lead time {v.avg_lead_time_days != null ? fmt(v.avg_lead_time_days) : "—"} days
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/55">Savings realized</h2>
                <div className="space-y-3">
                  {(savings?.savings || []).slice(0, 12).map((s) => (
                    <div key={s.id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white">{s.source_type} · {s.source_id}</p>
                        <p className="text-sm text-sky-400">{fmt(s.realized_amount || 0)}</p>
                      </div>
                      <p className="mt-1 text-xs text-white/35">
                        Baseline {fmt(s.baseline_amount || 0)} · Actual {fmt(s.actual_amount || 0)} · {s.currency || "USD"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}