import React, { useEffect, useState } from "react";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // HERO VIDEO RESPONSIVE HANDLING
  useEffect(() => {
    const handleResize = () => {
      const video = document.querySelector("#home video");
      if (!video) return;

      if (window.innerWidth < 700) {
        video.pause();
        video.style.display = "none";
      } else {
        video.style.display = "block";
        video.play().catch(() => {});
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ================================================================
          HEADER
      ================================================================= */}
 <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex items-center justify-between h-20">


      {/* LOGO */}
      <a href="#home" className="relative flex items-center gap-2 group">
        <div
          className="text-2xl font-extrabold tracking-wide relative text-white"
          style={{ fontFamily: "Graphik, Arial Black, Arial, sans-serif" }}
        >
          padanilathu

          {/* Highlight underline */}
          <span
            className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#6FA56F] rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300"
          ></span>
        </div>

        <div className="ml-3 text-sm text-white/80 font-medium">
          Since 2008
        </div>
      </a>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
        <a href="#sectors" className="hover:text-[#6FA56F]">Sectors</a>
        <a href="#services" className="hover:text-[#6FA56F]">Services</a>
        <a href="#projects" className="hover:text-[#6FA56F]">Projects</a>
        <a href="#gallery" className="hover:text-[#6FA56F]">Gallery</a>
        <a href="#insights" className="hover:text-[#6FA56F]">Insights</a>
        <a href="#news" className="hover:text-[#6FA56F]">News</a>
        <a href="#about" className="hover:text-[#6FA56F]">About</a>
        <a href="#careers" className="hover:text-[#6FA56F]">Careers</a>

        <a
          href="#contact"
          className="px-4 py-2 rounded-md font-semibold border border-white text-white hover:bg-white hover:text-[#6FA56F] transition"
        >
          Contact
        </a>
      </nav>

      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden p-2 border border-white text-white rounded-md"
      >
        ☰
      </button>
    </div>
  </div>

  {/* MOBILE NAV */}
  {mobileOpen && (
    <div className="md:hidden absolute left-4 right-4 top-20 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex flex-col gap-3 text-slate-700 font-medium">
        <a href="#sectors" onClick={() => setMobileOpen(false)}>Sectors</a>
        <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
        <a href="#projects" onClick={() => setMobileOpen(false)}>Projects</a>
        <a href="#gallery" onClick={() => setMobileOpen(false)}>Gallery</a>
        <a href="#insights" onClick={() => setMobileOpen(false)}>Insights</a>
        <a href="#news" onClick={() => setMobileOpen(false)}>News</a>
        <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#careers" onClick={() => setMobileOpen(false)}>Careers</a>
        <a
          href="#contact"
          onClick={() => setMobileOpen(false)}
          className="bg-[#6FA56F] text-white px-4 py-2 rounded-md mt-2"
        >
          Contact
        </a>
      </div>
    </div>
  )}
</header>


      {/* ================================================================
          HERO SECTION
      ================================================================= */}
      <section id="home" className="relative h-screen min-h-[650px]">
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

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="text-white max-w-3xl">
            <h1
  className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
  style={{ fontFamily: "Graphik, Inter, sans-serif" }}
>

              Designing Eco-Conscious & Aesthetically Stunning Outdoor Spaces
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white/90">
              We craft eco-friendly outdoor spaces using sustainable materials,
              landscape architecture, and 3D visualization — delivering
              long-lasting, functional, and beautifully designed environments
              across Kerala.
            </p>

            <div className="mt-6 flex gap-4 flex-wrap">
              <a
                href="#services"
                className="bg-white text-[#6FA56F] px-4 py-2 rounded-md font-semibold"
              >
                Explore Services
              </a>

              <a
                href="#projects"
                className="border border-white/40 text-white px-4 py-2 rounded-md"
              >
                View Projects
              </a>
            </div>

            <div className="mt-10 flex gap-6 flex-wrap">
              <div className="bg-white/10 p-4 rounded-md min-w-[160px]">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-white/80">Completed Sites</div>
              </div>

              <div className="bg-white/10 p-4 rounded-md min-w-[160px]">
                <div className="text-2xl font-bold">17+ Years</div>
                <div className="text-sm text-white/80">Industry Experience</div>
              </div>

              <div className="bg-white/10 p-4 rounded-md min-w-[200px]">
                <div className="text-2xl font-bold">Integrated</div>
                <div className="text-sm text-white/80">
                  Design–Build Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          MAIN WRAPPER
      ================================================================= */}
      <main className="relative max-w-7xl mx-auto px-6 -mt-24 pb-24">

        {/* ================================================================
            SECTORS
        ================================================================ */}
        <section id="sectors" className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-poppins font-semibold">Sectors</h2>
          <p className="text-sm text-slate-600 mt-2">
            We design outdoor environments across residential, commercial,
            hospitality, public and institutional spaces.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                className="relative h-44 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(/images/${img})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
                <div className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            SERVICES
        ================================================================ */}
        <section id="services" className="mt-12">
          <h2 className="text-2xl font-poppins font-semibold">Services</h2>
          <p className="mt-2 text-sm text-slate-600">
            From concept and 3D visualization to execution and maintenance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
              <article
                key={title}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <img
                  src={`/images/${img}`}
                  className="w-full h-44 object-cover"
                  alt={title}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================================================================
            PROJECTS
        ================================================================ */}
        <section id="projects" className="mt-14">
          <h2 className="text-2xl font-poppins font-semibold">Featured Projects</h2>

          <p className="mt-2 text-sm text-slate-600">
            A curated look at some of our most iconic project deliveries.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              ["project1_1.png", "Natural Stone Courtyard"],
              ["project2_1.png", "Waterfall Garden"],
              ["project3_1.png", "Café Outdoor Seating"],
              ["project4_1.png", "Resort Pathway"],
            ].map(([img, title]) => (
              <article
                key={title}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <img
                  src={`/images/${img}`}
                  className="w-full h-44 object-cover"
                  alt={title}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================================================================
            GALLERY
        ================================================================ */}
        <section id="gallery" className="mt-16">
          <h2 className="text-2xl font-poppins font-semibold">Gallery</h2>
          <p className="mt-2 text-sm text-slate-600">
            Visual moments from our completed landscape projects.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {[
              "gallery1.jpg",
              "gallery2.png",
              

              "gallery5.jpg",
              
              
              "gallery8.jpg",
            ].map((img) => (
              <img
  src={`/images/${img}`}
  loading="lazy"
  decoding="async"
  className="h-40 w-full object-cover rounded-lg shadow"
  alt="Gallery"
/>

              
            ))}
          </div>
        </section>
        {/* ================================================================
            OUR PROCESS
        ================================================================ */}
        <section id="process" className="mt-16 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-poppins font-semibold">Our Process</h2>
          <p className="mt-2 text-sm text-slate-600">
            A simple and transparent workflow from concept to completion.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            {[
              ["1. Site Consultation", "On-site study and requirement briefing"],
              ["2. 3D Design & Planning", "Photoreal renders and approval"],
              ["3. Material & Budgeting", "BOQs, samples, and cost planning"],
              ["4. Execution & Quality", "Supervision and quality finishing"],
              ["5. Handover & Maintenance", "Warranty and AMC support"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="p-4 border rounded-md text-sm text-slate-700"
              >
                <div className="font-semibold">{title}</div>
                <div className="text-slate-500 mt-1 text-sm">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            INSIGHTS
        ================================================================ */}
        <section id="insights" className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-poppins font-semibold">Insights</h2>
              <p className="mt-2 text-sm text-slate-600">
                Thought leadership, practical guides, and ideas from our team.
              </p>
            </div>

            <a href="#insights" className="text-sm text-slate-500">
              View all insights →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[
              [
                "Designing Climate-Responsive Landscapes for Kerala",
                "How heat, humidity, and soil shape plant selection and design decisions.",
              ],
              [
                "Role of Native Plants in Sustainable Outdoor Design",
                "Why native species reduce maintenance and support biodiversity.",
              ],
              [
                "Natural Stone vs Interlock",
                "Choosing the best paving material for long-term durability.",
              ],
            ].map(([title, desc]) => (
              <article
                key={title}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ================================================================
            NEWS
        ================================================================ */}
        <section id="news" className="mt-16">
  <h2 className="text-2xl font-semibold" style={{ fontFamily: "Graphik, Inter, sans-serif" }}>
    News & Updates
  </h2>
  <p className="mt-2 text-sm text-slate-600">Latest announcements & events.</p>

  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      ["news1.png", "Christmas Update — New Outdoor Lighting Designs",
        "Special festive installations completed across Kerala resorts."],
      ["news2.png", "500+ Completed Projects Milestone",
        "A major achievement in delivering sustainable outdoor spaces."],
      ["news3.png", "Kerala Landscaping Trends 2025",
        "Emerging eco-friendly materials and design philosophies."]
    ].map(([img, title, desc]) => (
      <article key={title} className="bg-white rounded-lg shadow overflow-hidden">
        <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold" style={{ fontFamily: 'Graphik, Inter, sans-serif' }}>
            {title}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{desc}</p>
        </div>
      </article>
    ))}
  </div>
</section>

{/* ================================================================
    REVIEWS / TESTIMONIALS
================================================================ */}
{/* ================================================================
    REVIEWS
================================================================ */}
<section id="reviews" className="mt-16">
  <h2 className="text-2xl font-poppins font-semibold">
    What Our Clients Say
  </h2>
  <p className="mt-2 text-sm text-slate-600">
    Genuine feedback from homeowners and long-term clients.
  </p>

  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-sm text-slate-600">
        “Worked with them for my home front yard tile paving and found their
        service extremely satisfying and value for money. I would gladly
        work with them again.”
      </p>
      <div className="mt-4 font-semibold text-slate-900">
        Sanjith Pillai
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-sm text-slate-600">
        “Among many professionals I met during house construction,
        Padanilathu stood out for their honesty and dedication.
        Special thanks to Mr. Sudhakaran and the team.”
      </p>
      <div className="mt-4 font-semibold text-slate-900">
        Sreekanth Haridasan
      </div>
      <div className="text-xs text-slate-500">3 years ago</div>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-sm text-slate-600 italic">
        “Professional execution, transparent communication, and
        eco-friendly approach throughout the project.”
      </p>
      <div className="mt-4 font-semibold text-slate-900">
        Ananya R
      </div>
    </div>
  </div>
</section>

        {/* ================================================================
            ABOUT
        ================================================================ */}
     <section id="about" className="mt-16 bg-white rounded-xl p-8 shadow">
  <h2 className="text-2xl font-semibold" style={{ fontFamily: "Graphik, Inter, sans-serif" }}>
    About Padanilathu
  </h2>
  <p className="mt-3 text-sm text-slate-600">
    Since 2008, Padanilathu has been shaping sustainable, high-quality outdoor spaces across Kerala.
  </p>

  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
    {[
      ["mission.png", "Mission", "Crafting eco-conscious, aesthetic outdoor environments that improve everyday living."],
      ["vision.png", "Vision", "To be Kerala’s most trusted outdoor architecture and landscaping brand."],
      ["values.png", "Values", "Sustainability · Creativity · Craftsmanship · Transparency"],
    ].map(([img, title, desc]) => (
      <div key={title} className="text-center bg-white p-4 rounded-lg shadow-sm">
        <img src={`/images/${img}`} alt={title} className="w-full h-40 object-cover rounded-md mb-4" />
        <h3 className="font-semibold text-lg" style={{ fontFamily: 'Graphik, Inter, sans-serif' }}>
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600">{desc}</p>
      </div>
    ))}
  </div>
</section>


        {/* ================================================================
            CAREERS
        ================================================================ */}
        <section id="careers" className="mt-16">
          <h2 className="text-2xl font-poppins font-semibold">Careers</h2>
          <p className="mt-2 text-sm text-slate-600">
            Join our growing team — we hire designers, engineers, horticulturists
            and site specialists across Kerala.
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
            ].map(([title, desc]) => (
              <div key={title} className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <a
              href="#contact"
              className="inline-flex items-center bg-[#6FA56F] hover:bg-[#507953] text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              Apply Now
            </a>
          </div>
        </section>

        {/* ================================================================
            CONTACT
        ================================================================ */}
        <section
          id="contact"
          className="mt-16 bg-white rounded-xl p-8 shadow-sm"
        >
          <h2 className="text-2xl font-poppins font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-slate-600">
            Request a free site visit and quotation. We serve all of Kerala with
            a strong presence in Ernakulam.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* CONTACT INFO */}
            <div>
              <p className="text-sm text-slate-600">Quick contact</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+91-XXXXXXXXXX" className="text-slate-600">
                    +91-XXXXXXXXXX
                  </a>
                </li>

                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:hello@padanilathu.com" className="text-slate-600">
                    hello@padanilathu.com
                  </a>
                </li>

                <li>
                  <strong>Service area:</strong> All Kerala — focus Ernakulam
                </li>
              </ul>

              <div className="mt-6 rounded-md overflow-hidden">
                <img
                  src="/images/about_office.png"
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

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div>
            <div className="font-poppins font-semibold text-lg">padanilathu</div>
            <p className="text-sm mt-2 text-slate-600">
              Transforming Kerala’s outdoor spaces since 2008.
            </p>
            <p className="text-sm text-slate-600 mt-1">
              17+ Years · 500+ Completed Sites
            </p>

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
              <li><a href="#sectors">Sectors</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#insights">Insights</a></li>
              <li><a href="#news">News</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="text-sm mt-3 text-slate-600">
              Phone: +91-XXXXXXXXXX <br />
              Email: hello@padanilathu.com <br />
              Service Area: Kerala (Focus: Ernakulam)
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="text-sm mt-3 space-y-2 text-slate-600">
              <li><a href="#contact">Request a Free Site Visit</a></li>
              <li><a href="#">Download Company Profile (PDF)</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
          © 2025 padanilathu — All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
