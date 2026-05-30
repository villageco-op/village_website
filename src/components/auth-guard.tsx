'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import type { User } from '@/lib/api/generated/models/user';

interface AuthGuardProps {
  children: React.ReactNode;
  user: User | undefined;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  requireStripeOnboarding?: boolean;
}

/**
 * A component wrapper for redirecting authenticated users that didn't complete basic onboarding.
 * @param props - Component props
 * @param props.children - Component children
 * @param props.user - The user object
 * @param props.status - User authentication status
 * @param props.requireStripeOnboarding - Is it required for stripe onboarding to be complete
 * @returns The children components
 */
export function AuthGuard({ children, user, status, requireStripeOnboarding }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/buyer/browse');
      return;
    }

    if (user && pathname !== '/onboarding') {
      if (!user.isOnboardingComplete) {
        router.replace('/onboarding');
      }
    }

    if (requireStripeOnboarding && !user?.stripeOnboardingComplete) {
      router.replace('/become-seller');
    }
  }, [user, status, pathname, router, requireStripeOnboarding]);

  return <>{children}</>;
}
