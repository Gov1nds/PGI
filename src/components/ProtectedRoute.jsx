// ============================================================
// SECTION 2: Protected Route Component (NEW FILE)
// FILE: src/components/ProtectedRoute.jsx
// ============================================================

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * The critical fix: we do NOT redirect while `loading` is true.
 * This prevents the premature redirect-to-login during auth hydration.
 *
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ── Critical: do not redirect while hydration is in progress ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-sky-500/20 border-t-sky-500 animate-spin" />
          <p className="text-white/30 text-xs mt-4">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save the intended destination so we can redirect back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}


// ============================================================
// SECTION 2: App.jsx with ProtectedRoute (FULL REPLACEMENT)
// FILE: src/App.jsx
// ============================================================
/*
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingActions from "./components/FloatingActions.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ConsultPopup from "./components/ConsultPopup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Capabilities from "./pages/capabilities.jsx";
import BOMAnalyzer from "./pages/BOMAnalyzer.jsx";
import Pricing from "./pages/Pricing.jsx";
import Insights from "./pages/Insights.jsx";
import InsightDetail from "./pages/InsightDetail.jsx";
import News from "./pages/News.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";

export default function App() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-black/80 focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <Navbar />
      <ConsultPopup delayMs={10000} />
      <ScrollToTop />

      <main id="content" className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/bom-analyzer" element={<BOMAnalyzer />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          // Protected routes — wrapped with ProtectedRoute
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
*/
