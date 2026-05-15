import React, { useEffect, useRef, useState } from 'react';
import { Bell, ShoppingCart, X, Package, Star, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AppNotification } from '../types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const typeIcon = (type: AppNotification['notification_type']) => {
  if (type === 'order_update') return <Package className="w-4 h-4 text-primary-500" />;
  if (type === 'reward') return <Star className="w-4 h-4 text-yellow-500" />;
  return <Tag className="w-4 h-4 text-blue-500" />;
};

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, setNotifications, markNotificationRead, markAllNotificationsRead, unreadCount, isAuthenticated } = useStore();

  // Fetch + auto-refresh every 5 s
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get<AppNotification[]>('/notifications/');
      if (Array.isArray(res.data)) setNotifications(res.data.slice(0, 20));
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
<<<<<<< HEAD
      await api.post('/api/notifications/mark-all-read/');
=======
      await api.post('/notifications/mark-all-read/');
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
      markAllNotificationsRead();
    } catch { markAllNotificationsRead(); }
  };

  const handleClickNotification = async (n: AppNotification) => {
    if (!n.is_read) {
<<<<<<< HEAD
      try { await api.post(`/api/notifications/${n.id}/read/`); } catch { /* silent */ }
=======
      try { await api.post(`/notifications/${n.id}/read/`); } catch { /* silent */ }
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
      markNotificationRead(n.id);
    }
    setOpen(false);
    if (n.order) {
      navigate(`/orders?id=${n.order}`);
    } else if (n.notification_type === 'reward') {
      navigate('/gifts');
    }
  };

  const count = unreadCount();

  return (
    <div ref={ref} className="relative">
      <button
        id="notification-bell"
        onClick={() => setOpen(o => !o)}
        className="relative p-2 md:p-3 bg-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors group"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-primary-500 transition-colors" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg"
            >
              {count > 9 ? '9+' : count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed md:absolute inset-x-4 md:inset-auto md:right-0 top-20 md:top-14 md:w-96 bg-white rounded-3xl shadow-2xl shadow-black/10 border border-slate-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-sm">Notifications</h3>
                {count > 0 && <p className="text-[10px] text-slate-400 font-medium">{count} unread</p>}
              </div>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-black text-primary-500 hover:text-primary-700 uppercase tracking-wider"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-80 divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                  <Bell className="w-10 h-10 mb-3" />
                  <p className="text-sm font-black">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleClickNotification(n)}
                    className={`w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-primary-50/30' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {typeIcon(n.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900 truncate">{n.title}</p>
                        {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-300 font-medium mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100">
              <button
                onClick={() => { navigate('/orders'); setOpen(false); }}
                className="w-full text-center text-xs font-black text-primary-500 hover:text-primary-700 uppercase tracking-wider transition-colors"
              >
                View All Orders
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
