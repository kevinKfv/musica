import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: (count: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
      unreadNotificationsCount: 3,
      setUnreadNotificationsCount: (count: number) => set({ unreadNotificationsCount: count }),
    }),
    {
      name: 'bandhub-ui-storage',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
