import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useAuth } from '../../../hooks/useAuth';

import { logger } from '@/lib/logger';

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function TestQueryWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  TestQueryWrapper.displayName = 'TestQueryWrapper';

  return TestQueryWrapper;
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  it('should initialize with loading status', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

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

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

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
      json: () => Promise.resolve({}),
    } as Response);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });

    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeUndefined();
  });

  it('should handle fetch errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });

    expect(logger.error).toHaveBeenCalledWith('Failed to fetch auth session', expect.any(Error));
  });

  it('should set unauthenticated if the fetch response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Internal Server Error' }),
    } as Response);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });
  });

  describe('logout', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // @ts-expect-error - overriding window.location for testing purposes
      delete window.location;
      window.location = {
        ...originalLocation,
        href: 'http://localhost:3000/dashboard',
      } as Location & string;
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

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.status).toBe('unauthenticated');
      });

      await act(async () => {
        await result.current.logout();
      });

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

    it('should catch errors, log them, and still redirect to home if fetching CSRF fails', async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) } as Response)
        .mockResolvedValueOnce({ ok: false } as Response);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
      await waitFor(() => expect(result.current.status).toBe('unauthenticated'));

      await act(async () => {
        await result.current.logout();
      });

      expect(logger.error).toHaveBeenCalledWith('Failed to logout', expect.any(Error));
      expect(fetch).not.toHaveBeenCalledWith('/api/auth/signout', expect.any(Object));
      expect(window.location.href).toBe('/');
    });

    it('should catch errors, log them, and still redirect to home if the signout call fails', async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ csrfToken: 'token' }),
        } as Response)
        .mockRejectedValueOnce(new Error('Network error on signout'));

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
      await waitFor(() => expect(result.current.status).toBe('unauthenticated'));

      await act(async () => {
        await result.current.logout();
      });

      expect(logger.error).toHaveBeenCalledWith('Failed to logout', expect.any(Error));
      expect(window.location.href).toBe('/');
    });
  });
});
