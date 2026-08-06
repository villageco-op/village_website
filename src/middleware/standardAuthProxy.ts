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
        if (user.organizationId) return '/onboarding?upgrade=org_invited';
        return '/onboarding';
      }

      if (!!user.organizationId) {
        return '/org/clients';
      } else if (user.stripeOnboardingComplete) {
        return '/seller';
      } else {
        return '/buyer';
      }
    }

    return '/onboarding';
  }

  // Temporary base org redirect
  if (pathname === '/org') {
    return '/org/clients';
  }

  return null;
}
