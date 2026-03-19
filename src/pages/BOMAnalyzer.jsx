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
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const proceedToLocation = () => {
    if (file) {
      setStep(2);
    } else {
      setError("Please upload a BOM file first");
    }
  };

  const startProcessing = async () => {
    if (!country || !stateRegion || !city || !file) {
      setError("Please fill in all location fields");
      return;
    }

    setStep(3);
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Upload BOM
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading BOM...");
      const uploadRes = await fetch(`${API_BASE}/upload-bom`, {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed: ${uploadRes.status}`);
      }

      const uploadData = await uploadRes.json();
      console.log("Upload response:", uploadData);

      if (!uploadData.success || !uploadData.components || uploadData.components.length === 0) {
        throw new Error("No valid components found in BOM file");
      }

      // Step 2: Analyze BOM
      console.log("Analyzing BOM...");
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

      if (!analyzeRes.ok) {
        throw new Error(`Analysis failed: ${analyzeRes.status}`);
      }

      const result = await analyzeRes.json();
      console.log("Analysis result:", result);

      if (!result.success) {
        throw new Error(result.error || "Analysis failed");
      }

      setAnalysisResult(result);
      setIsProcessing(false);
      setStep(4);

    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred during processing");
      setIsProcessing(false);
      setStep(2); // Go back to location input
    }
  };

  const handleEmailSubmit = () => {
    if (email) {
      setStep(5);
    } else {
      setError("Please enter your email address");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm text-emerald-400 font-semibold">Engineering Tool</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">BOM Analyzer</h1>
            <p className="mt-4 text-white/75">
              Upload your Bill of Materials and get instant manufacturing strategy.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16">

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* STEP 1: File Upload */}
{step === 1 && (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="rounded-3xl bg-white/5 p-8">
      <h2 className="text-2xl text-white mb-4">Upload BOM File</h2>
      <p className="text-white/60 text-sm mb-4">
        Accepted formats: CSV (.csv), Excel (.xlsx, .xls)
      </p>
      <input 
        type="file" 
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
        className="block w-full text-white/75 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 cursor-pointer"
      />
      {file && (
        <p className="mt-2 text-emerald-400 text-sm">
          ✓ Selected: {file.name}
        </p>
      )}
    </div>
    <PrimaryButton onClick={proceedToLocation}>
      Analyze BOM
    </PrimaryButton>
  </div>
)}

        {/* STEP 2: Location Input */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 p-8 space-y-4">
              <h2 className="text-2xl text-white mb-4">Delivery Location</h2>
              
              <input 
                placeholder="Country (e.g., USA, India, Germany)"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/50"
              />
              
              <input 
                placeholder="State/Region"
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/50"
              />
              
              <input 
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/50"
              />
            </div>
            
            <PrimaryButton onClick={startProcessing}>
              Start Analysis
            </PrimaryButton>
          </div>
        )}

        {/* STEP 3: Processing */}
        {step === 3 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-white/75">Processing your BOM...</p>
          </div>
        )}

        {/* STEP 4: Email Input */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 p-8">
              <h2 className="text-2xl text-white mb-4">Analysis Complete!</h2>
              <p className="text-white/75 mb-4">
                Enter your email to receive the detailed report.
              </p>
              <input 
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/50"
              />
            </div>
            <PrimaryButton onClick={handleEmailSubmit}>
              View Results
            </PrimaryButton>
          </div>
        )}

        {/* STEP 5: Results Display */}
        {step === 5 && analysisResult && (
          <div className="space-y-8 text-white">

            {/* Summary Card */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/10 p-8">
              <h2 className="text-3xl font-semibold mb-6">BOM Analysis Report</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-white/50 text-sm">Total Components</p>
                  <p className="text-3xl font-bold mt-1">
                    {analysisResult.summary?.total_components || 0}
                  </p>
                  {analysisResult.summary?.failed_components > 0 && (
                    <p className="text-red-400 text-xs mt-1">
                      {analysisResult.summary.failed_components} failed
                    </p>
                  )}
                </div>

                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-white/50 text-sm">Total Cost</p>
                  <p className="text-3xl font-bold mt-1 text-emerald-400">
                    ${(analysisResult.summary?.total_cost_usd || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>

                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-white/50 text-sm">Critical Path</p>
                  <p className="text-3xl font-bold mt-1">
                    {analysisResult.summary?.critical_path_days || 0} <span className="text-lg">days</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/50">Suppliers</p>
                  <p className="text-xl font-semibold">{analysisResult.summary?.total_suppliers || 0}</p>
                </div>
                <div>
                  <p className="text-white/50">Regions</p>
                  <p className="text-xl font-semibold">{analysisResult.summary?.unique_regions || 0}</p>
                </div>
              </div>
            </div>

            {/* Regional Breakdown */}
            {analysisResult.summary?.regional_breakdown && 
             Object.keys(analysisResult.summary.regional_breakdown).length > 0 && (
              <div className="rounded-3xl bg-white/5 p-6">
                <h3 className="text-xl font-semibold mb-4">Sourcing by Region</h3>
                <div className="space-y-2">
                  {Object.entries(analysisResult.summary.regional_breakdown).map(([region, count]) => (
                    <div key={region} className="flex justify-between items-center p-3 bg-black/30 rounded">
                      <span>{region}</span>
                      <span className="text-emerald-400 font-semibold">{count} components</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Components List */}
            <div className="rounded-3xl bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-4">Component Details</h3>
              
              {analysisResult.components && analysisResult.components.length > 0 ? (
                <div className="space-y-3">
                  {analysisResult.components.map((comp, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-lg ${
                        comp.error 
                          ? 'bg-red-500/10 border border-red-500/30' 
                          : 'bg-black/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {comp.component_name || "Unnamed Component"}
                          </h4>
                          <p className="text-white/50 text-sm">
                            Quantity: {comp.quantity || "N/A"}
                          </p>
                        </div>
                        {comp.error && (
                          <span className="text-red-400 text-xs bg-red-500/20 px-2 py-1 rounded">
                            Error
                          </span>
                        )}
                      </div>

                      {!comp.error && comp.selected_strategy && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                          <div>
                            <p className="text-white/50">Unit Cost</p>
                            <p className="font-semibold text-emerald-400">
                              ${(comp.selected_strategy.unit_cost_usd || 0).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/50">Total Cost</p>
                            <p className="font-semibold">
                              ${(comp.selected_strategy.total_cost_usd || 0).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/50">Lead Time</p>
                            <p className="font-semibold">
                              {comp.selected_strategy.lead_time_days || 0}d
                            </p>
                          </div>
                          <div>
                            <p className="text-white/50">Region</p>
                            <p className="font-semibold">
                              {comp.selected_strategy.manufacturing_region || "N/A"}
                            </p>
                          </div>
                        </div>
                      )}

                      {comp.error && (
                        <p className="text-red-400 text-sm mt-2">
                          {comp.error_message || "Processing failed"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-center py-8">No components returned</p>
              )}
            </div>

            {/* Scenario Analysis (if available) */}
            {analysisResult.scenario_analysis && (
              <div className="rounded-3xl bg-white/5 p-6">
                <h3 className="text-xl font-semibold mb-4">Scenario Analysis</h3>
                
                {analysisResult.scenario_analysis.recommended && (
                  <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-emerald-400 font-semibold">
                      Recommended: {analysisResult.scenario_analysis.recommended.scenario}
                    </p>
                    <p className="text-white/75 text-sm mt-1">
                      {analysisResult.scenario_analysis.recommended.reason}
                    </p>
                  </div>
                )}

                {analysisResult.scenario_analysis.scenarios && 
                 analysisResult.scenario_analysis.scenarios.length > 0 && (
                  <div className="space-y-2">
                    {analysisResult.scenario_analysis.scenarios.map((scenario, i) => (
                      <div key={i} className="p-3 bg-black/30 rounded text-sm">
                        <p className="font-semibold">{scenario.scenario_name}</p>
                        <div className="flex gap-4 mt-1 text-white/75">
                          <span>Cost: ${scenario.costs?.total_bom_cost?.toFixed(2) || "N/A"}</span>
                          <span>Time: {scenario.timing?.critical_path_days || "N/A"}d</span>
                          <span>Risk: {scenario.risk?.risk_score?.toFixed(2) || "N/A"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <PrimaryButton onClick={() => window.print()}>
                Download Report
              </PrimaryButton>
              <button 
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setAnalysisResult(null);
                  setError(null);
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                Analyze Another BOM
              </button>
            </div>

          </div>
        )}

      </Container>
    </div>
  );
}