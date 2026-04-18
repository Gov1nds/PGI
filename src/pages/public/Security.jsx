import { Link } from "react-router-dom";
import { Container } from "../../components/Shared";
import Seo from "../../components/Seo";

const PILLARS = [
  { title: "Encryption in transit & at rest", body: "TLS 1.2+ on every connection. AES-256 for stored data. Key rotation handled by our managed KMS provider." },
  { title: "Isolated tenant data",             body: "Strict row-level isolation on customer data. No cross-tenant reads — enforced at the query planner, not just the application layer." },
  { title: "Access on need-to-know",           body: "Internal access is least-privilege by default, short-lived, audited. No shared credentials, no production access without approval." },
  { title: "Continuous monitoring",            body: "24/7 anomaly detection on auth, rate-limit and egress patterns. Alert routing integrated with on-call rotations." },
  { title: "Backups & DR",                     body: "Point-in-time recovery on all customer stores. DR drills twice yearly. RTO < 4h, RPO < 15min for production." },
  { title: "Responsible disclosure",           body: "security@pgihub.com reaches the security team directly. We acknowledge within 24h and triage within 3 business days." },
];

const COMPLIANCE = [
  { label: "SOC 2 Type II",  status: "In progress", note: "Observation window: Q1–Q2 2026" },
  { label: "GDPR",           status: "Compliant",   note: "DPA available on request · EU hosting option" },
  { label: "ISO 27001",      status: "Planned",     note: "Targeted H2 2026" },
  { label: "HIPAA",          status: "Not applicable", note: "Not required for current customer base" },
];

const SUBPROCESSORS = [
  { name: "AWS",                purpose: "Primary cloud hosting",                  region: "us-east-1, eu-central-1" },
  { name: "Cloudflare",         purpose: "Edge, DDoS protection, WAF",              region: "Global" },
  { name: "Stripe",             purpose: "Payments & subscription billing",         region: "US / EU" },
  { name: "PostgreSQL (RDS)",   purpose: "Primary database",                        region: "us-east-1" },
  { name: "OpenAI / Anthropic", purpose: "LLM inference for classification & search", region: "US" },
  { name: "Sentry",             purpose: "Error monitoring",                        region: "US" },
];

const statusColor = (s) =>
  s === "Compliant" ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
  : s === "In progress" ? "border-amber-400/25 bg-amber-500/10 text-amber-200"
  : "border-white/10 bg-white/[0.04] text-white/60";

export default function Security() {
  return (
    <>
      <Seo title="Security | PGI Hub" description="How PGI Hub protects customer data — encryption, compliance, subprocessors, and responsible disclosure." canonical="https://pgihub.com/security" />

      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-label mx-auto mb-5">Trust Center</div>
            <h1 className="hero-title text-4xl md:text-6xl font-semibold">
              Security that moves <span className="gradient-text">with you.</span>
            </h1>
            <p className="hero-subtitle mt-5 text-base leading-7 max-w-2xl mx-auto">
              Customer data is the most sensitive thing we handle. Here's exactly how we treat it.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.055] py-16">
        <Container>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.04]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L11.5 3V7c0 3-2 5-4.5 6-2.5-1-4.5-3-4.5-6V3L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-[14.5px] font-semibold text-white">{p.title}</h3>
                </div>
                <p className="text-[13px] leading-6 text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.055] py-16">
        <Container>
          <div className="mb-8">
            <div className="section-label mb-4">Compliance</div>
            <h2 className="section-heading text-2xl md:text-3xl font-semibold">Certifications & frameworks.</h2>
          </div>
          <div className="card divide-y divide-white/[0.05]">
            {COMPLIANCE.map((c) => (
              <div key={c.label} className="flex items-center justify-between gap-4 p-5 flex-wrap">
                <div>
                  <div className="text-[14px] font-semibold text-white">{c.label}</div>
                  <div className="mt-0.5 text-[12px] text-white/45">{c.note}</div>
                </div>
                <span className={`badge-pill ${statusColor(c.status)}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.055] py-16">
        <Container>
          <div className="mb-8">
            <div className="section-label mb-4">Subprocessors</div>
            <h2 className="section-heading text-2xl md:text-3xl font-semibold">Who we share data with.</h2>
            <p className="mt-3 text-[14px] text-muted max-w-2xl">Customer personal data may be processed by these vendors solely to deliver our service. We maintain DPAs with each.</p>
          </div>
          <div className="card overflow-hidden">
            <div className="hidden md:grid grid-cols-[1.4fr_2fr_1.4fr] gap-4 border-b border-white/[0.05] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-white/40">
              <div>Vendor</div>
              <div>Purpose</div>
              <div>Region</div>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {SUBPROCESSORS.map((s) => (
                <div key={s.name} className="grid grid-cols-1 md:grid-cols-[1.4fr_2fr_1.4fr] gap-2 md:gap-4 px-5 py-4 text-[13.5px] items-center">
                  <div className="font-semibold text-white">{s.name}</div>
                  <div className="text-white/70">{s.purpose}</div>
                  <div className="text-white/50">{s.region}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.055] py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <div className="section-label mb-4">Disclosure</div>
              <h2 className="section-heading text-2xl md:text-3xl font-semibold">Found something?</h2>
              <p className="mt-4 text-[14px] leading-6 text-muted max-w-md">
                We take security reports seriously. Email <a href="mailto:security@pgihub.com" className="text-white underline underline-offset-4">security@pgihub.com</a> with technical details — we acknowledge within 24 hours.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-[14.5px] font-semibold text-white">Need a DPA or SOC 2 report?</h3>
              <p className="mt-2 text-[13px] text-muted">Our security team sends current docs under NDA on request. Usually within one business day.</p>
              <Link to="/contact" className="primary-btn mt-5 rounded-xl px-5 py-2.5 text-[13px]">Request documents</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
