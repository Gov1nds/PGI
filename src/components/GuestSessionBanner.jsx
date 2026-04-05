/**
 * GuestSessionBanner — UX-3
 * Shows a persistent, dismissible banner for guest users indicating their
 * analysis will carry over after signup. Builds trust in the continuity promise.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function GuestSessionBanner({ sessionToken, bomId, projectId }) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Only show for guest users with an active session
  if (user || dismissed || !sessionToken) return null;

  return (
    <div className="relative rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-4">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-300">Your analysis is saved</p>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            Sign up to convert this into a full procurement project.
            Your BOM data, cost analysis, and vendor recommendations will carry over — nothing is lost.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/register"
              state={{ returnTo: projectId ? `/project/${projectId}` : "/dashboard" }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/30 transition-colors"
            >
              Create free account
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              to="/login"
              state={{ returnTo: projectId ? `/project/${projectId}` : "/dashboard" }}
              className="inline-flex items-center rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white/70 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
