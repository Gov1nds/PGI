import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";
import { getPostAuthRoute } from "../lib/workflowState";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Fill in all required fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }

    setLoading(true);
    setError(null);
    try {
      await register(email, password, fullName);
      const returnTo = location.state?.returnTo || getPostAuthRoute("/dashboard");
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-white/[0.15] focus:border-white/[0.12] transition-all duration-300";

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Container className="py-16">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-white/40 text-sm mt-1">Start your manufacturing coordination journey</p>
            {(location.state?.returnTo || getPostAuthRoute("/dashboard") !== "/dashboard") && (
              <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-left text-sm text-white/60">
                After registration you'll return to your analysis or workspace.
              </div>
            )}
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-500/[0.06] border border-red-500/15 rounded-xl">
              <p className="text-red-300/80 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/45 text-xs font-medium mb-1.5">Full name <span className="text-white/25">(optional)</span></label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" className={inputCls} autoFocus />
              </div>
              <div>
                <label className="block text-white/45 text-xs font-medium mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={inputCls} required />
              </div>
              <div>
                <label className="block text-white/45 text-xs font-medium mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className={inputCls} required />
              </div>
              <div>
                <label className="block text-white/45 text-xs font-medium mb-1.5">Confirm password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" className={inputCls} required />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#09090b] text-sm font-semibold transition-all duration-300 shadow-[0_4px_16px_rgba(255,255,255,0.06)]"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>

          <p className="text-center text-white/35 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-white/70 hover:text-white font-medium transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
