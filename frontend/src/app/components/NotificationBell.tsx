import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { notificationService, NotificationItem } from '../services/notificationService';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => notificationService.getAll());
  const [hasUnread, setHasUnread] = useState<boolean>(() => notificationService.hasUnread());
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => {
      const items = notificationService.getAll();
      setNotifications(items);
      setHasUnread(items.some(i => !i.read));
    };
    // listen for changes from the service
    const onChanged = (e: Event) => handler();
    window.addEventListener('notifications:changed', onChanged as EventListener);
    return () => window.removeEventListener('notifications:changed', onChanged as EventListener);
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    function onBodyClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('click', onBodyClick);
    return () => document.removeEventListener('click', onBodyClick);
  }, [open]);

  const handleToggle = () => setOpen(!open);

  const handleClickNotification = (id: string) => {
    notificationService.markRead(id);
    // navigate or other actions could be added here in the future
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleToggle} className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100 font-semibold">Notifications</div>
          <div className="max-h-64 overflow-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-sm text-gray-600">No notifications</div>
            )}

            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClickNotification(n.id)}
                className={`w-full text-left p-3 border-b last:border-b-0 hover:bg-gray-50 ${n.read ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-900">{n.message}</div>
                  <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{n.type}</div>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-gray-100 flex items-center justify-between">
            <button
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => notificationService.markAllRead()}
            >
              Mark all as read
            </button>
            <button
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => { localStorage.removeItem('app_notifications_v1'); window.dispatchEvent(new CustomEvent('notifications:changed')); }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
