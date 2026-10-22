import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it('debe iniciar sin usuario autenticado ni token', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('debe guardar usuario y token con setAuth()', () => {
    const { setAuth } = useAuthStore.getState();
    const mockUser = { email: 'admin@bandhub.com' };
    const mockToken = 'mock-jwt-token-12345';

    setAuth(mockUser, mockToken);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe(mockToken);
  });

  it('debe limpiar usuario y token con logout()', () => {
    const { setAuth, logout } = useAuthStore.getState();
    setAuth({ email: 'musico@bandhub.com' }, 'token-abc');

    expect(useAuthStore.getState().accessToken).toBe('token-abc');

    logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });
});
