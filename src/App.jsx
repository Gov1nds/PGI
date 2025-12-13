import React, { useEffect, useState } from "react";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Responsive video behavior
  useEffect(() => {
    const check = () => {
      const video = document.querySelector("section#home video");
      if (!video) return;

      if (window.innerWidth < 700) {
        video.pause();
        video.style.display = "none";
      } else {
        video.style.display = "";
        video.play().catch(() => {});
      }
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <a href="#home" className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-md"
                style={{ background: "#6FA56F" }}
              />
              <div className="font-poppins font-semibold text-lg text-slate-900">
                padanilathu
              </div>
              <div className="ml-3 text-sm text-slate-500">Since 2008</div>
            </a>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 font-medium">
              <a href="#sectors" className="hover:text-slate-900">Sectors</a>
              <a href="#services" className="hover:text-slate-900">Services</a>
              <a href="#projects" className="hover:text-slate-900">Projects</a>
              <a href="#gallery" className="hover:text-slate-900">Gallery</a>
              <a href="#insights" className="hover:text-slate-900">Insights</a>
              <a href="#news" className="hover:text-slate-900">News</a>
              <a
                href="#contact"
                className="ml-3 inline-flex items-center bg-[#6FA56F] hover:bg-[#507953] text-white text-sm font-semibold px-4 py-2 rounded-md"
              >
                Contact
              </a>
            </nav>

            {/* MOBILE TOGGLE */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="p-2 rounded-md border"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
            <nav className="flex flex-col gap-3 text-slate-700 font-medium">
              <a href="#sectors" onClick={() => setMobileOpen(false)}>Sectors</a>
              <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
              <a href="#projects" onClick={() => setMobileOpen(false)}>Projects</a>
              <a href="#gallery" onClick={() => setMobileOpen(false)}>Gallery</a>
              <a href="#insights" onClick={() => setMobileOpen(false)}>Insights</a>
              <a href="#news" onClick={() => setMobileOpen(false)}>News</a>

              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center bg-[#6FA56F] hover:bg-[#507953] text-white text-sm font-semibold px-4 py-2 rounded-md"
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative h-screen min-h-[640px]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero1.png"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero1.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/50" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Designing Eco-Conscious & Aesthetically Stunning Outdoor Spaces
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white/90">
              We craft aesthetically appealing, eco-friendly outdoor spaces by
              prioritizing sustainability and the best materials for eco-house
              living. Our services, including landscape architecture and 3D
              visualization, deliver enduring, high-quality, and ecologically
              sound designs across the state.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="#services"
                className="inline-flex items-center bg-white text-[#6FA56F] font-semibold px-4 py-2 rounded-md shadow-sm"
              >
                Explore Services
              </a>
              <a
                href="#projects"
                className="inline-flex items-center border border-white/40 text-white px-4 py-2 rounded-md"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="relative max-w-7xl mx-auto px-6 -mt-24 pb-24">

        {/* SECTORS */}
        <section id="sectors" className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-poppins font-semibold">Sectors</h2>
          <p className="text-sm mt-2 text-slate-600">
            We create outdoor environments across residential, commercial, public, and hospitality sectors.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Residential", "sector_residential.png"],
              ["Commercial", "sector_commercial.png"],
              ["Hospitality", "sector_hospitality.png"],
              ["Public & Recreational", "sector_public.png"],
              ["Institutional", "sector_institutional.png"],
              ["Real Estate & Developers", "sector_developers.png"],
              ["Industrial", "sector_industrial.png"],
            ].map(([title, img]) => (
              <div
                key={title}
                className="relative h-44 rounded-lg bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url(/images/${img})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
                <div className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="mt-12">
          <h2 className="text-2xl font-poppins font-semibold">Services</h2>
          <p className="mt-2 text-sm text-slate-600">
            Complete expertise from concept & 3D visualization to execution and maintenance.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["service_landscape.png", "Landscaping & Gardening"],
              ["service_stonepaving.png", "Natural Stone Paving"],
              ["service_exterior.png", "Exterior Architecture & 3D Design"],
              ["service_waterfeatures.png", "Water Features"],
              ["service_playgrounds.png", "Playgrounds & Sports Areas"],
              ["service_commercial.png", "Commercial & Resort Landscaping"],
              ["service_renovation.png", "Renovation & Maintenance"],
              ["service_consulting.png", "Outdoor Space Consulting"],
              ["service_sustainability.png", "Sustainable Outdoor Solutions"],
            ].map(([img, title]) => (
              <article key={title} className="bg-white rounded-lg shadow overflow-hidden">
                <img src={`/images/${img}`} className="w-full h-44 object-cover" alt={title} />
                <div className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mt-12">
          <h2 className="text-2xl font-poppins font-semibold">Featured Projects</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["project1_1.png", "Natural Stone Courtyard"],
              ["project2_1.png", "Waterfall Garden"],
              ["project3_1.png", "Café Outdoor Seating"],
              ["project4_1.png", "Resort Pathway & Landscape"],
            ].map(([img, title]) => (
              <article key={title} className="bg-white rounded-lg shadow overflow-hidden">
                <img src={`/images/${img}`} className="w-full h-44 object-cover" alt={title} />
                <div className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="mt-16">
          <h2 className="text-2xl font-poppins font-semibold">Gallery</h2>
          <p className="mt-2 text-sm text-slate-600">
            A curated collection showcasing our outdoor craftsmanship.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "gallery1.png",
              "gallery2.png",
              "gallery3.png",
              "gallery4.png",
              "gallery5.png",
              "gallery6.png",
              "gallery7.png",
              "gallery8.png",
            ].map((img) => (
              <img
                key={img}
                src={`/images/${img}`}
                alt="Gallery"
                className="w-full h-40 object-cover rounded-lg shadow-sm hover:opacity-90 transition"
              />
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-10 text-center text-sm text-slate-500">
        © 2025 padanilathu — All Rights Reserved.
      </footer>
    </>
  );
}
