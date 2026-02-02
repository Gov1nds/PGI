export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* WhatsApp */}
      <div className="group relative">
        <a
          href="https://wa.me/919446061029"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full
                     bg-white/80 text-slate-900 backdrop-blur
                     ring-1 ring-black/10
                     shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                     transition hover:scale-110 hover:bg-white"
          aria-label="Chat on WhatsApp"
          title="WhatsApp"
        >
          {/* WhatsApp icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="currentColor"
          >
            <path d="M20.52 3.48A11.94 11.94 0 0012 0a12 12 0 00-10.3 18.17L0 24l5.97-1.56A12 12 0 1012 0zm0 17.03A9.93 9.93 0 0112 22a9.86 9.86 0 01-5.05-1.38l-.36-.21-3.55.93.95-3.46-.23-.37A9.94 9.94 0 1120.52 20.5zm-4.37-6.26c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12s-.62.77-.76.93c-.14.16-.28.18-.52.06a8.06 8.06 0 01-2.37-1.46 8.9 8.9 0 01-1.64-2.04c-.17-.29 0-.45.13-.6.13-.13.29-.34.43-.51.14-.17.18-.29.27-.48.09-.18.05-.35-.02-.49-.07-.12-.54-1.3-.74-1.78-.19-.46-.38-.4-.54-.41h-.46c-.16 0-.41.06-.63.29-.22.23-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.12 3.65.58.25 1.04.4 1.39.51.59.19 1.13.16 1.56.1.48-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.29z" />
          </svg>
        </a>

        {/* Tooltip */}
        <div className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 rounded-lg bg-black/80 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 md:block">
          WhatsApp
        </div>
      </div>

      {/* Call (primary) */}
      <div className="group relative">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[rgba(var(--brand-600)/0.25)] blur-md animate-[pulse_2.2s_ease-in-out_infinite]" />

        <a
          href="tel:+917907709032"
          className="relative flex h-14 w-14 items-center justify-center rounded-full
                     bg-[rgba(var(--brand-700))] text-white
                     ring-1 ring-white/20
                     shadow-[0_14px_40px_rgba(22,163,74,0.35)]
                     transition hover:scale-110 hover:bg-[rgba(var(--brand-600))]"
          aria-label="Call now"
          title="Call"
        >
          {/* Phone icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h2.2a1 1 0 01.97.757l.6 2.4a1 1 0 01-.27.98L7.91 8.09a16 16 0 006 6l.95-.59a1 1 0 01.98-.27l2.4.6a1 1 0 01.76.97V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V5z"
            />
          </svg>
        </a>

        {/* Tooltip */}
        <div className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 rounded-lg bg-black/80 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 md:block">
          Call now
        </div>
      </div>
    </div>
  );
}
