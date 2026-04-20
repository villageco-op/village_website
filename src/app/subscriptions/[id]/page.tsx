import SubscriptionDetailClient from '@/components/buyer/subscriptions/details/SubscriptionDetailsClient';

/**
 * The view specific subscription page.
 * Accessible by both the buyer and seller of the subscription.
 *
 * @param props - The URL parameters containing the subscription ID
 * @param props.params - The parameters from the URL
 * @param props.params.id - The subscription ID
 * @returns The subscription detail client component
 */
export default function SubscriptionDetailPage({ params }: { params: { id: string } }) {
  return <SubscriptionDetailClient id={params.id} />;
}
