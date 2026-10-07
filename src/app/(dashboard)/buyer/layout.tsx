'use client';

import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/hooks/useAuth';

/**
 * Buyer layout wrapper that persists the left sidebar
 * across all dashboard sub-pages.
 * @param props - The component props.
 * @param props.children - Inject child elements into the body.
 * @returns HTML with children and page body.
 */
export default function BuyerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, status } = useAuth();

  return (
    <AuthGuard user={user} status={status}>
      {children}
    </AuthGuard>
  );
}
