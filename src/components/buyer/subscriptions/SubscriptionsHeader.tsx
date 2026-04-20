'use client';

import { PageHeader } from '@/components/ui/page-header';

interface SubscriptionsHeaderProps {
  activeCount: number;
}

/**
 * A greeting header for the buyer subscriptions page.
 * @param props - Props for the subtitle data
 * @param props.activeCount - Active number of subscriptions
 * @returns A component displaying the title and the active subscriptions count
 */
export function SubscriptionsHeader({ activeCount }: SubscriptionsHeaderProps) {
  return (
    <PageHeader
      title="My Subscriptions"
      subtitle={`${activeCount} active subscription${activeCount !== 1 ? 's' : ''}`}
    />
  );
}
