import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function NotFound() {
  return (
    <Container className="py-14">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm text-white/70">The page you are looking for doesn’t exist.</p>
      <Link to="/" className="mt-6 inline-flex text-sm font-semibold text-[rgba(var(--brand-500))]">
        ← Go to home
      </Link>
    </Container>
  );
}
