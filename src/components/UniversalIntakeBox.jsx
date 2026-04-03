import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Upload, Search, Sparkles, Boxes, BadgeHelp, ArrowUp, Loader2, FileText, ScanSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { normalizeIntake, parseIntake, submitIntake } from "../lib/intakeApi";

const MODE_OPTIONS = [
  { key: "auto", label: "Auto" },
  { key: "item", label: "Item" },
  { key: "component", label: "Component" },
  { key: "material", label: "Material" },
  { key: "bom", label: "BOM" },
  { key: "voice", label: "Voice" },
  { key: "free_text", label: "Free text" },
];

const INTENT_OPTIONS = [
  { key: "source", label: "Find suppliers" },
  { key: "deep_search", label: "Deep search suppliers" },
  { key: "research_product", label: "Research product" },
  { key: "price_check", label: "Price check" },
  { key: "compare", label: "Compare quotes" },
  { key: "rfq", label: "Create RFQ" },
];

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function UniversalIntakeBox({
  className = "",
  onParsed,
  onSubmitted,
}) {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [mode, setMode] = useState("auto");
  const [intent, setIntent] = useState("source");
  const [deliveryLocation, setDeliveryLocation] = useState("India");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [priority, setPriority] = useState("cost");
  const [file, setFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [error, setError] = useState("");
  const [sessionToken, setSessionToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("guest_session_token") || localStorage.getItem("pgi_guest_session_token") || "";
  });

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0]?.transcript || "")
        .join(" ")
        .trim();
      if (transcript) {
        setVoiceTranscript(transcript);
        if (!text.trim()) setText(transcript);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [text]);

  const inputPreview = useMemo(() => {
    if (file) return file.name;
    if (audioFile) return audioFile.name;
    if (voiceTranscript) return voiceTranscript;
    return text;
  }, [file, audioFile, voiceTranscript, text]);

  const helperCards = [
    {
      icon: <Boxes className="h-4 w-4" />,
      title: "Item",
      desc: "Single SKU / part number / assembly.",
    },
    {
      icon: <Sparkles className="h-4 w-4" />,
      title: "Component",
      desc: "Technical components with specs.",
    },
    {
      icon: <Search className="h-4 w-4" />,
      title: "Material",
      desc: "Sheet, bar, rod, resin, metal, polymer.",
    },
    {
      icon: <BadgeHelp className="h-4 w-4" />,
      title: "Voice",
      desc: "Speak your sourcing requirement.",
    },
  ];

  async function runParse() {
    setError("");
    setIsParsing(true);
    try {
      const res = await parseIntake({
        raw_input_text: text,
        input_type: mode,
        intent,
        delivery_location: deliveryLocation,
        target_currency: targetCurrency,
        priority,
        session_token: sessionToken,
        voice_transcript: voiceTranscript,
        source_channel: audioFile ? "voice" : file ? "file" : "web",
        metadata: {
          ui_source: "universal_intake_box",
          user_input_preview: inputPreview,
        },
        source_file: file,
        audio_file: audioFile,
      });
      setParseResult(res);
      if (res?.intake_session?.session_token) {
        setSessionToken(res.intake_session.session_token);
        if (typeof window !== "undefined") {
          localStorage.setItem("guest_session_token", res.intake_session.session_token);
        }
      }
      onParsed?.(res);
    } catch (err) {
      setError(err.message || "Failed to parse intake");
    } finally {
      setIsParsing(false);
    }
  }

  async function runNormalize() {
    setError("");
    setIsParsing(true);
    try {
      const res = await normalizeIntake({
        raw_input_text: text,
        input_type: mode,
        intent,
        delivery_location: deliveryLocation,
        target_currency: targetCurrency,
        priority,
        session_token: sessionToken,
        voice_transcript: voiceTranscript,
        source_channel: audioFile ? "voice" : file ? "file" : "web",
        metadata: {
          ui_source: "universal_intake_box",
          user_input_preview: inputPreview,
        },
        source_file: file,
        audio_file: audioFile,
      });
      setParseResult(res);
      onParsed?.(res);
    } catch (err) {
      setError(err.message || "Failed to normalize intake");
    } finally {
      setIsParsing(false);
    }
  }

  async function runSubmit() {
    setError("");
    setIsSubmitting(true);
    try {
      const res = await submitIntake({
        raw_input_text: text,
        input_type: mode,
        intent,
        delivery_location: deliveryLocation,
        target_currency: targetCurrency,
        priority,
        session_token: sessionToken,
        voice_transcript: voiceTranscript,
        source_channel: audioFile ? "voice" : file ? "file" : "web",
        async_finalize: true,
        metadata: {
          ui_source: "universal_intake_box",
          user_input_preview: inputPreview,
        },
        source_file: file,
        audio_file: audioFile,
      });
      if (res?.intake_session?.session_token) {
        setSessionToken(res.intake_session.session_token);
        if (typeof window !== "undefined") {
          localStorage.setItem("guest_session_token", res.intake_session.session_token);
        }
      }
      onSubmitted?.(res);
      if (res?.workspace_route) {
        navigate(res.workspace_route);
      }
    } catch (err) {
      setError(err.message || "Failed to submit intake");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startVoiceCapture() {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }
    setError("");
    setIsListening(true);
    recognition.start();
  }

  function stopVoiceCapture() {
    const recognition = recognitionRef.current;
    if (recognition) recognition.stop();
    setIsListening(false);
  }

  function onDropFile(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (dropped.type.startsWith("audio/")) setAudioFile(dropped);
      else setFile(dropped);
    }
  }

  return (
    <section className={cn("w-full", className)}>
      <div
        className="rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm"
        onDrop={onDropFile}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="border-b border-slate-200/70 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Source top products from global suppliers</h2>
              <p className="text-sm text-slate-500">Describe an item, component, material, part number, BOM, or speak it aloud.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">Unified intake</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">AI parse</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">RFQ ready</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe anything about product sourcing"
                className="min-h-[150px] w-full resize-none bg-transparent text-[15px] leading-6 text-slate-900 outline-none placeholder:text-slate-400"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {mode !== "voice" ? (
                  <button
                    type="button"
                    onClick={startVoiceCapture}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition",
                      isListening
                        ? "border-rose-300 bg-rose-50 text-rose-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Mic className="h-4 w-4" />
                    {isListening ? "Listening..." : "Voice input"}
                  </button>
                ) : null}
                {isListening ? (
                  <button
                    type="button"
                    onClick={stopVoiceCapture}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-100"
                  >
                    Stop voice
                  </button>
                ) : null}

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-100">
                  <Upload className="h-4 w-4" />
                  Upload file
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls,.tsv,.txt,.md,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-100">
                  <FileText className="h-4 w-4" />
                  Audio
                  <input
                    type="file"
                    className="hidden"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  />
                </label>

                {file ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">{file.name}</span> : null}
                {audioFile ? <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-indigo-700">{audioFile.name}</span> : null}
                {sessionToken ? <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">Session linked</span> : null}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3">
              <button
                type="button"
                onClick={runSubmit}
                disabled={isSubmitting || (!text.trim() && !file && !audioFile && !voiceTranscript.trim())}
                className="inline-flex min-h-[150px] w-full items-center justify-center rounded-[24px] bg-slate-900 px-5 py-4 text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex flex-col items-center gap-2">
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                  <span className="text-sm font-medium">Analyze & continue</span>
                </div>
              </button>

              <button
                type="button"
                onClick={runParse}
                disabled={isParsing || (!text.trim() && !file && !audioFile && !voiceTranscript.trim())}
                className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
                Parse only
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setMode(opt.key)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  mode === opt.key
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {INTENT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setIntent(opt.key)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  intent === opt.key
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="Delivery location"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
            <input
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              placeholder="Currency"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="cost">Cost priority</option>
              <option value="speed">Speed priority</option>
            </select>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {parseResult ? (
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Normalized intake preview</h3>
                  <p className="text-xs text-slate-500">
                    {parseResult?.parsed_summary?.line_count || 0} item(s) detected • Confidence {Math.round((parseResult?.confidence_score || 0) * 100)}%
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{parseResult?.input_type}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{parseResult?.intent}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(parseResult?.normalized_items || []).map((item, idx) => (
                  <div key={`${item.item_name}-${idx}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{item.item_name || item.raw_text}</div>
                        <div className="text-xs text-slate-500">{item.category} • {item.material || "material missing"}</div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs text-slate-600">
                        {Math.round((item.confidence || 0) * 100)}%
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-600">
                      Qty: {item.quantity} {item.unit || ""}
                      {item.process ? <span> • Process: {item.process}</span> : null}
                    </div>
                    {item.warnings?.length ? (
                      <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-amber-700">
                        {item.warnings.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={runNormalize}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Re-normalize
                </button>
                <button
                  type="button"
                  onClick={runSubmit}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                >
                  Open workspace
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {helperCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="rounded-full bg-slate-100 p-2">{card.icon}</span>
                  <div className="text-sm font-medium">{card.title}</div>
                </div>
                <p className="mt-3 text-sm text-slate-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}