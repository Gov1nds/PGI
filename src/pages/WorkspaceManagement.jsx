/**
 * UX-2: Workspace management page.
 * Org membership, workspace switcher, member list, role assignments.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiCall } from "../lib/api";

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/[0.05] text-white/50 border-white/[0.08]",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

const ROLE_COLORS = {
  owner: "green", admin: "blue", manager: "blue",
  buyer: "amber", sourcing: "amber", approver: "amber",
  viewer: "neutral", vendor: "neutral",
};

export default function WorkspaceManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create org form
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrg) loadWorkspaces(selectedOrg.id);
  }, [selectedOrg]);

  useEffect(() => {
    if (selectedOrg && selectedWs) loadMembers(selectedOrg.id, selectedWs.id);
  }, [selectedOrg, selectedWs]);

  async function loadOrgs() {
    setLoading(true);
    try {
      const res = await apiCall("/api/v1/organizations");
      if (res.ok) {
        const data = await res.json();
        setOrgs(data);
        if (data.length > 0 && !selectedOrg) setSelectedOrg(data[0]);
      }
    } catch (e) {
      setError("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }

  async function loadWorkspaces(orgId) {
    try {
      const res = await apiCall(`/api/v1/organizations/${orgId}/workspaces`);
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
        if (data.length > 0 && !selectedWs) setSelectedWs(data[0]);
      }
    } catch (e) { /* ignore */ }
  }

  async function loadMembers(orgId, wsId) {
    try {
      const res = await apiCall(`/api/v1/organizations/${orgId}/workspaces/${wsId}/members`);
      if (res.ok) setMembers(await res.json());
    } catch (e) { /* ignore */ }
  }

  async function handleCreateOrg(e) {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    const slug = newOrgSlug.trim() || newOrgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    try {
      const res = await apiCall("/api/v1/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOrgName.trim(), slug }),
      });
      if (res.ok) {
        const org = await res.json();
        setOrgs(prev => [...prev, org]);
        setSelectedOrg(org);
        setShowCreateOrg(false);
        setNewOrgName("");
        setNewOrgSlug("");
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.detail || "Failed to create organization");
      }
    } catch (e) {
      setError("Network error");
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedOrg || !selectedWs) return;
    setInviting(true);
    try {
      const res = await apiCall(
        `/api/v1/organizations/${selectedOrg.id}/workspaces/${selectedWs.id}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
        }
      );
      if (res.ok) {
        setInviteEmail("");
        loadMembers(selectedOrg.id, selectedWs.id);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.detail || "Failed to invite member");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setInviting(false);
    }
  }

  const inputCls = "w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-white/[0.15]";
  const selectCls = "px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none";

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Container className="py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-white/40 text-sm mt-1">Manage your organizations, teams, and access</p>
          </div>
          <button
            onClick={() => setShowCreateOrg(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#09090b] hover:bg-white/90"
          >
            + New Organization
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-300">
            {error}
            <button onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-300">✕</button>
          </div>
        )}

        {/* Create Org Form */}
        {showCreateOrg && (
          <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold mb-4">Create Organization</h3>
            <form onSubmit={handleCreateOrg} className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={newOrgName} onChange={e => setNewOrgName(e.target.value)} placeholder="Organization name" className={inputCls} required />
              <input type="text" value={newOrgSlug} onChange={e => setNewOrgSlug(e.target.value)} placeholder="Slug (auto-generated)" className={inputCls} />
              <button type="submit" className="whitespace-nowrap rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-5 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30">
                Create
              </button>
              <button type="button" onClick={() => setShowCreateOrg(false)} className="whitespace-nowrap rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm text-white/50 hover:text-white/70">
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Org + Workspace Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
              <div className="border-b border-white/[0.08] px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-white/30">Organizations</p>
              </div>
              {orgs.length === 0 && !loading && (
                <div className="p-4 text-sm text-white/30">No organizations yet</div>
              )}
              {orgs.map(org => (
                <button
                  key={org.id}
                  onClick={() => { setSelectedOrg(org); setSelectedWs(null); setMembers([]); }}
                  className={`w-full px-4 py-3 text-left text-sm border-b border-white/[0.04] transition ${
                    selectedOrg?.id === org.id ? "bg-white/[0.06] text-white" : "text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="font-medium">{org.name}</div>
                  <div className="text-[11px] text-white/30">{org.slug}</div>
                </button>
              ))}
            </div>

            {selectedOrg && workspaces.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                <div className="border-b border-white/[0.08] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-white/30">Workspaces</p>
                </div>
                {workspaces.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => setSelectedWs(ws)}
                    className={`w-full px-4 py-3 text-left text-sm border-b border-white/[0.04] transition ${
                      selectedWs?.id === ws.id ? "bg-white/[0.06] text-white" : "text-white/50 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="font-medium">{ws.name}</div>
                    <div className="text-[11px] text-white/30">{ws.member_count || 0} members</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedOrg && selectedWs ? (
              <>
                {/* Invite */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Invite Team Member</h3>
                  <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email address" className={`flex-1 ${inputCls}`} required />
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className={selectCls}>
                      <option value="viewer">Viewer</option>
                      <option value="buyer">Buyer</option>
                      <option value="sourcing">Sourcing</option>
                      <option value="approver">Approver</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button type="submit" disabled={inviting} className="whitespace-nowrap rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#09090b] hover:bg-white/90 disabled:opacity-50">
                      {inviting ? "Inviting..." : "Invite"}
                    </button>
                  </form>
                </div>

                {/* Members */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                  <div className="border-b border-white/[0.08] px-5 py-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                      Members — {selectedWs.name}
                    </h3>
                  </div>
                  {members.length === 0 ? (
                    <div className="p-5 text-sm text-white/30">No members yet</div>
                  ) : (
                    <div className="divide-y divide-white/[0.04]">
                      {members.map(m => (
                        <div key={m.id} className="flex items-center justify-between px-5 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">{m.user_name || m.invited_email || "Pending"}</div>
                            <div className="text-xs text-white/30">{m.user_email || m.invited_email || ""}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge tone={ROLE_COLORS[m.role] || "neutral"}>{m.role}</Badge>
                            <Badge tone={m.status === "active" ? "green" : "amber"}>{m.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center">
                <p className="text-white/30 text-sm">
                  {loading ? "Loading..." : "Select an organization and workspace to manage members"}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
