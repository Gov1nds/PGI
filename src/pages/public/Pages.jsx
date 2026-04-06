import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, StatusBadge } from "../../components/Shared";
import { analyzeBOM, createSearch, promoteToProject, saveAsSourcingCase } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

// ═══ HOME — analysis-first conversion engine ═══
export function Home() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState("text");
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      if (mode === "file" && file) { setResult({ type:"bom", ...(await analyzeBOM(file,"","USD","balanced")) }); }
      else if (query.trim()) { setResult({ type:"search", ...(await createSearch(query.trim(), query.includes("\n")?"bom_text":"component")) }); }
      else setError("Enter a part number, paste a BOM, or upload a file");
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const proceed = async () => {
    if (!result) return;
    const sid = result.search_session_id || result.id;
    if (!sid) return;
    try {
      if (result.recommended_flow === "project" || (result.total_parts||0) > 3) {
        const p = await promoteToProject(sid); nav(`/project/${p.project_id}`);
      } else {
        await saveAsSourcingCase(sid, query.trim().slice(0,50) || "Quick analysis");
        nav(user ? "/dashboard" : "/register");
      }
    } catch(e) { setError(e.message); }
  };

  return (
    <>
      <section className="pt-20 pb-14">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">AI-Powered Sourcing<br/>Control Tower</h1>
            <p className="text-zinc-400 text-lg max-w-lg mx-auto">Analyze components, match vendors with explainable scoring, manage RFQs, and track procurement — all in one platform.</p>
          </div>

          {/* Unified intake composer */}
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl bg-white/[0.015] border border-white/[0.06] p-6">
              <div className="flex gap-2 mb-4">
                {[{k:"text",l:"Part Number"},{k:"paste",l:"Paste BOM"},{k:"file",l:"Upload File"}].map(m=>
                  <button key={m.k} onClick={()=>setMode(m.k)} className={`px-4 py-1.5 text-xs rounded-lg font-medium transition ${mode===m.k?"bg-indigo-600 text-white":"bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06]"}`}>{m.l}</button>
                )}
              </div>
              {mode==="text" && <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Enter part number or component name..." className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40" onKeyDown={e=>{if(e.key==="Enter")analyze();}}/>}
              {mode==="paste" && <textarea value={query} onChange={e=>setQuery(e.target.value)} rows={4} placeholder="Paste BOM text here — one component per line..." className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 resize-none"/>}
              {mode==="file" && (
                <label className="flex items-center justify-center gap-2 px-4 py-8 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:bg-white/[0.04] transition">
                  <span className="text-sm text-zinc-500">{file ? `${file.name} (${(file.size/1024).toFixed(1)} KB)` : "Drop a CSV or XLSX file here"}</span>
                  <input type="file" accept=".csv,.xlsx,.xls,.tsv" onChange={e=>setFile(e.target.files?.[0]||null)} className="hidden"/>
                </label>
              )}
              <div className="mt-4 flex items-center gap-3">
                <button onClick={analyze} disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition text-sm">{loading?"Analyzing...":"Analyze"}</button>
              </div>
              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </div>

            {/* Result preview with conversion CTA */}
            {result && (
              <div className="mt-6 rounded-2xl bg-white/[0.015] border border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
                  <StatusBadge status="analyzed"/>
                </div>
                {result.total_parts > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="kpi-card !p-3"><div className="text-xl font-bold">{result.total_parts}</div><div className="text-[11px] text-zinc-500">Parts</div></div>
                    {result.analysis?.total_cost_range?.low != null && <div className="kpi-card !p-3"><div className="text-lg font-bold">${result.analysis.total_cost_range.low.toLocaleString()}</div><div className="text-[11px] text-zinc-500">Cost Low</div></div>}
                    {result.analysis?.total_cost_range?.high != null && <div className="kpi-card !p-3"><div className="text-lg font-bold">${result.analysis.total_cost_range.high.toLocaleString()}</div><div className="text-[11px] text-zinc-500">Cost High</div></div>}
                  </div>
                )}
                {result.analysis?.rfq_required_count > 0 && <p className="text-xs text-zinc-400 mb-4">{result.analysis.rfq_required_count} parts require RFQ · {result.analysis.needs_review_count||0} need review</p>}
                <div className="flex items-center gap-3">
                  <button onClick={proceed} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-500">{user ? "Save & Continue" : "Continue as Guest"}</button>
                  {!user && <Link to="/register" className="px-6 py-2.5 bg-white/[0.03] text-white text-sm rounded-xl border border-white/[0.06] hover:bg-white/[0.06]">Sign Up to Save</Link>}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
      <section className="py-16 border-t border-white/[0.04]">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            {[{t:"Upload & Analyze",d:"Upload a BOM or type a component. Get classification, cost estimates, and risk flags."},{t:"Ranked Vendors",d:"Vendors ranked by price, lead time, reliability, compliance, capacity — fully explainable."},{t:"End-to-End Workflow",d:"RFQ, quote comparison, PO, shipment tracking, and spend analytics in one platform."}].map((f,i)=>
              <div key={i} className="card p-6"><h3 className="text-white font-semibold mb-2">{f.t}</h3><p className="text-zinc-500 text-sm">{f.d}</p></div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

// ═══ ANALYZE — unified intake composer ═══
export function Analyze() {
  const [mode,setMode]=useState("file"); const [file,setFile]=useState(null); const [text,setText]=useState("");
  const [loc,setLoc]=useState(""); const [cur,setCur]=useState("USD");
  const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [result,setResult]=useState(null);
  const nav = useNavigate(); const { user } = useAuth();

  const run = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      if (mode==="file"&&file) setResult(await analyzeBOM(file,loc,cur,"balanced"));
      else if (text.trim()) setResult({type:"search",...(await createSearch(text.trim(),text.includes("\n")?"bom_text":"component"))});
      else setError("Provide input");
    } catch(e){setError(e.message);}
    setLoading(false);
  };

  const promote = async () => {
    const sid = result?.search_session_id || result?.id; if (!sid) return;
    try { const p = await promoteToProject(sid); nav(`/project/${p.project_id}`); } catch(e){setError(e.message);}
  };

  return (
    <section className="py-12"><Container><div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-white">Analyze</h1>
      <p className="text-zinc-500 text-sm mb-6">Upload a BOM, type a part number, or paste component text.</p>
      <div className="flex gap-2 mb-4">{[{k:"file",l:"Upload File"},{k:"text",l:"Part Number"},{k:"paste",l:"Paste BOM"}].map(m=><button key={m.k} onClick={()=>setMode(m.k)} className={`px-4 py-1.5 text-xs rounded-lg font-medium transition ${mode===m.k?"bg-indigo-600 text-white":"bg-white/[0.03] text-zinc-400 border border-white/[0.06]"}`}>{m.l}</button>)}</div>
      <div className="space-y-4">
        {mode==="file"&&<label className="flex items-center justify-center gap-2 px-4 py-8 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:bg-white/[0.04]"><span className="text-sm text-zinc-500">{file?file.name:"Drop CSV/XLSX"}</span><input type="file" accept=".csv,.xlsx,.xls,.tsv" onChange={e=>setFile(e.target.files?.[0]||null)} className="hidden"/></label>}
        {mode==="text"&&<input value={text} onChange={e=>setText(e.target.value)} placeholder="Part number or name" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/>}
        {mode==="paste"&&<textarea value={text} onChange={e=>setText(e.target.value)} rows={5} placeholder="One component per line" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 resize-none"/>}
        <div className="grid grid-cols-2 gap-3"><input value={loc} onChange={e=>setLoc(e.target.value)} placeholder="Delivery location" className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/><select value={cur} onChange={e=>setCur(e.target.value)} className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white focus:outline-none">{["USD","EUR","INR","CNY","JPY","GBP"].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        {error&&<p className="text-red-400 text-sm">{error}</p>}
        <button onClick={run} disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 disabled:opacity-50 text-sm">{loading?"Analyzing...":"Analyze"}</button>
      </div>
      {result&&<div className="mt-6 card p-6"><h3 className="font-semibold text-white mb-2">Results</h3>{result.total_parts!=null&&<p className="text-sm text-zinc-300 mb-3">{result.total_parts} parts analyzed</p>}<div className="flex gap-3"><button onClick={promote} className="px-5 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-500">Create Project</button>{!user&&<Link to="/register" className="px-5 py-2.5 bg-white/[0.03] text-white text-sm rounded-xl border border-white/[0.06]">Sign Up</Link>}</div></div>}
    </div></Container></section>
  );
}

// ═══ AUTH ═══
export function Login() { const [e,sE]=useState(""); const [p,sP]=useState(""); const [err,sErr]=useState(""); const [l,sL]=useState(false); const {login}=useAuth(); const n=useNavigate(); const sub=async ev=>{ev.preventDefault();sErr("");sL(true);try{await login(e,p);n("/dashboard");}catch(x){sErr(x.message);}sL(false);}; return <section className="py-20"><Container><div className="max-w-sm mx-auto"><h1 className="text-2xl font-bold mb-6 text-center text-white">Sign In</h1><form onSubmit={sub} className="space-y-4"><input value={e} onChange={x=>sE(x.target.value)} type="email" placeholder="Email" required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/><input value={p} onChange={x=>sP(x.target.value)} type="password" placeholder="Password" required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/>{err&&<p className="text-red-400 text-sm">{err}</p>}<button type="submit" disabled={l} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 disabled:opacity-50 text-sm">{l?"Signing in...":"Sign In"}</button></form><p className="text-center text-sm text-zinc-500 mt-4">No account? <Link to="/register" className="text-indigo-400">Register</Link></p></div></Container></section>; }
export function Register() { const [e,sE]=useState(""); const [p,sP]=useState(""); const [nm,sN]=useState(""); const [err,sErr]=useState(""); const [l,sL]=useState(false); const {register}=useAuth(); const n=useNavigate(); const sub=async ev=>{ev.preventDefault();sErr("");sL(true);try{await register(e,p,nm);n("/dashboard");}catch(x){sErr(x.message);}sL(false);}; return <section className="py-20"><Container><div className="max-w-sm mx-auto"><h1 className="text-2xl font-bold mb-6 text-center text-white">Create Account</h1><form onSubmit={sub} className="space-y-4"><input value={nm} onChange={x=>sN(x.target.value)} placeholder="Full name" className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/><input value={e} onChange={x=>sE(x.target.value)} type="email" placeholder="Email" required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/><input value={p} onChange={x=>sP(x.target.value)} type="password" placeholder="Password" required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40"/>{err&&<p className="text-red-400 text-sm">{err}</p>}<button type="submit" disabled={l} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 disabled:opacity-50 text-sm">{l?"Creating...":"Create Account"}</button></form><p className="text-center text-sm text-zinc-500 mt-4">Have an account? <Link to="/login" className="text-indigo-400">Sign In</Link></p></div></Container></section>; }
export function Pricing() { return <section className="py-16"><Container><h1 className="text-2xl font-bold text-white mb-4">Pricing</h1><p className="text-zinc-400">Contact us for enterprise pricing.</p></Container></section>; }
export function Insights() { return <section className="py-16"><Container><h1 className="text-2xl font-bold text-white mb-4">Insights</h1><p className="text-zinc-400">Procurement intelligence coming soon.</p></Container></section>; }
export function Contact() { return <section className="py-16"><Container><h1 className="text-2xl font-bold text-white mb-4">Contact</h1><p className="text-zinc-400">contact@pgihub.com</p></Container></section>; }
export function NotFound() { return <section className="py-20"><Container><div className="text-center"><h1 className="text-4xl font-bold text-white mb-2">404</h1><p className="text-zinc-400">Page not found</p></div></Container></section>; }
