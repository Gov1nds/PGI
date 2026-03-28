import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ConsultPopup({ delayMs = 10000 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("pgi-popup-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("pgi-popup-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f1423] ring-1 ring-white/[0.08] p-8 shadow-2xl shadow-black/40 animate-[fadeInScale_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-all"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 ring-1 ring-sky-500/20 mb-5">
            <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Analyze Your BOM Instantly</h3>
          <p className="mt-3 text-sm text-white/65 leading-relaxed">
            Upload your Bill of Materials for instant cost analysis, sourcing strategy, and manufacturing recommendations.
          </p>
          <div className="mt-7 flex flex-col gap-2.5">
            <Link
              to="/bom-analyzer"
              onClick={dismiss}
              className="btn-primary rounded-xl px-5 py-3.5 text-sm font-semibold text-white text-center"
            >
              Try BOM Analyzer Free
            </Link>
            <button
              onClick={dismiss}
              className="text-sm text-white/45 hover:text-white/60 transition-colors py-1"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
