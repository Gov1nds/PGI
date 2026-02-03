import React from "react";

/**
 * FloatingActions.jsx
 *
 * - Responsive: vertical floating buttons on md+; full-width bottom bar on small screens.
 * - Accessible: keyboard focus, aria-labels, respects prefers-reduced-motion.
 * - Visual: premium glass, subtle gradients, stronger contrast.
 *
 * Usage: import FloatingActions from "./FloatingActions";
 * Place near page root (e.g., inside <body> or layout) so it's above other content.
 */

export default function FloatingActions() {
  return (
    <>
      <style>{`
        /* Gentle float used on desktop buttons */
        @keyframes fa-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }

        /* Pulse for primary call button */
        @keyframes fa-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        .fa-button {
          display: inline-grid;
          place-items: center;
          height: 56px;
          width: 56px;
          border-radius: 9999px;
          position: relative;
          z-index: 50;
          transform-origin: center;
          transition: transform .18s ease, box-shadow .18s ease, background-color .18s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .fa-button:focus { outline: none; box-shadow: 0 0 0 4px rgba(16,185,129,0.12); }

        /* desktop float animation */
        @media (min-width: 768px) {
          .fa-float { animation: fa-float 3.6s ease-in-out infinite; }
        }

        /* reduced motion respects user preference */
        @media (prefers-reduced-motion: reduce) {
          .fa-float { animation: none; }
          .fa-pulse-elem { animation: none; opacity: 1; }
        }

        /* pulse element behind primary */
        .fa-pulse-elem {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(16,185,129,0.22);
          filter: blur(10px);
          z-index: -1;
          animation: fa-pulse 2.6s cubic-bezier(.4,0,.2,1) infinite;
        }

        /* small-screen bottom bar */
        .fa-bottom-bar {
          display: flex;
          gap: 12px;
          padding: 10px;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02));
          backdrop-filter: blur(6px);
          border-radius: 12px 12px 0 0;
          box-shadow: 0 -6px 30px rgba(0,0,0,0.12);
        }

        /* tooltips (desktop) */
        .fa-tooltip {
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          background: rgba(0,0,0,0.8);
          color: #fff;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 12px;
          opacity: 0;
          pointer-events: none;
          transition: opacity .14s ease, transform .14s ease;
          white-space: nowrap;
        }
        .fa-wrap:hover .fa-tooltip,
        .fa-wrap:focus-within .fa-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        /* nice focus-visible fallback */
        .fa-button:focus-visible { box-shadow: 0 0 0 4px rgba(34,197,94,0.14); }

        /* visually hide but keep accessible */
        .sr-only {
          position: absolute !important;
          height: 1px; width: 1px;
          overflow: hidden;
          clip: rect(1px, 1px, 1px, 1px);
          white-space: nowrap;
        }
      `}</style>

      {/* Desktop: vertical floating buttons (md+) */}
      <div className="hidden md:flex fixed right-5 bottom-8 z-50 flex-col items-end gap-3">
        {/* WhatsApp */}
        <div className="fa-wrap relative group">
          <a
            href="https://wa.me/919446061029"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="WhatsApp"
            className="fa-button fa-float"
            style={{
              background: "linear-gradient(180deg,#10B981,#059669)",
              color: "white",
              boxShadow: "0 10px 30px rgba(6,95,70,0.18)",
            }}
          >
            {/* refined WhatsApp glyph — filled phone-speech bubble */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="white"
              aria-hidden="true"
            >
              <path d="M20.5 3.5A11.9 11.9 0 0012 .5 11.9 11.9 0 003.5 9.2c0 2.1.6 4.1 1.7 5.9L3 22l7-1.9c1.7 1 3.6 1.5 5.5 1.5 6.6 0 12-5.4 12-12 0-1.6-.3-3.1-.8-4.5zM12 20.3c-1.6 0-3.2-.4-4.6-1.2l-.3-.2-4.1 1.1 1.1-4.1-.2-.3A8.9 8.9 0 013.7 9.2 8.8 8.8 0 1112 20.3z" />
              <path d="M16.2 13.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.2-.5.1s-.5.6-.6.7c-.1.1-.2.1-.4 0-.4-.2-1.3-.8-2.1-1.6-.6-.6-1-1.2-1.2-1.6-.1-.3 0-.5.2-.7.2-.2.4-.4.6-.6.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.3-1.2-.5-1.6-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 .9-1 2.2 0 1.3.8 2.4.9 2.6.1.2 1.4 2.2 3.3 3.1.5.2.9.3 1.2.4.5.1 1 .1 1.4.1.4 0 1.1-.3 1.4-.9.3-.6.3-1.1.2-1.3-.1-.1-.1-.2-.3-.3z" />
            </svg>
          </a>

          <div className="fa-tooltip" role="status" aria-hidden>
            WhatsApp
          </div>
        </div>

        {/* Primary Call */}
        <div className="fa-wrap relative group">
          <div aria-hidden className="fa-pulse-elem" style={{ width: 56, height: 56 }} />
          <a
            href="tel:+917907709032"
            className="fa-button fa-float"
            aria-label="Call now"
            title="Call"
            style={{
              background: "linear-gradient(180deg,#065f46,#047857)",
              color: "white",
              boxShadow: "0 16px 50px rgba(6,95,70,0.22)",
            }}
          >
            {/* cleaner phone icon with bold silhouette */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
              aria-hidden="true"
            >
              <path d="M3 5a2 2 0 012-2h2.2a1 1 0 01.97.76l.6 2.4a1 1 0 01-.27.98L7.9 8.1a16 16 0 006 6l.95-.6a1 1 0 01.98-.27l2.4.6a1 1 0 01.76.97V19a2 2 0 01-2 2h-1C8.8 21 3 15.2 3 8V5z" />
            </svg>
          </a>

          <div className="fa-tooltip" role="status" aria-hidden>
            Call now
          </div>
        </div>
      </div>

      {/* Mobile: bottom bar (visible < md) */}
      <div
        className="md:hidden fixed left-0 right-0 bottom-0 z-50 px-4 pb-safe"
        aria-hidden={false}
      >
        <div className="fa-bottom-bar mx-auto max-w-3xl rounded-t-xl">
          <a
            href="tel:+917907709032"
            aria-label="Call now"
            className="inline-flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "linear-gradient(90deg,#065f46,#059669)",
              color: "white",
              boxShadow: "0 8px 24px rgba(6,95,70,0.18)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M3 5a2 2 0 012-2h2.2a1 1 0 01.97.76l.6 2.4a1 1 0 01-.27.98L7.9 8.1a16 16 0 006 6l.95-.6a1 1 0 01.98-.27l2.4.6a1 1 0 01.76.97V19a2 2 0 01-2 2h-1C8.8 21 3 15.2 3 8V5z" />
            </svg>
            <span style={{ fontWeight: 600 }}>Call</span>
          </a>

          <a
            href="https://wa.me/919446061029"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "white",
              color: "#065f46",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#065f46"
              aria-hidden="true"
            >
              <path d="M20.5 3.5A11.9 11.9 0 0012 .5 11.9 11.9 0 003.5 9.2c0 2.1.6 4.1 1.7 5.9L3 22l7-1.9c1.7 1 3.6 1.5 5.5 1.5 6.6 0 12-5.4 12-12 0-1.6-.3-3.1-.8-4.5zM12 20.3c-1.6 0-3.2-.4-4.6-1.2l-.3-.2-4.1 1.1 1.1-4.1-.2-.3A8.9 8.9 0 013.7 9.2 8.8 8.8 0 1112 20.3z" />
              <path d="M16.2 13.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.2-.5.1s-.5.6-.6.7c-.1.1-.2.1-.4 0-.4-.2-1.3-.8-2.1-1.6-.6-.6-1-1.2-1.2-1.6-.1-.3 0-.5.2-.7.2-.2.4-.4.6-.6.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.3-1.2-.5-1.6-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 .9-1 2.2 0 1.3.8 2.4.9 2.6.1.2 1.4 2.2 3.3 3.1.5.2.9.3 1.2.4.5.1 1 .1 1.4.1.4 0 1.1-.3 1.4-.9.3-.6.3-1.1.2-1.3-.1-.1-.1-.2-.3-.3z" />
            </svg>
            <span style={{ fontWeight: 600 }}>WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}