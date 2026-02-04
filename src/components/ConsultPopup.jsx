import { useEffect, useState, useCallback } from "react";

const WHATSAPP_NUMBER = "918921983250"; // country code + number (no +, no spaces)

export default function ConsultPopup({ delayMs = 10000 }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    localStorage.setItem("PGI_consult_popup_dismissed", "1");
  }, []);

  const openWhatsApp = useCallback(() => {
    const text = encodeURIComponent(
      `Engage with PGI.

I would like to schedule a strategic consultation. Our requirements are as follows:

Project Deployment Location: [City, Country]

Operational Scope: [Describe your procurement or logistics needs]

Target Timeline: [Start Date/Deadline]`
    );

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
    close();
  }, [close]);

  useEffect(() => {
    const dismissed = localStorage.getItem("PGI_consult_popup_dismissed");
    if (dismissed === "1") return;

    const t = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close popup"
        onClick={close}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[rgb(var(--bg-900))] ring-1 ring-white/10 shadow-soft">
        <div className="p-6 sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold ring-1 ring-white/10">
            <span className="h-2 w-2 rounded-full bg-[rgb(var(--brand-500))] animate-pulse" />
            Free Consultation
          </div>

          <h3 className="mt-3 text-2xl font-semibold">Request a consultation</h3>

          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            Submit your location, scope, and timeline. We will engineer the optimal strategic plan, fiscal framework, and execution roadmap for your project.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={openWhatsApp}
              className="flex-1 rounded-xl bg-[rgb(var(--brand-600)/0.25)] px-4 py-3 text-sm font-semibold ring-1 ring-[rgb(var(--brand-500)/0.35)] transition hover:bg-[rgb(var(--brand-600)/0.35)]"
            >
              WhatsApp now
            </button>

            <button
              type="button"
              onClick={close}
              className="rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Later
            </button>
          </div>

          <div className="mt-4 text-xs text-white/45">
            Tip: Press <span className="font-mono">Esc</span> to close.
          </div>
        </div>
      </div>
    </div>
  );
}
