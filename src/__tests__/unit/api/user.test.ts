import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@/lib/api/generated/models/user';
import { fetchCurrentUser } from '@/lib/api/user';

describe('fetchCurrentUser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully fetches and returns the user profile when cookies are present', async () => {
    const mockUser: User = {
      id: 'user-123',
      name: 'Alex Developer',
      address: '123 Tech Lane',
      city: 'Madison',
      state: 'WI',
      country: 'US',
      stripeOnboardingComplete: true,
    } as any;

    // Mock global fetch for a successful 200 OK JSON response
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => mockUser,
    });
    vi.stubGlobal('fetch', mockFetch);

    const req = new NextRequest('http://localhost/dashboard');
    req.headers.set('cookie', 'authjs.session-token=fake-token');

    const result = await fetchCurrentUser(req);

    // Verify it called the correct endpoint with the forwarded Cookie header
    expect(mockFetch).toHaveBeenCalledWith('http://localhost/api/users/me', {
      method: 'GET',
      headers: { Cookie: 'authjs.session-token=fake-token' },
    });
    expect(result).toEqual(mockUser);
  });

  it('sends empty headers if no cookie is present on the incoming request', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => ({ id: 'user-123' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const req = new NextRequest('http://localhost/dashboard');
    // Notice: no cookie header is set on the request

    await fetchCurrentUser(req);

    expect(mockFetch).toHaveBeenCalledWith('http://localhost/api/users/me', {
      method: 'GET',
      headers: {},
    });
  });

  it('returns null when the API responds with a non-200 status code', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });
    vi.stubGlobal('fetch', mockFetch);

    const req = new NextRequest('http://localhost/dashboard');
    const result = await fetchCurrentUser(req);

    expect(result).toBeNull();
  });

  it('catches network errors, logs them, and returns null', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Simulate a network failure or DNS timeout
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));
    vi.stubGlobal('fetch', mockFetch);

    const req = new NextRequest('http://localhost/dashboard');
    const result = await fetchCurrentUser(req);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
