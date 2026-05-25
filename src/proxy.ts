import { type NextRequest, NextResponse } from 'next/server';

import { fetchCurrentUser } from '@/lib/api/user';
import { hasSessionToken } from '@/lib/auth';

/**
 * Proxy for handling redirecting for protected pages.
 * @param request - The NextRequest
 * @returns The NextResponse redirect or passthrough
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasSessionToken(request);

  const unprotectedRoutes = ['/buyer/browse', '/buyer/help'];
  const isProtectedBuyerRoute =
    pathname.startsWith('/buyer') && !unprotectedRoutes.includes(pathname);
  const isSellerRoute = pathname.startsWith('/seller');

  if (isProtectedBuyerRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/buyer/browse', request.url));
  }

  if (isSellerRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/become-seller', request.url));
  }

  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/login/success') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const user = await fetchCurrentUser(request);

    if (user) {
      const hasCompletedOnboarding = Boolean(
        user.name && user.address && user.city && user.state && user.country,
      );

      if (!hasCompletedOnboarding) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }

      if (user.stripeOnboardingComplete) {
        return NextResponse.redirect(new URL('/seller/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/buyer/dashboard', request.url));
      }
    }

    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware config defining the path matching.
 */
export const config = {
  matcher: ['/buyer/:path*', '/seller/:path*', '/login/success', '/login'],
};
