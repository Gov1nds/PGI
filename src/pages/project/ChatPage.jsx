import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getChatThreads, createChatThread, getChatMessages, sendChatMessage, apiCall } from "../../lib/api";
import { ChatWS } from "../../lib/chatWs";
import { EmptyState } from "../../components/Shared";

/* ─── Thread Sidebar ─── */
function ThreadSidebar({ threads, activeId, onSelect, onCreate }) {
  return (
    <div className="space-y-1">
      <button
        onClick={onCreate}
        className="w-full px-3 py-2 bg-indigo-600 text-white text-xs rounded-lg font-medium hover:bg-indigo-500 mb-2"
      >
        + New Thread
      </button>
      {threads.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`w-full text-left p-3 rounded-xl border transition ${
            activeId === t.id
              ? "bg-indigo-900/10 border-indigo-500/20"
              : "card hover:border-white/10"
          }`}
        >
          <div className="text-sm text-white truncate">{t.title || "Thread"}</div>
          <div className="text-[10px] text-white/25 mt-0.5">
            {t.thread_type || "general"} · {t.message_count || 0} msgs
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─── Message Feed ─── */
function MessageFeed({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
      {messages.map((m) => (
        <div
          key={m.id || m.temp_id}
          className={`p-3 rounded-lg text-sm ${
            m.message_type === "offer"
              ? "bg-amber-500/[0.05] border border-amber-500/15"
              : m.visibility === "vendor_visible"
              ? "bg-purple-500/[0.04] border border-purple-500/10"
              : "card"
          } ${m._sending ? "opacity-50" : ""}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-white/40 font-medium">
              {m.sender_name || m.sender_user_id?.slice(0, 8) || "System"}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded ${
                m.visibility === "internal"
                  ? "bg-zinc-800 text-zinc-500"
                  : "bg-purple-500/10 text-purple-400"
              }`}
            >
              {m.visibility}
            </span>
            {m.message_type === "offer" && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                Offer
              </span>
            )}
            {m._sending && (
              <span className="text-[9px] text-white/20">sending…</span>
            )}
            <span className="text-[9px] text-white/15 ml-auto">
              {m.created_at ? new Date(m.created_at).toLocaleTimeString() : ""}
            </span>
          </div>

          {/* Offer content */}
          {m.message_type === "offer" && m.offer_payload_json && (
            <div className="mb-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="text-xs text-white/50">
                <span className="capitalize">{m.offer_payload_json.offer_type || "price"}</span>:{" "}
                <strong className="text-white">
                  {m.offer_payload_json.proposed_value}
                </strong>
                {m.offer_payload_json.original_value && (
                  <span className="text-white/25 ml-2">
                    (was: {m.offer_payload_json.original_value})
                  </span>
                )}
              </div>
              {m.offer_status && (
                <div className={`text-[10px] mt-1 ${
                  m.offer_status === "accepted" ? "text-emerald-300" : m.offer_status === "rejected" ? "text-red-300" : "text-white/30"
                }`}>
                  {m.offer_status === "accepted" ? "✓ Accepted" : m.offer_status === "rejected" ? "✕ Rejected" : "Pending"}
                </div>
              )}
            </div>
          )}

          <div className="text-white/70">{m.content}</div>

          {/* Attachment */}
          {m.attachment_url && (
            <a href={m.attachment_url} target="_blank" rel="noopener" className="text-[11px] text-indigo-300 mt-1 inline-block">
              📎 {m.attachment_name || "Attachment"}
            </a>
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

/* ─── Offer Composer ─── */
function OfferComposer({ onSubmit, onCancel }) {
  const [type, setType] = useState("price");
  const [proposed, setProposed] = useState("");
  const [original, setOriginal] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="card p-4 border-amber-500/15 space-y-3">
      <h4 className="text-xs font-semibold text-white flex items-center gap-2">
        <span className="text-amber-300">💰</span> Make Offer
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {["price", "lead_time", "qty", "combined"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-2 py-1.5 rounded-lg text-[11px] border transition capitalize ${
              type === t ? "bg-amber-500/10 border-amber-500/20 text-amber-200" : "border-white/[0.06] text-white/30"
            }`}
          >
            {t.replace("_", " ")}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-white/30 block mb-0.5">Proposed Value</label>
          <input value={proposed} onChange={(e) => setProposed(e.target.value)} className="glass-input rounded-lg px-3 py-2 text-sm w-full" placeholder="e.g. $2.50" />
        </div>
        <div>
          <label className="text-[10px] text-white/30 block mb-0.5">Original Value</label>
          <input value={original} onChange={(e) => setOriginal(e.target.value)} className="glass-input rounded-lg px-3 py-2 text-sm w-full" placeholder="e.g. $3.00" readOnly={false} />
        </div>
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Offer note…" className="glass-textarea rounded-lg px-3 py-2 text-sm w-full resize-none" />
      <div className="flex gap-2">
        <button onClick={() => onSubmit({ offer_type: type, proposed_value: proposed, original_value: original, note })} className="px-4 py-2 bg-amber-600 text-white text-xs rounded-lg font-medium hover:bg-amber-500">
          Send Offer
        </button>
        <button onClick={onCancel} className="text-xs text-white/30 hover:text-white/60">Cancel</button>
      </div>
    </div>
  );
}

/* ─── Message Composer ─── */
function MessageComposer({ onSend, onOffer }) {
  const [msg, setMsg] = useState("");
  const [vis, setVis] = useState("internal");
  const [showOffer, setShowOffer] = useState(false);
  const fileRef = useRef(null);

  const send = () => {
    if (!msg.trim()) return;
    onSend(msg, vis);
    setMsg("");
  };

  if (showOffer) {
    return (
      <OfferComposer
        onSubmit={(offer) => {
          onOffer(offer);
          setShowOffer(false);
        }}
        onCancel={() => setShowOffer(false)}
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select value={vis} onChange={(e) => setVis(e.target.value)} className="px-2 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-white">
          <option value="internal">Internal</option>
          <option value="vendor_visible">Vendor</option>
        </select>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type a message…"
          className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/30"
        />
        <button onClick={send} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 font-medium">
          Send
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setShowOffer(true)} className="text-[11px] text-amber-300/60 hover:text-amber-200 transition">
          💰 Make Offer
        </button>
        <button onClick={() => fileRef.current?.click()} className="text-[11px] text-white/30 hover:text-white/50 transition">
          📎 Attach File
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={(e) => {
          // File upload would go through multipart API
        }} />
      </div>
    </div>
  );
}

/* ─── Main Chat Page ─── */
export default function ChatPage({ projectId }) {
  const { accessToken, user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);

  // Fetch threads
  useEffect(() => {
    getChatThreads("project", projectId, accessToken)
      .then((d) => setThreads(d.items || d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, accessToken]);

  // Load messages for active thread
  const loadMessages = useCallback(async (threadId) => {
    setActiveId(threadId);
    try {
      const d = await getChatMessages(threadId, accessToken);
      setMessages(d.items || d || []);
    } catch {
      setMessages([]);
    }
  }, [accessToken]);

  // WebSocket connection
  useEffect(() => {
    if (!activeId || !accessToken) return;

    // Close previous
    wsRef.current?.close();

    const ws = new ChatWS(activeId, accessToken);
    wsRef.current = ws;

    const unsub = ws.on((data) => {
      if (data.type === "message" || data.message_type) {
        setMessages((prev) => {
          // Remove optimistic message if present
          const filtered = prev.filter((m) => m.temp_id !== data.temp_id);
          return [...filtered, data];
        });
      }
    });

    return () => {
      unsub();
      ws.close();
    };
  }, [activeId, accessToken]);

  const createThread = async () => {
    try {
      const t = await createChatThread(
        { context_type: "project", context_id: projectId, thread_type: "general", title: "New Thread" },
        accessToken
      );
      setThreads((prev) => [t, ...prev]);
      loadMessages(t.id);
    } catch {}
  };

  const handleSend = async (content, visibility) => {
    const tempId = crypto.randomUUID();
    // Optimistic UI
    setMessages((prev) => [...prev, {
      id: tempId, temp_id: tempId, content, visibility,
      sender_user_id: user?.id, sender_name: user?.full_name || user?.email,
      created_at: new Date().toISOString(), _sending: true,
    }]);

    try {
      await sendChatMessage(
        { thread_id: activeId, content, visibility, message_type: "text" },
        accessToken
      );
    } catch {
      // Mark as failed
      setMessages((prev) => prev.map((m) => m.temp_id === tempId ? { ...m, _sending: false, _failed: true } : m));
    }
  };

  const handleOffer = async (offer) => {
    try {
      await sendChatMessage(
        {
          thread_id: activeId,
          content: offer.note || `Offer: ${offer.proposed_value}`,
          visibility: "vendor_visible",
          message_type: "offer",
          offer_payload_json: offer,
        },
        accessToken
      );
    } catch {}
  };

  if (loading) return <div className="p-6 text-xs text-white/30">Loading chat…</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-4">Chat</h2>
      <div className="grid md:grid-cols-[240px_1fr] gap-4">
        <ThreadSidebar
          threads={threads}
          activeId={activeId}
          onSelect={loadMessages}
          onCreate={createThread}
        />
        <div>
          {activeId ? (
            <div className="space-y-4">
              {/* Connection indicator */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className={`w-1.5 h-1.5 rounded-full ${wsRef.current?.connected ? "bg-emerald-400" : "bg-white/20"}`} />
                <span className="text-white/25">{wsRef.current?.connected ? "Connected" : "Connecting…"}</span>
              </div>
              <MessageFeed messages={messages} />
              <MessageComposer onSend={handleSend} onOffer={handleOffer} />
            </div>
          ) : (
            <EmptyState title="Select or create a thread" />
          )}
        </div>
      </div>
    </div>
  );
}
