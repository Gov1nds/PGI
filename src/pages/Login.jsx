import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Fill in all fields"); return; }

    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/30 transition-all";

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Container className="py-16">
        <div className="max-w-sm mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-white/50 text-sm mt-1">Sign in to your PGI HUB account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-red-500/[0.08] border border-red-500/20 rounded-xl">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5">Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com" className={inputCls} autoFocus
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5">Password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className={inputCls}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-sky-600/20"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}