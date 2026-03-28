import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
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
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/25 transition-all duration-200";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#080c15]">
      <Container className="py-16">
        <div className="max-w-sm mx-auto">

          <div className="text-center mb-9">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-white/45 text-sm mt-1.5">Start optimizing your manufacturing</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/[0.06] border border-red-500/15 rounded-xl">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-7 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/55 text-xs font-semibold mb-2">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe" className={inputCls} autoFocus />
              </div>
              <div>
                <label className="block text-white/55 text-xs font-semibold mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com" className={inputCls} required />
              </div>
              <div>
                <label className="block text-white/55 text-xs font-semibold mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters" className={inputCls} required />
              </div>
              <div>
                <label className="block text-white/55 text-xs font-semibold mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••" className={inputCls} required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-emerald-600/20 active:scale-[0.98]">
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>

          <p className="text-center text-white/35 text-sm mt-7">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
