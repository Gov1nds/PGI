import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useRealTimeCtx } from "./RealTimeContext";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../lib/api";

const Ctx = createContext(null);

export function useNotifications() {
  return useContext(Ctx) || { notifications: [], unreadCount: 0, markAsRead: () => {}, markAllRead: () => {} };
}

export function NotificationProvider({ children }) {
  const { user, accessToken } = useAuth();
  const { subscribe, unsubscribe } = useRealTimeCtx();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial unread on auth
  useEffect(() => {
    if (!user || !accessToken) { setNotifications([]); setUnreadCount(0); return; }
    getNotifications(accessToken, null, 20, "unread")
      .then(data => {
        const items = data.items || data || [];
        setNotifications(items);
        setUnreadCount(data.pagination?.total_count ?? items.length);
      })
      .catch(() => {});
  }, [user, accessToken]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;
    const handler = (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 50));
      setUnreadCount(prev => prev + 1);
    };
    subscribe("notification.new", handler);
    return () => unsubscribe("notification.new", handler);
  }, [user, subscribe, unsubscribe]);

  const markAsRead = useCallback(async (id) => {
    try {
      await markNotificationRead(id, accessToken);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  }, [accessToken]);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead(accessToken);
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {}
  }, [accessToken]);

  return (
    <Ctx.Provider value={{ notifications, unreadCount, markAsRead, markAllRead }}>
      {children}
    </Ctx.Provider>
  );
}
