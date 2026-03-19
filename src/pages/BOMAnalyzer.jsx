import React, { useState, useEffect } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";

// ✅ USE WORKING API (deployed endpoints are at /api, not /api1)
const API_BASE = "https://bom-analyzer-api-production.up.railway.app";

// Location data
const LOCATION_DATA = {
  India: {
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Kottayam", "Kannur"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum", "Davangere"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Agra", "Varanasi"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"],
    Haryana: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal"],
    Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Delhi NCR": ["New Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"]
  },
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
    Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
    "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
    Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
    Illinois: ["Chicago", "Aurora", "Naperville", "Rockford", "Joliet"]
  },
  China: {
    Guangdong: ["Shenzhen", "Guangzhou", "Dongguan", "Foshan", "Zhongshan"],
    Shanghai: ["Shanghai"],
    Beijing: ["Beijing"],
    Jiangsu: ["Suzhou", "Nanjing", "Wuxi", "Changzhou", "Nantong"]
  },
  Germany: {
    Bavaria: ["Munich", "Nuremberg", "Augsburg", "Regensburg"],
    "North Rhine-Westphalia": ["Cologne", "Dusseldorf", "Dortmund", "Essen"],
    "Baden-Wurttemberg": ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg"]
  },
  Mexico: {
    "Nuevo Leon": ["Monterrey", "Guadalupe", "San Nicolas de los Garza"],
    Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque"]
  },
  Vietnam: {
    "Ho Chi Minh": ["Ho Chi Minh City"],
    Hanoi: ["Hanoi"],
    "Da Nang": ["Da Nang"]
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Mississauga", "Brampton"],
    Quebec: ["Montreal", "Quebec City", "Laval"],
    "British Columbia": ["Vancouver", "Surrey", "Burnaby"]
  }
};

function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    if (error.detail) return error.detail;
    if (error.message) return error.message;
    if (error.error) return error.error;
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'An unknown error occurred';
    }
  }
  return 'An error occurred during processing';
}

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

  useEffect(() => {
    console.log("📁 File state changed:", file ? {
      name: file.name,
      size: file.size,
      type: file.type
    } : "No file");
  }, [file]);

  useEffect(() => {
    console.log("📍 Step changed to:", step);
  }, [step]);

  const availableStates = country ? Object.keys(LOCATION_DATA[country] || {}) : [];
  const availableCities = (country && stateRegion) 
    ? (LOCATION_DATA[country]?.[stateRegion] || []) 
    : [];

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      console.warn("⚠️ No file selected");
      setError("No file selected");
      return;
    }

    console.log("📤 File selected:", {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type
    });

    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      console.error("❌ Invalid file type:", fileName);
      setError("Invalid file type. Please upload CSV or Excel files (.csv, .xlsx, .xls)");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      console.error("❌ File too large:", selectedFile.size);
      setError("File too large. Maximum size is 10MB");
      setFile(null);
      return;
    }

    console.log("✅ File validation passed");
    setFile(selectedFile);
    setError(null);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setStateRegion("");
    setCity("");
  };

  const handleStateChange = (e) => {
    setStateRegion(e.target.value);
    setCity("");
  };

  const proceedToLocation = () => {
    console.log("🚀 Proceeding to location. File:", file);
    
    if (!file) {
      setError("Please upload a BOM file first");
      return;
    }
    setError(null);
    setStep(2);
  };

  const startProcessing = async () => {
    console.log("=".repeat(60));
    console.log("🚀 STARTING ANALYSIS");
    console.log("=".repeat(60));
    
    console.log("📋 Pre-flight checks:");
    console.log("  File:", file ? `${file.name} (${file.size} bytes)` : "❌ NO FILE");
    console.log("  Country:", country || "❌ NOT SET");
    console.log("  State:", stateRegion || "❌ NOT SET");
    console.log("  City:", city || "❌ NOT SET");

    if (!file) {
      console.error("❌ FATAL: No file uploaded");
      setError("No file uploaded. Please go back and select a file.");
      setStep(1);
      return;
    }

    if (!country || !stateRegion || !city) {
      console.error("❌ FATAL: Location not complete");
      setError("Please select all location fields");
      return;
    }

    console.log("✅ Pre-flight checks passed");
    
    setStep(3);
    setIsProcessing(true);
    setError(null);

    try {
      // ✅ USE DEPLOYED API - FormData with delivery_location
      console.log("\n📤 UPLOADING FILE");
      console.log("-".repeat(60));
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("delivery_location", `${city}, ${stateRegion}, ${country}`);

      const uploadUrl = `${API_BASE}/api/upload-bom`;
      console.log("🌐 Upload URL:", uploadUrl);

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData
        // Let browser set Content-Type with boundary
      });

      console.log("📥 Upload response received");
      console.log("  Status:", uploadRes.status);

      const uploadText = await uploadRes.text();
      console.log("📄 Response:", uploadText.substring(0, 500));

      if (!uploadRes.ok) {
        console.error("❌ Upload failed:", uploadRes.status);
        let errorMsg = `Upload failed (${uploadRes.status})`;
        try {
          const errorData = JSON.parse(uploadText);
          errorMsg = errorData.detail || errorData.error || errorMsg;
        } catch (e) {
          errorMsg = uploadText.substring(0, 100) || errorMsg;
        }
        throw new Error(errorMsg);
      }

      let uploadData;
      try {
        uploadData = JSON.parse(uploadText);
        console.log("✅ Parse successful:", uploadData);
      } catch (e) {
        console.error("❌ Parse failed:", e);
        throw new Error("Server returned invalid response");
      }

      if (!uploadData.success) {
        throw new Error(uploadData.error || "Upload failed");
      }

      console.log(`✅ Upload successful: ${uploadData.total_parts} parts found`);

      // Convert simple API response to analysis format
      const parts = uploadData.parts || [];
      
      const analysisData = {
        success: true,
        summary: {
          total_components: uploadData.total_parts || 0,
          successful_components: uploadData.total_parts || 0,
          failed_components: 0,
          total_cost_usd: 0, // Not available in simple API
          critical_path_days: 0, // Not available in simple API
          total_suppliers: 0,
          unique_regions: Object.keys(uploadData.categories || {}).length,
          regional_breakdown: uploadData.categories || {}
        },
        components: parts.map((part, idx) => ({
          component_id: `part_${idx}`,
          component_name: part.part_name || part.name || "Unknown",
          quantity: part.quantity || 0,
          selected_strategy: {
            strategy_id: "simple_parse",
            unit_cost_usd: 0,
            total_cost_usd: 0,
            lead_time_days: 0,
            manufacturing_region: part.category || "Not classified",
            supplier_id: "TBD",
            confidence: "PARSED",
            process: part.process || "Unknown"
          }
        }))
      };

      setAnalysisResult(analysisData);
      setIsProcessing(false);
      setStep(4);

    } catch (err) {
      console.error("\n❌ ERROR OCCURRED");
      console.error("=".repeat(60));
      console.error("Error:", err);
      console.error("=".repeat(60));
      
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setIsProcessing(false);
      setStep(2);
    }
  };

  const handleEmailSubmit = () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setStep(5);
  };

  const resetForm = () => {
    console.log("🔄 Resetting form");
    setStep(1);
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setCountry("");
    setStateRegion("");
    setCity("");
    setEmail("");
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
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-400 font-medium">Error</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
                <p className="text-red-200/60 text-xs mt-2">
                  Check browser console (F12) for detailed logs
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  step >= s 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white/10 text-white/40'
                }`}>
                  {s}
                </div>
                {s < 5 && (
                  <div className={`w-12 md:w-20 h-0.5 transition-all ${
                    step > s ? 'bg-emerald-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/50">
            <span>Upload</span>
            <span>Location</span>
            <span>Process</span>
            <span>Email</span>
            <span>Results</span>
          </div>
        </div>

        {/* STEP 1: File Upload */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
              <h2 className="text-2xl text-white mb-4 font-semibold">Upload BOM File</h2>
              <p className="text-white/60 text-sm mb-6">
                Accepted formats: CSV (.csv), Excel (.xlsx, .xls) • Max size: 10MB
              </p>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="block w-full text-white/75 
                    file:mr-4 file:py-3 file:px-6 file:rounded-lg 
                    file:border-0 file:bg-emerald-500 file:text-white file:font-semibold
                    hover:file:bg-emerald-600 cursor-pointer
                    file:cursor-pointer file:transition-all"
                />
              </div>

              {file && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div className="flex-1">
                      <p className="text-emerald-400 font-medium">{file.name}</p>
                      <p className="text-emerald-300/60 text-sm">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <PrimaryButton 
              onClick={proceedToLocation}
              disabled={!file}
            >
              Continue to Location
            </PrimaryButton>
          </div>
        )}

        {/* STEP 2: Location Selection */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 space-y-6">
              <h2 className="text-2xl text-white mb-4 font-semibold">Delivery Location</h2>
              
              <div>
                <label className="block text-white/60 text-sm mb-2 font-medium">
                  Country <span className="text-red-400">*</span>
                </label>
                <select
                  value={country}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white 
                    focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer
                    bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')] 
                    bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  <option value="" className="bg-gray-800">Select a country</option>
                  {Object.keys(LOCATION_DATA).map(countryName => (
                    <option key={countryName} value={countryName} className="bg-gray-800">
                      {countryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-medium">
                  State/Region <span className="text-red-400">*</span>
                </label>
                <select
                  value={stateRegion}
                  onChange={handleStateChange}
                  disabled={!country}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white 
                    focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')] 
                    bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  <option value="" className="bg-gray-800">
                    {country ? "Select a state/region" : "First select a country"}
                  </option>
                  {availableStates.map(state => (
                    <option key={state} value={state} className="bg-gray-800">
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-medium">
                  City <span className="text-red-400">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!stateRegion}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white 
                    focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')] 
                    bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  <option value="" className="bg-gray-800">
                    {stateRegion ? "Select a city" : "First select a state/region"}
                  </option>
                  {availableCities.map(cityName => (
                    <option key={cityName} value={cityName} className="bg-gray-800">
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              {country && stateRegion && city && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-emerald-400 text-sm font-medium">
                    ✓ Delivery Location: {city}, {stateRegion}, {country}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-all"
              >
                ← Back
              </button>
              <PrimaryButton 
                onClick={startProcessing}
                disabled={!country || !stateRegion || !city}
              >
                Start Analysis
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* STEP 3: Processing */}
        {step === 3 && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-6 text-white text-lg font-medium">Analyzing your BOM...</p>
            <p className="mt-2 text-white/50 text-sm">
              {city}, {stateRegion}, {country}
            </p>
            <p className="mt-1 text-white/40 text-xs">This may take a few moments</p>
          </div>
        )}

        {/* STEP 4: Email Input */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-4">
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-3xl text-white font-bold">Analysis Complete!</h2>
                <p className="text-white/60 mt-3">
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
              View Results →
            </PrimaryButton>
          </div>
        )}

        {/* STEP 5: Results Display */}
        {step === 5 && analysisResult && (
          <div className="space-y-8">
            
            {/* Notice Banner */}
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4">
              <p className="text-blue-300 text-sm">
                ℹ️ <strong>Note:</strong> Using basic parsing mode. Cost and lead time analysis will be available when the advanced API is deployed.
              </p>
            </div>

            {/* Summary Card */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">BOM Analysis Report</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                  <p className="text-white/50 text-sm mb-1">Total Components</p>
                  <p className="text-4xl font-bold text-white">
                    {analysisResult.summary?.total_components || 0}
                  </p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                  <p className="text-white/50 text-sm mb-1">Categories</p>
                  <p className="text-4xl font-bold text-white">
                    {analysisResult.summary?.unique_regions || 0}
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

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-white/50 mb-1">Category</p>
                          <p className="text-lg font-semibold text-white">
                            {comp.selected_strategy?.manufacturing_region || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 mb-1">Process</p>
                          <p className="text-lg font-semibold text-white">
                            {comp.selected_strategy?.process || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 mb-1">Status</p>
                          <p className="text-lg font-semibold text-emerald-400">
                            {comp.selected_strategy?.confidence || "Parsed"}
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
                onClick={resetForm}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-semibold transition-all shadow-lg shadow-emerald-500/20"
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
