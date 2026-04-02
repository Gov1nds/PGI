import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import { getProject, getVendor, getVendorMatch, getVendorScorecard, submitVendorFeedback } from "../lib/api";

const fmt = (n, d = 2) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};

function ScoreBar({ label, value }) {
  const pct = Math.max(0, Math.min(100, Math.round((Number(value) || 0) * 100)));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-white/40">{label}</span>
        <span className="text-xs text-white/70">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full bg-orange-500 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function VendorDiscovery() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [project, setProject] = useState(null);
  const [run, setRun] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [scorecard, setScorecard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [regions, setRegions] = useState("");
  const [certifications, setCertifications] = useState("");
  const [maxMoq, setMaxMoq] = useState("");
  const [maxLeadTime, setMaxLeadTime] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [limit, setLimit] = useState(20);

  const [rating, setRating] = useState("");
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [predictedCost, setPredictedCost] = useState("");
  const [actualLeadDays, setActualLeadDays] = useState("");
  const [predictedLeadDays, setPredictedLeadDays] = useState("");
  const [qualityOk, setQualityOk] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    loadProject();
  }, [authLoading, projectId, user]);

  const loadProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProject(projectId);
      setProject(data);
      await loadMatch({
        search,
        regions,
        certifications,
        max_moq: maxMoq,
        max_lead_time: maxLeadTime,
        max_price: maxPrice,
        limit,
      });
    } catch (err) {
      setError(err.message || "Failed to load vendor discovery");
    } finally {
      setLoading(false);
    }
  };

  const loadMatch = async (filters) => {
    const data = await getVendorMatch(projectId, filters);
    setRun(data);
    if (data?.items?.length) {
      const first = data.items[0];
      setSelectedVendorId(first.vendor_id);
      await loadVendorDetails(first.vendor_id);
    } else {
      setSelectedVendorId(null);
      setVendorProfile(null);
      setScorecard(null);
    }
  };

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      await loadMatch({
        search,
        regions,
        certifications,
        max_moq: maxMoq,
        max_lead_time: maxLeadTime,
        max_price: maxPrice,
        limit,
      });
    } catch (err) {
      setError(err.message || "Failed to refresh shortlist");
    } finally {
      setLoading(false);
    }
  };

  const loadVendorDetails = async (vendorId) => {
    setDrawerLoading(true);
    try {
      const [profile, sc] = await Promise.all([
        getVendor(vendorId),
        getVendorScorecard(vendorId, projectId),
      ]);
      setVendorProfile(profile);
      setScorecard(sc);
      setSelectedVendorId(vendorId);
      setRating("");
      setFeedbackNotes("");
      setActualCost("");
      setPredictedCost("");
      setActualLeadDays("");
      setPredictedLeadDays("");
      setQualityOk(true);
    } catch (err) {
      setError(err.message || "Failed to load vendor profile");
    } finally {
      setDrawerLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!selectedVendorId) return;
    setSubmitting(true);
    try {
      await submitVendorFeedback(selectedVendorId, {
        project_id: projectId,
        match_run_id: run?.run_id,
        rating: rating === "" ? null : Number(rating),
        notes: feedbackNotes || null,
        actual_cost: actualCost === "" ? null : Number(actualCost),
        predicted_cost: predictedCost === "" ? null : Number(predictedCost),
        actual_lead_days: actualLeadDays === "" ? null : Number(actualLeadDays),
        predicted_lead_days: predictedLeadDays === "" ? null : Number(predictedLeadDays),
        quality_ok: qualityOk,
        response_status: "feedback_received",
      });
      await loadVendorDetails(selectedVendorId);
      await loadMatch({
        search,
        regions,
        certifications,
        max_moq: maxMoq,
        max_lead_time: maxLeadTime,
        max_price: maxPrice,
        limit,
      });
    } catch (err) {
      setError(err.message || "Feedback submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const shortlist = useMemo(() => run?.items || [], [run]);

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading vendor discovery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060a]">
      <section className="border-b border-white/[0.06]">
        <Container className="py-8">
          <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
            <button onClick={() => navigate(`/project/${projectId}`)} className="hover:text-white/60 transition-colors">Project</button>
            <span>/</span>
            <span className="text-white/60">Vendor discovery</span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Vendor discovery</h1>
              <p className="text-white/35 mt-2">
                {project?.name || "Project"} · ranked shortlist with reasons, filters, and scorecard drill-down
              </p>
            </div>

            <Link
              to={`/project/${projectId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08]"
            >
              Back to project
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search vendor / capability"
                  className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                />
                <input
                  value={regions}
                  onChange={(e) => setRegions(e.target.value)}
                  placeholder="Regions, comma-separated"
                  className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                />
                <input
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="Certifications"
                  className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                />
                <input
                  value={maxMoq}
                  onChange={(e) => setMaxMoq(e.target.value)}
                  placeholder="Max MOQ"
                  type="number"
                  className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                />
                <input
                  value={maxLeadTime}
                  onChange={(e) => setMaxLeadTime(e.target.value)}
                  placeholder="Max lead time"
                  type="number"
                  className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                />
                <input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max price"
                  type="number"
                  className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  type="number"
                  min={1}
                  max={50}
                  className="w-24 rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none"
                />
                <button
                  onClick={applyFilters}
                  className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 transition-all"
                >
                  Apply filters
                </button>
                <span className="text-xs text-white/35">
                  {run?.total_vendors_considered || 0} vendors considered · {shortlist.length} shortlisted
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
              <div className="border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">Shortlist</h2>
                <span className="text-xs text-white/30">Ranked by score</span>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {shortlist.length === 0 ? (
                  <div className="p-6 text-sm text-white/35">No vendors matched your filters.</div>
                ) : (
                  shortlist.map((item) => (
                    <button
                      key={item.match_id}
                      onClick={() => loadVendorDetails(item.vendor_id)}
                      className={`w-full text-left p-5 hover:bg-white/[0.03] transition-all ${selectedVendorId === item.vendor_id ? "bg-white/[0.04]" : ""}`}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[60px_1fr_220px] md:items-center">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/30">Rank</p>
                          <p className="text-2xl font-semibold text-white">{item.rank}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-medium text-white">{item.vendor_name}</h3>
                            <span className="rounded-lg bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-400">
                              {(item.region || item.country || "unknown").replace(/_/g, " ")}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-white/35">
                            {item.capabilities?.slice(0, 4).join(" · ") || "No capabilities listed"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(item.reason_codes || []).slice(0, 5).map((code) => (
                              <span key={code} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/45">
                                {code.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-right md:text-left">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/25">Score</p>
                            <p className="text-lg font-semibold text-orange-400">{fmt(item.score * 100, 1)}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/25">Lead time</p>
                            <p className="text-sm text-white">{item.avg_lead_time_days ? `${fmt(item.avg_lead_time_days)} d` : "—"}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">Vendor profile</h2>
              </div>

              <div className="p-5">
                {!vendorProfile ? (
                  <p className="text-sm text-white/35">Select a vendor to inspect profile and scorecard.</p>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-white">{vendorProfile.name}</h3>
                    <p className="text-sm text-white/35 mt-1">{vendorProfile.region || vendorProfile.country || "Unknown region"}</p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-white/25">Reliability</p>
                        <p className="mt-1 text-white font-semibold">{fmt((vendorProfile.reliability_score || 0) * 100, 1)}%</p>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-white/25">Lead time</p>
                        <p className="mt-1 text-white font-semibold">{fmt(vendorProfile.avg_lead_time_days)} d</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wider text-white/25 mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {(vendorProfile.certifications || []).length === 0 ? (
                          <span className="text-xs text-white/35">None listed</span>
                        ) : vendorProfile.certifications.map((c) => (
                          <span key={c} className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wider text-white/25 mb-2">Capabilities</p>
                      <div className="flex flex-wrap gap-2">
                        {(vendorProfile.capabilities || []).length === 0 ? (
                          <span className="text-xs text-white/35">None listed</span>
                        ) : vendorProfile.capabilities.map((c) => (
                          <span key={c} className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/60">
                            {c.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">Match scorecard</h2>
              </div>

              <div className="p-5">
                {!scorecard ? (
                  <p className="text-sm text-white/35">{drawerLoading ? "Loading scorecard..." : "No scorecard loaded."}</p>
                ) : (
                  <div className="space-y-4">
                    <ScoreBar label="Process fit" value={scorecard.scorecard?.subscores?.process_fit || 0} />
                    <ScoreBar label="Material fit" value={scorecard.scorecard?.subscores?.material_fit || 0} />
                    <ScoreBar label="Capacity fit" value={scorecard.scorecard?.subscores?.capacity_fit || 0} />
                    <ScoreBar label="Price fit" value={scorecard.scorecard?.subscores?.price_fit || 0} />
                    <ScoreBar label="Lead-time fit" value={scorecard.scorecard?.subscores?.lead_time_fit || 0} />
                    <ScoreBar label="Quality fit" value={scorecard.scorecard?.subscores?.quality_fit || 0} />
                    <ScoreBar label="Logistics fit" value={scorecard.scorecard?.subscores?.logistics_fit || 0} />
                    <ScoreBar label="Tariff fit" value={scorecard.scorecard?.subscores?.tariff_fit || 0} />
                    <ScoreBar label="Currency fit" value={scorecard.scorecard?.subscores?.currency_fit || 0} />

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25">Overall score</p>
                      <p className="text-2xl font-semibold text-orange-400 mt-1">
                        {fmt((scorecard.scorecard?.overall_score || 0) * 100, 1)}%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/25 mb-2">Reasons</p>
                      <div className="flex flex-wrap gap-2">
                        {(scorecard.project_match?.match?.reason_codes || scorecard.scorecard?.latest_match?.reason_codes || []).map((r) => (
                          <span key={r} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/50">
                            {r.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wider text-white/25 mb-2">Match summary</p>
                      <p className="text-sm text-white/70">
                        {scorecard.scorecard?.latest_match?.explanation_json?.summary || scorecard.project_match?.match?.explanation_json?.summary || "No summary available."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">Feedback</h2>
              </div>

              <div className="p-5 space-y-3">
                <input value={rating} onChange={(e) => setRating(e.target.value)} type="number" min="0" max="5" step="0.5" placeholder="Rating 0-5" className="w-full rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none" />
                <textarea value={feedbackNotes} onChange={(e) => setFeedbackNotes(e.target.value)} placeholder="Feedback notes" className="w-full rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none min-h-[96px]" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={actualCost} onChange={(e) => setActualCost(e.target.value)} type="number" placeholder="Actual cost" className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none" />
                  <input value={predictedCost} onChange={(e) => setPredictedCost(e.target.value)} type="number" placeholder="Predicted cost" className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none" />
                  <input value={actualLeadDays} onChange={(e) => setActualLeadDays(e.target.value)} type="number" placeholder="Actual lead days" className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none" />
                  <input value={predictedLeadDays} onChange={(e) => setPredictedLeadDays(e.target.value)} type="number" placeholder="Predicted lead days" className="rounded-xl border border-white/[0.06] bg-[#06060a] px-4 py-3 text-sm text-white outline-none" />
                </div>

                <label className="flex items-center gap-2 text-sm text-white/60">
                  <input type="checkbox" checked={qualityOk} onChange={(e) => setQualityOk(e.target.checked)} />
                  Quality OK
                </label>

                <button
                  onClick={submitFeedback}
                  disabled={submitting || !selectedVendorId}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Save feedback"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}