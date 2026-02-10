import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { persist } from 'zustand/middleware';

// Global app state interface
interface AppState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // User preferences
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MMM dd, yyyy',
  itemsPerPage: 10,
  autoRefresh: false,
  refreshInterval: 30000, // 30 seconds
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications.slice(-9), // Keep only last 10 notifications
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: Date.now(),
            },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // Loading states
      globalLoading: false,
      setGlobalLoading: (globalLoading) => set({ globalLoading }),

      // User preferences
      preferences: defaultPreferences,
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        preferences: state.preferences,
      }),
      // Optimize persistence
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Clear old notifications on rehydration
          state.notifications = [];
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useTheme = () => useAppStore((state) => state.theme);
export const useSidebar = () =>
  useAppStore(
    useShallow((state) => ({
      sidebarOpen: state.sidebarOpen,
      setSidebarOpen: state.setSidebarOpen,
      toggleSidebar: state.toggleSidebar,
    }))
  );
export const useNotifications = () =>
  useAppStore(
    useShallow((state) => ({
      notifications: state.notifications,
      addNotification: state.addNotification,
      removeNotification: state.removeNotification,
      clearNotifications: state.clearNotifications,
    }))
  );
export const useGlobalLoading = () =>
  useAppStore(
    useShallow((state) => ({
      globalLoading: state.globalLoading,
      setGlobalLoading: state.setGlobalLoading,
    }))
  );
export const useUserPreferences = () =>
  useAppStore(
    useShallow((state) => ({
      preferences: state.preferences,
      updatePreferences: state.updatePreferences,
    }))
  );
