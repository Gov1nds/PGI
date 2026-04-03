/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pgi: {
          bg: "rgb(var(--bg) / <alpha-value>)",
          surface: "rgb(var(--bg-raised) / <alpha-value>)",
          surfaceAlt: "rgb(var(--bg-alt) / <alpha-value>)",
          text: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-2) / <alpha-value>)",
          accent: "rgb(var(--brand) / <alpha-value>)",
          accentSoft: "rgb(var(--brand-soft) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
        },
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.18)",
        glow: "0 10px 30px rgba(139,92,246,0.18)",
        glass: "0 18px 60px rgba(0,0,0,0.30)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
