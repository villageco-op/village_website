'use client';

import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/hooks/useAuth';

/**
 * Seller layout wrapper that persists the left sidebar
 * across all dashboard sub-pages.
 * @param props - The component props.
 * @param props.children - Inject child elements into the body.
 * @returns HTML with children and page body.
 */
export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, status } = useAuth();

  return (
    <AuthGuard user={user} status={status} requireStripeOnboarding>
      {children}
    </AuthGuard>
  );
}
