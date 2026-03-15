import React, { useState } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function BOMAnalyzer() {

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [bomData, setBomData] = useState([]);
  const [analysis, setAnalysis] = useState([]);

  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [city, setCity] = useState("");

  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  /* ------------------------------
     FILE UPLOAD + BOM PARSING
  --------------------------------*/

  const handleFileUpload = (e) => {

    const file = e.target.files[0];
    setFile(file);

    const reader = new FileReader();

    reader.onload = (evt) => {

      const data = new Uint8Array(evt.target.result);

      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(sheet);

      setBomData(json);

    };

    reader.readAsArrayBuffer(file);
  };

  /* ------------------------------
     PART CLASSIFICATION
  --------------------------------*/

  function classifyPart(partName) {

    const name = partName.toLowerCase();

    if (name.includes("bolt") || name.includes("nut") || name.includes("washer"))
      return "Standard Mechanical";

    if (name.includes("motor") || name.includes("sensor") || name.includes("pcb"))
      return "Electrical";

    if (name.includes("plate") || name.includes("housing") || name.includes("block"))
      return "Machining";

    return "Unknown";
  }

  /* ------------------------------
     PROCESS DETECTION
  --------------------------------*/

  function detectProcess(part) {

    const name = part.toLowerCase();

    if (name.includes("shaft")) return "Turning";
    if (name.includes("plate")) return "Laser Cutting";
    if (name.includes("housing")) return "CNC Machining";
    if (name.includes("bracket")) return "Sheet Metal";

    return "Standard Purchase";
  }

  /* ------------------------------
     SUPPLIER SELECTION
  --------------------------------*/

  function chooseSupplier(qty) {

    if (qty <= 3) return "Local Distributor";

    if (qty > 3 && qty < 50) return "Regional Supplier";

    return "Global Supplier";
  }

  /* ------------------------------
     COST ESTIMATION
  --------------------------------*/

  function estimateCost(process, qty) {

    if (process === "CNC Machining")
      return qty * 45;

    if (process === "Sheet Metal")
      return qty * 20;

    if (process === "Turning")
      return qty * 35;

    if (process === "Laser Cutting")
      return qty * 25;

    return qty * 10;
  }

  /* ------------------------------
     RUN ANALYSIS
  --------------------------------*/

  const runAnalysis = () => {

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

    setAnalysis(results);
  };

  /* ------------------------------
     PROCESSING SIMULATION
  --------------------------------*/

  const startProcessing = () => {

    if (country && stateRegion && city) {

      setStep(3);
      setIsProcessing(true);

      setTimeout(() => {

        runAnalysis();

        setIsProcessing(false);

        setStep(4);

      }, 4000);
    }
  };

  /* ------------------------------
     COST TOTAL
  --------------------------------*/

  const totalCost = analysis.reduce((sum, p) => sum + p.cost, 0);

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

            <p className="mt-4 text-white/75">
              Upload your Bill of Materials and get instant manufacturing
              strategy, cost estimation, and global sourcing recommendations.
            </p>

          </div>

        </Container>

      </section>

      <Container className="py-16">

        {/* STEP 1 UPLOAD */}

        {step === 1 && (

          <div className="max-w-2xl mx-auto">

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-10 ring-1 ring-white/10">

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
                onClick={() => setStep(2)}
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

            <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/3 p-10 ring-1 ring-white/10">

              <h2 className="text-2xl text-white mb-6">
                Where should we deliver?
              </h2>

              <div className="space-y-4 mb-6">

                <input
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl bg-white/10 px-4 py-3 text-white"
                />

                <input
                  placeholder="State"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  className="w-full rounded-xl bg-white/10 px-4 py-3 text-white"
                />

                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl bg-white/10 px-4 py-3 text-white"
                />

              </div>

              <PrimaryButton
                onClick={startProcessing}
                className="w-full"
              >
                Start BOM Analysis
              </PrimaryButton>

            </div>

          </div>
        )}

        {/* STEP 3 PROCESSING */}

        {step === 3 && (

          <div className="text-center text-white space-y-4">

            <h2 className="text-2xl">Analyzing BOM</h2>

            <p>Parsing BOM</p>
            <p>Classifying Parts</p>
            <p>Finding Suppliers</p>
            <p>Optimizing Logistics</p>
            <p>Generating Report</p>

          </div>

        )}

        {/* STEP 4 EMAIL */}

        {step === 4 && (

          <div className="max-w-xl mx-auto">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-white mb-4"
            />

            <PrimaryButton
              onClick={() => setStep(5)}
              className="w-full"
            >
              View Report
            </PrimaryButton>

          </div>

        )}

        {/* STEP 5 REPORT */}

        {step === 5 && (

          <div className="space-y-8">

            <h2 className="text-3xl text-white font-semibold">
              BOM Analysis Report
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full text-white">

                <thead>

                  <tr className="text-left border-b border-white/20">

                    <th className="py-3">Part</th>
                    <th>Qty</th>
                    <th>Category</th>
                    <th>Process</th>
                    <th>Supplier</th>
                    <th>Cost</th>

                  </tr>

                </thead>

                <tbody>

                  {analysis.map((p, i) => (

                    <tr key={i} className="border-b border-white/10">

                      <td className="py-3">{p.part}</td>
                      <td>{p.qty}</td>
                      <td>{p.category}</td>
                      <td>{p.process}</td>
                      <td>{p.supplier}</td>
                      <td>${p.cost}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div className="text-white text-xl">

              Estimated Total Cost:  
              <span className="text-emerald-400 ml-2 font-bold">
                ${totalCost}
              </span>

            </div>

            <div className="rounded-3xl bg-emerald-500/10 p-8">

              <h3 className="text-white text-xl mb-4">
                Ready to Manufacture?
              </h3>

              <p className="text-white/70 mb-6">
                PGI can handle supplier sourcing, production,
                quality control and delivery.
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