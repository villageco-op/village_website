'use client';

import { OrderHistoryCard } from './OrderHistoryCard';
import { OrdersHeader } from './OrdersHeader';
import { OrdersSkeleton } from './OrdersSkeleton';
import { PendingOrdersCard } from './PendingOrdersCard';

import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/usePagination';
import { useGetOrders } from '@/lib/api/generated/orders/orders';

/**
 * The client component for the seller orders page.
 * @returns A composite view of pending and historical orders.
 */
export default function SellerOrdersClient() {
  const { page: pendingPage, limit: pendingLimit, setPage: pendingSetPage } = usePagination(12);
  const { page: historyPage, limit: historyLimit, setPage: historySetPage } = usePagination(12);

  const {
    data: pendingRes,
    isLoading: isPendingLoading,
    isError: isPendingError,
  } = useGetOrders({ role: 'seller', status: 'pending', limit: pendingLimit, page: pendingPage });

  const {
    data: historyRes,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetOrders({ role: 'seller', status: 'completed', timeframe: '30d', limit: historyLimit, page: historyPage });

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
  
  const pendingMeta = pendingRes?.data?.meta;
  const historyMeta = historyRes?.data?.meta;

  const pendingTotal = pendingMeta?.total || pendingOrders.length;
  const historyTotal = historyMeta?.total || historyOrders.length;

  return (
    <div className="flex w-full flex-col">
      <OrdersHeader pendingCount={pendingTotal} />

      <PendingOrdersCard orders={pendingOrders} pendingCount={pendingTotal} />
      <PaginationControls meta={pendingMeta} onPageChange={pendingSetPage} className="mt-2 mb-10" />

      <OrderHistoryCard orders={historyOrders} completedCount={historyTotal} />
      <PaginationControls meta={historyMeta} onPageChange={historySetPage} />
    </div>
  );
}
