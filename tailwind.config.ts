import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}","./src/components/**/*.{ts,tsx}","./src/content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950:"#05070B", 900:"#07101A", 100:"#E6EEF8" },
        accent: { 500:"#2B7BFF", 600:"#1E6FFF", 700:"#145CDA" }
      },
      boxShadow: { soft:"0 10px 30px rgba(0,0,0,0.35)" },
      borderRadius: { xl2:"1.25rem" },
      fontFamily: { sans:["ui-sans-serif","system-ui","Segoe UI","Inter","Arial","sans-serif"], serif:["ui-serif","Georgia","Times New Roman","serif"] },
      backgroundImage: {
        hero: "radial-gradient(1200px 600px at 20% 15%, rgba(43,123,255,0.25), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(43,123,255,0.18), transparent 55%), linear-gradient(180deg, #07101A 0%, #05070B 45%, #05070B 100%)",
      }
    },
  },
  plugins: [],
};
export default config;
