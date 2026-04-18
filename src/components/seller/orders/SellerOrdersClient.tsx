'use client';

import { OrderHistoryCard } from './OrderHistoryCard';
import { OrdersHeader } from './OrdersHeader';
import { OrdersSkeleton } from './OrdersSkeleton';
import { PendingOrdersCard } from './PendingOrdersCard';

import { useGetOrders } from '@/lib/api/generated/orders/orders';

/**
 * The client component for the seller orders page.
 * @returns A composite view of pending and historical orders.
 */
export default function SellerOrdersClient() {
  const {
    data: pendingRes,
    isLoading: isPendingLoading,
    isError: isPendingError,
  } = useGetOrders({ role: 'seller', status: 'pending', limit: 50 });

  const {
    data: historyRes,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetOrders({ role: 'seller', status: 'completed', timeframe: '30d', limit: 50 });

  if (isPendingLoading || isHistoryLoading) {
    return <OrdersSkeleton />;
  }

  if (
    isPendingError ||
    isHistoryError ||
    pendingRes?.status !== 200 ||
    historyRes?.status !== 200
  ) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <p className="font-heading font-bold">Failed to load orders data.</p>
      </div>
    );
  }

  const pendingOrders = pendingRes?.data?.data || [];
  const historyOrders = historyRes?.data?.data || [];

  const pendingTotal = pendingRes?.data?.meta?.total || pendingOrders.length;
  const historyTotal = historyRes?.data?.meta?.total || historyOrders.length;

  return (
    <div className="flex w-full flex-col">
      <OrdersHeader pendingCount={pendingTotal} />

      <PendingOrdersCard orders={pendingOrders} pendingCount={pendingTotal} />

      <OrderHistoryCard orders={historyOrders} completedCount={historyTotal} />
    </div>
  );
}
