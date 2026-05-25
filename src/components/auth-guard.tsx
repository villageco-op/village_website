'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import type { User } from '@/lib/api/generated/models/user';
import { hasCompletedOnboarding } from '@/lib/user-utils';

interface AuthGuardProps {
  children: React.ReactNode;
  user: User | undefined;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

/**
 * A component wrapper for redirecting authenticated users that didn't complete basic onboarding.
 * @param props - Component props
 * @param props.children - Component children
 * @param props.user - The user object
 * @param props.status - User authentication status
 * @returns The children components
 */
export function AuthGuard({ children, user, status }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/buyer/browse');
      return;
    }

    if (user && pathname !== '/onboarding') {
      if (!hasCompletedOnboarding(user)) {
        router.replace('/onboarding');
      }
    }
  }, [user, status, pathname, router]);

  return <>{children}</>;
}
