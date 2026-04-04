/**
 * ProtectedRoute — waits for auth hydration before rendering or redirecting.
 * FIXES the auth hydration race that caused false logouts on page refresh.
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowGuest = false, requiredCapability = null, redirectTo = "/login", fallbackTo = "/dashboard" }) {
  const { user, loading, canAccessCapability } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-white/[0.1] border-t-white/70 animate-spin" />
          <p className="text-white/40 text-sm mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (allowGuest) {
      return children;
    }
    return <Navigate to={redirectTo} replace state={{ from: location, returnTo: `${location.pathname}${location.search}` }} />;
  }

  if (requiredCapability && !canAccessCapability(requiredCapability)) {
    return <Navigate to={fallbackTo} replace state={{ from: location, reason: "insufficient-capability" }} />;
  }

  return children;
}
