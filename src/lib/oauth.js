/**
 * OAuth utilities for Google, LinkedIn, Microsoft sign-in.
 * Generates PKCE state and stores it for verification on callback.
 */

const API = import.meta.env.VITE_API_BASE_URL || "";

export function generateState() {
  const state = crypto.randomUUID();
  try { sessionStorage.setItem("pgi_oauth_state", state); } catch {}
  return state;
}

export function verifyState(state) {
  try {
    const stored = sessionStorage.getItem("pgi_oauth_state");
    sessionStorage.removeItem("pgi_oauth_state");
    return stored === state;
  } catch { return false; }
}

export function getOAuthRedirectUri(provider) {
  return `${window.location.origin}/auth/oauth/${provider}/callback`;
}

export const OAUTH_PROVIDERS = [
  { id: "google", label: "Continue with Google", icon: "/google.svg", color: "hover:bg-white/[0.06]" },
  { id: "linkedin", label: "Continue with LinkedIn", icon: "/linkedin.svg", color: "hover:bg-[#0077b5]/10" },
  { id: "microsoft", label: "Continue with Microsoft", icon: "/microsoft.svg", color: "hover:bg-[#00a4ef]/10" },
];
