import { type NextRequest, NextResponse } from 'next/server';

import { hasSessionToken } from '@/lib/auth';

/**
 * Middleware for handling redirecting for protected pages.
 * @param request - The NextRequest
 * @returns The NextResponse redirect or passthrough
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasSessionToken(request);

  const unprotectedRoutes = ['/buyer/browse', '/buyer/help'];
  const isProtectedBuyerRoute =
    pathname.startsWith('/buyer') && !unprotectedRoutes.includes(pathname);
  const isSellerRoute = pathname.startsWith('/seller');

  if (isProtectedBuyerRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isSellerRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/become-seller', request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware config defining the path matching.
 */
export const config = {
  matcher: ['/buyer/:path*', '/seller/:path*'],
};
