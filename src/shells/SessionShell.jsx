import { useState, useEffect, useCallback } from "react";
import { Outlet, Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSession, promoteSession } from "../lib/api";
import { LoadingState, ErrorState, StatusBadge } from "../components/Shared";

export default function SessionShell() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const nav = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoting, setPromoting] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const data = await getSession(id, accessToken);
      setSession(data);
      setError(null);
    } catch (e) { setError(e); }
    finally { setLoading(false); }
  }, [id, accessToken]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  const handlePromote = async () => {
    setPromoting(true);
    try {
      const result = await promoteSession(id, accessToken);
      nav(`/project/${result.project_id}`);
    } catch (e) { setError(e); }
    setPromoting(false);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} message="Failed to load session" onRetry={fetchSession} />;
  if (!session) return <ErrorState message="Session not found" />;

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <aside className="hidden w-52 flex-col border-r border-white/[0.06] bg-black/80 backdrop-blur-2xl md:flex">
        <div className="flex h-16 items-center border-b border-white/[0.06] px-4">
          <Link to="/sessions" className="text-sm text-white/55 transition hover:text-white">← Sessions</Link>
        </div>
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <div className="text-sm font-medium text-white truncate">{session.name || "Session"}</div>
          <div className="mt-1"><StatusBadge status={session.status} /></div>
        </div>
        <div className="px-3 py-4">
          {session.status !== "PROMOTED_TO_PROJECT" && session.status !== "CLOSED" && (
            <button onClick={handlePromote} disabled={promoting} className="w-full px-3 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 disabled:opacity-50 font-medium">
              {promoting ? "Promoting..." : "Promote to Project"}
            </button>
          )}
        </div>
      </aside>
      <div className="min-w-0 flex-1 overflow-y-auto">
        <Outlet context={{ session, refetchSession: fetchSession }} />
      </div>
    </div>
  );
}
