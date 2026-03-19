import React, { useState } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { Link } from "react-router-dom";

const API_BASE = "https://bom-analyzer-api-production.up.railway.app";

export default function BOMAnalyzer() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const proceedToLocation = () => {
    if (file) {
      setStep(2);
    }
  };

  const startProcessing = async () => {
    if (country && stateRegion && city && file) {
      setStep(3);
      setIsProcessing(true);

      try {
        // STEP 1: Upload BOM
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(`${API_BASE}/upload-bom`, {
          method: "POST",
          body: formData
        });

        const uploadData = await uploadRes.json();

        // STEP 2: Analyze BOM
        const analyzeRes = await fetch(`${API_BASE}/analyze-bom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            components: uploadData.components,
            user_context: {
              country: country,
              priority: "BALANCED",
              delivery_location: city
            }
          })
        });

        const result = await analyzeRes.json();

        console.log("REAL RESULT:", result);

        setAnalysisResult(result);

        setIsProcessing(false);
        setStep(4);

      } catch (error) {
        console.error("Error:", error);
        setIsProcessing(false);
      }
    }
  };

  const handleEmailSubmit = () => {
    if (email) {
      setStep(5);
    }
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
              Upload your Bill of Materials and get instant manufacturing strategy, cost estimation, and global sourcing recommendations.
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

        {/* STEP 1 */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Upload BOM
              </h2>
              <div className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-8 text-center mb-6">
                <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <span className="text-white font-semibold">
                    {file ? file.name : "Click to upload BOM"}
                  </span>
                </label>
              </div>
              <PrimaryButton onClick={proceedToLocation} disabled={!file} className="w-full text-center">
                Analyze BOM
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-12 ring-1 ring-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Where should we deliver?
              </h2>

              <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full mb-3 px-4 py-3 rounded-xl bg-white/10 text-white"/>
              <input placeholder="State" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} className="w-full mb-3 px-4 py-3 rounded-xl bg-white/10 text-white"/>
              <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full mb-3 px-4 py-3 rounded-xl bg-white/10 text-white"/>

              <PrimaryButton onClick={startProcessing} className="w-full text-center">
                Start BOM Analysis
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="text-center text-white">
            <h2>Processing...</h2>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="text-center text-white">
            <h2>Enter Email</h2>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} />
            <PrimaryButton onClick={handleEmailSubmit}>
              Continue
            </PrimaryButton>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && analysisResult && (
          <div className="text-white space-y-6">

            <h2 className="text-2xl">BOM Analysis Report</h2>

            <p>Total Components: {analysisResult.summary.total_components}</p>
            <p>Total Cost: ${analysisResult.summary.total_cost_usd}</p>
            <p>Lead Time: {analysisResult.summary.critical_path_days} days</p>

            {analysisResult.components.map((comp, i) => (
              <div key={i} className="border p-4 rounded">
                <p>{comp.component_name}</p>
                <p>Cost: ${comp.selected_strategy.unit_cost_usd}</p>
                <p>Region: {comp.selected_strategy.manufacturing_region}</p>
              </div>
            ))}

          </div>
        )}

      </Container>
    </div>
  );
}