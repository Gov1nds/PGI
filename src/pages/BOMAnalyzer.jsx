import React, { useState } from "react";
import Container from "../components/Container.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { Link } from "react-router-dom";

const API_BASE = "https://bom-analyzer-api-production.up.railway.app/api1";

// Location data - India focused with other major countries
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
    Illinois: ["Chicago", "Aurora", "Naperville", "Rockford", "Joliet"],
    Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
    Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
    Georgia: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
    Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"]
  },
  China: {
    Guangdong: ["Shenzhen", "Guangzhou", "Dongguan", "Foshan", "Zhongshan"],
    Shanghai: ["Shanghai"],
    Beijing: ["Beijing"],
    Jiangsu: ["Suzhou", "Nanjing", "Wuxi", "Changzhou", "Nantong"],
    Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou", "Jiaxing", "Shaoxing"],
    Shandong: ["Qingdao", "Jinan", "Yantai", "Weifang", "Zibo"],
    Sichuan: ["Chengdu", "Mianyang", "Deyang", "Nanchong"],
    Liaoning: ["Shenyang", "Dalian", "Anshan", "Fushun"]
  },
  Germany: {
    Bavaria: ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Ingolstadt"],
    "North Rhine-Westphalia": ["Cologne", "Dusseldorf", "Dortmund", "Essen", "Duisburg"],
    "Baden-Wurttemberg": ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg"],
    "Lower Saxony": ["Hanover", "Brunswick", "Osnabruck", "Oldenburg"],
    Hesse: ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt"],
    Berlin: ["Berlin"],
    Hamburg: ["Hamburg"]
  },
  Mexico: {
    "Nuevo Leon": ["Monterrey", "Guadalupe", "San Nicolas de los Garza", "Apodaca"],
    Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonala"],
    "Mexico City": ["Mexico City"],
    Guanajuato: ["Leon", "Irapuato", "Celaya", "Salamanca"],
    Chihuahua: ["Chihuahua", "Juarez"],
    Baja_California: ["Tijuana", "Mexicali", "Ensenada"],
    Queretaro: ["Santiago de Queretaro", "San Juan del Rio"]
  },
  Vietnam: {
    "Ho Chi Minh": ["Ho Chi Minh City"],
    Hanoi: ["Hanoi"],
    "Da Nang": ["Da Nang"],
    "Binh Duong": ["Thu Dau Mot", "Di An", "Thuan An"],
    "Dong Nai": ["Bien Hoa", "Long Khanh"],
    "Bac Ninh": ["Bac Ninh"],
    "Hai Phong": ["Hai Phong"]
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton"],
    Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau"],
    "British Columbia": ["Vancouver", "Surrey", "Burnaby", "Richmond", "Victoria"],
    Alberta: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"],
    Manitoba: ["Winnipeg", "Brandon", "Steinbach"]
  }
};

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

  // Get available states based on selected country
  const availableStates = country ? Object.keys(LOCATION_DATA[country] || {}) : [];
  
  // Get available cities based on selected state
  const availableCities = (country && stateRegion) 
    ? (LOCATION_DATA[country]?.[stateRegion] || []) 
    : [];

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setStateRegion(""); // Reset state when country changes
    setCity(""); // Reset city when country changes
  };

  const handleStateChange = (e) => {
    setStateRegion(e.target.value);
    setCity(""); // Reset city when state changes
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

      const uploadRes = await fetch(`${API_BASE}/upload-bom`, {
        method: "POST",
        body: formData
      });

      console.log("Upload response status:", uploadRes.status);

      const uploadText = await uploadRes.text();
      console.log("Upload response:", uploadText);

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

      let uploadData;
      try {
        uploadData = JSON.parse(uploadText);
      } catch (e) {
        throw new Error("Invalid response from server");
      }

      if (!uploadData.success || !uploadData.components || uploadData.components.length === 0) {
        throw new Error(uploadData.error || "No valid components found in BOM file");
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

      const analyzeText = await analyzeRes.text();
      console.log("Analyze response:", analyzeText);

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
        throw new Error("Invalid analysis response");
      }

      if (!result.success) {
        throw new Error(result.error || "Analysis failed");
      }

      setAnalysisResult(result);
      setIsProcessing(false);
      setStep(4);

    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An error occurred");
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

        {/* STEP 2: Location Selection with Dropdowns */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 space-y-6">
              <h2 className="text-2xl text-white mb-4 font-semibold">Delivery Location</h2>
              
              {/* Country Dropdown */}
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

              {/* State Dropdown */}
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

              {/* City Dropdown */}
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

              {/* Selected Location Summary */}
              {country && stateRegion && city && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-emerald-400 text-sm font-medium">
                    ✓ Delivery Location: {city}, {stateRegion}, {country}
                  </p>
                </div>
              )}
            </div>
            
            <PrimaryButton 
              onClick={startProcessing}
              disabled={!country || !stateRegion || !city}
            >
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

        {/* STEP 5: Results Display */}
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