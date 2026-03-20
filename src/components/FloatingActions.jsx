import React from "react";

export default function FloatingActions() {
  return (
    <>
      <style>{`
        @keyframes fa-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        @keyframes fa-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .fa-button {
          display: inline-grid;
          place-items: center;
          height: 52px;
          width: 52px;
          border-radius: 9999px;
          position: relative;
          z-index: 50;
          transition: transform .2s ease, box-shadow .2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .fa-button:hover { transform: scale(1.05); }
        .fa-button:focus-visible { box-shadow: 0 0 0 3px rgba(14,165,233,0.2); }
        @media (min-width: 768px) {
          .fa-float-anim { animation: fa-float 3.5s ease-in-out infinite; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fa-float-anim { animation: none; }
          .fa-pulse-ring { animation: none; }
        }
        .fa-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(14,165,233,0.15);
          filter: blur(8px);
          z-index: -1;
          animation: fa-pulse 2.4s cubic-bezier(.4,0,.2,1) infinite;
        }
        .fa-tooltip {
          position: absolute;
          right: 64px;
          top: 50%;
          transform: translateY(-50%) translateX(4px);
          background: rgba(10,15,26,0.9);
          color: #fff;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11px;
          opacity: 0;
          pointer-events: none;
          transition: opacity .15s ease, transform .15s ease;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .fa-wrap:hover .fa-tooltip { opacity: 1; transform: translateY(-50%) translateX(0); }
      `}</style>

      {/* Desktop floating buttons */}
      <div className="hidden md:flex fixed right-5 bottom-8 z-50 flex-col items-end gap-2.5">
        <div className="fa-wrap relative group">
          <a href="https://wa.me/918921983250" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fa-button fa-float-anim" style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "white", boxShadow: "0 8px 24px rgba(16,185,129,0.2)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M20.5 3.5A11.9 11.9 0 0012 .5 11.9 11.9 0 003.5 9.2c0 2.1.6 4.1 1.7 5.9L3 22l7-1.9c1.7 1 3.6 1.5 5.5 1.5 6.6 0 12-5.4 12-12 0-1.6-.3-3.1-.8-4.5zM12 20.3c-1.6 0-3.2-.4-4.6-1.2l-.3-.2-4.1 1.1 1.1-4.1-.2-.3A8.9 8.9 0 013.7 9.2 8.8 8.8 0 1112 20.3z" /><path d="M16.2 13.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.2-.5.1s-.5.6-.6.7c-.1.1-.2.1-.4 0-.4-.2-1.3-.8-2.1-1.6-.6-.6-1-1.2-1.2-1.6-.1-.3 0-.5.2-.7.2-.2.4-.4.6-.6.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.3-1.2-.5-1.6-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 .9-1 2.2 0 1.3.8 2.4.9 2.6.1.2 1.4 2.2 3.3 3.1.5.2.9.3 1.2.4.5.1 1 .1 1.4.1.4 0 1.1-.3 1.4-.9.3-.6.3-1.1.2-1.3-.1-.1-.1-.2-.3-.3z" /></svg>
          </a>
          <div className="fa-tooltip">WhatsApp</div>
        </div>

        <div className="fa-wrap relative group">
          <div aria-hidden className="fa-pulse-ring" style={{ width: 52, height: 52 }} />
          <a href="tel:+918921983250" className="fa-button fa-float-anim" aria-label="Call now" style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)", color: "white", boxShadow: "0 12px 32px rgba(14,165,233,0.2)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M3 5a2 2 0 012-2h2.2a1 1 0 01.97.76l.6 2.4a1 1 0 01-.27.98L7.9 8.1a16 16 0 006 6l.95-.6a1 1 0 01.98-.27l2.4.6a1 1 0 01.76.97V19a2 2 0 01-2 2h-1C8.8 21 3 15.2 3 8V5z" /></svg>
          </a>
          <div className="fa-tooltip">Call now</div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden fixed left-0 right-0 bottom-0 z-50 px-3 pb-safe">
        <div className="flex gap-2.5 p-2.5 mx-auto max-w-lg rounded-t-xl bg-[rgba(10,15,26,0.9)] backdrop-blur-xl border border-white/[0.06] border-b-0">
          <a href="tel:+918921983250" aria-label="Call now" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg flex-1 justify-center text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 5a2 2 0 012-2h2.2a1 1 0 01.97.76l.6 2.4a1 1 0 01-.27.98L7.9 8.1a16 16 0 006 6l.95-.6a1 1 0 01.98-.27l2.4.6a1 1 0 01.76.97V19a2 2 0 01-2 2h-1C8.8 21 3 15.2 3 8V5z" /></svg>
            Call
          </a>
          <a href="https://wa.me/918921983250" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg flex-1 justify-center text-sm font-semibold bg-white/5 text-white/80 ring-1 ring-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.9 11.9 0 0012 .5 11.9 11.9 0 003.5 9.2c0 2.1.6 4.1 1.7 5.9L3 22l7-1.9c1.7 1 3.6 1.5 5.5 1.5 6.6 0 12-5.4 12-12 0-1.6-.3-3.1-.8-4.5zM12 20.3c-1.6 0-3.2-.4-4.6-1.2l-.3-.2-4.1 1.1 1.1-4.1-.2-.3A8.9 8.9 0 013.7 9.2 8.8 8.8 0 1112 20.3z" /><path d="M16.2 13.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.2-.5.1s-.5.6-.6.7c-.1.1-.2.1-.4 0-.4-.2-1.3-.8-2.1-1.6-.6-.6-1-1.2-1.2-1.6-.1-.3 0-.5.2-.7.2-.2.4-.4.6-.6.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.3-1.2-.5-1.6-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 .9-1 2.2 0 1.3.8 2.4.9 2.6.1.2 1.4 2.2 3.3 3.1.5.2.9.3 1.2.4.5.1 1 .1 1.4.1.4 0 1.1-.3 1.4-.9.3-.6.3-1.1.2-1.3-.1-.1-.1-.2-.3-.3z" /></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
