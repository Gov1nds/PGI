import { useState, useEffect } from "react";
import { LoadingState, ErrorState } from "../../components/Shared";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { getVendorProfile, updateVendorProfile, getVendorProfileCompletion } from "../../lib/api";

export default function VendorProfile() {
  const { vendorUser, vendorAccessToken } = useVendorAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const isAdmin = vendorUser?.role === "vendor_admin";

  useEffect(() => {
    getVendorProfile(vendorAccessToken)
      .then(setProfile)
      .catch(e => setError(e))
      .finally(() => setLoading(false));
  }, [vendorAccessToken]);

  const handleSave = async () => {
    setSaving(true); setSuccess(false); setError(null);
    try {
      await updateVendorProfile(profile, vendorAccessToken);
      setSuccess(true);
    } catch (e) { setError(e); }
    setSaving(false);
  };

  const upd = (field, val) => setProfile(p => ({ ...p, [field]: val }));

  if (loading) return <LoadingState />;
  if (error && !profile) return <ErrorState error={error} message="Failed to load profile" />;

  const completionFields = ["name","country","region","capabilities","contact_email","certifications","commercial_terms","equipment"];
  const filled = completionFields.filter(f => profile?.[f] && (Array.isArray(profile[f]) ? profile[f].length > 0 : true)).length;
  const completionPct = profile?.completion_pct || Math.round((filled / completionFields.length) * 100);
  const missingFields = completionFields.filter(f => !profile?.[f] || (Array.isArray(profile[f]) && profile[f].length === 0));

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Vendor Profile</h1>
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-zinc-500">{completionPct}% complete</div>
          <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {!isAdmin && <div className="mb-4 rounded-xl border border-amber-400/15 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">View only — contact your vendor admin to edit profile.</div>}
      
      {missingFields.length > 0 && isAdmin && (
        <div className="mb-4 rounded-xl border border-indigo-400/15 bg-indigo-500/[0.06] px-4 py-3 text-xs text-indigo-200">
          <div className="font-medium mb-1">Complete your profile to improve visibility</div>
          <div className="text-indigo-200/50">Missing: {missingFields.map(f => f.replace(/_/g, " ")).join(", ")}</div>
        </div>
      )}

      {profile && (
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Identity</h3>
            <div className="space-y-3">
              <div><label className="text-[11px] text-zinc-500 block mb-1">Company Name</label>
                <input value={profile.name || ""} onChange={e => upd("name", e.target.value)} disabled={!isAdmin} className="glass-input rounded-lg px-3 py-2 text-sm w-full" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[11px] text-zinc-500 block mb-1">Country</label>
                  <input value={profile.country || ""} onChange={e => upd("country", e.target.value)} disabled={!isAdmin} className="glass-input rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-[11px] text-zinc-500 block mb-1">Region</label>
                  <input value={profile.region || ""} onChange={e => upd("region", e.target.value)} disabled={!isAdmin} className="glass-input rounded-lg px-3 py-2 text-sm" /></div>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Capabilities</h3>
            <textarea value={profile.capabilities || ""} onChange={e => upd("capabilities", e.target.value)} disabled={!isAdmin} rows={3} placeholder="e.g., CNC machining, injection molding, PCB assembly" className="glass-textarea rounded-lg px-3 py-2 text-sm w-full" />
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Contact</h3>
            <input value={profile.contact_email || ""} onChange={e => upd("contact_email", e.target.value)} disabled={!isAdmin} placeholder="contact@vendor.com" className="glass-input rounded-lg px-3 py-2 text-sm w-full" />
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-500 disabled:opacity-50 font-medium">
                {saving ? "Saving..." : "Save Profile"}
              </button>
              {success && <span className="text-xs text-emerald-400">Saved successfully</span>}
              {error && <span className="text-xs text-red-400">{error.message}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
