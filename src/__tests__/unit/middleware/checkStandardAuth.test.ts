import { afterEach, describe, expect, it, vi } from 'vitest';

import * as userApi from '@/lib/api/user';
import { checkStandardAuth } from '@/middleware/standardAuthProxy';

vi.mock('@/lib/api/user', () => ({
  fetchCurrentUser: vi.fn(),
}));

describe('checkStandardAuth', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('allows access to unprotected buyer routes without auth', async () => {
    const redirect = await checkStandardAuth('/buyer/browse', '', false, null);
    expect(redirect).toBeNull();
  });

  it('redirects unauthenticated users on protected buyer routes', async () => {
    const redirect = await checkStandardAuth('/buyer', '', false, null);
    expect(redirect).toBe('/buyer/browse');
  });

  it('allows access to protected buyer routes if authenticated', async () => {
    const redirect = await checkStandardAuth('/buyer', '', true, null);
    expect(redirect).toBeNull();
  });

  it('redirects unauthenticated users on seller routes', async () => {
    const redirect = await checkStandardAuth('/seller/inventory', '', false, null);
    expect(redirect).toBe('/become-seller');
  });

  it('allows access to seller routes if authenticated', async () => {
    const redirect = await checkStandardAuth('/seller/inventory', '', true, null);
    expect(redirect).toBeNull();
  });

  it('redirects unauthenticated users on general protected routes like /orders', async () => {
    const redirect = await checkStandardAuth('/orders', '', false, null);
    expect(redirect).toBe('/login?callbackUrl=%2Forders');
  });

  it('redirects /org route to /org/clients', async () => {
    const redirect = await checkStandardAuth('/org', '', false, null);
    expect(redirect).toBe('/org/clients');
  });

  describe('/login', () => {
    it('allows access to login page if unauthenticated', async () => {
      const redirect = await checkStandardAuth('/login', '', false, null);
      expect(redirect).toBeNull();
    });

    it('redirects to already-logged-in if already authenticated', async () => {
      const redirect = await checkStandardAuth('/login', '', true, null);
      expect(redirect).toBe('/already-logged-in');
    });
  });

  describe('/login/success', () => {
    it('redirects to home if unauthenticated', async () => {
      const redirect = await checkStandardAuth('/login/success', '', false, null);
      expect(redirect).toBe('/');
    });

    it('redirects to onboarding if user profile fetch fails (returns null)', async () => {
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue(null as any);

      const redirect = await checkStandardAuth('/login/success', '', true, 'mock-cookie');
      expect(userApi.fetchCurrentUser).toHaveBeenCalledWith('mock-cookie');
      expect(redirect).toBe('/onboarding');
    });

    it('redirects to onboarding if authenticated user has incomplete onboarding profile data', async () => {
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue({
        name: 'Jane Doe',
        isOnboardingComplete: false,
      } as any);

      const redirect = await checkStandardAuth('/login/success', '', true, null);
      expect(redirect).toBe('/onboarding');
    });

    it('redirects to onboarding with org_invited query param if user has organizationId but onboarding is incomplete', async () => {
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue({
        name: 'Jane Doe',
        isOnboardingComplete: false,
        organizationId: 'org_123',
      } as any);

      const redirect = await checkStandardAuth('/login/success', '', true, null);
      expect(redirect).toBe('/onboarding?upgrade=org_invited');
    });

    it('redirects to /org/clients if onboarding is complete and user has an organizationId', async () => {
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue({
        name: 'Jane Doe',
        isOnboardingComplete: true,
        organizationId: 'org_123',
      } as any);

      const redirect = await checkStandardAuth('/login/success', '', true, null);
      expect(redirect).toBe('/org/clients');
    });

    it('redirects to seller dashboard if onboarding is complete and stripe onboarding is complete', async () => {
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue({
        name: 'Jane Doe',
        stripeOnboardingComplete: true,
        isOnboardingComplete: true,
      } as any);

      const redirect = await checkStandardAuth('/login/success', '', true, null);
      expect(redirect).toBe('/seller');
    });

    it('redirects to buyer dashboard if onboarding is complete but stripe onboarding is incomplete', async () => {
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue({
        name: 'Jane Doe',
        stripeOnboardingComplete: false,
        isOnboardingComplete: true,
      } as any);

      const redirect = await checkStandardAuth('/login/success', '', true, null);
      expect(redirect).toBe('/buyer');
    });
  });
});
