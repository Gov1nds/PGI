import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PublicNavbar, Footer } from "../components/Shared";
import { useAnalytics } from "../context/AnalyticsContext";
import LocationBanner from "../components/LocationBanner";

export default function PublicShell() {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(location.pathname, "public");
  }, [location.pathname, trackPageView]);

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <LocationBanner />
      <main className="relative min-h-[72vh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
