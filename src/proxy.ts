import { type NextRequest, NextResponse } from 'next/server';

import { fetchCurrentUser } from '@/lib/api/user';
import { hasSessionToken } from '@/lib/auth';
import { hasCompletedOnboarding } from '@/lib/user-utils';

/**
 * Proxy for handling redirecting for protected pages.
 * @param request - The NextRequest
 * @returns The NextResponse redirect or passthrough
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasSessionToken(request);

  const unprotectedRoutes = ['/buyer/browse', '/buyer/help'];
  const otherProtectedRoutes = ['/orders'];
  const isProtectedBuyerRoute =
    pathname.startsWith('/buyer') && !unprotectedRoutes.includes(pathname);
  const isSellerRoute = pathname.startsWith('/seller');
  const isGeneralProtectedRoute = otherProtectedRoutes.includes(pathname);

  if (isProtectedBuyerRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/buyer/browse', request.url));
  }

  if (isSellerRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/become-seller', request.url));
  }

  if (isGeneralProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
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
      if (!hasCompletedOnboarding(user)) {
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
  matcher: ['/buyer/:path*', '/seller/:path*', '/login/success', '/login', '/orders/:path*'],
};
