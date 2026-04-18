import { Container } from "../../components/Shared";
import Seo from "../../components/Seo";

export default function Privacy() {
  return (
    <section className="py-16">
      <Seo title="Privacy Policy | PGI Hub" description="PGI Hub privacy policy — how we collect, use, and protect your data." canonical="https://pgihub.com/privacy" />
      <Container>
        <div className="mx-auto max-w-3xl surface-strong p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <div className="prose-sm text-muted space-y-4 text-sm leading-7">
            <p>Last updated: {new Date().toISOString().slice(0,10)}</p>
            <h2 className="text-lg font-semibold text-white mt-6">1. Information We Collect</h2>
            <p>We collect information you provide directly, such as account registration details, BOM data uploaded for analysis, and communications through our platform. We also collect usage data to improve our services.</p>
            <h2 className="text-lg font-semibold text-white mt-6">2. How We Use Your Information</h2>
            <p>Your data is used to provide procurement analysis, vendor matching, RFQ management, and other platform services. We do not sell your personal information to third parties.</p>
            <h2 className="text-lg font-semibold text-white mt-6">3. Data Security</h2>
            <p>We implement industry-standard security measures including encryption in transit and at rest, access controls, and regular security audits to protect your data.</p>
            <h2 className="text-lg font-semibold text-white mt-6">4. Data Retention</h2>
            <p>We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us.</p>
            <h2 className="text-lg font-semibold text-white mt-6">5. Contact</h2>
            <p>For privacy-related inquiries, contact us at privacy@pgihub.com.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
