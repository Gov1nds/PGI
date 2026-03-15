```javascript
import React, { useState } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { Link } from "react-router-dom";

export default function BOMAnalyzer() {

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);

  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [city, setCity] = useState("");

  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const proceedToLocation = () => {
    if (file) {
      setStep(2);
    }
  };

  const startProcessing = () => {
    if (country && stateRegion && city) {
      setStep(3);
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        setStep(4);
      }, 4000);
    }
  };

  const handleEmailSubmit = () => {
    if (email) {
      setStep(5);
    }
  };

  const mockResults = {
    partCount: 24,
    categories: [
      { name: "CNC Machining", count: 6 },
      { name: "Sheet Metal", count: 4 },
      { name: "PCB Assembly", count: 2 },
      { name: "Standard Components", count: 12 }
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
            <p className="text-sm text-emerald-400 font-semibold">
              Engineering Tool
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              BOM Analyzer
            </h1>

            <p className="mt-4 text-white/75 leading-relaxed">
              Upload your Bill of Materials and get instant manufacturing
              strategy, cost estimation, and global sourcing recommendations.
            </p>

            <p className="text-xs text-emerald-400 mt-2">
              Instant BOM intelligence for global manufacturing
            </p>
          </div>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="py-12 border-b border-white/10">
        <Container>
          <div className="max-w-4xl mx-auto text-center">

            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
              Upload your Bill of Materials and receive
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-left">

              <div className="text-white/80">✔ Part classification</div>
              <div className="text-white/80">✔ Best suppliers</div>
              <div className="text-white/80">✔ Manufacturing process detection</div>
              <div className="text-white/80">✔ Logistics optimized sourcing</div>
              <div className="text-white/80">✔ Estimated cost & lead time</div>

            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">

        {/* STEP 1 : UPLOAD BOM */}

        {step === 1 && (
          <div className="max-w-2xl mx-auto">

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">

              <h2 className="text-2xl font-semibold text-white mb-4">
                Upload BOM
              </h2>

              <p className="text-white/70 mb-6">
                Upload your BOM file (.xlsx or .csv) to begin analysis.
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

                  <span className="text-white font-semibold">
                    {file ? file.name : "Click to upload BOM"}
                  </span>

                  <span className="text-sm text-white/60">
                    Excel (.xlsx) or CSV
                  </span>

                </label>
              </div>

              <PrimaryButton
                onClick={proceedToLocation}
                disabled={!file}
                className="w-full text-center"
              >
                Analyze BOM
              </PrimaryButton>

            </div>
          </div>
        )}

        {/* STEP 2 : LOCATION */}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">

              <h2 className="text-2xl font-semibold text-white mb-4">
                Where should we deliver?
              </h2>

              <p className="text-white/70 mb-6">
                This helps us calculate logistics cost and sourcing strategy.
              </p>

              <div className="space-y-4 mb-6">

                <input
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white"
                />

                <input
                  placeholder="State"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white"
                />

                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white"
                />

              </div>

              <PrimaryButton
                onClick={startProcessing}
                className="w-full text-center"
              >
                Start BOM Analysis
              </PrimaryButton>

            </div>
          </div>
        )}

        {/* STEP 3 : PROCESSING */}

        {step === 3 && (
          <div className="max-w-2xl mx-auto text-center">

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-10 ring-1 ring-white/10">

              <h2 className="text-2xl font-semibold text-white mb-6">
                Analyzing Your BOM
              </h2>

              {isProcessing && (
                <div className="space-y-4">

                  <p className="text-white/70">Parsing BOM</p>
                  <p className="text-white/70">Classifying Parts</p>
                  <p className="text-white/70">Finding Suppliers</p>
                  <p className="text-white/70">Optimizing Logistics</p>
                  <p className="text-white/70">Generating Report</p>

                </div>
              )}

            </div>
          </div>
        )}

        {/* STEP 4 : EMAIL */}

        {step === 4 && (
          <div className="max-w-2xl mx-auto">

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 ring-1 ring-white/10">

              <h2 className="text-2xl font-semibold text-white mb-4">
                Your Report is Ready
              </h2>

              <p className="text-white/70 mb-6">
                Enter your email to unlock the BOM Analysis Report.
              </p>

              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white mb-4"
              />

              <PrimaryButton
                onClick={handleEmailSubmit}
                className="w-full text-center"
              >
                View BOM Analysis Report
              </PrimaryButton>

            </div>
          </div>
        )}

        {/* STEP 5 : REPORT */}

        {step === 5 && (
          <div className="space-y-8">

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 ring-1 ring-white/10">

              <h2 className="text-2xl font-semibold text-white mb-6">
                BOM Analysis Report
              </h2>

              <p className="text-white/70 mb-4">
                Total parts analyzed: {mockResults.partCount}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockResults.categories.map((cat, idx) => (
                  <div key={idx} className="bg-black/30 rounded-xl p-4 text-center">
                    <div className="text-2xl text-emerald-300 font-bold">
                      {cat.count}
                    </div>
                    <div className="text-xs text-white/60 mt-2">
                      {cat.name}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 ring-1 ring-white/10">

              <h2 className="text-2xl font-semibold text-white mb-6">
                Recommended Manufacturing Strategy
              </h2>

              {mockResults.strategy.map((s, i) => (
                <div key={i} className="flex justify-between mb-3 text-white/80">
                  <span>{s.process}</span>
                  <span className="text-emerald-300">
                    {s.region} (Save {s.savings})
                  </span>
                </div>
              ))}

            </div>

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 ring-1 ring-white/10">

              <h2 className="text-2xl font-semibold text-white mb-6">
                Cost Estimation
              </h2>

              <p className="text-white/70">
                Total Estimated Cost:
                <span className="text-emerald-300 font-bold ml-2">
                  {mockResults.costEstimate.total}
                </span>
              </p>

              <p className="text-white/60 mt-2">
                Lead Time: {mockResults.leadTime}
              </p>

            </div>

            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-8 ring-1 ring-emerald-500/30">

              <h2 className="text-2xl font-semibold text-white mb-4">
                Ready to Manufacture?
              </h2>

              <p className="text-white/70 mb-6">
                PGI can manage sourcing, manufacturing and delivery.
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
```
