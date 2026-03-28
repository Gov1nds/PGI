/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080b16',
          900: '#0c101e',
          800: '#101528',
          700: '#161d38',
        },
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.12)",
        "glass": "0 4px 24px rgba(0,0,0,0.15), 0 0 1px rgba(100,140,255,0.06)",
        "glass-hover": "0 12px 40px rgba(0,0,0,0.22), 0 0 1px rgba(100,140,255,0.12)",
        "glow-cyan": "0 0 30px rgba(14,165,233,0.12)",
        "glow-violet": "0 0 30px rgba(139,92,246,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
