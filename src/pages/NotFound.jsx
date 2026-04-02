import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <Container className="text-center py-20">
        <div className="text-7xl font-bold text-orange-500/15 mb-4 font-mono">404</div>
        <h1 className="text-2xl font-semibold text-white mb-3">Page not found</h1>
        <p className="text-sm text-white/75 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 btn-primary rounded-xl px-6 py-3 text-sm font-semibold text-white"
        >
          ← Back to Home
        </Link>
      </Container>
    </section>
  );
}
