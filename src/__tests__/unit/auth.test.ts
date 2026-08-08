import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { hasSessionToken } from '@/lib/auth';

describe('hasSessionToken', () => {
  it('returns true when secure cookie is present', () => {
    const req = new NextRequest('http://localhost');
    req.cookies.set('__Secure-authjs.session-token', 'fake-token');

    expect(hasSessionToken(req)).toBe(true);
  });

  it('returns true when dev cookie is present', () => {
    const req = new NextRequest('http://localhost');
    req.cookies.set('authjs.session-token', 'fake-token');

    expect(hasSessionToken(req)).toBe(true);
  });

  it('returns false when no session cookies are present', () => {
    const req = new NextRequest('http://localhost');
    req.cookies.set('some-other-cookie', 'value');

    expect(hasSessionToken(req)).toBe(false);
  });
});
