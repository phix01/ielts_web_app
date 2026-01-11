// In-app notification store and helpers (local notifications)
export type NotificationType = 'reading' | 'listening' | 'writing' | 'speaking' | 'test' | 'system';

export interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
  createdAt: string; // ISO timestamp
  read: boolean;
}

const STORAGE_KEY = 'app_notifications_v1';
const CONTENT_COUNTS_KEY = 'content_counts_v1';

function safeParse<T>(v: string | null, fallback: T): T {
  if (!v) return fallback;
  try { return JSON.parse(v) as T; } catch { return fallback; }
}

function readStorage(): NotificationItem[] {
  return safeParse<NotificationItem[]>(localStorage.getItem(STORAGE_KEY), []);
}

function writeStorage(items: NotificationItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  // notify app
  window.dispatchEvent(new CustomEvent('notifications:changed', { detail: { items } }));
}

export const notificationService = {
  getAll: (): NotificationItem[] => readStorage(),

  add: (payload: { message: string; type: NotificationType }) => {
    const items = readStorage();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: NotificationItem = {
      id,
      message: payload.message,
      type: payload.type,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [item, ...items].slice(0, 200); // cap at 200
    writeStorage(updated);
    return item;
  },

  markRead: (id: string) => {
    const items = readStorage();
    const updated = items.map(i => i.id === id ? { ...i, read: true } : i);
    writeStorage(updated);
  },

  markAllRead: () => {
    const items = readStorage();
    const updated = items.map(i => ({ ...i, read: true }));
    writeStorage(updated);
  },

  hasUnread: () => {
    const items = readStorage();
    return items.some(i => !i.read);
  },

  // Content count helpers: detect newly added content between runs
  getContentCounts: (): Record<string, number> => safeParse<Record<string, number>>(localStorage.getItem(CONTENT_COUNTS_KEY), {}),

  setContentCount: (key: string, count: number) => {
    const counts = safeParse<Record<string, number>>(localStorage.getItem(CONTENT_COUNTS_KEY), {});
    counts[key] = count;
    localStorage.setItem(CONTENT_COUNTS_KEY, JSON.stringify(counts));
  },

  checkForNewContent: (key: string, currentCount: number, friendlyName: string) => {
    const counts = safeParse<Record<string, number>>(localStorage.getItem(CONTENT_COUNTS_KEY), {});
    const prev = counts[key] || 0;
    if (currentCount > prev) {
      const added = currentCount - prev;
      const message = `New ${friendlyName} added (${added})`;
      notificationService.add({ message, type: 'system' });
    }
    // always update stored value
    notificationService.setContentCount(key, currentCount);
  }
};

// initialize storage keys if missing
(function init() {
  if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  if (!localStorage.getItem(CONTENT_COUNTS_KEY)) localStorage.setItem(CONTENT_COUNTS_KEY, JSON.stringify({}));
})();

export default notificationService;
