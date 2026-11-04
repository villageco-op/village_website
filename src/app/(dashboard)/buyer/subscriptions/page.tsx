import SubscriptionsClient from '@/components/subscriptions/SubscriptionsClient';

/**
 * The buyer subscriptions page containing a list of subscriptions.
 * @returns The buyer subscriptions client
 */
export default function BuyerSubscriptions() {
  return <SubscriptionsClient role="buyer" />;
}
