import SubscriptionsClient from '@/components/subscriptions/SubscriptionsClient';

/**
 * The seller subscriptions page containing active and past subscriptions.
 * @returns The seller subscriptions client
 */
export default function SellerSubscriptions() {
  return <SubscriptionsClient role="seller" />;
}
