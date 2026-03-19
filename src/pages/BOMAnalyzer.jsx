import React, { useState } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { Link } from "react-router-dom";

// ✅ CORRECT API BASE (with /api1 prefix from docs)
const API_BASE = "https://bom-analyzer-api-production.up.railway.app/api1";

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

      console.log("Uploading to:", `${API_BASE}/upload-bom`);
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const uploadRes = await fetch(`${API_BASE}/upload-bom`, {
        method: "POST",
        body: formData
        // DO NOT set Content-Type header - browser sets it automatically with boundary
      });

      console.log("Upload response status:", uploadRes.status);

      // Get response text first to see what we're dealing with
      const uploadText = await uploadRes.text();
      console.log("Upload response text:", uploadText);

      if (!uploadRes.ok) {
        let errorMsg = `Upload failed: ${uploadRes.status}`;
        try {
          const errorData = JSON.parse(uploadText);
          errorMsg = errorData.detail || errorData.message || errorMsg;
        } catch (e) {
          errorMsg = uploadText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      // Parse response
      let uploadData;
      try {
        uploadData = JSON.parse(uploadText);
      } catch (e) {
        throw new Error("Invalid response from server");
      }

      console.log("Upload data:", uploadData);

      if (!uploadData.success || !uploadData.components || uploadData.components.length === 0) {
        throw new Error(uploadData.error || "No valid components found in BOM file");
      }

      // Step 2: Analyze BOM
      console.log("Analyzing BOM with components:", uploadData.components);

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

      console.log("Analyze response status:", analyzeRes.status);

      const analyzeText = await analyzeRes.text();
      console.log("Analyze response text:", analyzeText);

      if (!analyzeRes.ok) {
        let errorMsg = `Analysis failed: ${analyzeRes.status}`;
        try {
          const errorData = JSON.parse(analyzeText);
          errorMsg = errorData.detail || errorData.error || errorMsg;
        } catch (e) {
          errorMsg = analyzeText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      let result;
      try {
        result = JSON.parse(analyzeText);
      } catch (e) {
        throw new Error("Invalid analysis response from server");
      }

      console.log("Analysis result:", result);

      if (!result.success) {
        throw new Error(result.error || "Analysis failed");
      }

      setAnalysisResult(result);
      setIsProcessing(false);
      setStep(4);

    } catch (err) {
      console.error("Error details:", err);
      setError(err.message || "An error occurred during processing");
      setIsProcessing(false);
      setStep(2);
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
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: File Upload */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
              <h2 className="text-2xl text-white mb-4 font-semibold">Upload BOM File</h2>
              <p className="text-white/60 text-sm mb-4">
                Accepted formats: CSV (.csv), Excel (.xlsx, .xls)
              </p>
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="block w-full text-white/75 
                  file:mr-4 file:py-2 file:px-4 file:rounded 
                  file:border-0 file:bg-emerald-500 file:text-white 
                  hover:file:bg-emerald-600 cursor-pointer
                  file:cursor-pointer file:font-semibold"
              />
              {file && (
                <p className="mt-3 text-emerald-400 text-sm font-medium">
                  ✓ Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            <PrimaryButton onClick={proceedToLocation}>
              Continue to Location
            </PrimaryButton>
          </div>
        )}

        {/* STEP 2: Location Input */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 space-y-4">
              <h2 className="text-2xl text-white mb-4 font-semibold">Delivery Location</h2>
              
              <div>
                <label className="block text-white/60 text-sm mb-2">Country *</label>
                <input 
                  placeholder="e.g., India, USA, Germany"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-white/60 text-sm mb-2">State/Region *</label>
                <input 
                  placeholder="e.g., Kerala, California"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-white/60 text-sm mb-2">City *</label>
                <input 
                  placeholder="e.g., Thamarakulam, San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            
            <PrimaryButton onClick={startProcessing}>
              Start Analysis
            </PrimaryButton>
          </div>
        )}

        {/* STEP 3: Processing */}
        {step === 3 && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-6 text-white/75 text-lg">Analyzing your BOM...</p>
            <p className="mt-2 text-white/50 text-sm">This may take a few moments</p>
          </div>
        )}

        {/* STEP 4: Email Input */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-2xl text-white font-semibold">Analysis Complete!</h2>
                <p className="text-white/60 mt-2">
                  Enter your email to receive the detailed report
                </p>
              </div>
              
              <input 
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            <PrimaryButton onClick={handleEmailSubmit}>
              View Results
            </PrimaryButton>
          </div>
        )}

        {/* STEP 5: Results */}
        {step === 5 && analysisResult && (
          <div className="space-y-8">
            
            {/* Summary Card */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">BOM Analysis Report</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                  <p className="text-white/50 text-sm mb-1">Total Components</p>
                  <p className="text-4xl font-bold text-white">
                    {analysisResult.summary?.total_components || 0}
                  </p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                  <p className="text-white/50 text-sm mb-1">Total Cost</p>
                  <p className="text-4xl font-bold text-emerald-400">
                    ${Number(analysisResult.summary?.total_cost_usd || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                  <p className="text-white/50 text-sm mb-1">Lead Time</p>
                  <p className="text-4xl font-bold text-white">
                    {analysisResult.summary?.critical_path_days || 0}
                    <span className="text-xl text-white/60 ml-1">days</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Components List */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Component Details</h3>
              
              {analysisResult.components && analysisResult.components.length > 0 ? (
                <div className="space-y-4">
                  {analysisResult.components.map((comp, i) => (
                    <div 
                      key={i} 
                      className="p-6 bg-black/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {comp.component_name || "Unnamed Component"}
                          </h4>
                          <p className="text-white/50 text-sm mt-1">
                            Quantity: {comp.quantity || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-white/50 mb-1">Unit Cost</p>
                          <p className="text-lg font-semibold text-emerald-400">
                            ${Number(comp.selected_strategy?.unit_cost_usd || 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 mb-1">Total Cost</p>
                          <p className="text-lg font-semibold text-white">
                            ${Number(comp.selected_strategy?.total_cost_usd || 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 mb-1">Lead Time</p>
                          <p className="text-lg font-semibold text-white">
                            {comp.selected_strategy?.lead_time_days || 0} days
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 mb-1">Region</p>
                          <p className="text-lg font-semibold text-white">
                            {comp.selected_strategy?.manufacturing_region || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-center py-8">No components found</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setAnalysisResult(null);
                  setError(null);
                  setCountry("");
                  setStateRegion("");
                  setCity("");
                  setEmail("");
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-all"
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