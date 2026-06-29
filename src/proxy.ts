import { type NextRequest, NextResponse } from 'next/server';

import { hasSessionToken } from './lib/auth';
import { checkOrgAuth } from './middleware/checkOrgAuth';
import { checkStandardAuth } from './middleware/standardAuthProxy';

/**
 * Main app proxy. Handles auth protection and org subdomains.
 * @param request The NextRequest
 * @returns A NextResponse next, redirect or rewrite
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const hostname = request.headers.get('host') || '';
  const isAuthenticated = hasSessionToken(request);
  const cookieHeader = request.headers.get('cookie');

  const allowedDomains = ['localhost:3000', 'localhost:3001', 'villageco-op.com'];
  const isCustomDomain = !allowedDomains.some((domain) => hostname.includes(domain));

  let subdomain = '';
  if (!isCustomDomain) {
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[1] != 'com' && parts[0] != 'staging') subdomain = parts[0];
  }

  if (subdomain && subdomain !== 'www') {
    const redirectUrl = await checkOrgAuth(pathname, isAuthenticated, subdomain);
    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (!pathname.startsWith(`/org/${subdomain}`)) {
      url.pathname = `/org/${subdomain}${pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  const standardRedirect = await checkStandardAuth(pathname, isAuthenticated, cookieHeader);
  if (standardRedirect) {
    return NextResponse.redirect(new URL(standardRedirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
