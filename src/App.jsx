import React, { useEffect, useState } from "react";

/*
  App.jsx — Full component (2025-12-26)
  - Full code with hero redesign, 3-image crossfade carousel, section palette applied, image fallback logic,
    intersection observers and accessibility considerations.
  - Includes an accessible inline SVG Logo component and CSS custom properties for consistent theming.
  - Replace the /images/* assets with your actual images.
*/

function Logo({ compact = false, className = "" }) {
  // Accessible inline SVG mark + wordmark; scales well and requires no external asset.
  // Pass compact={true} to show just the mark.
  return (
    <svg
      className={className}
      width={compact ? 40 : 160}
      height={compact ? 40 : 36}
      viewBox="0 0 520 120"
      role="img"
      aria-label="Padanilathu — sustainable design"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMid meet"
    >
      <title>Padanilathu — sustainable design studio</title>

      {/* mark: stylized leaf + P monogram */}
      <g transform="translate(10,12)">
        <g transform="translate(0,0) scale(0.9)">
          <path
            d="M73.5 13c-14.7 5.6-28.6 16-38.8 29.3-7.8 10-14.8 21.2-20 34-0.9 2.6-1.6 5.4-2.1 8.1-0.1 0.7 0.4 1.3 1.1 1.3 0.1 0 0.3 0 0.4-0.1 5.9-2 11.6-4.6 17-7.8 9.4-5.6 18.3-12.8 26.2-21.4 10.1-11.2 17.9-25.1 21.5-40.6 0.4-1.8-0.9-3.6-2.8-3.7-1.1-0.1-2.1 0.1-3 0.4z"
            fill="var(--brand-dark)"
            opacity="0.98"
          />
          <path
            d="M45 78c-6.2 4.6-12.6 8.6-19.2 11.9-0.5 0.3-0.9 0.6-1.3 1-0.9 0.9-0.6 2.5 0.6 3 9.3 3.4 19.1 5 29 5 15.4 0 30.3-3.9 43.3-11.1 1.5-0.9 1.8-3.2 0.6-4.6-0.6-0.7-1.5-1.1-2.3-1.2-1.7-0.2-3.4 0.2-5.1 0.5-14.7 3.5-30.5 2.9-44.6-3.5z"
            fill="var(--brand)"
            opacity="0.9"
          />
          {/* P monogram overlaid */}
          <path
            d="M120 12c-18.4 0-34 12.3-34 30.9V78h14V44.9c0-9.7 6.9-16.9 20-16.9 11.8 0 18.9 6.2 18.9 16.3 0 10.2-7.6 16.8-21.4 16.8H116v14h7.8c21 0 34.8-12.8 34.8-32.6C158.6 25.6 146.5 12 120 12z"
            fill="var(--brand-text)"
            opacity="0.98"
          />
        </g>
      </g>

      {/* wordmark — only display when not compact */}
      {!compact && (
        <g transform="translate(210,18)">
          <text
            x="0"
            y="28"
            fontFamily="'Playfair Display', serif"
            fontWeight="700"
            fontSize="34"
            fill="var(--brand-text)"
          >
            Padanilathu
          </text>
          <rect x="0" y="34" rx="2" ry="2" width="84" height="4" fill="var(--brand-accent)" opacity="0.95" />
        </g>
      )}
    </svg>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // HERO carousel images (place your hero images in /images/)
  const heroImages = [
    { src: "/images/hero1.webp", alt: "Padanilathu — Sustainable design hero 1" },
    { src: "/images/hero2.webp", alt: "Padanilathu — Sustainable design hero 2" },
    { src: "/images/hero3.webp", alt: "Padanilathu — Sustainable design hero 3" },
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  // Social links provision (edit to your live profiles)
  const socialLinks = {
    instagram: "https://instagram.com/padanilathu",
    facebook: "https://facebook.com/padanilathu",
    whatsapp: "https://wa.me/919446061029",
    x: "https://x.com/padanilathu",
    linkedin: "https://www.linkedin.com/company/padanilathu",
    threads: "https://www.threads.net/@padanilathu",
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const alreadyClosed = sessionStorage.getItem("quoteClosed");
    if (alreadyClosed) return;
    const timer = setTimeout(() => setQuoteOpen(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  // PROCESS observer - tuned to trigger reliably on mobile + desktop and reveal internal animate-on-scroll elements
  useEffect(() => {
    const section = document.getElementById("process");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProcessVisible(true);
          // reveal any internal animate-on-scroll items immediately for reliability
          section.querySelectorAll(".animate-on-scroll").forEach((el) => el.classList.add("in-view"));
          observer.disconnect();
        }
      },
      // lower threshold and a little rootMargin so it triggers reliably on small screens
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Animate-on-scroll observer for cards/images (keeps reduced-motion safe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => el.classList.add("in-view"));
      return;
    }

    const elems = Array.from(document.querySelectorAll(".animate-on-scroll"));
    if (!elems.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elems.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [mounted]);

  // hero auto-cycle
  useEffect(() => {
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(id);
  }, []);

  // small helper for robust image fallbacks: tries alternate filenames if provided, otherwise placeholder
  const onImgErrorTryAlts = (e) => {
    const el = e.currentTarget;
    // remove default onerror to avoid loop
    el.onerror = null;

    // if a data-alts attribute exists (comma-separated), try the next alt
    const altsRaw = el.dataset.alts || "";
    const tried = el.dataset.tried ? el.dataset.tried.split(",").filter(Boolean) : [];

    const alts = altsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    const nextAlt = alts.find((a) => !tried.includes(a));

    if (nextAlt) {
      // mark tried
      el.dataset.tried = tried.concat([nextAlt]).join(",");
      el.src = `/images/${nextAlt}`;
      // reattach onerror to continue trying
      el.onerror = onImgErrorTryAlts;
      return;
    }

    // final fallback
    el.src = "/images/placeholder.webp";
  };

  // connector top calculation
  const connectorTop = isMobile ? (typeof window !== "undefined" && window.innerWidth < 420 ? "3rem" : "3.6rem") : "4.5rem";

  // Section wrapper helper
  const sectionWrapper = "max-w-7xl mx-auto px-6 py-16";

  // Small palette — you can edit or expand this to cycle backgrounds across sections.
  const sectionPalette = {
    apple: "#0f3b2e10" /* very light apple tint (kept subtle) */,
    appleLight: "#eef8ef",
    cream: "#fffaf0",
    offWhite: "#ffffff",
    grayLight: "#f5f7f6",
    slateSoft: "#f3fbf3",
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-900">
      {/* Inline styles & animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@400;600&display=swap');

        :root {
          --brand: #2f8a56;
          --brand-dark: #1f6b41;
          --brand-accent: #6FA56F;
          --brand-accent-2: #9fd7a2;
          --brand-text: #0f172a;
          --muted-1: #eef8ef;
          --muted-2: #f3fbf3;
          --glass: rgba(255,255,255,0.88);
          --elev: 0 14px 36px rgba(2,6,23,0.06);
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .animated-gradient { background: linear-gradient(120deg, rgba(196,255,225,0.04), rgba(255,250,240,0.02)); background-size: 300% 300%; animation: gradientShift 18s ease-in-out infinite; mix-blend-mode: overlay; position: absolute; inset: 0; z-index: -10; opacity: 0.45; pointer-events:none; }

        .animate-fadeInUp { animation: fadeInUp 600ms cubic-bezier(.2,.9,.3,1) both; }
        .animate-fadeInUp-slow { animation: fadeInUp 900ms cubic-bezier(.2,.9,.3,1) both; }
        .float-subtle { animation: floatY 6s ease-in-out infinite; }

        .card-hover { transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease; border: 1px solid rgba(15,23,42,0.05); background: var(--glass); backdrop-filter: blur(3px); }
        .card-hover:hover { transform: translateY(-6px); box-shadow: var(--elev); }

        .thumbline { border-radius: 12px; padding: 6px; background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,255,249,0.9)); box-shadow: 0 8px 20px rgba(15,23,42,0.06); display:block; overflow:hidden; }
        .thumbline img { display:block; border-radius:8px; width:100%; height:100%; object-fit:cover; }

        .section-heading { font-family: "Playfair Display", serif; font-size: 1.9rem; line-height: 1.05; font-weight:700; color:var(--brand-text); margin:0; }
        @media (min-width:1024px){ .section-heading { font-size:2.25rem; } }

        .animate-on-scroll { opacity:0; transform: translateY(8px); transition: opacity 640ms cubic-bezier(.2,.9,.3,1), transform 640ms cubic-bezier(.2,.9,.3,1); will-change: transform, opacity; }
        .animate-on-scroll.in-view { opacity:1; transform: translateY(0); }

        /* HERO carousel */
        .hero-carousel { position: absolute; inset:0; overflow:hidden; display:block; }
        .hero-carousel img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0; transition: opacity 900ms ease; transform: scale(1.02); }
        .hero-carousel img.active { opacity:1; z-index:1; transform: scale(1); }

        /* hero overlay stronger for the photographed mood */
        .hero-overlay { position:absolute; inset:0; background: linear-gradient(180deg, rgba(6,6,6,0.55), rgba(6,6,6,0.28)); z-index:0; }

        /* hero info card (right) similar to uploaded design */
        .hero-info-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.92);
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(6,7,12,0.18);
          border: 1px solid rgba(15,23,42,0.06);
          backdrop-filter: blur(6px);
        }
        .hero-info-card .kicker { color: var(--brand); font-weight:600; font-size:0.95rem; }
        .hero-info-card h4 { margin: 8px 0 6px; font-size:1.5rem; color:var(--brand-text); font-weight:700; font-family: "Playfair Display", serif; }
        .hero-info-card p { margin:0; color: #334155; font-size:0.95rem; line-height:1.45; }

        /* Buttons matching uploaded style */
        .btn-primary {
          background: linear-gradient(180deg,var(--brand),var(--brand-dark));
          color:white;
          padding: 12px 22px;
          border-radius: 12px;
          font-weight:600;
          box-shadow: 0 8px 20px rgba(15,23,42,0.18);
          border: none;
        }
        .btn-outline {
          background: transparent;
          color: white;
          padding: 12px 22px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.28);
          font-weight:600;
        }

        .logo-underline { display:block; height:3px; width:48px; background:var(--brand-accent); margin-top:6px; border-radius:2px; }

        /* header dark translucent when at top */
        .topbar-dark { background: rgba(6,6,6,0.55); backdrop-filter: blur(6px); }
        .topbar-sticky { background: rgba(255,255,255,0.96); backdrop-filter: blur(6px); box-shadow: 0 6px 20px rgba(2,6,23,0.08); }

        /* mobile spacing tighten */
        @media (max-width:640px) {
          .section-wrapper-mobile { padding-top: 1.75rem; padding-bottom: 1.75rem; }
          .section-heading { font-size: 1.5rem; text-align:center; }
          .positioning-grid-mobile { text-align:center; }
          .hero-info-card { display:none; } /* hide right card on small screens to match screenshots */
        }

        /* Our positioning: center on small screens */
        .positioning-center-mobile { text-align: center; }

        /* header logo sizing */
        .site-logo { display:flex; align-items:center; gap:10px; }
        .site-logo .wordmark { display:inline-block; vertical-align:middle; color:var(--brand-text); font-family: "Playfair Display", serif; font-weight:700; font-size:1.1rem; letter-spacing:0.6px; }
      `}</style>

      {/* animated gradient overlay */}
      <div className="animated-gradient" aria-hidden />

      {/* HEADER - dark translucent at top, becomes light on scroll */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "topbar-sticky" : "topbar-dark"}`}
        aria-label="Main header"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <a href="#home" className="group inline-flex items-center gap-3 site-logo" aria-label="Padanilathu home">
              <Logo className="logo-svg" />
            </a>

            <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? "text-slate-700" : "text-white"}`} aria-label="Primary navigation">
              <a href="#services" className="nav-link">Services</a>
              <a href="#projects" className="nav-link">Projects</a>
              <a href="#gallery" className="nav-link">Gallery</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#careers" className="nav-link">Careers</a>

              <button onClick={() => setQuoteOpen(true)} className="ml-2" style={{ display: "inline-block" }}>
                <span className="btn-primary" style={{ borderRadius: 8, padding: "8px 12px", fontSize: "0.92rem" }}>Request Quote</span>
              </button>
            </nav>

            <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden text-2xl p-2 rounded-md ${scrolled ? "text-slate-900 bg-white/0" : "text-white bg-transparent"}`} aria-label="Toggle mobile menu">
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-4 border-t">
            <div className="flex flex-col gap-3 text-slate-700 font-medium">
              {["services", "projects", "gallery", "about", "careers"].map((item) => (
                <a key={item} href={`#${item}`} onClick={() => setMobileOpen(false)} className="py-2">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <button onClick={() => { setQuoteOpen(true); setMobileOpen(false); }} className="mt-2 cta-primary px-4 py-2 rounded-md text-white" style={{ background: "var(--brand)" }}>Request Quote</button>
            </div>
          </div>
        )}
      </header>

      {/* HERO (3-image carousel with crossfade) */}
      <section id="home" className="relative min-h-[72vh] flex items-center" aria-label="Hero section">
        <div className="absolute inset-0 hero-carousel" aria-hidden>
          {heroImages.map((h, idx) => (
            <img
              key={h.src}
              src={h.src}
              alt={h.alt}
              className={idx === heroIndex ? "active" : ""}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/placeholder.webp"; }}
            />
          ))}
        </div>

        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className={`${mounted ? "animate-fadeInUp" : "opacity-0"} ${isMobile ? "text-emerald-900" : "text-white"}`}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight max-w-3xl display-lg section-heading" style={{ lineHeight: 1.02, color: "white", fontFamily: "Playfair Display, Georgia, serif", fontWeight: 700 }}>
                  Sustainable Design for Better Living
                </h1>

                <p className={`mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-2xl text-white/95`} style={{ color: "rgba(255,255,255,0.92)" }}>
                  Eco-first homes and outdoor spaces, crafted for Kerala’s climate — energy-saving, beautiful and future-ready.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 bg-white/10 text-white/95 px-4 py-2 rounded-full float-subtle">Exterior Design</span>
                  <span className="inline-flex items-center gap-2 bg-white/10 text-white/95 px-4 py-2 rounded-full float-subtle">🌿 Landscaping</span>
                  <span className="inline-flex items-center gap-2 bg-white/10 text-white/95 px-4 py-2 rounded-full float-subtle">Interior Design</span>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setQuoteOpen(true)} className="btn-primary" style={{ borderRadius: 10 }}>Request Quote</button>

                  <a href="#projects" className="btn-outline" style={{ borderRadius: 10 }}>View Projects</a>
                </div>
              </div>
            </div>

            {/* right info card */}
            <aside className="hidden lg:block lg:col-span-5">
              <div className="hero-info-card animate-fadeInUp-slow" role="note" aria-label="Trusted across Kerala">
                <div className="kicker">17+ Years · 500+ Completed Sites</div>
                <h4>Trusted across Kerala</h4>
                <p className="mt-3">We combine craft, climate knowledge and modern technology to deliver long-lasting, energy-efficient spaces.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* COMPANY INTRO (top text-only) */}
      <section id="company-intro" className={`${sectionWrapper} section-wrapper-mobile relative`} style={{ backgroundColor: sectionPalette.appleLight }}>
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="section-heading">About Padanilathu</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">
            Padanilathu is an integrated design-build studio specialising in sustainable outdoor environments, energy-efficient homes and AI-enabled living. We combine horticultural knowledge, practical construction experience and modern design tools to deliver resilient, beautiful spaces across Kerala.
          </p>
        </div>
      </section>

      {/* EXTERIOR DESIGN & LANDSCAPING — soft slate tint */}
      <section id="exterior" className={`${sectionWrapper} section-wrapper-mobile relative`} style={{ backgroundColor: sectionPalette.slateSoft }}>
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="section-heading">Exterior Design & Landscaping</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">
            Exterior architecture, landscape design and garden planning that connect the home to nature and perform well year-round.
          </p>
        </div>

        <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            ["Landscaping & Gardening", "Eco-friendly gardens, water-wise planting and site-specific horticulture.", "landscape1.webp"],
            ["Swimming Pools & Water Systems", "Natural pools, efficient filtration and sustainable water detailing.", "pool1.webp"],
            ["Exterior Architecture & 3D Design", "Biophilic façade design and photorealistic exterior visualisations.", "exterior1.webp"],
          ].map(([title, desc, img]) => (
            <article key={title} className="card-hover rounded-lg shadow overflow-hidden bg-white animate-on-scroll">
              <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts={`${img}`} />
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SUSTAINABLE CONSTRUCTION — white */}
      <section id="sustainable-construction" className={`${sectionWrapper} section-wrapper-mobile relative`} style={{ backgroundColor: sectionPalette.offWhite }}>
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="section-heading">Sustainable Construction</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">
            Low-carbon materials, passive cooling strategies and on-site practices that reduce environmental impact while improving comfort and durability.
          </p>
        </div>

        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
          <div className="lg:col-span-5 px-4">
            <div className="card-hover rounded-xl p-8 h-full">
              <h3 className="text-xl font-semibold text-slate-900">Climate-Responsive Builds</h3>
              <p className="mt-4 text-slate-600">
                Material selection, insulation, breathable finishes and workmanship tailored to Kerala’s humidity and monsoon conditions.
              </p>

              <div className="mt-6">
                <a href="#contact" className="inline-block cta-primary text-white px-5 py-2 rounded-md shadow" style={{ background: "var(--brand)" }}>Explore Sustainable Options →</a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="card-hover rounded-xl p-6 animate-on-scroll">
              <h4 className="font-semibold text-slate-900">Low-Carbon Materials</h4>
              <p className="mt-2 text-sm text-slate-600">Locally-sourced materials, recycled aggregates and low-VOC finishes to reduce embodied carbon.</p>
            </article>

            <article className="card-hover rounded-xl p-6 animate-on-scroll">
              <h4 className="font-semibold text-slate-900">Passive Cooling & Ventilation</h4>
              <p className="mt-2 text-sm text-slate-600">Shading, cross-ventilation and thermal mass strategies that reduce reliance on mechanical cooling.</p>
            </article>
          </div>
        </div>
      </section>

      {/* HYDROPONIC VERTICAL GARDENS — cream background */}
      <section id="hydroponic" className={`${sectionWrapper} section-wrapper-mobile relative`} style={{ backgroundColor: sectionPalette.cream }}>
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="section-heading">Hydroponic Vertical Gardens</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">
            Smart greenery for modern spaces — soil-free vertical gardens using nutrient-rich water systems for cleaner air, faster growth and long-lasting aesthetics.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto mt-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="thumbline card-hover rounded-2xl overflow-hidden h-64">
              <img src="/images/hydroponic-1.webp" alt="Indoor Hydroponic Vertical Garden" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts="hydroponic-1.webp,hydro1.webp" />
            </div>

            <div className="thumbline card-hover rounded-2xl overflow-hidden h-64">
              <img src="/images/hydroponic-2.webp" alt="Balcony Hydroponic Garden System" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts="hydroponic-2.webp,hydro2.webp" />
            </div>

            <div className="thumbline card-hover rounded-2xl overflow-hidden h-64">
              <img src="/images/hydroponic-3.webp" alt="Commercial Hydroponic Green Wall" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts="hydroponic-3.webp,hydro3.webp" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <div className="card-hover rounded-xl p-8 h-full animate-fadeInUp animate-on-scroll">
              <h3 className="text-xl font-semibold text-slate-900">Smart Greenery Systems</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">Our hydroponic vertical gardens grow plants without soil, using controlled water circulation and nutrients — ideal for homes, offices, apartments, hotels and commercial spaces.</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Indoor & Outdoor</span>
                <span className="inline-flex items-center bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Low Maintenance</span>
                <span className="inline-flex items-center bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Modular</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["Space-Saving Design", "Perfect for small homes, balconies and compact urban walls.", "📐"],
              ["90% Less Water Usage", "Highly water-efficient systems with recirculation.", "💧"],
              ["Improves Air Quality", "Natural air purification and humidity balance.", "🌱"],
              ["Modern & Premium Look", "Clean, elegant greenery that enhances interiors and façades.", "🌿"],
            ].map(([title, desc, icon]) => (
              <article key={title} className="card-hover rounded-xl p-6 bg-white/80 backdrop-blur animate-on-scroll">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{icon}</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mt-12">
          <p className="text-slate-700 text-lg">Sustainable. Elegant. Future-ready green living.</p>
        </div>
      </section>

      {/* AI-INTEGRATED LIVING — light gray */}
      <section id="ai" className={`${sectionWrapper} section-wrapper-mobile relative`} style={{ backgroundColor: sectionPalette.grayLight }}>
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="section-heading">AI-Integrated Living</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">We integrate AI into everyday home life to make spaces safer, smarter and more energy-efficient.</p>
        </div>

        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 px-4">
            <div className="card-hover rounded-xl p-8 h-full animate-fadeInUp animate-on-scroll">
              <h3 className="text-xl font-semibold text-slate-900">AI-Integrated Systems</h3>
              <p className="mt-4 text-slate-600">Intelligent automation for lighting, HVAC, security and energy — personalised schedules, adaptive control and remote monitoring via app.</p>

              <div className="mt-6 space-y-3">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Smart Security</div>
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Comfort Automation</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["Smart Security & Safety", "AI-enabled surveillance, alerts and access control", "🛡️"],
              ["Comfort Automation", "Lighting, temperature & ventilation auto-adjust", "🌡️"],
              ["Effortless Living", "Voice + app-based control for hands-free living", "🎙️"],
              ["Energy Saving", "Intelligent control of appliances and solar systems", "💡"],
            ].map(([title, desc, icon]) => (
              <article key={title} className="card-hover rounded-xl p-6 animate-on-scroll">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{icon}</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mt-10">
          <p className="text-slate-700">Designed for Kerala’s climate — our AI solutions create homes that think ahead, saving energy and enhancing comfort.</p>
        </div>
      </section>

      {/* ECO SMART LIVING (white) */}
      <section id="eco-living" className={`${sectionWrapper} section-wrapper-mobile relative`} style={{ backgroundColor: sectionPalette.offWhite }}>
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="section-heading">Sustainable, Energy-Efficient & Smart Living Spaces</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">Smarter, greener homes for Kerala. We blend AI technology with eco-friendly architecture to deliver energy-efficient living tailored to the local climate.</p>
        </div>

        <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
          <div className="lg:col-span-5 px-4">
            <div className="card-hover rounded-xl p-8 h-full animate-on-scroll">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="inline-block bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Core Service</div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">Sustainable Construction</h3>
                </div>
                <div className="text-3xl">♻️</div>
              </div>

              <p className="mt-6 text-slate-600">Low-carbon materials and climate-responsive construction designed to reduce heat gain, improve airflow and minimise long-term energy use.</p>

              <div className="mt-6 flex gap-3">
                <div className="inline-block bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Core Service</div>
                <div className="inline-block text-xs text-slate-500 px-3 py-1 rounded-md border">Featured</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            {[
              ["Fresh Air & Thermal Comfort", "Cross-ventilation planning, breathable interiors and indoor air-quality optimisation designed for humid tropical climates."],
              ["Maximum Energy Saving", "Solar integration, daylight optimisation and insulation strategies that significantly reduce electricity consumption."],
              ["Smart & AI-Enabled Homes", "Intelligent automation for lighting, security and climate — adapting to your lifestyle while reducing energy waste."],
              ["Hospitality & Café Design", "Eco-focused interiors for cafés, homestays and resorts — designed for guest comfort, operational efficiency and lower running costs."],
            ].map(([title, desc]) => (
              <article key={title} className="card-hover rounded-xl p-6 animate-on-scroll">
                <div className="flex items-center gap-3">
                  <div className="text-xl" />
                  <h4 className="font-semibold text-slate-900">{title}</h4>
                </div>
                <p className="mt-3 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES, PROJECTS, GALLERY, PROCESS, ETC. */}
      <main className="relative max-w-7xl mx-auto px-6 pt-12 pb-24">
        <section id="services" className="mt-6">
          <h2 className="section-heading">Our Services</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-3xl">Complete eco-conscious design & build solutions — integrating nature, technology and sustainability for homes and spaces across Kerala.</p>

          {/* Group 1 */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Outdoor & Landscape</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
              {[
                ["Landscaping & Gardening", "Eco-friendly gardens, fountains and outdoor landscaping designed for Kerala’s climate.", "service_landscape.webp"],
                ["Swimming Pools & Water Systems", "Natural pools, energy-efficient filtration and sustainable water systems.", "service_pool.webp"],
                ["Exterior Architecture & 3D Design", "Biophilic architecture and realistic 3D visualizations for custom exterior spaces.", "service_exterior.webp"],
              ].map(([title, desc, img]) => (
                <article key={title} className="card-hover rounded-lg shadow overflow-hidden bg-white animate-on-scroll">
                  <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts={`${img}`} />
                  <div className="p-4">
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Group 2 */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold">Architecture & Interiors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
              {[
                ["Exterior Architecture & 3D Design", "Biophilic architecture and realistic 3D visualizations for custom exterior spaces.", "service_exterior1.webp"],
                ["Interior Design (Eco & Minimal)", "Clutter-free interiors using natural materials and passive cooling layouts.", "service_interior.webp"],
                // small-space image - added alternates to increase chance of loading
                ["Small-Space Optimisation", "Space-saving design solutions tailored for flats, villas and compact residences.", "service-small-space.webp,service_small_space.webp,service-smallspace.webp"],
              ].map(([title, desc, img]) => {
                const altAttr = img.includes(",") ? img.split(",").map(s => s.trim()).join(",") : img;
                const src = img.includes(",") ? img.split(",")[0].trim() : img;
                return (
                  <article key={title} className="card-hover rounded-lg shadow overflow-hidden bg-white animate-on-scroll">
                    <img src={`/images/${src}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts={altAttr} />
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-900">{title}</h4>
                      <p className="mt-2 text-sm text-slate-600">{desc}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Group 3 */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold">Smart & Sustainable Systems</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
              {[
                ["Home Automation & Smart Systems", "Intelligent automation for lighting, security and climate controls.", "service_smart.webp"],
                ["Energy-Efficient Design & Solar Planning", "Solar planning, daylighting and energy-saving strategies.", "service_energy.webp"],
                ["Sustainable Construction Consulting", "Low-carbon materials and construction approaches for longevity and low maintenance.", "service_sustainable.webp"],
              ].map(([title, desc, img]) => (
                <article key={title} className="card-hover rounded-lg shadow overflow-hidden bg-white animate-on-scroll">
                  <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts={`${img}`} />
                  <div className="p-4">
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-md bg-[#eef4ef] p-6 flex items-center justify-between gap-4">
              <div className="text-slate-700">Tell us about your space — we'll design the right solution.</div>
              <a href="#contact" className="inline-flex items-center bg-[#2f5640] text-white px-5 py-2 rounded-md shadow">Request a Free Consultation →</a>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mt-14">
          <h2 className="section-heading">Featured Projects</h2>
          <p className="mt-2 text-sm text-slate-600">A curated look at some of our most iconic project deliveries.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              ["project1_1.webp", "Natural Stone Courtyard"],
              ["project2_1.webp", "Waterfall Garden"],
              ["project3_1.webp", "Café Outdoor Seating"],
              ["project4_1.webp", "Resort Pathway"],
            ].map(([img, title]) => (
              <article key={title} className="card-hover rounded-lg shadow overflow-hidden bg-white animate-on-scroll">
                <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts={`${img}`} />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="mt-16 bg-[#fffaf0] rounded-xl p-8">
          <h2 className="section-heading">Gallery</h2>
          <p className="mt-2 text-sm text-slate-600">Visual moments from our completed landscape projects.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {["gallery1.webp", "gallery2.webp", "gallery5.webp", "gallery8.webp"].map((img, index) => (
              <img key={img} src={`/images/${img}`} loading="lazy" decoding="async" className="h-40 w-full object-cover rounded-lg shadow card-hover animate-on-scroll" alt={`Gallery ${index + 1}`} onError={onImgErrorTryAlts} data-alts={`${img}`} />
            ))}
          </div>
        </section>

        {/* PROCESS (connector + steps) */}
        <section id="process" className="mt-16 bg-[linear-gradient(180deg,#fbfefd,transparent)] rounded-xl p-12 shadow-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-heading">Our Design & Build Process</h2>
            <p className="mt-3 text-slate-700">A clear, structured approach from first consultation to final handover.</p>
          </div>

          <div className="max-w-7xl mx-auto mt-8 relative">
            <div className={`hidden lg:block absolute left-0 right-0 h-px bg-[repeating-linear-gradient(to right,#cfdfcc,#cfdfcc 8px,transparent 8px,transparent 16px)] connector-dots`} style={{ top: connectorTop, opacity: processVisible ? 1 : 0, transform: processVisible ? "translateY(0)" : "translateY(6px)" }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start lg:items-stretch">
              {[
                ["1", "Site Consultation & Assessment", "On-site analysis and requirement discussion", true],
                ["2", "3D Design & Spatial Planning", "Photorealistic 3D visuals, layouts and design approvals", false],
                ["3", "Materials, BOQ & Cost Planning", "Material selection, BOQs and transparent budgeting", false],
                ["4", "Execution & Quality Control", "Supervised construction, precision finishing and quality checks", true],
              ].map(([step, title, desc, keyStage], index) => {
                const delay = index * (isMobile ? 80 : 120);
                const duration = isMobile ? "400ms" : "700ms";
                return (
                  <div key={step} className={`card-hover rounded-xl p-8 transition-all ease-out animate-on-scroll`} style={{ transitionDuration: duration, transitionDelay: `${delay}ms` }}>
                    {keyStage && <div className="inline-block bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">Key Stage</div>}
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#6FA56F] text-white flex items-center justify-center font-bold text-lg float-subtle">{step}</div>
                    <h4 className="font-semibold text-slate-900 text-lg">{title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="max-w-2xl mx-auto text-center mt-10">
              <p className="text-slate-700">Every stage is transparent, supervised and tailored to Kerala’s climate.</p>
              <div className="mt-6">
                <a href="#contact" className="inline-block bg-[#2f5640] text-white px-8 py-3 rounded-md shadow card-hover">Book a Site Consultation →</a>
              </div>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="mt-16 bg-white rounded-xl p-8 shadow">
          <h2 className="section-heading">Why Padanilathu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              ["🌱 Eco-First Design", "Sustainability is built into every decision — not added later."],
              ["🧠 Integrated Thinking", "Exterior, interior, energy and automation planned together."],
              ["🏗 17+ Years Experience", "Ground-level execution knowledge across Kerala conditions."],
              ["📐 Practical Innovation", "Smart solutions that are realistic, serviceable and future-ready."],
            ].map(([title, desc]) => (
              <article key={title} className="card-hover bg-[#f8f9f8] rounded-lg p-5 animate-on-scroll">
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* PROFESSIONAL FEATURES */}
        <section className="mt-14">
          <h2 className="section-heading">Professional Capabilities & Credentials</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-3xl">Certifications, partnerships and capabilities that make delivery predictable and high-quality.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["Certified Contractors", "Registered & insured teams with safety-compliant workflows."],
              ["Project Management", "Dedicated PM & quality checkpoints on every site."],
              ["Sustainability Audit", "Lifecycle and embodied carbon assessments available."],
              ["Aftercare & Maintenance", "Planned maintenance packages to protect your investment."],
            ].map(([title, desc]) => (
              <div key={title} className="card-hover rounded-lg p-6 bg-white animate-on-scroll">
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NEWS, REVIEWS, ABOUT (kept) */}
        <section id="news" className="mt-16">
          <h2 className="section-heading">News & Updates</h2>
          <p className="mt-2 text-sm text-slate-600">Latest announcements & events.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["news1.webp", "17 Years of Landscape Excellence", "Celebrating over 17 years of crafting sustainable, high-quality outdoor spaces across Kerala."],
              ["news2.webp", "500+ Completed Projects Milestone", "A major achievement in delivering sustainable outdoor spaces."],
              ["news3.webp", "Kerala Landscaping Trends 2025", "Emerging eco-friendly materials and design philosophies."],
            ].map(([img, title, desc]) => (
              <article key={title} className="card-hover rounded-lg shadow overflow-hidden bg-white animate-on-scroll">
                <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts={`${img}`} />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="reviews" className="mt-16">
          <h2 className="section-heading">What Our Clients Say</h2>
          <p className="mt-2 text-sm text-slate-600">Genuine feedback from homeowners and long-term clients.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { stars: "★ ★ ★ ★ ★", text: "Worked with them for my home front yard tile paving — extremely satisfying and value for money.", author: "Sanjith Pillai" },
              { stars: "★ ★ ★ ★ ★", text: "Padanilathu stood out for their honesty and dedication. Special thanks to Mr. Sudhakaran and the team.", author: "Sreekanth Haridasan" },
              { stars: "★ ★ ★ ★ ★", text: "Professional execution, transparent communication and eco-friendly approach throughout the project.", author: "Ananya R" },
            ].map((r) => (
              <article key={r.author} className="card-hover bg-[#f7f8f7] rounded-lg shadow-sm p-6 animate-on-scroll">
                <div className="flex gap-1 text-yellow-400 text-lg">{r.stars}</div>
                <p className="mt-3 text-sm text-slate-600">{r.text}</p>
                <div className="mt-4 font-semibold text-slate-900">{r.author}</div>
              </article>
            ))}
          </div>
        </section>

        {/* ABOUT (kept lower section as-is) */}
        <section id="about" className="mt-16 bg-[#eef4ef] rounded-xl p-8">
          <h2 className="section-heading">About Padanilathu</h2>
          <p className="mt-3 text-sm text-slate-600">
            Padanilathu is an eco-focused design and construction studio integrating architecture, interiors, landscape, energy efficiency and smart automation. Our mission is to create healthier, low-energy living environments that are deeply connected to nature and future-ready.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              ["mission.webp", "Mission", "Crafting eco-conscious, aesthetic outdoor environments that improve everyday living."],
              ["vision.webp", "Vision", "To be Kerala’s most trusted outdoor architecture and landscaping brand."],
              ["values.webp", "Values", "Sustainability · Creativity · Craftsmanship · Transparency"],
            ].map(([img, title, desc]) => (
              <article key={title} className="soft-white bg-white text-center p-4 rounded-lg shadow-sm animate-on-scroll">
                <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover rounded-md mb-4" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts={`${img}`} />
                <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* POSITIONING SUMMARY (center text on phone) */}
        <section className="mt-10">
          <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-white/25" />
            <div className="relative p-8 sm:p-12">
              <div className="text-center max-w-3xl mx-auto positioning-center-mobile">
                <h3 className="text-3xl font-serif text-slate-900">Our Positioning</h3>
                <p className="mt-4 text-lg text-slate-700">A design studio focused on sustainability, energy efficiency, and intelligent living.</p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow flex gap-4 items-start card-hover animate-on-scroll positioning-center-mobile">
                  <div className="text-3xl text-green-700">🍃</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xl">Eco Home Designer</h4>
                    <p className="mt-2 text-slate-600">Low-energy homes designed for Kerala’s climate.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow flex gap-4 items-start card-hover animate-on-scroll positioning-center-mobile">
                  <div className="text-3xl text-slate-700">🏠</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xl">Interior + Exterior Studio</h4>
                    <p className="mt-2 text-slate-600">Seamless spaces — inside and out.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow flex gap-4 items-start card-hover animate-on-scroll positioning-center-mobile">
                  <div className="text-3xl text-yellow-500">⚡</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xl">Energy-Saving Specialist</h4>
                    <p className="mt-2 text-slate-600">Designs that reduce long-term power costs.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow flex gap-4 items-start card-hover animate-on-scroll positioning-center-mobile">
                  <div className="text-3xl text-emerald-700">🤖</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xl">Smart Home Integrator</h4>
                    <p className="mt-2 text-slate-600">AI-ready homes for comfort, safety and control.</p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-slate-500">This integrated approach sets us apart from most conventional design firms in Kerala.</p>
            </div>
          </div>
        </section>

        {/* CAREERS */}
        <section id="careers" className="mt-16 bg-[#f7f8f7] rounded-xl p-6">
          <h2 className="section-heading">Careers</h2>
          <p className="mt-2 text-sm text-slate-600">Join our growing team — we hire designers, engineers, horticulturists and site specialists across Kerala.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {[
              ["Landscape Architect / Designer", "Experience: 2–6 years · Location: Ernakulam · Apply with CV & portfolio."],
              ["Site Supervisor / Foreman", "Experience: 3+ years · Lead site teams and ensure quality delivery."],
              ["Horticulturist / Plant Specialist", "Plant selection, soil and irrigation planning · References preferred."],
              ["3D Visualization Intern", "Assist in renders and CAD drawings · Portfolio required."],
            ].map(([title, desc]) => (
              <article key={title} className="bg-white rounded-lg shadow-sm p-4 card-hover animate-on-scroll">
                <h4 className="font-semibold text-slate-900">{title}</h4>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-6">
            <a href="#contact" className="inline-flex items-center bg-[#6FA56F] hover:bg-[#507953] text-white px-4 py-2 rounded-md text-sm font-semibold">Apply Now</a>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mt-16 bg-[#eef4ef] rounded-xl p-8">
          <h2 className="section-heading">Contact</h2>
          <p className="mt-2 text-sm text-slate-600">Request a free site visit and quotation. We serve clients across Kerala, with a strong presence in South Kerala.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-sm text-slate-600">Quick contact</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li><strong>Phone:</strong> <a href="tel:+91-7907709032" className="text-slate-600">+91-7907709032</a></li>
                <li><strong>Email:</strong> <a href="mailto:hello@padanilathu.com" className="text-slate-600">hello@padanilathu.com</a></li>
                <li><strong>Service area:</strong> All Kerala</li>
              </ul>

              <div className="mt-6 rounded-md overflow-hidden">
                <img src="/images/about_office.webp" alt="Padanilathu office" className="w-full h-56 object-cover rounded-md" loading="lazy" decoding="async" onError={onImgErrorTryAlts} data-alts="about_office.webp" />
              </div>
            </div>

            <form id="contactForm" className="space-y-3 bg-white rounded-lg p-6 shadow" onSubmit={(e) => { e.preventDefault(); alert("Form submitted — backend not yet connected."); }}>
              <input type="text" name="name" required placeholder="Full name" className="w-full p-3 rounded-md border border-slate-200" />
              <input type="tel" name="phone" required placeholder="Phone" className="w-full p-3 rounded-md border border-slate-200" />
              <input type="email" name="email" placeholder="Email (optional)" className="w-full p-3 rounded-md border border-slate-200" />
              <select name="service" className="w-full p-3 rounded-md border border-slate-200">
                <option>Service required</option>
                <option>Landscaping</option>
                <option>Stone paving</option>
                <option>3D design</option>
                <option>Maintenance</option>
              </select>
              <textarea name="message" rows="4" placeholder="Project details (optional)" className="w-full p-3 rounded-md border border-slate-200" />
              <button type="submit" className="bg-[#6FA56F] hover:bg-[#507953] text-white px-4 py-2 rounded-md text-sm font-semibold">Request Site Visit</button>
            </form>
          </div>
        </section>
      </main>

      {/* FLOATING CONTACT BUTTON + social quick links */}
      <div className="fixed bottom-6 right-6 z-50 contact-popup">
        <button onClick={() => setContactOpen(!contactOpen)} className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white text-2xl shadow-lg flex items-center justify-center" aria-label="Contact options" type="button">
          ☎
        </button>

        {contactOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-lg p-3 w-52">
            <a href={`tel:+917907709032`} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-sm">📞 Call Now</a>
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-sm">💬 WhatsApp</a>
            <div className="border-t mt-2 pt-2">
              <div className="text-xs text-slate-500 mb-1">Follow us</div>
              <div className="flex gap-2">
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-sm px-2 py-1 rounded hover:bg-slate-100">IG</a>
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-sm px-2 py-1 rounded hover:bg-slate-100">FB</a>
                <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="text-sm px-2 py-1 rounded hover:bg-slate-100">X</a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm px-2 py-1 rounded hover:bg-slate-100">In</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-transparent border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Logo compact />
              <div>
                <div className="font-poppins font-semibold text-lg" style={{ textTransform: "lowercase" }}>padanilathu</div>
                <p className="text-sm mt-2 text-slate-700">Transforming Kerala’s outdoor spaces since 2008.</p>
                <p className="text-sm text-slate-700 mt-1">17+ Years · 500+ Completed Sites</p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="Instagram">IG</a>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="Facebook">FB</a>
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="WhatsApp">WA</a>
              <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="X">X</a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="LinkedIn">In</a>
              <a href={socialLinks.threads} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="Threads">Th</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Navigation</h4>
            <ul className="text-sm mt-3 space-y-2 text-slate-700">
              <li><a href="#services">Services</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#news">News</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="text-sm mt-3 text-slate-700">Phone: +91-7907709032 <br /> Email: hello@padanilathu.com <br /> Service Area: Kerala (Focus: Ernakulam)</p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="text-sm mt-3 space-y-2 text-slate-700">
              <li><a href="#contact">Request a Free Site Visit</a></li>
              <li><a href="#">Download Company Profile (PDF)</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-600">© 2025 padanilathu — All Rights Reserved.</div>
      </footer>
    </div>
  );
}