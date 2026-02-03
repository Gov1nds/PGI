import React from "react";

export default function FloatingActions() {
  return (
    <>
      <style>{`
        /* small local keyframes for the floating and pulse ring */
        @keyframes fa-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes fa-pulse-ring {
          0% { transform: scale(1); opacity: 0.45; }
          70% { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        .fa-float { animation: fa-float 3.6s ease-in-out infinite; transform-origin: center; }
        .fa-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(34,197,94,0.22); /* green-500/35% */
          filter: blur(10px);
          z-index: 0;
          animation: fa-pulse-ring 2.6s cubic-bezier(.4,0,.2,1) infinite;
        }

        /* tooltip animation fallback (non-tailwind keyframes) */
        .fa-tooltip {
          transition: transform .18s ease, opacity .18s ease;
          transform: translateX(6px);
          opacity: 0;
          pointer-events: none;
        }
        .group:hover .fa-tooltip,
        .group:focus-within .fa-tooltip {
          transform: translateX(0);
          opacity: 1;
        }
      `}</style>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {/* WhatsApp */}
        <div className="group relative">
          <a
            href="https://wa.me/918921983250"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="WhatsApp"
            className="relative flex h-14 w-14 items-center justify-center rounded-full
                       bg-gradient-to-br from-emerald-500 to-emerald-600 text-white
                       ring-1 ring-black/10 shadow-[0_12px_30px_rgba(16,185,129,0.12)]
                       transform-gpu transition-transform duration-200 ease-out
                       hover:scale-110 active:scale-95 fa-float"
          >
            {/* soft inner highlight */}
            <span className="absolute inset-0 rounded-full bg-white/6 mix-blend-screen pointer-events-none" />

            {/* WhatsApp icon (clean, bold) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="relative z-10 h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                {/* accessible: defs are ignored by most renderers, safe to include */}
              </defs>
              <path
                d="M21 12.1A9 9 0 1 1 11.9 3a9 9 0 0 1 9.1 9.1z"
                stroke="none"
                fill="rgba(255,255,255,0.06)"
              />
              <path d="M17.5 16.5c-.6 1.6-1.5 1.9-2.6 2.2-.7.2-1.5.3-3.9-1.2C8 16.9 6.6 16 5.8 15.3c-.8-.6-1.1-1.1-.9-1.9.2-.8.9-1.7 1.4-2.1.5-.4 1.1-.9 1.6-.6.6.3 1.3.9 2 .9.7 0 1.1-.4 1.6-.4.5 0 .9.1 1.5.8.6.6.9 1 .9 1.9 0 .9-.2 1.5-.2 1.9z" 
                    fill="white" opacity="0.95"/>
              <path d="M16 8.5c0 .83-.67 1.5-1.5 1.5S13 9.33 13 8.5 13.67 7 14.5 7 16 7.67 16 8.5z" fill="white" opacity="0.95"/>
            </svg>
          </a>

          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="fa-tooltip rounded-lg bg-black/85 px-3 py-1 text-xs text-white">
              WhatsApp
            </div>
          </div>
        </div>

        {/* Call (primary) */}
        <div className="group relative">
          {/* Pulse ring (absolute, behind button) */}
          <span className="fa-pulse-ring" aria-hidden="true" />

          <a
            href="tel:+918921983250"
            aria-label="Call now"
            title="Call"
            className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full
                       bg-gradient-to-br from-emerald-700 to-emerald-600 text-white
                       ring-1 ring-white/20
                       shadow-[0_18px_50px_rgba(6,95,70,0.22)]
                       transform-gpu transition-transform duration-200 ease-out
                       hover:scale-110 active:scale-95 fa-float"
          >
            {/* Phone icon (clean handset) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 7.2c.1-1.1.7-2.2 1.7-3 1.3-1.1 3.1-1.3 4.7-.6l2 .8a1 1 0 01.6.9v2.1a1 1 0 01-.5.9L9.6 9.9c-.2.1-.3.3-.2.5.6 1.6 1.9 3.8 3.5 5.3 1.6 1.6 3.7 2.9 5.3 3.5.2.1.4 0 .5-.2l1.1-1.1c.3-.3.7-.4 1.1-.5h2.1a1 1 0 01.9.6l.8 2c.7 1.6.5 3.4-.6 4.7-1 1-2 1.7-3 1.7-6.1 0-11-4.9-11-11 0-1 .6-2 1.7-3z"
                    fill="white" opacity="0.98"/>
            </svg>
          </a>

          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="fa-tooltip rounded-lg bg-black/85 px-3 py-1 text-xs text-white">
              Call now
            </div>
          </div>
        </div>
      </div>
    </>
  );
}