import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-[#080c15]">
      <Container className="text-center py-20">
        <div className="text-8xl font-bold gradient-text mb-6 font-mono opacity-30">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-sm text-white/55 mb-10 max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 btn-primary rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
        >
          ← Back to Home
        </Link>
      </Container>
    </section>
  );
}
