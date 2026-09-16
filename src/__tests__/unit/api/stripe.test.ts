import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import type { StripeOnboardingResponse } from '@/lib/api/generated/models';
import { fetchStripeOnboardingLink } from '@/lib/api/stripe';

describe('fetchStripeOnboardingLink', () => {
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

  it('successfully requests and returns the onboarding URL when cookies are present', async () => {
    const mockResponse: StripeOnboardingResponse = {
      url: 'https://connect.stripe.com/setup/s/mock_session_123',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => mockResponse,
    });
    vi.stubGlobal('fetch', mockFetch);

    const cookieHeader = 'authjs.session-token=fake-token';

    const result = await fetchStripeOnboardingLink(cookieHeader);

    expect(mockFetch).toHaveBeenCalledWith(NEW_BACKEND_URL + '/api/stripe/connect/onboard', {
      method: 'POST',
      headers: {
        Cookie: 'authjs.session-token=fake-token',
        Host: 'localhost:3000',
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('omits the Cookie header if no cookie is present on the incoming request', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => ({ url: 'https://connect.stripe.com/setup/s/mock_session_123' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const cookieHeader = null;

    await fetchStripeOnboardingLink(cookieHeader);

    expect(mockFetch).toHaveBeenCalledWith(NEW_BACKEND_URL + '/api/stripe/connect/onboard', {
      method: 'POST',
      headers: {
        Host: 'localhost:3000',
        'Content-Type': 'application/json',
      },
    });
  });

  it('logs a warning and returns null when the API responds with a non-200 status code', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });
    vi.stubGlobal('fetch', mockFetch);

    const cookieHeader = 'authjs.session-token=fake-token';
    const result = await fetchStripeOnboardingLink(cookieHeader);

    expect(result).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Fetch Stripe onboarding link failed with status: 401',
    );
  });

  it('catches network errors, logs them, and returns null', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockFetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));
    vi.stubGlobal('fetch', mockFetch);

    const cookieHeader = 'authjs.session-token=fake-token';
    const result = await fetchStripeOnboardingLink(cookieHeader);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
