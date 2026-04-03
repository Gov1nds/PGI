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
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
          <p className="text-white/40 text-sm mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}