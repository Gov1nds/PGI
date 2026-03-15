import React, { useState } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function BOMAnalyzer() {

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [bomData, setBomData] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);

  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [city, setCity] = useState("");

  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  /* -----------------------------
     STEP 1 — READ BOM FILE
  ----------------------------- */

  const handleFileUpload = (e) => {

    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();

    reader.onload = (evt) => {

      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      setBomData(json);

      console.log("Parsed BOM:", json);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  /* -----------------------------
     STEP 2 — PART CLASSIFICATION
  ----------------------------- */

  function classifyPart(partName) {

    const name = partName?.toLowerCase() || "";

    if (name.includes("bolt") || name.includes("nut") || name.includes("washer"))
      return "Standard Mechanical";

    if (name.includes("motor") || name.includes("sensor") || name.includes("pcb"))
      return "Electrical";

    if (name.includes("plate") || name.includes("housing") || name.includes("block"))
      return "Machining";

    return "Unknown";
  }

  /* -----------------------------
     STEP 3 — PROCESS DETECTION
  ----------------------------- */

  function detectProcess(part) {

    const name = part?.toLowerCase() || "";

    if (name.includes("shaft")) return "Turning";
    if (name.includes("plate")) return "Laser Cutting";
    if (name.includes("housing")) return "CNC Machining";
    if (name.includes("bracket")) return "Sheet Metal";

    return "General Manufacturing";
  }

  /* -----------------------------
     STEP 4 — SUPPLIER DECISION
  ----------------------------- */

  function chooseSupplier(qty) {

    if (qty <= 3) return "Local Distributor";

    if (qty > 3 && qty < 50) return "Regional Supplier";

    return "Global Supplier";
  }

  /* -----------------------------
     STEP 5 — COST ESTIMATION
  ----------------------------- */

  function estimateCost(process, qty) {

    if (process === "CNC Machining")
      return qty * 45;

    if (process === "Sheet Metal")
      return qty * 20;

    if (process === "Laser Cutting")
      return qty * 18;

    if (process === "Turning")
      return qty * 35;

    return qty * 10;
  }

  /* -----------------------------
     ANALYZE BOM
  ----------------------------- */

  const analyzeBOM = () => {

    const results = bomData.map((item) => {

      const part = item.Part || item.part || Object.values(item)[0];
      const qty = item.Qty || item.qty || Object.values(item)[1] || 1;

      const category = classifyPart(part);
      const process = detectProcess(part);
      const supplier = chooseSupplier(qty);
      const cost = estimateCost(process, qty);

      return {
        part,
        qty,
        category,
        process,
        supplier,
        cost
      };
    });

    setAnalysisResults(results);
  };

  /* -----------------------------
     FLOW CONTROL
  ----------------------------- */

  const proceedToLocation = () => {
    if (file) setStep(2);
  };

  const startProcessing = () => {

    if (country && stateRegion && city) {

      setStep(3);
      setIsProcessing(true);

      setTimeout(() => {

        analyzeBOM();

        setIsProcessing(false);
        setStep(4);

      }, 3000);
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

            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
              BOM Analyzer
            </h1>

            <p className="mt-4 text-white/75">
              Upload your Bill of Materials and receive manufacturing
              strategy, sourcing recommendations and cost estimation.
            </p>

          </div>

        </Container>

      </section>

      <Container className="py-16">

        {/* STEP 1 UPLOAD */}

        {step === 1 && (

          <div className="max-w-2xl mx-auto">

            <div className="p-8 bg-white/5 rounded-3xl">

              <h2 className="text-2xl text-white mb-6">
                Upload BOM
              </h2>

              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileUpload}
                className="mb-6 text-white"
              />

              <PrimaryButton
                onClick={proceedToLocation}
                disabled={!file}
                className="w-full"
              >
                Analyze BOM
              </PrimaryButton>

            </div>

          </div>
        )}

        {/* STEP 2 LOCATION */}

        {step === 2 && (

          <div className="max-w-2xl mx-auto">

            <div className="p-8 bg-white/5 rounded-3xl">

              <h2 className="text-2xl text-white mb-6">
                Delivery Location
              </h2>

              <input
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full mb-4 p-3 rounded-xl"
              />

              <input
                placeholder="State"
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                className="w-full mb-4 p-3 rounded-xl"
              />

              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mb-6 p-3 rounded-xl"
              />

              <PrimaryButton
                onClick={startProcessing}
                className="w-full"
              >
                Start Analysis
              </PrimaryButton>

            </div>

          </div>
        )}

        {/* STEP 3 PROCESSING */}

        {step === 3 && (

          <div className="text-center text-white">

            <h2 className="text-2xl mb-6">
              Analyzing BOM
            </h2>

            {isProcessing && (

              <div className="space-y-3">

                <p>Parsing BOM</p>
                <p>Classifying Parts</p>
                <p>Detecting Manufacturing Process</p>
                <p>Finding Suppliers</p>
                <p>Optimizing Logistics</p>

              </div>

            )}

          </div>
        )}

        {/* STEP 4 EMAIL */}

        {step === 4 && (

          <div className="max-w-xl mx-auto">

            <div className="p-8 bg-white/5 rounded-3xl">

              <h2 className="text-2xl text-white mb-6">
                Report Ready
              </h2>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-6 p-3 rounded-xl"
              />

              <PrimaryButton
                onClick={handleEmailSubmit}
                className="w-full"
              >
                View Report
              </PrimaryButton>

            </div>

          </div>
        )}

        {/* STEP 5 REPORT */}

        {step === 5 && (

          <div className="space-y-10">

            <h2 className="text-3xl text-white">
              BOM Analysis Report
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full text-white">

                <thead>

                  <tr className="border-b border-white/20">

                    <th className="p-3 text-left">Part</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Process</th>
                    <th className="p-3">Supplier</th>
                    <th className="p-3">Cost</th>

                  </tr>

                </thead>

                <tbody>

                  {analysisResults.map((row, i) => (

                    <tr key={i} className="border-b border-white/10">

                      <td className="p-3">{row.part}</td>
                      <td className="p-3 text-center">{row.qty}</td>
                      <td className="p-3 text-center">{row.category}</td>
                      <td className="p-3 text-center">{row.process}</td>
                      <td className="p-3 text-center">{row.supplier}</td>
                      <td className="p-3 text-center">${row.cost}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div className="bg-emerald-500/10 p-8 rounded-3xl">

              <h3 className="text-xl text-white mb-4">
                Ready to Manufacture?
              </h3>

              <p className="text-white/70 mb-6">
                PGI can manage sourcing, manufacturing and delivery.
              </p>

              <Link to="/contact">

                <PrimaryButton className="w-full">
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