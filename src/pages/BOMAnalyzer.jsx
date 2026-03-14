import React, { useState } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";
import { Link } from "react-router-dom";

export default function BOMAnalyzer() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const locations = [
    { value: "usa", label: "United States" },
    { value: "europe", label: "Europe" },
    { value: "india", label: "India" },
    { value: "china", label: "China" },
    { value: "global", label: "Best Global Price" }
  ];

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 3000);
  };

  const handleEmailSubmit = () => {
    if (email) {
      setStep(4);
    }
  };

  const proceedToAnalysis = () => {
    if (file) {
      setStep(2);
    }
  };

  // Mock data for results
  const mockResults = {
    partCount: 24,
    categories: [
      { name: "CNC Machining", count: 6, color: "emerald" },
      { name: "Sheet Metal", count: 4, color: "blue" },
      { name: "PCB Assembly", count: 2, color: "purple" },
      { name: "Standard Components", count: 12, color: "amber" }
    ],
    strategy: [
      { process: "CNC Machining", region: "India", savings: "65%" },
      { process: "Sheet Metal", region: "India", savings: "58%" },
      { process: "PCB Assembly", region: "China", savings: "42%" },
      { process: "Standard Components", region: "Global Distributors", savings: "30%" }
    ],
    costEstimate: {
      manufacturing: "$3,200 – $3,900",
      components: "$1,600 – $1,900",
      electronics: "$850 – $1,200",
      logistics: "$420 – $500",
      total: "$6,070 – $7,500"
    },
    leadTime: "8-12 weeks"
  };

  return (
    <div>
      {/* HEADER */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm text-emerald-400 font-semibold">Engineering Tool</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              BOM Analyzer
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed">
              Upload your Bill of Materials and get instant manufacturing strategy, cost estimation, and global sourcing recommendations.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        {/* STEP 1: UPLOAD FILE */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">Step 1: Upload Your BOM</h2>
              <p className="text-white/70 mb-6">
                Upload your Bill of Materials in Excel (.xlsx) or CSV format. We'll analyze your parts and provide manufacturing strategy.
              </p>

              <div className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-8 text-center mb-6">
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-white font-semibold">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </span>
                  <span className="text-sm text-white/60">
                    Excel (.xlsx) or CSV files
                  </span>
                </label>
              </div>

              <PrimaryButton
                onClick={proceedToAnalysis}
                disabled={!file}
                className="w-full text-center"
              >
                {file ? "Analyze BOM" : "Upload a file to continue"}
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT LOCATION */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">Step 2: Where Should Your Product Be Delivered?</h2>
              <p className="text-white/70 mb-8">
                This helps us calculate shipping costs, tariffs, and recommend the best sourcing strategy for your region.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => handleLocationSelect(loc.value)}
                    className="group relative rounded-2xl bg-white/5 hover:bg-white/10 p-6 ring-1 ring-white/10 hover:ring-emerald-500/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-400 group-hover:bg-emerald-400/20" />
                      <span className="text-white font-semibold">{loc.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10 text-center">
              <h2 className="text-2xl font-semibold text-white mb-6">Analyzing Your BOM...</h2>
              
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="animate-pulse space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="text-white/70">Detecting part types</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="text-white/70">Estimating manufacturing processes</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span className="text-white/70">Calculating sourcing strategy</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-emerald-300 font-semibold">Processing complete!</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: EMAIL GATE */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">Your Report is Ready</h2>
              <p className="text-white/70 mb-6">
                Enter your email to unlock the full analysis report with cost breakdowns, sourcing strategy, and supplier recommendations.
              </p>

              <div className="space-y-4 mb-6">
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <PrimaryButton
                onClick={handleEmailSubmit}
                disabled={!email}
                className="w-full text-center"
              >
                View Full Report
              </PrimaryButton>

              <p className="text-xs text-white/50 mt-4 text-center">
                We'll send your report and stay in touch about manufacturing solutions.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS */}
        {step === 5 && (
          <div className="space-y-8">
            {/* PARTS BREAKDOWN */}
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">BOM Analysis Summary</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockResults.categories.map((cat, idx) => (
                  <div key={idx} className="rounded-2xl bg-black/30 p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-300">{cat.count}</div>
                    <div className="text-xs text-white/60 mt-2">{cat.name}</div>
                  </div>
                ))}
              </div>
              
              <p className="text-white/70 mt-6">
                Total parts analyzed: <span className="text-emerald-300 font-semibold">{mockResults.partCount}</span>
              </p>
            </div>

            {/* MANUFACTURING STRATEGY */}
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Recommended Global Manufacturing Strategy</h2>
              
              <div className="space-y-3">
                {mockResults.strategy.map((strat, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/30 rounded-xl p-4">
                    <div>
                      <div className="text-white font-semibold">{strat.process}</div>
                      <div className="text-sm text-white/60">Manufacturing location</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-300 font-bold">{strat.region}</div>
                      <div className="text-xs text-white/60">Save {strat.savings}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COST BREAKDOWN */}
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Cost Estimation</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/70">
                  <span>Manufacturing cost</span>
                  <span className="text-white font-semibold">{mockResults.costEstimate.manufacturing}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Standard components</span>
                  <span className="text-white font-semibold">{mockResults.costEstimate.components}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Electronics procurement</span>
                  <span className="text-white font-semibold">{mockResults.costEstimate.electronics}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Logistics & shipping</span>
                  <span className="text-white font-semibold">{mockResults.costEstimate.logistics}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Estimated Cost</span>
                  <span className="text-2xl font-bold text-emerald-300">{mockResults.costEstimate.total}</span>
                </div>
              </div>

              <p className="text-xs text-white/60 mt-4">
                Lead time: <span className="text-emerald-300">{mockResults.leadTime}</span>
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-8 md:p-12 ring-1 ring-emerald-500/30">
              <h2 className="text-2xl font-semibold text-white mb-4">Ready to Manufacture?</h2>
              <p className="text-white/70 mb-6">
                PGI can handle your global sourcing and manufacturing coordination. Request a quote to get started.
              </p>
              
              <Link to="/contact">
                <PrimaryButton className="w-full text-center">
                  Request Manufacturing Quote
                </PrimaryButton>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}