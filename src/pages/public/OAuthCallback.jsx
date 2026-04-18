import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { oauthCallback } from "../../lib/api";
import { verifyState } from "../../lib/oauth";

export default function OAuthCallback() {
  const { provider } = useParams();
  const [sp] = useSearchParams();
  const { loginWithOAuth } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const code = sp.get("code");
        const state = sp.get("state");
        const errorParam = sp.get("error");

        if (errorParam) {
          nav(`/login?error=${encodeURIComponent(errorParam)}`);
          return;
        }

        if (!code) {
          nav("/login?error=oauth_no_code");
          return;
        }

        // Verify state parameter to prevent CSRF
        if (state && !verifyState(state)) {
          nav("/login?error=oauth_state_mismatch");
          return;
        }

        const data = await oauthCallback(provider, code, state);
        await loginWithOAuth(data);

        // If user was on guest report, stay there; otherwise go to dashboard
        const returnTo = sessionStorage.getItem("pgi_oauth_return");
        sessionStorage.removeItem("pgi_oauth_return");
        nav(returnTo || "/dashboard", { replace: true });
      } catch (e) {
        setError(e.message);
        setTimeout(() => nav("/login?error=oauth_failed"), 2000);
      }
    })();
  }, [provider, sp, loginWithOAuth, nav]);

  return (
    <section className="flex items-center justify-center py-24">
      <div className="surface-strong rounded-2xl p-8 text-center max-w-sm">
        {error ? (
          <>
            <div className="mb-3 text-red-400 text-lg">⚠</div>
            <div className="text-sm text-red-200">{error}</div>
            <div className="mt-2 text-xs text-white/40">Redirecting to sign in…</div>
          </>
        ) : (
          <>
            <div className="mb-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" />
            </div>
            <div className="text-sm text-white/70">Signing you in…</div>
            <div className="mt-1 text-xs text-white/30 capitalize">{provider}</div>
          </>
        )}
      </div>
    </section>
  );
}
