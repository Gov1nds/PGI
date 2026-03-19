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
    if (file) setStep(2);
  };

  const startProcessing = async () => {
    if (country && stateRegion && city && file) {
      setStep(3);
      setIsProcessing(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(`${API_BASE}/upload-bom`, {
          method: "POST",
          body: formData
        });

        const uploadData = await uploadRes.json();

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
    if (email) setStep(5);
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

        {/* STEP 1 */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <input type="file" onChange={handleFileUpload} />
            <PrimaryButton onClick={proceedToLocation}>Analyze BOM</PrimaryButton>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <input placeholder="Country" onChange={(e)=>setCountry(e.target.value)} />
            <input placeholder="State" onChange={(e)=>setStateRegion(e.target.value)} />
            <input placeholder="City" onChange={(e)=>setCity(e.target.value)} />
            <PrimaryButton onClick={startProcessing}>Start</PrimaryButton>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && <div>Processing...</div>}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <input onChange={(e)=>setEmail(e.target.value)} />
            <PrimaryButton onClick={handleEmailSubmit}>Continue</PrimaryButton>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div>
            {analysisResult && (
              <>
                <p>Total: {analysisResult.summary?.total_components}</p>
                {analysisResult.components?.map((c,i)=>(
                  <div key={i}>{c.component_name}</div>
                ))}
              </>
            )}
          </div>
        )}

      </Container>

    </div>
  );
}