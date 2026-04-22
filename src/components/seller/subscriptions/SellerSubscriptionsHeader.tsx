'use client';

import { PageHeader } from '@/components/ui/page-header';

interface SellerSubscriptionsHeaderProps {
  activeCount: number;
}

/**
 * A greeting header for the seller subscriptions page.
 * @param props - Props for the subtitle data
 * @param props.activeCount - Active number of subscriptions the seller fulfills
 * @returns A component displaying the title and the active subscriptions count
 */
export function SellerSubscriptionsHeader({ activeCount }: SellerSubscriptionsHeaderProps) {
  return (
    <PageHeader
      title="Customer Subscriptions"
      subtitle={`You are fulfilling ${activeCount} active subscription${activeCount !== 1 ? 's' : ''}`}
    />
  );
}
