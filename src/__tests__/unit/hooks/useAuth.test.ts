import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

  describe('logout', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // @ts-expect-error - overriding window.location for testing purposes
      delete window.location;
      window.location = { ...originalLocation, href: '' } as Location & string;
    });

    afterEach(() => {
      window.location = originalLocation as Location & string;
    });

    it('should successfully logout and redirect to the home page', async () => {
      const mockCsrfToken = 'mock-csrf-token-123';

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ csrfToken: mockCsrfToken }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
        } as Response);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.status).toBe('unauthenticated');
      });

      await result.current.logout();

      expect(fetch).toHaveBeenCalledWith('/api/auth/csrf');

      expect(fetch).toHaveBeenCalledWith('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: expect.any(URLSearchParams),
      });

      const lastFetchCallArgs = vi.mocked(fetch).mock.calls[2][1];
      const sentParams = lastFetchCallArgs?.body as URLSearchParams;
      expect(sentParams.get('csrfToken')).toBe(mockCsrfToken);

      expect(window.location.href).toBe('/');
    });

    it('should catch errors and log them if fetching CSRF fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // 1st fetch: useAuth init, 2nd fetch: CSRF failure
      vi.mocked(fetch)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) } as Response)
        .mockResolvedValueOnce({ ok: false } as Response);

      const { result } = renderHook(() => useAuth());
      await waitFor(() => expect(result.current.status).toBe('unauthenticated'));

      await result.current.logout();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to logout', expect.any(Error));
      // Ensure it aborted before reaching the signout call or shifting location
      expect(fetch).not.toHaveBeenCalledWith('/api/auth/signout', expect.any(Object));
      expect(window.location.href).not.toBe('/');

      consoleSpy.mockRestore();
    });

    it('should catch errors and log them if the signout call fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // 1st fetch: init, 2nd fetch: CSRF success, 3rd fetch: Signout network failure
      vi.mocked(fetch)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ csrfToken: 'token' }),
        } as Response)
        .mockRejectedValueOnce(new Error('Network error on signout'));

      const { result } = renderHook(() => useAuth());
      await waitFor(() => expect(result.current.status).toBe('unauthenticated'));

      await result.current.logout();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to logout', expect.any(Error));
      expect(window.location.href).not.toBe('/');

      consoleSpy.mockRestore();
    });
  });
});
