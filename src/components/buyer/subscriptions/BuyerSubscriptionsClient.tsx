'use client';

import { SubscriptionCard } from './SubscriptionCard';
import { SubscriptionsHeader } from './SubscriptionsHeader';
import { SubscriptionsSkeleton } from './SubscriptionsSkeleton';

import { useGetSubscriptions } from '@/lib/api/generated/subscriptions/subscriptions'; // Adjust path if needed based on your orval setup

/**
 * The buyer subscriptions page client for displaying the user's subscriptions.
 * @returns Page displaying a list of subscription cards.
 */
export default function BuyerSubscriptionsClient() {
  const { data: response, isLoading, isError } = useGetSubscriptions();

  if (isLoading) {
    return <SubscriptionsSkeleton />;
  }

  if (isError || response?.status !== 200 || !response?.data) {
    return (
      <div className="m-8 flex h-64 items-center justify-center rounded-xl bg-destructive/10 p-8 text-destructive">
        <p className="font-heading font-bold">Failed to load your subscriptions.</p>
      </div>
    );
  }

  const subscriptions = response.data.data;

  const activeCount = subscriptions.filter((sub) => sub.status === 'active').length;

  return (
    <div className="flex w-full flex-col p-8 pt-6">
      <SubscriptionsHeader activeCount={activeCount} />

      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((subscription, i) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-forest-dark/20 bg-slate-50 text-ink-3">
          <p>You don&apos;t have any active subscriptions yet.</p>
        </div>
      )}
    </div>
  );
}
