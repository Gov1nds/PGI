import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Mic,
  Upload,
  Search,
  Sparkles,
  Boxes,
  BadgeHelp,
  ArrowUp,
  Loader2,
  FileText,
  ScanSearch,
} from "lucide-react";
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

function persistGuestSessionToken(token) {
  if (typeof window === "undefined" || !token) return;
  localStorage.setItem("guest_session_token", token);
  localStorage.setItem("pgi_guest_session_token", token);
  localStorage.setItem("pgi_session", token);
}

export default function UniversalIntakeBox({
  className = "",
  onParsed,
  onSubmitted,
  initialText = "",
  initialMode = "auto",
  initialIntent = "source",
  initialSessionToken = "",
}) {
  const navigate = useNavigate();
  const [text, setText] = useState(initialText);
  const [mode, setMode] = useState(initialMode);
  const [intent, setIntent] = useState(initialIntent);
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
    if (typeof window === "undefined") return initialSessionToken || "";
    return (
      initialSessionToken ||
      localStorage.getItem("guest_session_token") ||
      localStorage.getItem("pgi_guest_session_token") ||
      localStorage.getItem("pgi_session") ||
      ""
    );
  });

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof initialText === "string" && initialText.trim()) {
      setText(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    if (typeof initialSessionToken === "string" && initialSessionToken.trim()) {
      setSessionToken(initialSessionToken);
      persistGuestSessionToken(initialSessionToken);
    }
  }, [initialSessionToken]);

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
      icon: <ScanSearch className="h-4 w-4" />,
      title: "BOM",
      desc: "Structured line-item analysis and normalization.",
    },
    {
      icon: <BadgeHelp className="h-4 w-4" />,
      title: "Voice",
      desc: "Speak your sourcing requirement.",
    },
  ];

  async function applyResult(res) {
    setParseResult(res);

    const nextSessionToken = res?.intake_session?.session_token || res?.session_token || "";
    if (nextSessionToken) {
      setSessionToken(nextSessionToken);
      persistGuestSessionToken(nextSessionToken);
    }

    onParsed?.(res);
  }

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

      await applyResult(res);
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

      await applyResult(res);
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

      await applyResult(res);
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
        className="rounded-[28px] border border-white/[0.08] bg-[#111827] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm"
        onDrop={onDropFile}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="border-b border-white/[0.08] px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Source top products from global suppliers
              </h2>
              <p className="text-sm text-white/40">
                Describe an item, component, material, part number, BOM, or speak it aloud.
              </p>
            </div>
            <div className="hidden items-center gap-2 text-xs text-white/35 sm:flex">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
                Unified intake
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
                AI parse
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
                RFQ ready
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="rounded-[24px] border border-white/[0.08] bg-[#06060a] p-5">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe anything about product sourcing"
                className="min-h-[150px] w-full resize-none rounded-2xl border border-transparent bg-transparent text-[15px] leading-6 text-white outline-none placeholder:text-white/30"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {mode !== "voice" ? (
                  <button
                    type="button"
                    onClick={startVoiceCapture}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition",
                      isListening
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                        : "border-white/[0.08] bg-white/[0.05] text-white/70 hover:bg-white/[0.06]"
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
                    className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-white/70 hover:bg-white/[0.06]"
                  >
                    Stop voice
                  </button>
                ) : null}

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-white/70 hover:bg-white/[0.06]">
                  <Upload className="h-4 w-4" />
                  Upload file
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls,.tsv,.txt,.md,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-white/70 hover:bg-white/[0.06]">
                  <FileText className="h-4 w-4" />
                  Audio
                  <input
                    type="file"
                    className="hidden"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  />
                </label>

                {file ? (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
                    {file.name}
                  </span>
                ) : null}
                {audioFile ? (
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-indigo-300">
                    {audioFile.name}
                  </span>
                ) : null}
                {sessionToken ? (
                  <span className="rounded-full bg-white/[0.04] px-3 py-1.5 text-white/55">
                    Session linked
                  </span>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={runSubmit}
              disabled={isSubmitting || (!text.trim() && !file && !audioFile && !voiceTranscript.trim())}
              className="inline-flex min-h-[150px] w-full items-center justify-center rounded-[24px] bg-violet-500 px-5 py-4 text-white shadow-[0_16px_45px_rgba(139,92,246,0.28)] transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex flex-col items-center gap-2">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                <span className="text-sm font-medium">Analyze & continue</span>
              </div>
            </button>
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
                    ? "border-violet-500/30 bg-violet-500 text-white shadow-[0_12px_25px_rgba(139,92,246,0.18)]"
                    : "border-white/[0.08] bg-white/[0.05] text-white/70 hover:bg-white/[0.06]"
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
                    ? "bg-indigo-500 text-white shadow-[0_12px_25px_rgba(99,102,241,0.18)]"
                    : "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/15"
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
              className="rounded-2xl border border-white/[0.08] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-500/30"
            />
            <input
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              placeholder="Currency"
              className="rounded-2xl border border-white/[0.08] bg-[#06060a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-500/30"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-2xl border border-white/[0.08] bg-[#06060a] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/30"
            >
              <option value="cost">Cost priority</option>
              <option value="speed">Speed priority</option>
            </select>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {parseResult ? (
            <div className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#06060a] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Normalized intake preview</h3>
                  <p className="text-xs text-white/45">
                    {parseResult?.parsed_summary?.line_count || 0} item(s) detected • Confidence{" "}
                    {Math.round((parseResult?.confidence_score || 0) * 100)}%
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-white/45">
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1">
                    {parseResult?.input_type}
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1">
                    {parseResult?.intent}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(parseResult?.normalized_items || []).map((item, idx) => (
                  <div
                    key={`${item.item_name || item.raw_text || "item"}-${idx}`}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {item.item_name || item.raw_text}
                        </div>
                        <div className="text-xs text-white/45">
                          {item.category} • {item.material || "material missing"}
                        </div>
                      </div>
                      <div className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs text-white/65">
                        {Math.round((item.confidence || 0) * 100)}%
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-white/55">
                      Qty: {item.quantity} {item.unit || ""}
                      {item.process ? <span> • Process: {item.process}</span> : null}
                    </div>
                    {item.warnings?.length ? (
                      <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-indigo-300">
                        {item.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={runNormalize}
                  className="rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-sm text-white/75 hover:bg-white/[0.06]"
                >
                  Re-normalize
                </button>
                <button
                  type="button"
                  onClick={runSubmit}
                  className="rounded-full bg-violet-500 px-4 py-2 text-sm text-white hover:bg-violet-400"
                >
                  Open workspace
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {helperCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4">
                <div className="flex items-center gap-2 text-white">
                  <span className="rounded-full bg-white/[0.06] p-2">{card.icon}</span>
                  <div className="text-sm font-medium">{card.title}</div>
                </div>
                <p className="mt-3 text-sm text-white/45">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}