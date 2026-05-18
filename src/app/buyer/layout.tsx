'use client';

import { BuyerSidebar } from '@/components/buyer/BuyerSidebar';
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
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full bg-off-white">
      <BuyerSidebar user={user} />
      <main className="flex-1 px-9 py-8">{children}</main>
    </div>
  );
}
