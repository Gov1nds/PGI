/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pgi: {
          bg: "rgb(var(--bg) / <alpha-value>)",
          surface: "rgb(var(--bg-raised) / <alpha-value>)",
          surfaceAlt: "rgb(var(--bg-alt) / <alpha-value>)",
          panel: "rgb(var(--bg-elevated) / <alpha-value>)",
          text: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-2) / <alpha-value>)",
          subtle: "rgb(var(--ink-3) / <alpha-value>)",
          accent: "rgb(var(--brand) / <alpha-value>)",
          accentSoft: "rgb(var(--brand-soft) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
          borderStrong: "rgb(var(--border-strong) / <alpha-value>)",
        },
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.25)",
        glow: "0 10px 30px rgba(255,255,255,0.04)",
        glass: "0 18px 60px rgba(0,0,0,0.35)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideInUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseDot 2.5s ease infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
