import { Container } from "../../components/Shared";
import Seo from "../../components/Seo";

export default function Terms() {
  return (
    <section className="py-16">
      <Seo title="Terms of Service | PGI Hub" description="PGI Hub terms of service governing use of our AI sourcing marketplace." canonical="https://pgihub.com/terms" />
      <Container>
        <div className="mx-auto max-w-3xl surface-strong p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          <div className="prose-sm text-muted space-y-4 text-sm leading-7">
            <p>Last updated: {new Date().toISOString().slice(0,10)}</p>
            <h2 className="text-lg font-semibold text-white mt-6">1. Acceptance of Terms</h2>
            <p>By accessing or using PGI Hub, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
            <h2 className="text-lg font-semibold text-white mt-6">2. Service Description</h2>
            <p>PGI Hub provides an AI-powered procurement marketplace including BOM analysis, vendor discovery, RFQ management, quote comparison, purchase order management, and shipment tracking.</p>
            <h2 className="text-lg font-semibold text-white mt-6">3. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <h2 className="text-lg font-semibold text-white mt-6">4. Intellectual Property</h2>
            <p>All content, features, and functionality of PGI Hub are owned by PGI Hub and protected by intellectual property laws.</p>
            <h2 className="text-lg font-semibold text-white mt-6">5. Limitation of Liability</h2>
            <p>PGI Hub provides sourcing intelligence and marketplace services. All procurement decisions remain the responsibility of the user.</p>
            <h2 className="text-lg font-semibold text-white mt-6">6. Contact</h2>
            <p>For questions about these terms, contact us at legal@pgihub.com.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
