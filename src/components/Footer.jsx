import { Link } from "react-router-dom";
import Container from "./Container.jsx";
import { navLinks, site } from "../content/siteData.js";

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-white/[0.05] bg-[rgba(8,12,21,0.9)]">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/images/logo.png" alt="PGI Hub" className="h-9 w-9 rounded-lg bg-white/[0.04] p-1.5 object-contain ring-1 ring-white/[0.08]" />
              <div>
                <div className="text-sm font-bold text-white">PGI <span className="gradient-text">Hub</span></div>
                <div className="text-[9px] uppercase tracking-[0.12em] text-white/40 font-semibold">Manufacturing Network</div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-[1.7] text-white/60">
              Engineering-led manufacturing coordination across precision machining, electronics assembly, and global logistics.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-white/65">
              <div className="flex items-center gap-2.5">
                <svg className="w-3.5 h-3.5 text-sky-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a className="hover:text-sky-400 transition-colors duration-200" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-3.5 h-3.5 text-sky-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a className="hover:text-sky-400 transition-colors duration-200" href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>{site.contact.phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-3.5 h-3.5 text-sky-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{site.contact.location}</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-5">Platform</div>
            <ul className="space-y-3">
              {navLinks.slice(0, 5).map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 hover:text-sky-400 transition-colors duration-200">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-5">Manufacturing</div>
            <ul className="space-y-3 text-sm text-white/60">
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
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-5">Get Started</div>
            <p className="text-sm text-white/60 leading-[1.7]">
              Upload your BOM or send us CAD files for engineering review and manufacturing guidance.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                to="/bom-analyzer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-400 ring-1 ring-sky-500/20 hover:bg-sky-500/15 hover:ring-sky-500/30 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Analyze BOM
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/50 ring-1 ring-white/[0.06] hover:bg-white/[0.07] hover:text-white/70 transition-all duration-300"
              >
                Contact Engineering
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.05] pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/70 transition-colors">Cookie preferences</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
