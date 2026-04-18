import { useState, useEffect } from "react";
import { LoadingState, EmptyState, StatusBadge } from "../../components/Shared";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { listVendorCertifications, uploadVendorCertification } from "../../lib/api";

export default function VendorCertifications() {
  const { vendorAccessToken } = useVendorAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchCerts = () => {
    listVendorCertifications(vendorAccessToken)
      .then(data => setCerts(data.items || data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCerts(); }, [vendorAccessToken]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadVendorCertification(file, vendorAccessToken);
      fetchCerts();
    } catch {}
    setUploading(false);
  };

  if (loading) return <LoadingState />;

  const now = new Date();
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#0A0A0A]">Certifications</h1>
        <label className="px-4 py-2 bg-[#0A0A0A] text-white text-xs rounded-lg hover:bg-[#1A1A1A] font-medium cursor-pointer">
          {uploading ? "Uploading..." : "+ Upload Certificate"}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {certs.length === 0 ? <EmptyState title="No certifications" description="Upload certifications to improve your vendor profile" /> :
        <div className="space-y-2">
          {certs.map(cert => {
            const expiry = cert.expiry_date ? new Date(cert.expiry_date) : null;
            const soonExpiring = expiry && expiry > now && (expiry - now) < 30 * 24 * 60 * 60 * 1000;
            const expired = expiry && expiry < now;
            return (
              <div key={cert.cert_id || cert.id} className="card flex items-center justify-between p-4">
                <div>
                  <div className="text-sm font-medium text-[#0A0A0A]">{cert.name || cert.type}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">
                    {cert.issued_date && `Issued: ${cert.issued_date.slice(0,10)}`}
                    {cert.expiry_date && ` · Expires: ${cert.expiry_date.slice(0,10)}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {expired && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Expired</span>}
                  {soonExpiring && !expired && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Expiring soon</span>}
                  {!expired && !soonExpiring && <StatusBadge status={cert.status || "active"} />}
                </div>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
