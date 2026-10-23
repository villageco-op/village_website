'use client';

import { ListingOrdersTable } from '@/components/seller/listing-orders/ListingOrdersTable';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { PageErrorState } from '@/components/ui/state-displays';
import { usePagination } from '@/hooks/usePagination';
import { useGetProduceOrders } from '@/lib/api/generated/produce/produce';
import { useGetProduce } from '@/lib/api/generated/produce/produce';

interface ListingOrdersClientProps {
  id: string;
}

/**
 * Client component that fetches and displays orders for a specific produce listing.
 *
 * @param props - Component props
 * @param props.id - The ID of the produce listing
 * @returns A full page view of the listing's orders
 */
export default function ListingOrdersClient({ id }: ListingOrdersClientProps) {
  const { page, limit, setPage } = usePagination(12);

  const {
    data: produceRes,
    isLoading: isProduceLoading,
    isError: isProduceError,
    refetch: refetchProduce,
  } = useGetProduce(id, { query: { enabled: !!id } });

  const {
    data: ordersRes,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useGetProduceOrders(id, { limit, page }, { query: { enabled: !!id } });

  const isLoading = isProduceLoading || isOrdersLoading;
  const isError = isProduceError || isOrdersError;

  if (isLoading) {
    return <LoadingSkeleton heights={['h-20', 'h-64']} />;
  }

  if (isError || produceRes?.status !== 200 || ordersRes?.status !== 200) {
    return (
      <PageErrorState
        title="Failed to load orders"
        description="We couldn't load the orders for this listing. Please try again."
        onRetry={() => {
          void refetchProduce();
          void refetchOrders();
        }}
      />
    );
  }

  const produceTitle = produceRes?.data?.title || 'Unknown Produce';
  const orders = ordersRes?.data?.data || [];

  const meta = ordersRes?.data?.meta;
  const totalOrders = meta?.total || orders.length;

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Orders"
        subtitle={
          <>
            Viewing all {totalOrders} orders for{' '}
            <strong className="text-ink">{produceTitle}</strong>
          </>
        }
      />

      <ListingOrdersTable orders={orders} />
      <PaginationControls meta={meta} onPageChange={setPage} />
    </div>
  );
}
