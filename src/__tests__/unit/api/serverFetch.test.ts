import { cookies, headers } from 'next/headers';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { serverFetch } from '@/lib/api/server-fetch';
import { logger } from '@/lib/logger';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('serverFetch', () => {
  const originalBackendUrl = process.env.BACKEND_URL;
  const NEW_BACKEND_URL = 'http://localhost:3000';

  beforeAll(() => {
    process.env.BACKEND_URL = NEW_BACKEND_URL;
  });

  afterAll(() => {
    process.env.BACKEND_URL = originalBackendUrl;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully fetches and returns data when using an explicit cookie override and E2E header', async () => {
    const mockData = { id: 'test-123', name: 'Success' };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });
    vi.stubGlobal('fetch', mockFetch);

    vi.mocked(headers).mockResolvedValue({
      get: vi.fn().mockImplementation((key) => {
        if (key === 'x-e2e-neon-db-url') return 'postgres://e2e-test-db';
        return null;
      }),
    } as any);

    const result = await serverFetch(
      '/api/test-endpoint',
      { method: 'GET' },
      'authjs.session-token=explicit-token',
    );

    expect(mockFetch).toHaveBeenCalledWith(
      NEW_BACKEND_URL + '/api/test-endpoint',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Cookie: 'authjs.session-token=explicit-token',
          'x-e2e-neon-db-url': 'postgres://e2e-test-db',
          Host: 'localhost:3000',
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(result).toEqual(mockData);
  });

  it('automatically falls back to next/headers and next/cookies when no override is provided', async () => {
    const mockData = { success: true };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });
    vi.stubGlobal('fetch', mockFetch);

    vi.mocked(headers).mockResolvedValue({
      get: vi.fn().mockReturnValue('postgres://auto-e2e-db'),
    } as any);

    vi.mocked(cookies).mockResolvedValue({
      toString: vi.fn().mockReturnValue('authjs.session-token=auto-token'),
    } as any);

    const result = await serverFetch('/api/auto-fallback');

    expect(mockFetch).toHaveBeenCalledWith(
      NEW_BACKEND_URL + '/api/auto-fallback',
      expect.objectContaining({
        headers: expect.objectContaining({
          Cookie: 'authjs.session-token=auto-token',
          'x-e2e-neon-db-url': 'postgres://auto-e2e-db',
        }),
      }),
    );
    expect(result).toEqual(mockData);
  });

  it('gracefully omits Cookie and E2E headers when none are available', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'ok' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    vi.mocked(headers).mockResolvedValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    vi.mocked(cookies).mockRejectedValue(new Error('No cookies context'));

    await serverFetch('/api/no-auth');

    const calledHeaders = mockFetch.mock.calls[0][1].headers;
    expect(calledHeaders).not.toHaveProperty('Cookie');
    expect(calledHeaders).not.toHaveProperty('x-e2e-neon-db-url');
    expect(calledHeaders).toMatchObject({
      Host: 'localhost:3000',
      'Content-Type': 'application/json',
    });
  });

  it('logs a warning and returns null when the API responds with a non-ok status code', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });
    vi.stubGlobal('fetch', mockFetch);

    vi.mocked(headers).mockResolvedValue({ get: vi.fn() } as any);
    vi.mocked(cookies).mockResolvedValue({ toString: vi.fn() } as any);

    const result = await serverFetch('/api/not-found');

    expect(result).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith('Server fetch returned non-ok status', {
      status: 404,
      endpoint: '/api/not-found',
    });
  });

  it('catches network/rejection errors, logs them, and returns null', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network failure'));
    vi.stubGlobal('fetch', mockFetch);

    vi.mocked(headers).mockResolvedValue({ get: vi.fn() } as any);
    vi.mocked(cookies).mockResolvedValue({ toString: vi.fn() } as any);

    const result = await serverFetch('/api/error-endpoint');

    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      'Error executing server-side fetch',
      expect.objectContaining({ endpoint: '/api/error-endpoint' }),
    );
  });
});
