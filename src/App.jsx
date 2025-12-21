import React, { useEffect, useState } from "react";

/*
  Updated App.jsx
  - Larger, more spacious sections
  - More professional typographic scale and consistent spacing
  - Slightly refined color palette while keeping your brand green (#6FA56F)
  - Improved accessibility on key interactive elements
  - Kept existing structure and functionality (quote popup, contact, process reveal)
*/

/* Brand tokens (kept near top for easy edits) */
const BRAND = {
  primary: "#6FA56F",
  mutedBg: "#f3f5f3",
  altGreen: "#eef4ef",
  altGray: "#f7f8f7",
  text: "text-slate-900",
};

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);

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

  /* small helper for section wrapper classes to keep sections large/spacious */
  const sectionWrapper = "max-w-7xl mx-auto px-6 py-24";

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-sm shadow" : "bg-transparent"
        }`}
        aria-label="Main header"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            <a href="#home" className="group inline-flex items-center gap-3">
              <div
                className={`text-2xl md:text-3xl font-semibold tracking-wide ${
                  scrolled ? "text-slate-900" : "text-white"
                }`}
                style={{ fontFamily: "Poppins, Inter, Arial, sans-serif" }}
              >
                <span className="relative inline-block">
                  PADANILATHU
                  <span
                    aria-hidden
                    className="absolute left-0 -bottom-1 h-[2px] w-2/3 bg-[#6FA56F] transition-all duration-300 group-hover:w-full"
                  />
                </span>
              </div>
            </a>

            {/* DESKTOP NAV */}
            <nav
              className={`hidden md:flex items-center gap-8 text-sm font-medium ${
                scrolled ? "text-slate-700" : "text-white"
              }`}
              aria-label="Primary navigation"
            >
              <a href="#sectors" className="hover:underline">Sectors</a>
              <a href="#services" className="hover:underline">Services</a>
              <a href="#projects" className="hover:underline">Projects</a>
              <a href="#gallery" className="hover:underline">Gallery</a>
              <a href="#about" className="hover:underline">About</a>
              <a href="#careers" className="hover:underline">Careers</a>
              <button
                onClick={() => setQuoteOpen(true)}
                className="ml-2 bg-[#6FA56F] hover:bg-[#5f9a5f] text-white px-5 py-2 rounded-md text-sm font-semibold shadow"
              >
                Request Quote
              </button>
            </nav>

            {/* MOBILE TOGGLER */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden text-2xl p-2 rounded-md ${
                scrolled ? "text-slate-900 bg-white/0" : "text-white"
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-5 border-t">
            <div className="flex flex-col gap-4 text-slate-700 font-medium">
              {["sectors","services","projects","gallery","about","careers"].map((item) => (
                <a key={item} href={`#${item}`} onClick={() => setMobileOpen(false)} className="py-2">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <button
                onClick={() => {
                  setQuoteOpen(true);
                  setMobileOpen(false);
                }}
                className="mt-2 bg-[#6FA56F] text-white px-4 py-2 rounded-md"
              >
                Request Quote
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-[84vh] flex items-center">
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover hidden lg:block"
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
            className="w-full h-full object-cover lg:hidden"
            loading="eager"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-3xl"
                style={{ fontFamily: "Poppins, Inter, sans-serif" }}
              >
                Designing Eco-Conscious & Aesthetically Stunning Outdoor Spaces
              </h1>

              <p className="mt-6 text-lg md:text-xl max-w-2xl text-white/90">
                Eco-friendly homes, interiors & outdoor environments — designed for fresh air, energy efficiency, and smart living across Kerala.
              </p>

              <p className="mt-4 text-base text-white/80 max-w-2xl">
                We design and build eco-friendly, energy-efficient, smart homes and spaces — integrating nature, technology, and architecture for healthier living.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="bg-white text-[#6FA56F] px-6 py-3 rounded-md font-semibold shadow w-full sm:w-auto"
                >
                  Request Quote
                </button>
                <a
                  href="#projects"
                  className="border border-white/30 px-6 py-3 rounded-md text-center w-full sm:w-auto text-white/95"
                >
                  View Projects
                </a>
              </div>
            </div>

            {/* Optional hero visual summary / trust panel */}
            <aside className="hidden lg:flex flex-col gap-4 items-start">
              <div className="bg-white/6 backdrop-blur-md rounded-md p-4 text-white/90 w-full">
                <div className="text-sm">17+ Years · 500+ Completed Sites</div>
                <div className="mt-3 text-lg font-semibold">Trusted across Kerala</div>
              </div>

              <div className="bg-white/6 backdrop-blur-md rounded-md p-4 text-white/90 w-full">
                <div className="text-sm">Eco-first approach</div>
                <div className="mt-3 text-lg font-semibold">Energy-efficient, smart homes</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* QUOTE POPUP */}
      {quoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true">
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-8">
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

              <label className="sr-only">Project details</label>
              <textarea rows="4" className="border p-3 rounded w-full" placeholder="Project details" />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#6FA56F] text-white px-6 py-3 rounded-md font-semibold"
                >
                  Submit Quote Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHILOSOPHY INTRO (ALT - GREEN) */}
      <section className={`${sectionWrapper} ${BRAND.altGreen}`}>
        <div className="mx-auto max-w-6xl bg-white/40 backdrop-blur rounded-xl shadow-sm px-12 py-12 -mt-20">
          <h2 className="text-3xl font-semibold text-slate-900 text-center">Crafting Timeless Outdoor Spaces</h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-700 text-center max-w-4xl mx-auto">
            We respect Kerala’s landscapes and craft outdoor spaces where design, ecology and human experience exist in quiet harmony. Sustainability is our foundation — we design durable, low-energy, and highly serviceable environments shaped by clarity, craft and long-term value.
          </p>
        </div>
      </section>

      {/* ECO SMART LIVING */}
      <section className={`${sectionWrapper} bg-[#eef4ef] rounded-xl`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold">Eco Smart Living</h2>
          <p className="mt-3 text-base text-slate-700 max-w-3xl">
            We design and build eco-friendly, energy-efficient, smart homes and spaces — integrating nature, technology, and architecture for healthier living.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[
              ["♻️ Sustainable Construction","Low-carbon materials, passive cooling & climate-responsive design."],
              ["🌬 Fresh Air & Thermal Comfort","Cross-ventilation planning & indoor air-quality optimisation."],
              ["⚡ Maximum Energy Saving","Solar integration, daylight optimisation & low-energy systems."],
              ["🏠 Smart & AI-Enabled Homes","Integrated automation for lighting, climate & security."],
              ["🏊 Eco-Optimised Pools","Low-chemical systems, efficient filtration & natural water features."],
              ["🏨 Hospitality Design","Eco-focused hospitality spaces with operational efficiency."],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white rounded-lg p-6 shadow">
                <h4 className="font-semibold text-lg">{title}</h4>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN WRAPPER (before sectors) */}
      <main className="relative max-w-7xl mx-auto px-6 pt-12 pb-24" />

      {/* SECTORS (FULL WIDTH - ALT: GRAY) */}
      <section id="sectors" className={`${sectionWrapper} ${BRAND.altGray}`}>
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl shadow p-8">
            <h2 className="text-3xl font-semibold">Sectors</h2>
            <p className="text-base text-slate-600 mt-2">We design outdoor environments across residential, commercial, hospitality, public and institutional spaces.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[
                ["Residential","sector_residential.webp"],
                ["Commercial","sector_commercial.webp"],
                ["Hospitality","sector_hospitality.webp"],
                ["Public & Recreational","sector_public.webp"],
                ["Institutional","sector_institutional.webp"],
                ["Real Estate & Developers","sector_developers.webp"],
                ["Industrial","sector_industrial.webp"],
              ].map(([title, img], index) => {
                const cardBg = index % 2 === 0 ? BRAND.altGreen : BRAND.altGray;
                return (
                  <div key={title} className={`${cardBg} relative h-56 rounded-lg overflow-hidden`}>
                    <img src={`/images/${img}`} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-70" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40" />
                    <div className="absolute bottom-6 left-6 text-white text-xl font-semibold">
                      {title}
                      <div className="mt-3 h-1 w-24 bg-[#6FA56F]/70 rounded" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className={`${sectionWrapper}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">Services</h2>
          <p className="mt-3 text-base text-slate-600">We design and build eco-friendly, energy-efficient, smart homes and spaces — integrating nature, technology, and architecture for healthier living.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[
              ["service_landscape.webp","Landscaping & Gardening"],
              ["service_exterior.webp","Exterior Architecture & 3D Design"],
              ["service_interior.webp","Interior Design (Eco & Minimal)"],
              ["service_smallspace.webp","Small-Space Optimisation (Flats & Villas)"],
              ["service_hospitality.webp","Hospitality Interiors (Homestays & Cafés)"],
              ["service_pool.webp","Swimming Pools & Water Systems"],
              ["service_smart.webp","Home Automation & Smart Systems"],
              ["service_energy.webp","Energy-Efficient Design & Solar Planning"],
              ["service_sustainable.webp","Sustainable Construction Consulting"],
            ].map(([img, title], index) => {
              const bg = index % 2 === 0 ? BRAND.altGreen : BRAND.altGray;
              return (
                <article key={title} className={`${bg} rounded-lg shadow overflow-hidden`}>
                  <img src={`/images/${img}`} alt={title} className="w-full h-52 object-cover opacity-90" loading="lazy" decoding="async" />
                  <div className="p-6">
                    <h3 className="font-semibold text-lg">{title}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className={`${sectionWrapper} bg-white`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">Featured Projects</h2>
          <p className="mt-3 text-base text-slate-600">A curated look at some of our most iconic project deliveries.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              ["project1_1.webp","Natural Stone Courtyard"],
              ["project2_1.webp","Waterfall Garden"],
              ["project3_1.webp","Café Outdoor Seating"],
              ["project4_1.webp","Resort Pathway"],
            ].map(([img, title], idx) => (
              <article key={title} className="rounded-lg shadow overflow-hidden">
                <img src={`/images/${img}`} alt={title} className="w-full h-48 object-cover" loading="lazy" decoding="async" />
                <div className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className={`${sectionWrapper} ${BRAND.altGreen}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">Gallery</h2>
          <p className="mt-3 text-base text-slate-600">Visual moments from our completed landscape projects.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {["gallery1.webp","gallery2.webp","gallery5.webp","gallery8.webp"].map((img, i) => (
              <img key={img} src={`/images/${img}`} alt={`Gallery ${i+1}`} className="h-56 w-full object-cover rounded-lg shadow" loading="lazy" decoding="async" />
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section id="process" className={`${sectionWrapper} ${BRAND.altGray}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">Our Process</h2>
          <p className="mt-3 text-base text-slate-600">A simple, transparent workflow from concept to completion.</p>

          <div className="relative mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              ["1","Site Consultation","On-site study & requirement discussion"],
              ["2","3D Design & Planning","Photorealistic renders & approvals"],
              ["3","Material & Budgeting","BOQs, samples & cost planning"],
              ["4","Execution & Quality","Supervised execution & finishing"],
              ["5","Handover & Support","Warranty & maintenance assistance"],
            ].map(([step, title, desc], index) => {
              const delay = index * (isMobile ? 80 : 120);
              const duration = isMobile ? "400ms" : "700ms";
              const innerBg = index % 2 === 0 ? BRAND.altGreen : BRAND.altGray;
              return (
                <div
                  key={step}
                  className={`relative ${innerBg} border rounded-xl p-8 text-center shadow-sm transition-all ease-out ${processVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDuration: duration, transitionDelay: `${delay}ms` }}
                >
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#6FA56F] text-white flex items-center justify-center font-bold text-lg">
                    {step}
                  </div>
                  <h4 className="font-semibold text-lg">{title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className={`${sectionWrapper} bg-white`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">Why Padanilathu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              ["🌱 Eco-First Design","Sustainability is built into every decision."],
              ["🧠 Integrated Thinking","Exterior, interior, energy and automation planned together."],
              ["🏗 17+ Years Experience","Ground-level execution across Kerala."],
              ["📐 Practical Innovation","Smart solutions that are realistic and serviceable."],
            ].map(([title, desc]) => (
              <div key={title} className="bg-[#f8f9f8] rounded-lg p-6">
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className={`${sectionWrapper} ${BRAND.altGreen}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">News & Updates</h2>
          <p className="mt-3 text-base text-slate-600">Latest announcements & events.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["news1.webp","17 Years of Landscape Excellence","Celebrating over 17 years of crafting sustainable outdoor spaces across Kerala."],
              ["news2.webp","500+ Completed Projects Milestone","A major achievement in delivering sustainable outdoor spaces."],
              ["news3.webp","Kerala Landscaping Trends 2025","Emerging eco-friendly materials and design philosophies."],
            ].map(([img, title, desc]) => (
              <article key={title} className="rounded-lg shadow overflow-hidden bg-white">
                <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" />
                <div className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className={`${sectionWrapper} ${BRAND.altGray}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">What Our Clients Say</h2>
          <p className="mt-3 text-base text-slate-600">Genuine feedback from homeowners and long-term clients.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { stars: "★ ★ ★ ★ ★", text: "Worked with them for my home front yard tile paving — extremely satisfying and value for money.", author: "Sanjith Pillai" },
              { stars: "★ ★ ★ ★ ★", text: "Padanilathu stood out for their honesty and dedication. Special thanks to Mr. Sudhakaran and the team.", author: "Sreekanth Haridasan" },
              { stars: "★ ★ ★ ★ ★", text: "Professional execution, transparent communication and eco-friendly approach throughout the project.", author: "Ananya R" },
            ].map((r, idx) => (
              <div key={r.author} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-1 text-yellow-400 text-lg">{r.stars}</div>
                <p className="mt-3 text-sm text-slate-600">{r.text}</p>
                <div className="mt-4 font-semibold text-slate-900">{r.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={`${sectionWrapper} ${BRAND.altGreen}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">About Padanilathu</h2>
          <p className="mt-3 text-base text-slate-600 max-w-3xl">Padanilathu is an eco-focused design and construction studio integrating architecture, interiors, landscape, energy efficiency and smart automation. Our mission is to create healthier, low-energy living environments that are deeply connected to nature and future-ready.</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              ["mission.webp","Mission","Crafting eco-conscious, aesthetic outdoor environments."],
              ["vision.webp","Vision","To be Kerala’s most trusted outdoor architecture and landscaping brand."],
              ["values.webp","Values","Sustainability · Creativity · Craftsmanship · Transparency"],
            ].map(([img, title, desc], i) => (
              <div key={title} className="bg-white rounded-lg p-6 shadow">
                <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover rounded mb-4" loading="lazy" decoding="async" />
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POSITIONING SUMMARY */}
      <section className={`${sectionWrapper} bg-white`}>
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold">Positioning Summary</h3>
          <p className="mt-3 text-base text-slate-600">After these updates, our brand positioning is clear and differentiated:</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-700">
            <div>✅ Eco Home Designer</div>
            <div>✅ Interior + Exterior Studio</div>
            <div>✅ Energy-Saving Specialist</div>
            <div>✅ Smart Home Integrator</div>
            <div>✅ Hospitality Design Partner</div>
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section id="careers" className={`${sectionWrapper} ${BRAND.altGray}`}>
        <div className="max-w-7xl mx-auto p-6 rounded-lg">
          <h2 className="text-3xl font-semibold">Careers</h2>
          <p className="mt-3 text-base text-slate-600">Join our growing team — designers, engineers, horticulturists and site specialists across Kerala.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {[
              ["Landscape Architect / Designer","Experience: 2–6 years · Location: Ernakulam · Apply with CV & portfolio."],
              ["Site Supervisor / Foreman","Experience: 3+ years · Lead site teams and ensure quality delivery."],
              ["Horticulturist / Plant Specialist","Plant selection, soil and irrigation planning · References preferred."],
              ["3D Visualization Intern","Assist in renders and CAD drawings · Portfolio required."],
            ].map(([title, desc], idx) => (
              <div key={title} className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <a href="#contact" className="inline-flex items-center bg-[#6FA56F] hover:bg-[#507953] text-white px-5 py-3 rounded-md text-sm font-semibold">
              Apply Now
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={`${sectionWrapper} ${BRAND.altGreen}`}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-semibold">Contact</h2>
            <p className="mt-3 text-base text-slate-600">Request a free site visit and quotation. We serve clients across Kerala, with a strong presence in South Kerala.</p>

            <div className="mt-6 rounded-md overflow-hidden">
              <img src="/images/about_office.webp" alt="Padanilathu office" className="w-full h-64 object-cover rounded-md" />
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li><strong>Phone:</strong> <a href="tel:+91-7907709032" className="text-slate-700">+91-7907709032</a></li>
              <li><strong>Email:</strong> <a href="mailto:hello@padanilathu.com" className="text-slate-700">hello@padanilathu.com</a></li>
              <li><strong>Service area:</strong> All Kerala</li>
            </ul>
          </div>

          <form
            id="contactForm"
            className="space-y-3 bg-white rounded-lg p-6 shadow"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form submitted — backend not yet connected.");
            }}
          >
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
            <textarea name="message" rows="5" placeholder="Project details (optional)" className="w-full p-3 rounded-md border border-slate-200" />
            <div className="flex justify-end">
              <button type="submit" className="bg-[#6FA56F] hover:bg-[#507953] text-white px-5 py-3 rounded-md text-sm font-semibold">Request Site Visit</button>
            </div>
          </form>
        </div>
      </section>

      {/* FLOATING CONTACT BUTTON */}
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
            <a href="tel:+917907709032" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-sm">📞 Call Now</a>
            <a href="https://wa.me/919446061029" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-sm">💬 WhatsApp</a>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className={`${BRAND.altGray} border-t border-slate-200 mt-20`}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-semibold text-lg">padanilathu</div>
            <p className="text-sm mt-2 text-slate-600">Transforming Kerala’s outdoor spaces since 2008.</p>
            <p className="text-sm text-slate-600 mt-1">17+ Years · 500+ Completed Sites</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="Instagram">IG</a>
              <a href="#" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="Facebook">FB</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Navigation</h4>
            <ul className="text-sm mt-3 space-y-2 text-slate-600">
              <li><a href="#sectors">Sectors</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#news">News</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="text-sm mt-3 text-slate-600">Phone: +91-7907709032<br />Email: hello@padanilathu.com<br />Service Area: Kerala</p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="text-sm mt-3 space-y-2 text-slate-600">
              <li><a href="#contact">Request a Free Site Visit</a></li>
              <li><a href="#">Download Company Profile (PDF)</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">© 2025 padanilathu — All Rights Reserved.</div>
      </footer>
    </>
  );
}