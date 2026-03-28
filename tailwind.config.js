/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.12)",
        "glow-sm": "0 0 20px rgba(14,165,233,0.08)",
        "glow-md": "0 0 40px rgba(14,165,233,0.12)",
        "glow-lg": "0 0 60px rgba(14,165,233,0.16)",
        "card": "0 4px 24px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)",
        "elevated": "0 20px 60px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease both",
        "slide-up": "slideInUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
