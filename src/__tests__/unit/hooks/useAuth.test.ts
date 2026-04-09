import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuth } from '../../../hooks/useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  it('should initialize with loading status', () => {
    // We mock fetch to stay pending for this test
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAuth());

    expect(result.current.status).toBe('loading');
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeUndefined();
  });

  it('should set authenticated status when session is found', async () => {
    const mockSession = {
      user: { id: '1', name: 'John Doe', email: 'john@example.com' },
      expires: '2026-01-01T00:00:00Z',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSession),
    } as Response);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.status).toBe('authenticated');
    });

    expect(result.current.session).toEqual(mockSession);
    expect(result.current.user).toEqual(mockSession.user);
    expect(fetch).toHaveBeenCalledWith('/api/auth/session');
  });

  it('should set unauthenticated status when response is an empty object', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}), // Auth.js empty session
    } as Response);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });

    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeUndefined();
  });

  it('should handle fetch errors gracefully', async () => {
    // Suppress console.error for this test to keep logs clean
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(fetch).mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch auth session', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should set unauthenticated if the fetch response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Internal Server Error' }),
    } as Response);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });
  });
});
