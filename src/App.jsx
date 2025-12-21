import React, { useEffect, useState } from "react";

/*
  App.jsx
  - Full page component with updated hero and "Eco Smart Living" section
  - Hero heading updated to:
      "Sustainable Design for Better Living"
    Subheading:
      "Eco-friendly, smart homes and outdoor spaces designed for Kerala’s climate."
  - "Eco Smart Living" section redesigned to match the second screenshot layout:
      • Large centered heading + descriptive paragraph
      • Left-featured "Core Service" card
      • Grid of rounded cards with icons
      • Bottom-right CTA card
  - Preserves original functionality: auto quote popup, mobile menu, contact popup, process reveal
  - Uses Tailwind-style utility classes (hex backgrounds used where dynamic classes would otherwise be needed)
*/

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

            <nav
              className={`hidden md:flex items-center gap-8 text-sm font-medium ${
                scrolled ? "text-slate-700" : "text-white"
              }`}
              aria-label="Primary navigation"
            >
              <a href="#sectors" className="hover:underline">
                Sectors
              </a>
              <a href="#services" className="hover:underline">
                Services
              </a>
              <a href="#projects" className="hover:underline">
                Projects
              </a>
              <a href="#gallery" className="hover:underline">
                Gallery
              </a>
              <a href="#about" className="hover:underline">
                About
              </a>
              <a href="#careers" className="hover:underline">
                Careers
              </a>
              <button
                onClick={() => setQuoteOpen(true)}
                className="ml-2 bg-[#6FA56F] hover:bg-[#5f9a5f] text-white px-5 py-2 rounded-md text-sm font-semibold shadow"
              >
                Request Quote
              </button>
            </nav>

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

        {mobileOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-5 border-t">
            <div className="flex flex-col gap-4 text-slate-700 font-medium">
              {["sectors", "services", "projects", "gallery", "about", "careers"].map((item) => (
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

      {/* HERO (updated) */}
      <section id="home" className="relative min-h-[84vh] flex items-center">
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover hidden lg:block" autoPlay muted loop playsInline>
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
                Sustainable Design for Better Living
              </h1>

              <p className="mt-6 text-lg md:text-xl max-w-2xl text-white/90">
                Eco-friendly, smart homes and outdoor spaces designed for Kerala’s climate.
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
                <button type="submit" className="bg-[#6FA56F] text-white px-6 py-3 rounded-md font-semibold">
                  Submit Quote Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ECO SMART LIVING (converted to second image layout) */}
      <section className={`${sectionWrapper} bg-[#eef4ef]`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-900">
            Sustainable, Energy-Efficient & Smart Living Spaces
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed">
            We design and build sustainable, energy-efficient and AI-enabled homes tailored for Kerala’s climate — combining natural ventilation,
            smart technology and eco-friendly construction for healthier, lower-energy living.
          </p>

          <p className="mt-4 text-sm text-slate-600">Better air. Lower energy bills. Smarter everyday comfort.</p>
        </div>

        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Large left featured card */}
          <div className="lg:col-span-5 px-4">
            <div className="bg-white rounded-xl p-8 shadow-lg h-full">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="inline-block bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Core Service</div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">Sustainable Construction</h3>
                </div>

                <div className="text-3xl">♻️</div>
              </div>

              <p className="mt-6 text-slate-600">
                Low-carbon materials and climate-responsive construction designed to reduce heat gain, improve airflow and minimise long-term energy use.
              </p>

              <div className="mt-6 flex gap-3">
                <div className="inline-block bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Core Service</div>
                <div className="inline-block text-xs text-slate-500 px-3 py-1 rounded-md border">Featured</div>
              </div>
            </div>
          </div>

          {/* Right grid cards */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                <div className="text-xl">🌬️</div>
                <h4 className="font-semibold text-slate-900">Fresh Air & Thermal Comfort</h4>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Cross-ventilation planning, breathable interiors and indoor air-quality optimisation designed for humid tropical climates.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                <div className="text-xl">⚡</div>
                <h4 className="font-semibold text-slate-900">Maximum Energy Saving</h4>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Solar integration, daylight optimisation and insulation strategies that significantly reduce electricity consumption.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                <div className="text-xl">🏠</div>
                <h4 className="font-semibold text-slate-900">Smart & AI-Enabled Homes</h4>
              </div>
              <p className="mt-3 text-sm text-slate-600">Intelligent automation for lighting, security and climate — adapting to your lifestyle while reducing energy waste.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                <div className="text-xl">🏨</div>
                <h4 className="font-semibold text-slate-900">Hospitality & Café Design</h4>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Eco-focused interiors for cafés, homestays and resorts — designed for guest comfort, operational efficiency and lower running costs.
              </p>
            </div>

            <div className="md:col-span-1 bg-white rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                <div className="text-xl">🏊‍♂️</div>
                <h4 className="font-semibold text-slate-900">Eco-Optimised Swimming Pools</h4>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Low-chemical pools with energy-efficient filtration, natural water circulation and reduced maintenance.
              </p>
            </div>

            <div className="md:col-span-1 bg-white rounded-xl p-6 shadow flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-xl">🍃</div>
                  <h4 className="font-semibold text-slate-900">Maintenance & Long-Term Support</h4>
                </div>
                <p className="mt-3 text-sm text-slate-600">Practical maintenance plans to keep systems efficient and landscapes thriving year-round.</p>
              </div>

              <div className="ml-6">
                <a
                  href="#contact"
                  className="inline-block bg-slate-800 text-white px-6 py-3 rounded-full shadow hover:bg-slate-900"
                >
                  Request an Eco Design Consultation →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN wrapper & remaining sections (kept similar to previous structure) */}
      <main className="relative max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* SECTORS */}
        <section id="sectors" className="mt-12 bg-[#f7f8f7] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-xl shadow p-8">
              <h2 className="text-2xl font-poppins font-semibold">Sectors</h2>
              <p className="text-sm text-slate-600 mt-2">
                We design outdoor environments across residential, commercial, hospitality, public and institutional spaces.
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
                  const bg = index % 2 === 0 ? "bg-[#eef4ef]" : "bg-[#f7f8f7]";
                  return (
                    <div key={title} className={`${bg} relative h-44 rounded-lg overflow-hidden`}>
                      <img src={`/images/${img}`} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-70" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40" />
                      <div className="absolute bottom-4 left-4 text-white text-lg font-semibold">
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

        {/* SERVICES */}
        <section id="services" className="mt-14">
          <h2 className="text-2xl font-poppins font-semibold">Services</h2>
          <p className="mt-2 text-sm text-slate-600">
            We design and build eco-friendly, energy-efficient, smart homes and spaces — integrating nature, technology, and architecture for healthier living.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[
              ["service_landscape.webp", "Landscaping & Gardening"],
              ["service_exterior.webp", "Exterior Architecture & 3D Design"],
              ["service_interior.webp", "Interior Design (Eco & Minimal)"],
              ["service_smallspace.webp", "Small-Space Optimisation (Flats & Villas)"],
              ["service_hospitality.webp", "Hospitality Interiors (Homestays & Cafés)"],
              ["service_pool.webp", "Swimming Pools & Water Systems"],
              ["service_smart.webp", "Home Automation & Smart Systems"],
              ["service_energy.webp", "Energy-Efficient Design & Solar Planning"],
              ["service_sustainable.webp", "Sustainable Construction Consulting"],
            ].map(([img, title], index) => {
              const bg = index % 2 === 0 ? "bg-[#eef4ef]" : "bg-[#f7f8f7]";
              return (
                <article key={title} className={`${bg} rounded-lg shadow overflow-hidden`}>
                  <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover opacity-80" loading="lazy" decoding="async" />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mt-14">
          <h2 className="text-2xl font-poppins font-semibold">Featured Projects</h2>
          <p className="mt-2 text-sm text-slate-600">A curated look at some of our most iconic project deliveries.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              ["project1_1.webp", "Natural Stone Courtyard"],
              ["project2_1.webp", "Waterfall Garden"],
              ["project3_1.webp", "Café Outdoor Seating"],
              ["project4_1.webp", "Resort Pathway"],
            ].map(([img, title]) => (
              <article key={title} className="rounded-lg shadow overflow-hidden bg-white">
                <img src={`/images/${img}`} alt={title} className="w-full h-44 object-cover" loading="lazy" decoding="async" />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="mt-16 bg-[#eef4ef] rounded-xl p-8">
          <h2 className="text-2xl font-poppins font-semibold">Gallery</h2>
          <p className="mt-2 text-sm text-slate-600">Visual moments from our completed landscape projects.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {["gallery1.webp", "gallery2.webp", "gallery5.webp", "gallery8.webp"].map((img, index) => (
              <img key={img} src={`/images/${img}`} loading="lazy" decoding="async" className="h-40 w-full object-cover rounded-lg shadow" alt={`Gallery ${index + 1}`} />
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="mt-16 bg-[#f7f8f7] rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-poppins font-semibold">Our Process</h2>
          <p className="mt-2 text-sm text-slate-600">A simple, transparent workflow from concept to completion.</p>

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
              const bg = index % 2 === 0 ? "bg-[#eef4ef]" : "bg-[#f7f8f7]";
              return (
                <div
                  key={step}
                  className={`${bg} border rounded-xl p-6 text-center shadow-sm transition-all ease-out ${processVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDuration: duration, transitionDelay: `${delay}ms` }}
                >
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#6FA56F] text-white flex items-center justify-center font-bold text-lg">{step}</div>
                  <h4 className="font-semibold text-slate-900">{title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* WHY US */}
        <section className="mt-16 bg-white rounded-xl p-8 shadow">
          <h2 className="text-2xl font-poppins font-semibold">Why Padanilathu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              ["🌱 Eco-First Design", "Sustainability is built into every decision — not added later."],
              ["🧠 Integrated Thinking", "Exterior, interior, energy and automation planned together."],
              ["🏗 17+ Years Experience", "Ground-level execution knowledge across Kerala conditions."],
              ["📐 Practical Innovation", "Smart solutions that are realistic, serviceable and future-ready."],
            ].map(([title, desc]) => (
              <div key={title} className="bg-[#f8f9f8] rounded-lg p-5">
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NEWS */}
        <section id="news" className="mt-16">
          <h2 className="text-2xl font-semibold">News & Updates</h2>
          <p className="mt-2 text-sm text-slate-600">Latest announcements & events.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["news1.webp", "17 Years of Landscape Excellence", "Celebrating over 17 years of crafting sustainable, high-quality outdoor spaces across Kerala."],
              ["news2.webp", "500+ Completed Projects Milestone", "A major achievement in delivering sustainable outdoor spaces."],
              ["news3.webp", "Kerala Landscaping Trends 2025", "Emerging eco-friendly materials and design philosophies."],
            ].map(([img, title, desc]) => (
              <article key={title} className="rounded-lg shadow overflow-hidden bg-white">
                <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover" loading="lazy" decoding="async" />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="mt-16">
          <h2 className="text-2xl font-poppins font-semibold">What Our Clients Say</h2>
          <p className="mt-2 text-sm text-slate-600">Genuine feedback from homeowners and long-term clients.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                stars: "★ ★ ★ ★ ★",
                text: "Worked with them for my home front yard tile paving — extremely satisfying and value for money.",
                author: "Sanjith Pillai",
              },
              {
                stars: "★ ★ ★ ★ ★",
                text: "Padanilathu stood out for their honesty and dedication. Special thanks to Mr. Sudhakaran and the team.",
                author: "Sreekanth Haridasan",
              },
              {
                stars: "★ ★ ★ ★ ★",
                text: "Professional execution, transparent communication and eco-friendly approach throughout the project.",
                author: "Ananya R",
              },
            ].map((r) => (
              <div key={r.author} className="bg-[#f7f8f7] rounded-lg shadow-sm p-6">
                <div className="flex gap-1 text-yellow-400 text-lg">{r.stars}</div>
                <p className="mt-3 text-sm text-slate-600">{r.text}</p>
                <div className="mt-4 font-semibold text-slate-900">{r.author}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="mt-16 bg-[#eef4ef] rounded-xl p-8">
          <h2 className="text-2xl font-semibold">About Padanilathu</h2>
          <p className="mt-3 text-sm text-slate-600">
            Padanilathu is an eco-focused design and construction studio integrating architecture, interiors, landscape, energy efficiency and smart automation. Our mission is to create healthier, low-energy living environments that are deeply connected to nature and future-ready.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              ["mission.webp", "Mission", "Crafting eco-conscious, aesthetic outdoor environments that improve everyday living."],
              ["vision.webp", "Vision", "To be Kerala’s most trusted outdoor architecture and landscaping brand."],
              ["values.webp", "Values", "Sustainability · Creativity · Craftsmanship · Transparency"],
            ].map(([img, title, desc]) => (
              <div key={title} className="bg-white text-center p-4 rounded-lg shadow-sm">
                <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover rounded-md mb-4" loading="lazy" decoding="async" />
                <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* POSITIONING SUMMARY */}
        <section className="mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-lg font-semibold">Positioning Summary</h3>
            <p className="mt-3 text-sm text-slate-600">After these updates, our brand positioning is clear and differentiated:</p>

            <div className="mt-4 inline-grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
              <div>✅ Eco Home Designer</div>
              <div>✅ Interior + Exterior Studio</div>
              <div>✅ Energy-Saving Specialist</div>
              <div>✅ Smart Home Integrator</div>
              <div>✅ Hospitality Design Partner</div>
            </div>

            <p className="mt-3 text-xs text-slate-500">This separates us from 90% of competitors in Kerala.</p>
          </div>
        </section>

        {/* CAREERS */}
        <section id="careers" className="mt-16 bg-[#f7f8f7] rounded-xl p-6">
          <h2 className="text-2xl font-poppins font-semibold">Careers</h2>
          <p className="mt-2 text-sm text-slate-600">Join our growing team — we hire designers, engineers, horticulturists and site specialists across Kerala.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {[
              ["Landscape Architect / Designer", "Experience: 2–6 years · Location: Ernakulam · Apply with CV & portfolio."],
              ["Site Supervisor / Foreman", "Experience: 3+ years · Lead site teams and ensure quality delivery."],
              ["Horticulturist / Plant Specialist", "Plant selection, soil and irrigation planning · References preferred."],
              ["3D Visualization Intern", "Assist in renders and CAD drawings · Portfolio required."],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="font-semibold text-slate-900">{title}</h4>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </div>
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
          <h2 className="text-2xl font-poppins font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-slate-600">Request a free site visit and quotation. We serve clients across Kerala, with a strong presence in South Kerala.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
                <img src="/images/about_office.webp" alt="Padanilathu office" className="w-full h-56 object-cover rounded-md" />
              </div>
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

              <textarea name="message" rows="4" placeholder="Project details (optional)" className="w-full p-3 rounded-md border border-slate-200" />

              <button type="submit" className="bg-[#6FA56F] hover:bg-[#507953] text-white px-4 py-2 rounded-md text-sm font-semibold">
                Request Site Visit
              </button>
            </form>
          </div>
        </section>
      </main>

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
            <a href="tel:+917907709032" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-sm">
              📞 Call Now
            </a>

            <a href="https://wa.me/919446061029" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-sm">
              💬 WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#f7f8f7] border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-poppins font-semibold text-lg">padanilathu</div>
            <p className="text-sm mt-2 text-slate-600">Transforming Kerala’s outdoor spaces since 2008.</p>
            <p className="text-sm text-slate-600 mt-1">17+ Years · 500+ Completed Sites</p>

            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="Instagram">
                IG
              </a>
              <a href="#" className="w-9 h-9 border rounded-md flex items-center justify-center text-slate-700 hover:bg-[#6FA56F] hover:text-white" aria-label="Facebook">
                FB
              </a>
            </div>
          </div>

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
                <a href="#news">News</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="text-sm mt-3 text-slate-600">Phone: +91-7907709032 <br />
              Email: hello@padanilathu.com <br />
              Service Area: Kerala (Focus: Ernakulam)
            </p>
          </div>

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