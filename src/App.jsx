import React, { useEffect, useState } from "react";

/* =========================
   APP
========================= */
export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);

  // Background tokens for alternation
  const altGreen = "bg-[#eef4ef]";
  const altGray = "bg-[#f3f5f3]";

  /* =========================
     SCROLL EFFECT
  ========================= */
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

  /* =========================
     AUTO OPEN QUOTE POPUP (15s)
  ========================= */
  useEffect(() => {
    const alreadyClosed = sessionStorage.getItem("quoteClosed");
    if (alreadyClosed) return;

    const timer = setTimeout(() => {
      setQuoteOpen(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);
  /* =========================
   PROCESS SECTION REVEAL
  ========================= */
  useEffect(() => {
    const section = document.getElementById("process");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProcessVisible(true);
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* =========================
          HEADER
      ========================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <a href="#home" className="relative group select-none">
              <div
                className={`text-2xl font-semibold tracking-wide ${
                  scrolled ? "text-slate-900" : "text-white"
                }`}
                style={{ fontFamily: "Graphik, Inter, Arial, sans-serif" }}
              >
                <span className="relative inline-block">
                  PADANILATHU

                  <span
                    className="
          absolute left-0 -bottom-1
          h-[2px] w-2/3
          bg-[#6FA56F]
          transition-all duration-300
          group-hover:w-full
        "
                  />
                </span>
              </div>
            </a>

            {/* DESKTOP NAV */}
            <nav
              className={`hidden md:flex items-center gap-6 text-sm font-medium ${
                scrolled ? "text-slate-700" : "text-white"
              }`}
            >
              <a href="#sectors">Sectors</a>
              <a href="#services">Services</a>
              <a href="#projects">Projects</a>
              <a href="#gallery">Gallery</a>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <button
                onClick={() => setQuoteOpen(true)}
                className="bg-[#6FA56F] text-white px-4 py-2 rounded-md"
              >
                Request Quote
              </button>
            </nav>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden text-2xl ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-5">
            <div className="flex flex-col gap-4 text-slate-700 font-medium">
              {[
                "sectors",
                "services",
                "projects",
                "gallery",
                "about",
                "careers",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <button
                onClick={() => {
                  setQuoteOpen(true);
                  setMobileOpen(false);
                }}
                className="bg-[#6FA56F] text-white px-4 py-2 rounded-md"
              >
                Request Quote
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================
          HERO
      ========================== */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center"
      >
        {/* BACKGROUND */}
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero1.mp4" type="video/mp4" />
        </video>

        <img
          src="/images/hero1.webp"
          alt="Eco landscaping"
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* HERO CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-white text-center md:text-left pt-28 pb-24">
          {/* HEADING */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl animate-fade-up"
            style={{ fontFamily: "Graphik, Arial Black, Arial, sans-serif" }}
          >
            Designing Eco-Conscious <br />
            & Aesthetically Stunning Outdoor Spaces
          </h1>

          {/* SUBTEXT */}
          <p
            className="mt-5 text-lg md:text-xl text-white/90 max-w-3xl animate-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            Sustainable landscaping, exterior architecture & 3D design across Kerala.
          </p>

          {/* BUTTONS */}
          <div
            className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <button
              onClick={() => setQuoteOpen(true)}
              className="bg-white text-[#6FA56F] px-6 py-3 rounded-md font-semibold w-full sm:w-auto"
            >
              Request Quote
            </button>

            <a
              href="#projects"
              className="border border-white/40 px-6 py-3 rounded-md text-center w-full sm:w-auto"
            >
              View Projects
            </a>
          </div>
        </div>
      </section>

      {/* =========================
          QUOTE POPUP
      ========================= */}
      {quoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
            <button
              onClick={() => {
                setQuoteOpen(false);
                sessionStorage.setItem("quoteClosed", "true");
              }}
              className="absolute top-4 right-4 text-2xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold">Request a Quote</h2>
            <p className="text-sm text-slate-600 mt-1">
              Share project details for accurate pricing.
            </p>

            <form className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input className="border p-3 rounded" placeholder="Name*" />
                <input className="border p-3 rounded" placeholder="Phone*" />
                <input className="border p-3 rounded" placeholder="Email" />
                <input className="border p-3 rounded" placeholder="Location*" />
              </div>

              <select className="border p-3 rounded w-full">
                <option>Select Service</option>
                <option>Landscaping & Gardening</option>
                <option>Stone Paving</option>
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

              <textarea
                rows="3"
                className="border p-3 rounded w-full"
                placeholder="Project details"
              />

              <button
                type="submit"
                className="bg-[#6FA56F] text-white px-6 py-3 rounded-md font-semibold"
              >
                Submit Quote Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================
    PHILOSOPHY INTRO (ALT - GREEN)
========================= */}
      <section className={`relative z-30 max-w-6xl mx-auto px-6 ${altGreen}`}>
        <div className="backdrop-blur rounded-xl shadow-sm px-8 py-10 -mt-16">
          {/* HEADING */}
          <h2
            className="text-2xl md:text-3xl font-semibold text-slate-900 text-center"
            style={{ fontFamily: "Graphik, Inter, sans-serif" }}
          >
            Crafting Timeless Outdoor Spaces
          </h2>

          {/* TEXT */}
          <p
            className="mt-4 text-base md:text-lg leading-relaxed text-slate-700 text-center max-w-4xl mx-auto"
            style={{ fontFamily: "Graphik, Inter, sans-serif" }}
          >
            Our practice is guided by a deep respect for nature and the landscapes of Kerala. We believe outdoor
            spaces are living extensions of life itself—where design, ecology, and human experience exist in quiet
            harmony. With sustainability as our foundation, we craft thoughtful exterior environments that honour
            the land while elevating aesthetic expression. Through a disciplined, well-structured process and a culture
            of precision in execution, we deliver enduring landscapes shaped by trust, clarity, and care. Our work is
            driven by a single purpose: to create timeless, eco-conscious outdoor spaces that enrich Kerala’s
            atmosphere and leave every client deeply satisfied
          </p>
        </div>
      </section>

      {/* ================================================================
    MAIN WRAPPER (before sectors)
================================================================ */}
      <main className="relative max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* any content before sectors (if none, this can be empty) */}
      </main>

      {/* ================================================================
    SECTORS (FULL WIDTH - ALT: GRAY)
================================================================ */}
      <section id="sectors" className={`${altGray} py-16`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-xl shadow p-6 md:p-8">
            <h2 className="text-2xl font-poppins font-semibold">Sectors</h2>
            <p className="text-sm text-slate-600 mt-2">
              We design outdoor environments across residential, commercial,
              hospitality, public and institutional spaces.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[
                ["Residential", "sector_residential.webp"],
                ["Commercial", "sector_commercial.webp"],
                ["Hospitality", "sector_hospitality.webp"],
                ["Public & Recreational", "sector_public.webp"],
                ["Institutional", "sector_institutional.webp"],
                ["Real Estate & Developers", "sector_developers.webp"],
                ["Industrial", "sector_industrial.webp"],
              ].map(([title, img], index) => {
                const cardBg = index % 2 === 0 ? altGreen : altGray;
                const textColor = "text-slate-900";
                return (
                  <div
                    key={title}
                    className={`${cardBg} relative h-44 rounded-lg overflow-hidden`}
                  >
                    <img
                      src={`/images/${img}`}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40" />
                    <div className={`absolute bottom-4 left-4 ${textColor} text-lg font-semibold`}>
                      <div className="mt-16 h-1 w-full bg-gradient-to-r from-transparent via-[#6FA56F]/30 to-transparent" />
                      {title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
    MAIN WRAPPER (after sectors)
================================================================ */}
      <main className="relative max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Services, Projects, Gallery, Process, etc */}
        {/* ================================================================
            SERVICES (ALT: GREEN)
        ================================================================ */}
        <section id="services" className="mt-12">
          <h2 className="text-2xl font-poppins font-semibold">Services</h2>
          <p className="mt-2 text-sm text-slate-600">
            From concept and 3D visualization to execution and maintenance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[
              ["service_landscape.webp", "Landscaping & Gardening"],
              ["service_stonepaving.webp", "Natural Stone Paving"],
              ["service_exterior.webp", "Exterior Architecture & 3D Design"],
              ["service_waterfeatures.webp", "Water Features"],
              ["service_playgrounds.webp", "Playgrounds & Sports Areas"],
              ["service_commercial.webp", "Commercial & Resort Landscaping"],
              ["service_renovation.webp", "Renovation & Maintenance"],
              ["service_consulting.webp", "Outdoor Space Consulting"],
              ["service_sustainability.webp", "Sustainable Outdoor Solutions"],
            ].map(([img, title], index) => {
              const cardBg = index % 2 === 0 ? altGreen : altGray;
              const textColor = "text-slate-900";
              return (
                <article
                  key={title}
                  className={`${cardBg} rounded-lg shadow overflow-hidden`}
                >
                  <img
                    src={`/images/${img}`}
                    className="w-full h-44 object-cover opacity-80"
                    loading="lazy"
                    decoding="async"
                    alt={title}
                  />
                  <div className="p-4">
                    <h3 className={`font-semibold ${textColor}`}>{title}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            PROJECTS (ALT: GRAY)
        ================================================================ */}
        <section id="projects" className="mt-14">
          <h2 className="text-2xl font-poppins font-semibold">Featured Projects</h2>

          <p className="mt-2 text-sm text-slate-600">
            A curated look at some of our most iconic project deliveries.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              ["project1_1.webp", "Natural Stone Courtyard"],
              ["project2_1.webp", "Waterfall Garden"],
              ["project3_1.webp", "Café Outdoor Seating"],
              ["project4_1.webp", "Resort Pathway"],
            ].map(([img, title], index) => {
              const cardBg = index % 2 === 0 ? altGray : altGreen;
              const textColor = "text-slate-900";
              return (
                <article
                  key={title}
                  className={`${cardBg} rounded-lg shadow overflow-hidden`}
                >
                  <img
                    src={`/images/${img}`}
                    className="w-full h-44 object-cover opacity-85"
                    loading="lazy"
                    decoding="async"
                    alt={title}
                  />

                  <div className="p-4">
                    <h3 className={`font-semibold ${textColor}`}>{title}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            GALLERY (ALT: GREEN)
        ================================================================ */}
        <section id="gallery" className={`mt-16 rounded-xl p-8 ${altGreen}`}>
          <h2 className="text-2xl font-poppins font-semibold">Gallery</h2>
          <p className="mt-2 text-sm text-slate-600">
            Visual moments from our completed landscape projects.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {["gallery1.webp", "gallery2.webp", "gallery5.webp", "gallery8.webp"].map((img, index) => (
              <img
                key={img}
                src={`/images/${img}`}
                loading="lazy"
                decoding="async"
                className="h-40 w-full object-cover rounded-lg shadow"
                alt={`Gallery ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ================================================================
    OUR PROCESS (ALT: GRAY)
================================================================ */}
        <section id="process" className={`mt-16 rounded-xl p-8 shadow-sm ${altGray}`}>
          <h2 className="text-2xl font-poppins font-semibold">Our Process</h2>

          <p className="mt-2 text-sm text-slate-600">
            A simple, transparent workflow from concept to completion.
          </p>

          <div className="relative mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              ["1", "Site Consultation", "On-site study & requirement discussion"],
              ["2", "3D Design & Planning", "Photorealistic renders & approvals"],
              ["3", "Material & Budgeting", "BOQs, samples & cost planning"],
              ["4", "Execution & Quality", "Supervised execution & finishing"],
              ["5", "Handover & Support", "Warranty & maintenance assistance"],
            ].map(([step, title, desc], index) => {
              const delay = index * (isMobile ? 80 : 120);
              const duration = isMobile ? "400ms" : "700ms";
              const innerBg = index % 2 === 0 ? altGreen : altGray;
              const textColor = "text-slate-900";

              return (
                <div
                  key={step}
                  className={`relative ${innerBg} border rounded-xl p-6 text-center shadow-sm
          transition-all ease-out
          ${processVisible ? "opacity-100 translate-y-0 glow-once" : "opacity-0 translate-y-6"}
          `}
                  style={{
                    transitionDuration: duration,
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {/* DESKTOP LINE */}
                  {index !== 0 && (
                    <span
                      className="hidden lg:block process-line"
                      style={{
                        left: "-30px",
                        top: "50%",
                        width: "30px",
                        height: "2px",
                        transformOrigin: "left",
                        animationDelay: `${delay}ms`,
                      }}
                    >
                      <span
                        className="process-dot"
                        style={{
                          top: "-3px",
                          left: "0",
                          animation: `dotMoveHorizontal ${isMobile ? "0.4s" : "0.6s"} ease-out ${delay}ms forwards`,
                        }}
                      />
                    </span>
                  )}

                  {/* MOBILE LINE */}
                  {index !== 0 && (
                    <span
                      className="lg:hidden process-line"
                      style={{
                        top: "-24px",
                        left: "50%",
                        width: "2px",
                        height: "24px",
                        transform: "translateX(-50%)",
                        background:
                          "linear-gradient(180deg, rgba(111,165,111,0), rgba(111,165,111,.8), rgba(111,165,111,0))",
                        animationDelay: `${delay}ms`,
                      }}
                    >
                      <span
                        className="process-dot"
                        style={{
                          left: "-3px",
                          top: "0",
                          animation: `dotMoveVertical ${isMobile ? "0.35s" : "0.5s"} ease-out ${delay}ms forwards`,
                        }}
                      />
                    </span>
                  )}

                  <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#6FA56F] text-white flex items-center justify-center font-bold text-lg">
                    {step}
                  </div>

                  <h4 className={`font-semibold ${textColor}`}>{title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================
    NEWS (ALT: GREEN)
================================================================ */}
        <section id="news" className="mt-16">
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "Graphik, Inter, sans-serif" }}
          >
            News & Updates
          </h2>

          <p className="mt-2 text-sm text-slate-600">Latest announcements & events.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              [
                "news1.webp",
                "17 Years of Landscape Excellence",
                "Celebrating over 17 years of crafting sustainable, high-quality outdoor spaces across Kerala.",
              ],
              [
                "news2.webp",
                "500+ Completed Projects Milestone",
                "A major achievement in delivering sustainable outdoor spaces.",
              ],
              [
                "news3.webp",
                "Kerala Landscaping Trends 2025",
                "Emerging eco-friendly materials and design philosophies.",
              ],
            ].map(([img, title, desc], index) => {
              const cardBg = index % 2 === 0 ? altGreen : altGray;
              const textColor = "text-slate-900";
              return (
                <article key={title} className={`${cardBg} rounded-lg shadow overflow-hidden`}>
                  <img
                    src={`/images/${img}`}
                    alt={title}
                    className="w-full h-40 object-cover opacity-85"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="p-4">
                    <h3 className={`font-semibold ${textColor}`} style={{ fontFamily: "Graphik, Inter, sans-serif" }}>
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ================================================================
    REVIEWS / TESTIMONIALS (ALT: GRAY)
================================================================ */}
        <section id="reviews" className="mt-16">
          <h2 className="text-2xl font-poppins font-semibold">What Our Clients Say</h2>
          <p className="mt-2 text-sm text-slate-600">Genuine feedback from homeowners and long-term clients.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                stars: "★ ★ ★ ★ ★",
                text: "“Worked with them for my home front yard tile paving and found their service extremely satisfying and value for money. I would gladly work with them again.”",
                author: "Sanjith Pillai",
                meta: "",
              },
              {
                stars: "★ ★ ★ ★ ★",
                text: "“Among many professionals I met during house construction, Padanilathu stood out for their honesty and dedication. Special thanks to Mr. Sudhakaran and the team.”",
                author: "Sreekanth Haridasan",
                meta: "3 years ago",
              },
              {
                stars: "★ ★ ★ ★ ★",
                text: "“Professional execution, transparent communication, and eco-friendly approach throughout the project.”",
                author: "Ananya R",
                meta: "",
              },
            ].map((r, index) => {
              const cardBg = index % 2 === 0 ? altGray : altGreen;
              const textColor = "text-slate-900";
              return (
                <div key={r.author} className={`${cardBg} rounded-lg shadow-sm p-6`}>
                  <div className="flex gap-1 text-yellow-400 text-lg">{r.stars}</div>
                  <p className="mt-3 text-sm text-slate-600">{r.text}</p>
                  <div className={`mt-4 font-semibold ${textColor}`}>{r.author}</div>
                  {r.meta && <div className="text-xs text-slate-500">{r.meta}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            ABOUT (ALT: GREEN)
        ================================================================ */}
        <section id="about" className={`mt-16 rounded-xl p-8 shadow ${altGreen}`}>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "Graphik, Inter, sans-serif" }}>
            About Padanilathu
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Since 2008, Padanilathu has been shaping sustainable, high-quality outdoor spaces across Kerala.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              ["mission.webp", "Mission", "Crafting eco-conscious, aesthetic outdoor environments that improve everyday living."],
              ["vision.webp", "Vision", "To be Kerala’s most trusted outdoor architecture and landscaping brand."],
              ["values.webp", "Values", "Sustainability · Creativity · Craftsmanship · Transparency"],
            ].map(([img, title, desc], index) => {
              const cardBg = index % 2 === 0 ? altGreen : altGray;
              const textColor = "text-slate-900";
              return (
                <div key={title} className={`${cardBg} text-center p-4 rounded-lg shadow-sm`}>
                  <img
                    src={`/images/${img}`}
                    alt={title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                    loading="lazy"
                    decoding="async"
                  />
                  <h3 className={`font-semibold text-lg ${textColor}`}>{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            CAREERS (ALT: GRAY)
        ================================================================ */}
        <section id="careers" className={`mt-16 ${altGray}`}>
          <div className="p-6 rounded-lg">
            <h2 className="text-2xl font-poppins font-semibold">Careers</h2>
            <p className="mt-2 text-sm text-slate-600">
              Join our growing team — we hire designers, engineers, horticulturists and site specialists across Kerala.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {[
                [
                  "Landscape Architect / Designer",
                  "Experience: 2–6 years · Location: Ernakulam · Apply with CV & portfolio.",
                ],
                [
                  "Site Supervisor / Foreman",
                  "Experience: 3+ years · Lead site teams and ensure quality delivery.",
                ],
                [
                  "Horticulturist / Plant Specialist",
                  "Plant selection, soil and irrigation planning · References preferred.",
                ],
                [
                  "3D Visualization Intern",
                  "Assist in renders and CAD drawings · Portfolio required.",
                ],
              ].map(([title, desc], index) => {
                const cardBg = index % 2 === 0 ? altGray : altGreen;
                const textColor = "text-slate-900";
                return (
                  <div key={title} className={`${cardBg} rounded-lg shadow-sm p-4`}>
                    <h4 className={`font-semibold ${textColor}`}>{title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <a
                href="#contact"
                className="inline-flex items-center bg-[#6FA56F] hover:bg-[#507953] text-white px-4 py-2 rounded-md text-sm font-semibold"
              >
                Apply Now
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================
            CONTACT (ALT: GREEN)
        ================================================================ */}
        <section id="contact" className={`mt-16 rounded-xl p-8 shadow-sm ${altGreen}`}>
          <h2 className="text-2xl font-poppins font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-slate-600">
            Request a free site visit and quotation. We serve clients across Kerala, with a strong presence in South Kerala.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* CONTACT INFO */}
            <div>
              <p className="text-sm text-slate-600">Quick contact</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+91-7907709032" className="text-slate-600">
                    +91-7907709032
                  </a>
                </li>

                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:hello@padanilathu.com" className="text-slate-600">
                    hello@padanilathu.com
                  </a>
                </li>

                <li>
                  <strong>Service area:</strong> All Kerala
                </li>
              </ul>

              <div className="mt-6 rounded-md overflow-hidden">
                <img
                  src="/images/about_office.webp"
                  alt="Padanilathu office"
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>

            {/* FORM */}
            <form
              id="contactForm"
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Form submitted — backend not yet connected.");
              }}
            >
              <input
                type="text"
                name="name"
                required
                placeholder="Full name"
                className="w-full p-3 rounded-md border border-slate-200"
              />

              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone"
                className="w-full p-3 rounded-md border border-slate-200"
              />

              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                className="w-full p-3 rounded-md border border-slate-200"
              />

              <select
                name="service"
                className="w-full p-3 rounded-md border border-slate-200"
              >
                <option>Service required</option>
                <option>Landscaping</option>
                <option>Stone paving</option>
                <option>3D design</option>
                <option>Maintenance</option>
              </select>

              <textarea
                name="message"
                rows="4"
                placeholder="Project details (optional)"
                className="w-full p-3 rounded-md border border-slate-200"
              />

              <button
                type="submit"
                className="bg-[#6FA56F] hover:bg-[#507953] text-white px-4 py-2 rounded-md text-sm font-semibold"
              >
                Request Site Visit
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* =========================
    FLOATING CONTACT BUTTON
========================= */}
      <div className="fixed bottom-6 right-6 z-50 contact-popup">
        <button
          onClick={() => setContactOpen(!contactOpen)}
          className="w-14 h-14 rounded-full bg-[#6FA56F] text-white text-2xl shadow-lg flex items-center justify-center"
          aria-label="Contact options"
          type="button"
        >
          ☎
        </button>

        {contactOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-lg p-3 w-44">
            <a
              href="tel:+917907709032"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-sm"
            >
              📞 Call Now
            </a>

            <a
              href="https://wa.me/919446061029"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-sm"
            >
              💬 WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* ================================================================
          FOOTER (ALT: GRAY)
      ================================================================ */}
      <footer className={`${altGray} border-t border-slate-200 mt-20`}>
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div>
            <div className="font-poppins font-semibold text-lg">padanilathu</div>
            <p className="text-sm mt-2 text-slate-600">
              Transforming Kerala’s outdoor spaces since 2008.
            </p>
            <p className="text-sm text-slate-600 mt-1">17+ Years · 500+ Completed Sites</p>

            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white"
              >
                IG
              </a>
              <a
                href="#"
                className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white"
              >
                FB
              </a>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="font-semibold">Navigation</h4>
            <ul className="text-sm mt-3 space-y-2 text-slate-600">
              <li>
                <a href="#sectors">Sectors</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#projects">Projects</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
              <li>
                <a href="#insights">Insights</a>
              </li>
              <li>
                <a href="#news">News</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="text-sm mt-3 text-slate-600">
              Phone: +91-7907709032 <br />
              Email: hello@padanilathu.com <br />
              Service Area: Kerala (Focus: Ernakulam)
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="text-sm mt-3 space-y-2 text-slate-600">
              <li>
                <a href="#contact">Request a Free Site Visit</a>
              </li>
              <li>
                <a href="#">Download Company Profile (PDF)</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">© 2025 padanilathu — All Rights Reserved.</div>
      </footer>
    </>
  );
}