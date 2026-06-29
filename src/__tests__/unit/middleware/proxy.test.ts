import type { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { hasSessionToken } from '../../../lib/auth';
import { checkOrgAuth } from '../../../middleware/checkOrgAuth';
import { checkStandardAuth } from '../../../middleware/standardAuthProxy';
import { proxy } from '../../../proxy';

vi.mock('../../../middleware/standardAuthProxy', () => ({
  checkStandardAuth: vi.fn(),
}));

vi.mock('../../../middleware/checkOrgAuth', () => ({
  checkOrgAuth: vi.fn(),
}));

vi.mock('../../../lib/auth', () => ({
  hasSessionToken: vi.fn(),
}));

describe('proxy main function', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(NextResponse, 'redirect').mockImplementation(
      (url) => ({ status: 307, headers: new Headers({ location: url.toString() }) }) as any,
    );
    vi.spyOn(NextResponse, 'rewrite').mockImplementation(
      (url) =>
        ({ status: 200, headers: new Headers({ 'x-middleware-rewrite': url.toString() }) }) as any,
    );
    vi.spyOn(NextResponse, 'next').mockImplementation(
      () => ({ status: 200, headers: new Headers() }) as any,
    );
  });

  describe('Standard Routing (No Subdomain)', () => {
    it('should fall through to NextResponse.next() when no redirect is returned', async () => {
      vi.mocked(hasSessionToken).mockReturnValue(true);
      vi.mocked(checkStandardAuth).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/buyer/browse');
      req.headers.set('host', 'localhost:3000');

      await proxy(req);

      expect(checkStandardAuth).toHaveBeenCalledWith('/buyer/browse', true, null);
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should redirect if checkStandardAuth returns a redirect path', async () => {
      vi.mocked(hasSessionToken).mockReturnValue(false);
      vi.mocked(checkStandardAuth).mockResolvedValue('/buyer/browse');

      const req = new NextRequest('http://localhost:3000/buyer/dashboard');
      req.headers.set('host', 'localhost:3000');
      req.headers.set('cookie', 'session=123'); // Set directly via header utility

      const res = await proxy(req);

      expect(checkStandardAuth).toHaveBeenCalledWith('/buyer/dashboard', false, 'session=123');
      expect(NextResponse.redirect).toHaveBeenCalled();
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/buyer/browse');
    });
  });

  describe('Subdomain / Org Routing', () => {
    it('should redirect if checkOrgAuth returns a redirect path', async () => {
      vi.mocked(hasSessionToken).mockReturnValue(false);
      vi.mocked(checkOrgAuth).mockResolvedValue('/login');

      const req = new NextRequest('http://myorg.villageco-op.com/dashboard');
      req.headers.set('host', 'myorg.villageco-op.com');

      const res = await proxy(req);

      expect(checkOrgAuth).toHaveBeenCalledWith('/dashboard', false, 'myorg');
      expect(NextResponse.redirect).toHaveBeenCalled();
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://myorg.villageco-op.com/login');
    });

    it('should rewrite the URL to /org/subdomain if not already rewritten', async () => {
      vi.mocked(hasSessionToken).mockReturnValue(true);
      vi.mocked(checkOrgAuth).mockResolvedValue(null);

      const req = new NextRequest('http://myorg.villageco-op.com/dashboard');
      req.headers.set('host', 'myorg.villageco-op.com');

      await proxy(req);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const callArg = vi.mocked(NextResponse.rewrite).mock.calls[0][0] as NextURL;
      expect(callArg.pathname).toBe('/org/myorg/dashboard');
    });

    it('should pass through via NextResponse.next() if already on the rewritten path', async () => {
      vi.mocked(hasSessionToken).mockReturnValue(true);
      vi.mocked(checkOrgAuth).mockResolvedValue(null);

      const req = new NextRequest('http://myorg.villageco-op.com/org/myorg/dashboard');
      req.headers.set('host', 'myorg.villageco-op.com');

      await proxy(req);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
    });
  });
});
