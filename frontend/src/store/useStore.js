import { create } from 'zustand';

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    const parsed = JSON.parse(user);
    if (!parsed || parsed.name === 'undefined' || !parsed.name) return null;
    return parsed;
  } catch (err) {
    return null;
  }
};

const getInitialTheme = () => {
  try {
    const theme = localStorage.getItem('theme');
    return theme ? theme : 'dark';
  } catch (err) {
    return 'dark';
  }
};

const initialNotifications = [
  { id: '1', title: 'ANALYSIS READY', text: 'AI swarm is ready to analyze your archived lab reports.', time: '2m ago', type: 'info' },
  { id: '2', title: 'MEDICATION REMINDER', text: 'Dose scheduled: Take 1x Paracetamol in 30 minutes.', time: '30m ago', type: 'reminder' },
  { id: '3', title: 'REGISTRY SYNC', text: 'Patient profile synchronized with Central Medical Node.', time: '1h ago', type: 'sync' },
];

const getInitialNotifications = () => {
  try {
    const stored = localStorage.getItem('notifications');
    // If user has cleared all, 'stored' will be '[]'. If never set, it's null.
    if (stored !== null) return JSON.parse(stored);
    return initialNotifications;
  } catch (err) {
    return initialNotifications;
  }
};

const useStore = create((set) => ({
  user: getInitialUser(),
  theme: getInitialTheme(),
  notifications: getInitialNotifications(),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setNotifications: (notifications) => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    set({ notifications });
  },

  clearNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return { notifications: updated };
    });
  },

  clearAllNotifications: () => {
    localStorage.setItem('notifications', JSON.stringify([]));
    set({ notifications: [] });
  },

  logout: () => {
    localStorage.removeItem('mediconsult_token');
    localStorage.removeItem('user');
    // We don't remove notifications on logout so they stay "cleared" as requested
    set({ user: null });
  },
}));

export default useStore;
