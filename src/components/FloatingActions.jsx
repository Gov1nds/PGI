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
      navigate("/contact");
    } else {
      navigate("/contact");
    }
  };

  return (
    <>
      <style>{`
        .fab-container {
          position: fixed;
          z-index: 50;
        }

        @media (min-width: 768px) {
          .fab-container {
            right: 24px;
            bottom: 32px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
          }
        }

        @media (max-width: 767px) {
          .fab-container {
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: row;
            padding: 10px 14px;
            padding-bottom: max(10px, env(safe-area-inset-bottom));
            gap: 8px;
          }
          .fab-container::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(8,12,21,0.0) 0%, rgba(8,12,21,0.94) 30%);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 14px 14px 0 0;
            z-index: -1;
            pointer-events: none;
          }
        }

        .fab-wrap {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
        }

        @media (min-width: 768px) {
          .fab-wrap { flex-direction: row-reverse; }
        }

        @media (max-width: 767px) {
          .fab-wrap { flex: 1; }
        }

        .fab-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          position: relative;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.25s ease;
        }

        @media (min-width: 768px) {
          .fab-btn {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            flex-shrink: 0;
          }
          .fab-btn:hover { transform: scale(1.08); }
          .fab-btn:active { transform: scale(0.95); }
        }

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

        .fab-bom {
          background: linear-gradient(135deg, #0284c7, #0369a1);
          color: #fff;
          box-shadow: 0 6px 24px rgba(2,132,199,0.25),
                      inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .fab-bom:hover {
          box-shadow: 0 10px 32px rgba(2,132,199,0.35),
                      inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .fab-contact {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.80);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15),
                      inset 0 1px 0 rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .fab-contact:hover {
          background: rgba(255,255,255,0.09);
          box-shadow: 0 8px 28px rgba(0,0,0,0.2),
                      inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .fab-label {
          position: absolute;
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          white-space: nowrap;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.01em;
          padding: 6px 14px;
          border-radius: 10px;
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
          background: rgba(2,132,199,0.12);
          color: #38bdf8;
          border: 1px solid rgba(56,189,248,0.15);
          box-shadow: 0 4px 16px rgba(2,132,199,0.1);
        }
        .fab-label-contact {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        @media (max-width: 767px) {
          .fab-label { display: none; }
        }

        .fab-mobile-text { display: none; }
        @media (max-width: 767px) {
          .fab-mobile-text { display: inline; }
        }

        .fab-btn:focus-visible {
          outline: 2px solid rgba(56,189,248,0.4);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .fab-btn { transition: none; }
          .fab-label { transition: none; }
        }
      `}</style>

      <div className="fab-container">
        <div className="fab-wrap">
          <button onClick={handleBomClick} className="fab-btn fab-bom" aria-label="Open BOM Analyzer" title="BOM Analyzer">
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

        <div className="fab-wrap">
          <button onClick={handleContactClick} className="fab-btn fab-contact" aria-label="Contact us" title="Contact">
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
