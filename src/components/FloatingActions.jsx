import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FloatingActions() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBomClick = () => {
    navigate("/bom-analyzer");
  };

  const handleContactClick = () => {
    if (location.pathname === "/") {
      const el = document.getElementById("content");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      // Navigate to contact page directly for reliability
      navigate("/contact");
    } else {
      navigate("/contact");
    }
  };

  return (
    <>
      <style>{`
        /* ========= FLOATING ACTIONS CONTAINER ========= */
        .fab-container {
          position: fixed;
          z-index: 50;
        }

        /* ========= DESKTOP: vertical stack, right side ========= */
        @media (min-width: 768px) {
          .fab-container {
            right: 20px;
            bottom: 28px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
          }
        }

        /* ========= MOBILE: bottom bar ========= */
        @media (max-width: 767px) {
          .fab-container {
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: row;
            padding: 10px 12px;
            padding-bottom: max(10px, env(safe-area-inset-bottom));
            gap: 8px;
          }
          .fab-container::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(10,14,28,0.0) 0%, rgba(10,14,28,0.92) 30%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 14px 14px 0 0;
            z-index: -1;
            pointer-events: none;
          }
        }

        /* ========= INDIVIDUAL FAB WRAPPER ========= */
        .fab-wrap {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
        }

        /* Desktop: row layout with label on left */
        @media (min-width: 768px) {
          .fab-wrap {
            flex-direction: row-reverse;
          }
        }

        /* Mobile: full width */
        @media (max-width: 767px) {
          .fab-wrap {
            flex: 1;
          }
        }

        /* ========= FAB BUTTON ========= */
        .fab-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          position: relative;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.2s ease;
        }

        /* Desktop: circle icon */
        @media (min-width: 768px) {
          .fab-btn {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            flex-shrink: 0;
          }
          .fab-btn:hover {
            transform: scale(1.08);
          }
          .fab-btn:active {
            transform: scale(0.97);
          }
        }

        /* Mobile: full-width pill with label */
        @media (max-width: 767px) {
          .fab-btn {
            width: 100%;
            height: 44px;
            border-radius: 12px;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.01em;
          }
        }

        /* ---- BOM Analyzer button ---- */
        .fab-bom {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: #fff;
          box-shadow: 0 6px 20px rgba(139,92,246,0.25),
                      inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .fab-bom:hover {
          box-shadow: 0 10px 28px rgba(139,92,246,0.35),
                      inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* ---- Contact button ---- */
        .fab-contact {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12),
                      inset 0 1px 0 rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .fab-contact:hover {
          background: rgba(255,255,255,0.1);
          box-shadow: 0 8px 24px rgba(0,0,0,0.16),
                      inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* ========= DESKTOP LABEL (hover tooltip) ========= */
        .fab-label {
          position: absolute;
          right: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          white-space: nowrap;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.01em;
          padding: 6px 12px;
          border-radius: 8px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .fab-wrap:hover .fab-label,
        .fab-wrap:focus-within .fab-label {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        .fab-label-bom {
          background: rgba(139,92,246,0.12);
          color: #8b5cf6;
          border: 1px solid rgba(139,92,246,0.18);
          box-shadow: 0 4px 12px rgba(139,92,246,0.1);
        }
        .fab-label-contact {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* Hide desktop labels on mobile */
        @media (max-width: 767px) {
          .fab-label {
            display: none;
          }
        }

        /* Hide mobile text on desktop */
        .fab-mobile-text {
          display: none;
        }
        @media (max-width: 767px) {
          .fab-mobile-text {
            display: inline;
          }
        }

        /* ========= FOCUS VISIBLE ========= */
        .fab-btn:focus-visible {
          outline: 2px solid rgba(139,92,246,0.4);
          outline-offset: 3px;
        }

        /* ========= REDUCED MOTION ========= */
        @media (prefers-reduced-motion: reduce) {
          .fab-btn { transition: none; }
          .fab-label { transition: none; }
        }
      `}</style>

      <div className="fab-container">
        {/* BOM Analyzer */}
        <div className="fab-wrap">
          <button
            onClick={handleBomClick}
            className="fab-btn fab-bom"
            aria-label="Open BOM Analyzer"
            title="BOM Analyzer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <span className="fab-mobile-text">BOM Analyzer</span>
          </button>
          <span className="fab-label fab-label-bom">BOM Analyzer</span>
        </div>

        {/* Contact */}
        <div className="fab-wrap">
          <button
            onClick={handleContactClick}
            className="fab-btn fab-contact"
            aria-label="Contact us"
            title="Contact"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span className="fab-mobile-text">Contact</span>
          </button>
          <span className="fab-label fab-label-contact">Contact</span>
        </div>
      </div>
    </>
  );
}