import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingActions from "./components/FloatingActions.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";

// ✅ Change this import (use the correct filename + component name)
import Capabilities from "./pages/capabilities.jsx";

import Insights from "./pages/Insights.jsx";
import InsightDetail from "./pages/InsightDetail.jsx";
import News from "./pages/News.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import ConsultPopup from "./components/ConsultPopup.jsx";

export default function App() {
  return (
    <>
      {/* Accessibility skip link */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-black/80 focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <Navbar />
      <ConsultPopup delayMs={10000} />
<ScrollToTop />
<ConsultPopup delayMs={10000} />
      <main id="content" className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />

          {/* ✅ Route renamed */}
          <Route path="/capabilities" element={<Capabilities />} />

          {/* (Optional) keep old route redirect for old links, see below */}
          {/* <Route path="/outdoor-works" element={<Navigate to="/capabilities" replace />} /> */}

          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Floating Call + WhatsApp Buttons */}
      <FloatingActions />
    </>
  );
}
