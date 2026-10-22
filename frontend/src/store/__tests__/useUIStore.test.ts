import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../useUIStore';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      sidebarCollapsed: false,
      unreadNotificationsCount: 3,
    });
  });

  it('debe tener el estado inicial correcto', () => {
    const state = useUIStore.getState();
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.unreadNotificationsCount).toBe(3);
  });

  it('debe alternar el colapso del sidebar con toggleSidebar()', () => {
    const { toggleSidebar } = useUIStore.getState();
    
    toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);

    toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('debe permitir setear explícitamente el estado del sidebar', () => {
    const { setSidebarCollapsed } = useUIStore.getState();

    setSidebarCollapsed(true);
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);

    setSidebarCollapsed(false);
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('debe actualizar el contador de notificaciones no leídas', () => {
    const { setUnreadNotificationsCount } = useUIStore.getState();

    setUnreadNotificationsCount(10);
    expect(useUIStore.getState().unreadNotificationsCount).toBe(10);

    setUnreadNotificationsCount(0);
    expect(useUIStore.getState().unreadNotificationsCount).toBe(0);
  });
});
