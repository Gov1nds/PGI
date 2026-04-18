import { Container } from "../../components/Shared";
import Seo from "../../components/Seo";

export default function Privacy() {
  return (
    <section className="py-16">
      <Seo title="Privacy Policy | PGI Hub" description="PGI Hub privacy policy." canonical="https://pgihub.com/privacy" />
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-6">Privacy Policy</h1>
          <div className="prose prose-sm text-[#6B7280] space-y-4">
            <p>Last updated: January 2025</p>
            <p>PGI Hub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI sourcing marketplace platform.</p>
            <h2 className="text-lg font-semibold text-[#0A0A0A] mt-8">Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, upload BOMs, submit RFQs, or contact us. This may include your name, email address, company information, and sourcing data.</p>
            <h2 className="text-lg font-semibold text-[#0A0A0A] mt-8">How We Use Your Information</h2>
            <p>We use the information we collect to operate, maintain, and improve our platform, process your sourcing requests, communicate with you, and ensure security.</p>
            <h2 className="text-lg font-semibold text-[#0A0A0A] mt-8">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@pgihub.com.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
