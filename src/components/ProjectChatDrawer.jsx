import { useEffect, useMemo, useState } from "react";
import {
  createApproval,
  createChatThread,
  getApprovals,
  getChatMessages,
  getChatThreads,
  postChatMessage,
  approveApproval,
  rejectApproval,
} from "../lib/api";

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/[0.05] text-white/50 border-white/[0.06]",
    blue: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tones[tone] || tones.neutral}`}>{children}</span>;
}

export default function ProjectChatDrawer({ open, project, user, onClose }) {
  const projectId = project?.project_id || project?.id;

  const [threadsPayload, setThreadsPayload] = useState(null);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [approvals, setApprovals] = useState([]);

  const [threadTitle, setThreadTitle] = useState("");
  const [threadType, setThreadType] = useState("project");
  const [threadInternalOnly, setThreadInternalOnly] = useState(true);
  const [threadVendorId, setThreadVendorId] = useState("");
  const [threadRfqId, setThreadRfqId] = useState("");

  const [messageBody, setMessageBody] = useState("");
  const [messageInternalOnly, setMessageInternalOnly] = useState(true);
  const [messageType, setMessageType] = useState("message");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);

  const [approvalTitle, setApprovalTitle] = useState("");
  const [approvalDescription, setApprovalDescription] = useState("");
  const [approvalRole, setApprovalRole] = useState("manager");
  const [approvalDueAt, setApprovalDueAt] = useState("");
  const [approvalVendorId, setApprovalVendorId] = useState("");
  const [creatingApproval, setCreatingApproval] = useState(false);

  useEffect(() => {
    if (!open || !projectId) return;
    loadThreads();
    loadApprovals();
  }, [open, projectId]);

  useEffect(() => {
    if (!activeThreadId) return;
    loadMessages(activeThreadId);
  }, [activeThreadId]);

  const currentThread = useMemo(() => {
    return (threadsPayload?.threads || []).find((t) => t.id === activeThreadId) || null;
  }, [threadsPayload, activeThreadId]);

  const loadThreads = async () => {
    setThreadsLoading(true);
    try {
      const data = await getChatThreads(projectId);
      setThreadsPayload(data);
      const first = data?.threads?.[0];
      if (first && !activeThreadId) setActiveThreadId(first.id);
    } finally {
      setThreadsLoading(false);
    }
  };

  const loadApprovals = async () => {
    try {
      const data = await getApprovals(projectId);
      setApprovals(data || []);
    } catch {
      setApprovals([]);
    }
  };

  const loadMessages = async (threadId) => {
    setMessagesLoading(true);
    try {
      const data = await getChatMessages(threadId);
      setMessages(data?.messages || []);
      await loadThreads();
    } finally {
      setMessagesLoading(false);
    }
  };

  const createThread = async () => {
    if (!threadTitle.trim()) return;
    setThreadsLoading(true);
    try {
      const payload = {
        project_id: projectId,
        title: threadTitle.trim(),
        thread_type: threadType,
        is_internal_only: threadInternalOnly,
        vendor_id: threadVendorId || null,
        rfq_batch_id: threadRfqId || null,
        metadata: {
          created_from: "project_workspace",
        },
      };
      const thread = await createChatThread(payload);
      setThreadTitle("");
      setThreadVendorId("");
      setThreadRfqId("");
      setThreadType("project");
      setThreadInternalOnly(true);
      await loadThreads();
      setActiveThreadId(thread.id);
      await loadMessages(thread.id);
    } finally {
      setThreadsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!activeThreadId || !messageBody.trim()) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("thread_id", activeThreadId);
      fd.append("body", messageBody.trim());
      fd.append("message_type", messageType);
      fd.append("is_internal_only", String(messageInternalOnly));
      fd.append("metadata_json", JSON.stringify({
        source: "project_workspace",
        project_id: projectId,
      }));
      files.forEach((file) => fd.append("attachments", file));

      await postChatMessage(fd);
      setMessageBody("");
      setFiles([]);
      setMessageType("message");
      setMessageInternalOnly(true);
      await loadMessages(activeThreadId);
      await loadThreads();
    } finally {
      setSending(false);
    }
  };

  const createApproval = async () => {
    if (!approvalTitle.trim()) return;
    setCreatingApproval(true);
    try {
      await createApproval({
        project_id: projectId,
        title: approvalTitle.trim(),
        description: approvalDescription.trim() || null,
        required_role: approvalRole,
        vendor_id: approvalVendorId || null,
        due_at: approvalDueAt || null,
      });
      setApprovalTitle("");
      setApprovalDescription("");
      setApprovalRole("manager");
      setApprovalDueAt("");
      setApprovalVendorId("");
      await loadApprovals();
    } finally {
      setCreatingApproval(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex">
      <button
        aria-label="Close collaboration drawer"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="relative ml-auto h-full w-full max-w-[980px] border-l border-white/[0.06] bg-[#010409] shadow-2xl shadow-black/40 flex flex-col">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">Collaboration</h2>
            <p className="text-xs text-white/35">
              {project?.name || "Project"} · threads, vendor discussion, internal notes, approvals
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white/70 hover:bg-white/[0.08]"
          >
            Close
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 xl:grid-cols-[300px_1fr] min-h-0">
          <section className="border-r border-white/[0.06] bg-[#0b0f16] flex flex-col min-h-0">
            <div className="p-4 border-b border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45">Threads</h3>
                <Badge tone="blue">{threadsPayload?.notification_counts?.unread_messages || 0} unread</Badge>
              </div>

              <div className="space-y-2">
                <input
                  value={threadTitle}
                  onChange={(e) => setThreadTitle(e.target.value)}
                  placeholder="New thread title"
                  className="w-full rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={threadType}
                    onChange={(e) => setThreadType(e.target.value)}
                    className="rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="project">Project</option>
                    <option value="rfq">RFQ</option>
                    <option value="vendor">Vendor</option>
                    <option value="internal">Internal</option>
                    <option value="approval">Approval</option>
                  </select>
                  <label className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      checked={threadInternalOnly}
                      onChange={(e) => setThreadInternalOnly(e.target.checked)}
                    />
                    Internal only
                  </label>
                </div>
                <input
                  value={threadVendorId}
                  onChange={(e) => setThreadVendorId(e.target.value)}
                  placeholder="Vendor ID (optional)"
                  className="w-full rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                />
                <input
                  value={threadRfqId}
                  onChange={(e) => setThreadRfqId(e.target.value)}
                  placeholder="RFQ ID (optional)"
                  className="w-full rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                />
                <button
                  onClick={createThread}
                  disabled={threadsLoading || !threadTitle.trim()}
                  className="w-full rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
                >
                  {threadsLoading ? "Creating..." : "Create thread"}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {(threadsPayload?.threads || []).map((thread) => {
                const active = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition-all ${
                      active
                        ? "border-sky-500/30 bg-sky-500/10"
                        : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{thread.title}</p>
                        <p className="mt-1 text-[11px] text-white/35">
                          {thread.thread_type} · {thread.is_internal_only ? "internal" : "shared"}
                        </p>
                      </div>
                      {thread.unread_count > 0 && <Badge tone="amber">{thread.unread_count}</Badge>}
                    </div>
                    {thread.last_message && (
                      <p className="mt-2 text-xs text-white/45 line-clamp-2">
                        {thread.last_message.body}
                      </p>
                    )}
                  </button>
                );
              })}
              {threadsLoading && <p className="px-3 py-2 text-sm text-white/35">Loading threads...</p>}
            </div>

            <div className="border-t border-white/[0.06] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45 mb-3">Approvals</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {(approvals || []).map((approval) => (
                  <div key={approval.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-white">{approval.title}</p>
                      <Badge tone={approval.status === "approved" ? "green" : approval.status === "rejected" ? "red" : "amber"}>
                        {approval.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-white/35">{approval.required_role}</p>
                    {approval.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={async () => {
                            await approveApproval(approval.id, { note: "Approved from drawer" });
                            await loadApprovals();
                          }}
                          className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            await rejectApproval(approval.id, { note: "Rejected from drawer" });
                            await loadApprovals();
                          }}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-300 hover:bg-red-500/20"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {(approvals || []).length === 0 && (
                  <p className="text-sm text-white/35">No approval requests.</p>
                )}
              </div>

              <div className="mt-4 space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                <input
                  value={approvalTitle}
                  onChange={(e) => setApprovalTitle(e.target.value)}
                  placeholder="Approval title"
                  className="w-full rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                />
                <textarea
                  value={approvalDescription}
                  onChange={(e) => setApprovalDescription(e.target.value)}
                  placeholder="Approval description"
                  className="w-full min-h-20 rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={approvalRole}
                    onChange={(e) => setApprovalRole(e.target.value)}
                    className="rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="manager">Manager</option>
                    <option value="buyer">Buyer</option>
                    <option value="sourcing">Sourcing</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input
                    value={approvalDueAt}
                    onChange={(e) => setApprovalDueAt(e.target.value)}
                    placeholder="Due at (ISO)"
                    className="rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                  />
                </div>
                <input
                  value={approvalVendorId}
                  onChange={(e) => setApprovalVendorId(e.target.value)}
                  placeholder="Vendor ID (optional)"
                  className="w-full rounded-xl border border-white/[0.06] bg-[#010409] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                />
                <button
                  onClick={createApproval}
                  disabled={creatingApproval || !approvalTitle.trim()}
                  className="w-full rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  {creatingApproval ? "Creating..." : "Create approval"}
                </button>
              </div>
            </div>
          </section>

          <section className="flex flex-col min-h-0">
            {!currentThread ? (
              <div className="flex-1 grid place-items-center text-sm text-white/35">
                Select a thread to start negotiating
              </div>
            ) : (
              <>
                <div className="border-b border-white/[0.06] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{currentThread.title}</h3>
                      <p className="text-xs text-white/35">
                        {currentThread.thread_type} · {currentThread.is_internal_only ? "internal" : "shared"} · last message {fmtDate(currentThread.last_message_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge tone="blue">{currentThread.unread_count || 0} unread</Badge>
                      {currentThread.vendor_id && <Badge tone="violet">Vendor linked</Badge>}
                      {currentThread.rfq_batch_id && <Badge tone="amber">RFQ linked</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messagesLoading ? (
                    <div className="text-sm text-white/35">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="grid h-full place-items-center text-sm text-white/35">
                      No messages yet.
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[88%] rounded-2xl border p-4 ${
                          String(message.sender_user_id) === String(user?.id)
                            ? "ml-auto border-sky-500/20 bg-sky-500/10"
                            : "border-white/[0.06] bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {message.sender_name || "System"} <span className="text-xs text-white/35">{message.sender_role ? `· ${message.sender_role}` : ""}</span>
                            </p>
                            <p className="text-[11px] text-white/30">{fmtDate(message.created_at)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge tone={message.is_internal_only ? "amber" : "green"}>
                              {message.is_internal_only ? "internal" : "shared"}
                            </Badge>
                            {message.message_type !== "message" && <Badge tone="violet">{message.message_type}</Badge>}
                          </div>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-sm text-white/80">{message.body}</p>

                        {(message.attachments || []).length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((att) => (
                              <a
                                key={att.id}
                                href={att.file_url}
                                className="block rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-sky-400 hover:bg-white/[0.06]"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {att.file_name}
                              </a>
                            ))}
                          </div>
                        )}

                        {(message.read_by || []).length > 0 && (
                          <p className="mt-3 text-[11px] text-white/25">
                            Read by {message.read_by.length}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-white/[0.06] p-4 space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder="Write a message, negotiation note, or approval comment..."
                      className="min-h-24 rounded-2xl border border-white/[0.06] bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                    />
                    <div className="space-y-3">
                      <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.06] bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="message">Message</option>
                        <option value="note">Note</option>
                        <option value="approval">Approval</option>
                        <option value="system">System</option>
                      </select>

                      <label className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0b0f16] px-4 py-3 text-sm text-white/70">
                        <input
                          type="checkbox"
                          checked={messageInternalOnly}
                          onChange={(e) => setMessageInternalOnly(e.target.checked)}
                        />
                        Internal only
                      </label>
                    </div>
                  </div>

                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="block w-full text-sm text-white/55"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="blue">Approval badges live here</Badge>
                      {project?.rfq_status && <Badge tone="amber">RFQ {project.rfq_status}</Badge>}
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={sending || !messageBody.trim()}
                      className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}