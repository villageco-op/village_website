import { fetchCurrentUser } from '@/lib/api/user';

/**
 * Proxy for handling redirecting for protected pages.
 * @param pathname - The url pathname
 * @param isAuthenticated - Is the user authenticated
 * @param cookieHeader - The cookie header
 * @returns The redirect url
 */
export async function checkStandardAuth(
  pathname: string,
  isAuthenticated: boolean,
  cookieHeader: string | null,
) {
  const unprotectedRoutes = ['/buyer/browse', '/buyer/help'];
  const otherProtectedRoutes = ['/orders'];
  const isProtectedBuyerRoute =
    pathname.startsWith('/buyer') && !unprotectedRoutes.includes(pathname);
  const isSellerRoute = pathname.startsWith('/seller');
  const isGeneralProtectedRoute = otherProtectedRoutes.includes(pathname);

  if (isProtectedBuyerRoute && !isAuthenticated) {
    return '/buyer/browse';
  }

  if (isSellerRoute && !isAuthenticated) {
    return '/become-seller';
  }

  if (isGeneralProtectedRoute && !isAuthenticated) {
    return '/';
  }

  if (pathname === '/login' && isAuthenticated) {
    return '/';
  }

  if (pathname === '/login/success') {
    if (!isAuthenticated) {
      return '/';
    }

    const user = await fetchCurrentUser(cookieHeader);

    if (user) {
      if (!user.isOnboardingComplete) {
        return '/onboarding';
      }

      if (user.stripeOnboardingComplete) {
        return '/seller/dashboard';
      } else {
        return '/buyer/dashboard';
      }
    }

    return '/onboarding';
  }

  return null;
}
