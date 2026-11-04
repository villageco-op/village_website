import OrderDetailClient from '@/components/orders/OrderDetailClient';
import { NotFoundState, PageErrorState } from '@/components/ui/state-displays';
import { fetchOrderById } from '@/lib/api/order';
import { fetchCurrentUser } from '@/lib/api/user';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Client component that fetches and displays a specific order.
 * Manages states for rescheduling and canceling operations.
 * @param props - Component props
 * @param props.params - URL search params
 * @param props.params.id - The ID of the order
 * @returns A page for viewing order details with a cancel button and reschedule button
 */
export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const [user, order] = await Promise.all([fetchCurrentUser(), fetchOrderById(id)]);

  if (!user || !order) {
    return (
      <NotFoundState
        title="Order not found"
        description="We couldn't load the details for this order."
      />
    );
  }

  const buyerId = order.buyer?.id;
  const sellerId = order.seller?.id;
  const isBuyer = user.id === buyerId;
  const isSeller = user.id === sellerId;

  if (!isBuyer && !isSeller) {
    return (
      <PageErrorState
        title="Access Denied"
        description="You do not have permission to view or manage this order."
      />
    );
  }

  return <OrderDetailClient order={order} isSeller={isSeller} />;
}
