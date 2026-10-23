import { cookies } from 'next/headers';

import BuyerSubscriptionDetailClient from '@/components/buyer/subscriptions/details/BuyerSubscriptionDetailsClient';
import SellerSubscriptionDetailClient from '@/components/seller/subscriptions/details/SellerSubscriptionDetailsClient';
import { NotFoundState } from '@/components/ui/state-displays';
import { fetchSubscriptionById } from '@/lib/api/subscription';
import { fetchCurrentUser } from '@/lib/api/user';

interface SubscriptionPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Client component that fetches and displays a specific subscription.
 * Manages states for rescheduling and canceling operations.
 * @param props - Component props
 * @param props.params - URL search params
 * @param props.params.id - The ID of the subscription
 * @returns A page for viewing subscription details with a cancel button and reschedule button
 */
export default async function SubscriptionDetailPage({ params }: SubscriptionPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [user, sub] = await Promise.all([
    fetchCurrentUser(cookieHeader),
    fetchSubscriptionById(id, cookieHeader),
  ]);

  if (!user || !sub) {
    return (
      <NotFoundState
        title="Subscription not found"
        description="We couldn't load the details for this subscription."
      />
    );
  }

  const buyerId = sub.buyer?.id;
  const sellerId = sub.seller?.id;
  const isBuyer = user.id === buyerId;
  const isSeller = user.id === sellerId;

  if (!isBuyer && !isSeller) {
    return (
      <NotFoundState
        title="Access Denied"
        description="You do not have permission to view or manage this subscription."
      />
    );
  }

  if (isBuyer) {
    return <BuyerSubscriptionDetailClient subscription={sub} />;
  }

  return <SellerSubscriptionDetailClient subscription={sub} />;
}
