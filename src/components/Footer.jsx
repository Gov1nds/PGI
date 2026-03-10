import { Link } from "react-router-dom";
import Container from "./Container.jsx";
import { navLinks, site } from "../content/siteData.js";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/30">
      <Container className="py-12">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Company */}
          <div>
            <div className="text-lg font-semibold">{site.name}</div>

            <p className="mt-2 text-sm text-white/65">
              Engineering-led manufacturing coordination across precision
              machining, sheet metal fabrication, and electronic assembly.
            </p>

            <div className="mt-4 space-y-1 text-sm text-white/70">

              <div>
                <span className="text-white/50">Email:</span>{" "}
                <a
                  className="hover:text-white"
                  href={`mailto:${site.contact.email}`}
                >
                  {site.contact.email}
                </a>
              </div>

              <div>
                <span className="text-white/50">Phone:</span>{" "}
                <a
                  className="hover:text-white"
                  href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}
                >
                  {site.contact.phone}
                </a>
              </div>

              <div>
                <span className="text-white/50">Location:</span>{" "}
                {site.contact.location}
              </div>

            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="text-sm font-semibold text-white/90">
              Explore
            </div>

            <ul className="mt-3 space-y-2">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/65 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="text-sm font-semibold text-white/90">
              Manufacturing Services
            </div>

            <ul className="mt-3 space-y-2 text-sm text-white/65">
              <li>Precision CNC Machining</li>
              <li>Sheet Metal Fabrication</li>
              <li>PCB Assembly (PCBA)</li>
              <li>Electromechanical Assembly</li>
              <li>Quality Inspection</li>
              <li>Global Logistics</li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <div className="text-sm font-semibold text-white/90">
              Start a project
            </div>

            <p className="mt-3 text-sm text-white/65">
              Send us your CAD files, drawings, or BOM. Our engineering team
              will review the requirements and provide manufacturing guidance
              and quotation support.
            </p>

            <Link
              to="/contact"
              className="mt-4 inline-flex rounded-xl bg-[rgba(var(--brand-600)/0.25)] px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(var(--brand-500)/0.35)] transition hover:bg-[rgba(var(--brand-600)/0.35)]"
            >
              Contact engineering team
            </Link>
          </div>

        </div>

        {/* Bottom bar */}

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">

          <div>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </div>

          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Accessibility</a>
            <a href="#" className="hover:text-white">Cookie preferences</a>
          </div>

        </div>

      </Container>
    </footer>
  );
}