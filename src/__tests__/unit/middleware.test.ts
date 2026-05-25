import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { proxy } from '../../proxy';

import * as userApi from '@/lib/api/user';
import * as authLib from '@/lib/auth';

vi.mock('@/lib/auth', () => ({
  hasSessionToken: vi.fn(),
}));

vi.mock('@/lib/api/user', () => ({
  fetchCurrentUser: vi.fn(),
}));

describe('proxy', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('allows access to unprotected buyer routes without auth', async () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(false);
    const req = new NextRequest('http://localhost/buyer/browse');

    const res = await proxy(req);
    // NextResponse.next() doesn't set a location header
    expect(res.headers.get('location')).toBeNull();
  });

  it('redirects unauthenticated users on protected buyer routes', async () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(false);
    const req = new NextRequest('http://localhost/buyer/dashboard');

    const res = await proxy(req);
    // 307 is the default Next.js redirect status
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/buyer/browse');
  });

  it('allows access to protected buyer routes if authenticated', async () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
    const req = new NextRequest('http://localhost/buyer/dashboard');

    const res = await proxy(req);
    expect(res.headers.get('location')).toBeNull();
  });

  it('redirects unauthenticated users on seller routes', async () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(false);
    const req = new NextRequest('http://localhost/seller/inventory');

    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/become-seller');
  });

  it('allows access to seller routes if authenticated', async () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
    const req = new NextRequest('http://localhost/seller/inventory');

    const res = await proxy(req);
    expect(res.headers.get('location')).toBeNull();
  });

  describe('/login', () => {
    it('allows access to login page if unauthenticated', async () => {
      vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(false);
      const req = new NextRequest('http://localhost/login');

      const res = await proxy(req);
      expect(res.headers.get('location')).toBeNull();
    });

    it('redirects to home if already authenticated', async () => {
      vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
      const req = new NextRequest('http://localhost/login');

      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/');
    });
  });

  describe('/login/success', () => {
    it('redirects to home if unauthenticated', async () => {
      vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(false);
      const req = new NextRequest('http://localhost/login/success');

      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/');
    });

    it('redirects to onboarding if user profile fetch fails (returns null)', async () => {
      vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue(null as any);
      const req = new NextRequest('http://localhost/login/success');

      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/onboarding');
    });

    it('redirects to onboarding if authenticated user has incomplete onboarding profile data', async () => {
      vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
      // Missing address details
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue({
        name: 'Jane Doe',
        address: '',
        city: 'Madison',
        state: 'WI',
        country: 'US',
        stripeOnboardingComplete: false,
      } as any);
      const req = new NextRequest('http://localhost/login/success');

      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/onboarding');
    });

    it('redirects to seller dashboard if onboarding is complete and stripe onboarding is complete', async () => {
      vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue({
        name: 'Jane Doe',
        address: '123 Main St',
        city: 'Madison',
        state: 'WI',
        country: 'US',
        zip: 53714,
        stripeOnboardingComplete: true,
      } as any);
      const req = new NextRequest('http://localhost/login/success');

      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/seller/dashboard');
    });

    it('redirects to buyer dashboard if onboarding is complete but stripe onboarding is incomplete', async () => {
      vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
      vi.spyOn(userApi, 'fetchCurrentUser').mockResolvedValue({
        name: 'Jane Doe',
        address: '123 Main St',
        city: 'Madison',
        state: 'WI',
        country: 'US',
        zip: 53715,
        stripeOnboardingComplete: false,
      } as any);
      const req = new NextRequest('http://localhost/login/success');

      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/buyer/dashboard');
    });
  });
});
