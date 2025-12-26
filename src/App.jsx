import React, { useEffect, useState } from "react";

/*
  App.jsx — Revised (2025-12-26)
  Summary of key changes implemented:
  1. Hero section rewritten for a cleaner, more professional layout and accessibility.
  2. Added "Company Intro" section (styled like Exterior Design & Landscaping).
  3. Unified section headings via a new .section-heading class (same font & size).
  4. Added "thumbline" border style for images in Hydroponic Vertical Gardens.
  5. Improved overall alignment and consistent spacing using a single sectionWrapper.
  6. Removed the "Sectors" section and nav link.
  7. Added a "Professional Features" section with certificates / capabilities to increase credibility.
  8. Optimizations: consistent lazy loading, fallback image handler, prefers-reduced-motion handling preserved.
  9. Improved mobile spacing & typography; reduced vertical gaps on small screens.
 10. Added social media redirects (Instagram, Facebook, WhatsApp, X, LinkedIn, Threads) in footer & floating contact.
*/

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Social links provision (edit to your live profiles)
  const socialLinks = {
    instagram: "https://instagram.com/padanilathu",
    facebook: "https://facebook.com/padanilathu",
    whatsapp: "https://wa.me/919446061029",
    x: "https://x.com/padanilathu",
    linkedin: "https://www.linkedin.com/company/padanilathu",
    threads: "https://www.threads.net/@padanilathu",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    const section = document.getElementById("process");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProcessVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Animate-on-scroll observer for cards/images
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

  const sectionWrapper = "max-w-7xl mx-auto px-6 py-16";

  // Soft animated gradient background (keeps inline siteGradient as fallback)
  const siteGradient = {
    backgroundImage: "url('/images/gradient-bg.png')",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const connectorTop = isMobile ? (typeof window !== "undefined" && window.innerWidth < 420 ? "3rem" : "3.6rem") : "4.5rem";

  // small helper for robust image fallbacks
  const onImgErrorSetPlaceholder = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/images/placeholder.webp";
  };

  return (
    <div style={siteGradient} className="min-h-screen relative font-sans text-slate-900 animated-background">
      {/* Animated gradient overlay */}
      <div aria-hidden className="absolute inset-0 animated-gradient -z-10" style={{ pointerEvents: "none", opacity: 0.55 }} />

      {/* Inline animation & premium styles */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .animate-fadeInUp { animation: fadeInUp 600ms cubic-bezier(.2,.9,.3,1) both; }
        .animate-fadeInUp-slow { animation: fadeInUp 900ms cubic-bezier(.2,.9,.3,1) both; }
        .float-subtle { animation: floatY 6s ease-in-out infinite; }

        .card-hover { transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease; border: 1px solid rgba(15,23,42,0.05); background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(15,23,42,0.08); }

        .soft-white { background: rgba(255,255,255,0.96); box-shadow: 0 10px 30px rgba(15,23,42,0.04); border: 1px solid rgba(15,23,42,0.03); }

        .hero-overlay { background: linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.2)); }

        .cta-primary { background: linear-gradient(90deg, #2fa86a 0%, #6fd992 100%); color: white; box-shadow: 0 12px 30px rgba(47,168,106,0.14); }
        .cta-outline { border: 1px solid rgba(47,168,106,0.12); color: #11402a; background: rgba(255,255,255,0.82); }

        .animated-gradient { background: linear-gradient(120deg, rgba(196,255,225,0.06), rgba(255,250,240,0.04), rgba(198,255,231,0.04)); background-size: 300% 300%; animation: gradientShift 18s ease-in-out infinite; mix-blend-mode: overlay; }

        .animate-on-scroll { opacity: 0; transform: translateY(8px); transition: opacity 640ms cubic-bezier(.2,.9,.3,1), transform 640ms cubic-bezier(.2,.9,.3,1); will-change: transform, opacity; }
        .animate-on-scroll.in-view { opacity: 1; transform: translateY(0); }

        /* Unified section headings */
        .section-heading { font-family: "Playfair Display", serif; font-size: 1.9rem; line-height: 1.05; font-weight: 600; color: #0f172a; margin: 0; }
        @media (min-width: 1024px) { .section-heading { font-size: 2.25rem; } }

        /* Hydroponic thumbnails 'thumbline' */
        .thumbline { border-radius: 12px; padding: 6px; background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,255,249,0.9)); box-shadow: 0 8px 20px rgba(15,23,42,0.06); display: block; overflow: hidden; }
        .thumbline img { display: block; border-radius: 8px; width: 100%; height: 100%; object-fit: cover; }

        /* Mobile spacing improvements */
        @media (max-width: 640px) {
          .section-wrapper-mobile { padding-top: 2.25rem; padding-bottom: 2.25rem; }
          .hero-cta { width: 100%; padding-left: 1rem; padding-right: 1rem; }
          .display-lg { font-size: 1.9rem; }
          .lead { font-size: 0.96rem; }
          .animated-gradient { opacity: 0.6; }
        }

        /* Small utility tweaks */
        .nav-link { text-decoration: none; color: inherit; }
        .sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
      `}</style>

      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow" : "bg-transparent"}`}
        aria-label="Main header"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <a href="#home" className="group inline-flex items-center gap-3">
              <div className={`text-xl md:text-2xl font-semibold tracking-wide ${scrolled ? "text-slate-900" : (isMobile ? "text-emerald-900" : "text-white")}`} style={{ fontFamily: "Poppins, Inter, Arial, sans-serif" }}>
                <span className="relative inline-block">
                  PADANILATHU
                  <span aria-hidden className="absolute left-0 -bottom-1 h-[2px] w-2/3 bg-[#6FA56F] transition-all duration-300 group-hover:w-full" />
                </span>
              </div>
            </a>

            <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? "text-slate-700" : (isMobile ? "text-emerald-900" : "text-white")}`} aria-label="Primary navigation">
              <a href="#services" className="nav-link">Services</a>
              <a href="#projects" className="nav-link">Projects</a>
              <a href="#gallery" className="nav-link">Gallery</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#careers" className="nav-link">Careers</a>

              <button onClick={() => setQuoteOpen(true)} className="ml-2 cta-primary px-4 py-2 rounded-md text-sm font-semibold">
                Request Quote
              </button>
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden text-2xl p-2 rounded-md ${scrolled ? "text-slate-900 bg-white/0" : "text-emerald-900 bg-white/10"}`}
              aria-label="Toggle mobile menu"
            >
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
              <button
                onClick={() => {
                  setQuoteOpen(true);
                  setMobileOpen(false);
                }}
                className="mt-2 cta-primary px-4 py-2 rounded-md text-white"
              >
                Request Quote
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO (desktop/video, mobile/poster) */}
      <section id="home" className="relative min-h-[72vh] flex items-center" aria-label="Hero section">
        <div className="absolute inset-0">
          {!isMobile ? (
            <video
              className="w-full h-full object-cover hero-video"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/hero1.webp"
              aria-hidden
            >
              <source src="/videos/hero1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src="/images/hero1.webp"
              alt="Padanilathu — Sustainable design hero"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              onError={onImgErrorSetPlaceholder}
            />
          )}

          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className={`${mounted ? "animate-fadeInUp" : "opacity-0"} ${isMobile ? "text-emerald-900" : "text-white"}`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-3xl display-lg section-heading" style={{ lineHeight: 1.02, color: isMobile ? "#11402a" : "white" }}>
                Sustainable Design for Better Living
              </h1>

              <p className={`mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-2xl ${isMobile ? "lead" : "text-white/95"}`}>
                Eco-first homes and outdoor spaces, crafted for Kerala’s climate — energy-saving, beautiful and future-ready.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-white/12 text-white/95 px-4 py-2 rounded-full float-subtle">Exterior Design</span>
                <span className="inline-flex items-center gap-2 bg-white/12 text-white/95 px-4 py-2 rounded-full float-subtle">🌿 Landscaping</span>
                <span className="inline-flex items-center gap-2 bg-white/12 text-white/95 px-4 py-2 rounded-full float-subtle">Interior Design</span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={() => setQuoteOpen(true)} className="cta-primary px-6 py-3 rounded-full font-semibold shadow-md hero-cta">
                  Request Quote
                </button>

                <a href="#projects" className="inline-flex items-center justify-center px-6 py-3 rounded-full cta-outline hero-cta">
                  View Projects
                </a>
              </div>
            </div>

            <aside className="hidden lg:flex flex-col gap-6 items-start animate-fadeInUp-slow">
              <div className="soft-white rounded-xl p-6 w-80">
                <div className="text-sm text-green-800/90">17+ Years · 500+ Completed Sites</div>
                <div className="mt-3 text-xl font-semibold text-slate-900">Trusted across Kerala</div>
                <p className="mt-3 text-sm text-slate-600">We combine craft, climate knowledge and modern tech to deliver long-lasting results.</p>
              </div>

              <div className="soft-white rounded-xl p-6 w-80">
                <div className="text-sm text-green-800/90">Eco-first approach</div>
                <div className="mt-3 text-xl font-semibold text-slate-900">Energy-efficient, smart homes</div>
                <p className="mt-3 text-sm text-slate-600">Designs that reduce running costs and enhance everyday comfort.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* COMPANY INTRO (new, same style as Exterior Design & Landscaping) */}
      <section id="company-intro" className={`${sectionWrapper} relative section-wrapper-mobile`}>
        <div className="absolute inset-0 bg-white/6 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="section-heading">About Padanilathu</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">
            Padanilathu is an integrated design and build studio focused on sustainable outdoor environments, energy-efficient homes and intelligent living systems. We blend craft, horticulture expertise and modern technology to build resilient, beautiful spaces across Kerala.
          </p>
        </div>

        <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            ["Mission", "Craft eco-conscious outdoor environments that improve everyday living.", "mission.webp"],
            ["Vision", "To be Kerala’s most trusted outdoor architecture & landscaping brand.", "vision.webp"],
            ["Values", "Sustainability · Creativity · Craftsmanship · Transparency", "values.webp"],
          ].map(([title, desc, img]) => (
            <article key={title} className="soft-white rounded-lg p-6 text-center animate-on-scroll">
              <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover rounded-md mb-4" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
              <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* QUOTE POPUP */}
      {quoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-8 shadow-xl">
            <button
              onClick={() => {
                setQuoteOpen(false);
                sessionStorage.setItem("quoteClosed", "true");
              }}
              className="absolute top-4 right-4 text-2xl"
              aria-label="Close quote dialog"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold">Request a Quote</h2>
            <p className="text-sm text-slate-600 mt-1">Share project details for accurate pricing.</p>

            <form className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="sr-only">Name</label>
                <input className="border p-3 rounded" placeholder="Name*" />

                <label className="sr-only">Phone</label>
                <input className="border p-3 rounded" placeholder="Phone*" />

                <label className="sr-only">Email</label>
                <input className="border p-3 rounded" placeholder="Email" />

                <label className="sr-only">Location</label>
                <input className="border p-3 rounded" placeholder="Location*" />
              </div>

              <label className="sr-only">Service</label>
              <select className="border p-3 rounded w-full" defaultValue="">
                <option value="" disabled>
                  Select Service
                </option>
                <option>Interior Design</option>
                <option>Landscaping & Gardening</option>
                <option>Home automation</option>
                <option>Stone Paving</option>
                <option>Swimming Pool</option>
                <option>Exterior Design</option>
                <option>Water Features</option>
                <option>Maintenance</option>
                <option>Consulting</option>
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input className="border p-3 rounded" placeholder="Length" />
                <input className="border p-3 rounded" placeholder="Width" />
                <input className="border p-3 rounded" placeholder="Area" />
              </div>

              <label className="sr-only">Project details</label>
              <textarea rows="4" className="border p-3 rounded w-full" placeholder="Project details" />

              <div className="flex justify-end">
                <button type="submit" className="cta-primary px-6 py-3 rounded-full font-semibold">
                  Submit Quote Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXTERIOR DESIGN & LANDSCAPING */}
      <section id="exterior" className={`${sectionWrapper} relative section-wrapper-mobile`}>
        <div className="absolute inset-0 bg-white/6 pointer-events-none" />
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
              <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SUSTAINABLE CONSTRUCTION */}
      <section id="sustainable-construction" className={`${sectionWrapper} relative section-wrapper-mobile`}>
        <div className="absolute inset-0 bg-white/6 pointer-events-none" />
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
                <a href="#contact" className="inline-block cta-primary text-white px-5 py-2 rounded-md shadow">
                  Explore Sustainable Options →
                </a>
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

      {/* HYDROPONIC VERTICAL GARDENS (thumbline added) */}
      <section id="hydroponic" className={`${sectionWrapper} relative section-wrapper-mobile overflow-hidden`}>
        <div className="absolute inset-0 bg-white/6 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="section-heading">Hydroponic Vertical Gardens</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">
            Smart greenery for modern spaces — soil-free vertical gardens using nutrient-rich water systems for cleaner air, faster growth and long-lasting aesthetics.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto mt-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Thumbline wrappers give a subtle frame & consistent image border */}
            <div className="thumbline card-hover rounded-2xl overflow-hidden h-64">
              <img src="/images/hydroponic-1.webp" alt="Indoor Hydroponic Vertical Garden" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
            </div>

            <div className="thumbline card-hover rounded-2xl overflow-hidden h-64">
              <img src="/images/hydroponic-2.webp" alt="Balcony Hydroponic Garden System" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
            </div>

            <div className="thumbline card-hover rounded-2xl overflow-hidden h-64">
              <img src="/images/hydroponic-3.webp" alt="Commercial Hydroponic Green Wall" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
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

      {/* AI-INTEGRATED LIVING */}
      <section id="ai" className={`${sectionWrapper} relative section-wrapper-mobile`}>
        <div className="absolute inset-0 bg-white/6 pointer-events-none" />
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

      {/* ECO SMART LIVING */}
      <section id="eco-living" className={`${sectionWrapper} relative section-wrapper-mobile`}>
        <div className="absolute inset-0 bg-white/6 pointer-events-none" />
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

      {/* SERVICES */}
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
                  <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
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
                ["Small-Space Optimisation", "Space-saving design solutions tailored for flats, villas and compact residences.", "service-small-space.webp"],
              ].map(([title, desc, img]) => (
                <article key={title} className="card-hover rounded-lg shadow overflow-hidden bg-white animate-on-scroll">
                  <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
                  <div className="p-4">
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                </article>
              ))}
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
                  <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
                  <div className="p-4">
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-md bg-[#eef4ef] p-6 flex items-center justify-between gap-4">
              <div className="text-slate-700">Tell us about your space — we'll design the right solution.</div>
              <a href="#contact" className="inline-flex items-center bg-[#2f5640] text-white px-5 py-2 rounded-md shadow">
                Request a Free Consultation →
              </a>
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
                <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="mt-16 bg-[#eef4ef] rounded-xl p-8">
          <h2 className="section-heading">Gallery</h2>
          <p className="mt-2 text-sm text-slate-600">Visual moments from our completed landscape projects.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {["gallery1.webp", "gallery2.webp", "gallery5.webp", "gallery8.webp"].map((img, index) => (
              <img key={img} src={`/images/${img}`} loading="lazy" decoding="async" className="h-40 w-full object-cover rounded-lg shadow card-hover animate-on-scroll" alt={`Gallery ${index + 1}`} onError={onImgErrorSetPlaceholder} />
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="mt-16 bg-[linear-gradient(180deg,#fbfefd,transparent)] rounded-xl p-12 shadow-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-heading">Our Design & Build Process</h2>
            <p className="mt-3 text-slate-700">A clear, structured approach from first consultation to final handover.</p>
          </div>

          <div className="max-w-7xl mx-auto mt-8 relative">
            <div
              className={`hidden lg:block absolute left-0 right-0 h-px bg-[repeating-linear-gradient(to right,#cfdfcc,#cfdfcc 8px,transparent 8px,transparent 16px)] connector-dots`}
              style={{ top: connectorTop, opacity: processVisible ? 1 : 0, transform: processVisible ? "translateY(0)" : "translateY(6px)" }}
            />

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
                  <div key={step} className={`card-hover rounded-xl p-8 transition-all ease-out ${processVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} animate-on-scroll`} style={{ transitionDuration: duration, transitionDelay: `${delay}ms` }}>
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

        {/* PROFESSIONAL FEATURES (new section) */}
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

        {/* NEWS, REVIEWS, ABOUT, CAREERS, CONTACT (kept) */}
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
                <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
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

        <section id="about" className="mt-16 bg-[#eef4ef] rounded-xl p-8">
          <h2 className="section-heading">About Padanilathu</h2>
          <p className="mt-3 text-sm text-slate-600">Padanilathu is an eco-focused design and construction studio integrating architecture, interiors, landscape, energy efficiency and smart automation. Our mission is to create healthier, low-energy living environments that are deeply connected to nature and future-ready.</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              ["mission.webp", "Mission", "Crafting eco-conscious, aesthetic outdoor environments that improve everyday living."],
              ["vision.webp", "Vision", "To be Kerala’s most trusted outdoor architecture and landscaping brand."],
              ["values.webp", "Values", "Sustainability · Creativity · Craftsmanship · Transparency"],
            ].map(([img, title, desc]) => (
              <article key={title} className="soft-white bg-white text-center p-4 rounded-lg shadow-sm animate-on-scroll">
                <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover rounded-md mb-4" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
                <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-white/25" />
            <div className="relative p-12">
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-3xl font-serif text-slate-900">Our Positioning</h3>
                <p className="mt-4 text-lg text-slate-700">A design studio focused on sustainability, energy efficiency, and intelligent living.</p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow flex gap-4 items-start card-hover animate-on-scroll">
                  <div className="text-3xl text-green-700">🍃</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xl">Eco Home Designer</h4>
                    <p className="mt-2 text-slate-600">Low-energy homes designed for Kerala’s climate.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow flex gap-4 items-start card-hover animate-on-scroll">
                  <div className="text-3xl text-slate-700">🏠</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xl">Interior + Exterior Studio</h4>
                    <p className="mt-2 text-slate-600">Seamless spaces — inside and out.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow flex gap-4 items-start card-hover animate-on-scroll">
                  <div className="text-3xl text-yellow-500">⚡</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xl">Energy-Saving Specialist</h4>
                    <p className="mt-2 text-slate-600">Designs that reduce long-term power costs.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow flex gap-4 items-start card-hover animate-on-scroll">
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
            <a href="#contact" className="inline-flex items-center bg-[#6FA56F] hover:bg-[#507953] text-white px-4 py-2 rounded-md text-sm font-semibold">
              Apply Now
            </a>
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
                <img src="/images/about_office.webp" alt="Padanilathu office" className="w-full h-56 object-cover rounded-md" loading="lazy" decoding="async" onError={onImgErrorSetPlaceholder} />
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
            <div className="font-poppins font-semibold text-lg">padanilathu</div>
            <p className="text-sm mt-2 text-slate-700">Transforming Kerala’s outdoor spaces since 2008.</p>
            <p className="text-sm text-slate-700 mt-1">17+ Years · 500+ Completed Sites</p>

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