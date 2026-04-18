import { Container } from "../../components/Shared";
import Seo from "../../components/Seo";

export default function Terms() {
  return (
    <section className="py-16">
      <Seo title="Terms of Service | PGI Hub" description="PGI Hub terms of service." canonical="https://pgihub.com/terms" />
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-6">Terms of Service</h1>
          <div className="prose prose-sm text-[#6B7280] space-y-4">
            <p>Last updated: January 2025</p>
            <p>These Terms of Service govern your use of PGI Hub's AI sourcing marketplace platform. By accessing or using our platform, you agree to be bound by these terms.</p>
            <h2 className="text-lg font-semibold text-[#0A0A0A] mt-8">Use of Service</h2>
            <p>You may use PGI Hub for lawful procurement and sourcing activities. You are responsible for maintaining the confidentiality of your account credentials.</p>
            <h2 className="text-lg font-semibold text-[#0A0A0A] mt-8">Intellectual Property</h2>
            <p>The platform and its content are owned by PGI Hub. Your uploaded data remains yours. We use it only to provide our services to you.</p>
            <h2 className="text-lg font-semibold text-[#0A0A0A] mt-8">Contact</h2>
            <p>For questions about these terms, contact legal@pgihub.com.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
