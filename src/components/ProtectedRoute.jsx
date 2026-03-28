/**
 * ProtectedRoute — waits for auth hydration before rendering or redirecting.
 * FIXES the auth hydration race that caused false logouts on page refresh.
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c15] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-sky-500/15 border-t-sky-500 animate-spin" />
            <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-sky-500/25 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
          </div>
          <p className="text-white/35 text-sm mt-5 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
