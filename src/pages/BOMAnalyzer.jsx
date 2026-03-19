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
    if (file) setStep(2);
    else setError("Please upload a BOM file first");
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
      // ✅ FIXED
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`${API_BASE}/api/upload-bom`, {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

      const uploadData = await uploadRes.json();

      const analyzeRes = await fetch(`${API_BASE}/api/analyze-bom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          components: uploadData.components,
          user_context: {
            country,
            priority: "BALANCED",
            delivery_location: city
          }
        })
      });

      if (!analyzeRes.ok) throw new Error(`Analysis failed: ${analyzeRes.status}`);

      const result = await analyzeRes.json();

      setAnalysisResult(result);
      setIsProcessing(false);
      setStep(4);

    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsProcessing(false);
      setStep(2);
    }
  };

  const handleEmailSubmit = () => {
    if (email) setStep(5);
    else setError("Please enter your email address");
  };

  return (
    <div>

      {/* HEADER */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm text-emerald-400 font-semibold">Engineering Tool</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">BOM Analyzer</h1>
          </div>
        </Container>
      </section>

      <Container className="py-16">

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <input type="file" onChange={handleFileUpload} />
            <PrimaryButton onClick={proceedToLocation}>Analyze BOM</PrimaryButton>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
            <input placeholder="State" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} />
            <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <PrimaryButton onClick={startProcessing}>Start Analysis</PrimaryButton>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && <div className="text-white">Processing...</div>}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <PrimaryButton onClick={handleEmailSubmit}>Continue</PrimaryButton>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && analysisResult && (
          <div className="text-white">

            <p>Total Components: {analysisResult.summary?.total_components || 0}</p>

            <p>
              Total Cost: $
              {Number(analysisResult.summary?.total_cost_usd || 0).toLocaleString()}
            </p>

            {analysisResult.components?.map((comp, i) => (
              <div key={i}>
                <p>{comp.component_name}</p>
                <p>
                  Cost: $
                  {Number(comp.selected_strategy?.unit_cost_usd || 0).toFixed(2)}
                </p>
              </div>
            ))}

          </div>
        )}

      </Container>
    </div>
  );
}