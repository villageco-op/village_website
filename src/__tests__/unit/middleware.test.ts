import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { middleware } from '@/app/middleware';
import * as authLib from '@/lib/auth';

vi.mock('@/lib/auth', () => ({
  hasSessionToken: vi.fn(),
}));

describe('Middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('allows access to unprotected buyer routes without auth', () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(false);
    const req = new NextRequest('http://localhost/buyer/browse');

    const res = middleware(req);
    // NextResponse.next() doesn't set a location header
    expect(res.headers.get('location')).toBeNull();
  });

  it('redirects unauthenticated users on protected buyer routes', () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(false);
    const req = new NextRequest('http://localhost/buyer/dashboard');

    const res = middleware(req);
    // 307 is the default Next.js redirect status
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/login');
  });

  it('allows access to protected buyer routes if authenticated', () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
    const req = new NextRequest('http://localhost/buyer/dashboard');

    const res = middleware(req);
    expect(res.headers.get('location')).toBeNull();
  });

  it('redirects unauthenticated users on seller routes', () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(false);
    const req = new NextRequest('http://localhost/seller/inventory');

    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/become-seller');
  });

  it('allows access to seller routes if authenticated', () => {
    vi.spyOn(authLib, 'hasSessionToken').mockReturnValue(true);
    const req = new NextRequest('http://localhost/seller/inventory');

    const res = middleware(req);
    expect(res.headers.get('location')).toBeNull();
  });
});
