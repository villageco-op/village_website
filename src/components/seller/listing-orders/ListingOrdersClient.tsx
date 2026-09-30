'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ListingOrdersSkeleton } from '@/components/seller/listing-orders/ListingOrdersSkeleton';
import { ListingOrdersTable } from '@/components/seller/listing-orders/ListingOrdersTable';
import { Button } from '@/components/ui/button';
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
  const router = useRouter();

  const { page, limit, setPage } = usePagination(12);

  const produceQuery = useGetProduce(id, { query: { enabled: !!id } });

  const ordersQuery = useGetProduceOrders(id, { limit, page }, { query: { enabled: !!id } });

  const isLoading = produceQuery.isLoading || ordersQuery.isLoading;
  const isError = produceQuery.isError || ordersQuery.isError;

  if (isLoading) {
    return (
      <div className="bg-off-white">
        <div className="mx-auto">
          <ListingOrdersSkeleton />
        </div>
      </div>
    );
  }

  if (isError || produceQuery.data?.status !== 200 || ordersQuery.data?.status !== 200) {
    return (
      <PageErrorState
        title="Failed to load orders"
        description="We couldn't load the orders for this listing. Please try again."
        action={<Button onClick={() => router.back()}>Back to Listing</Button>}
      />
    );
  }

  const produceTitle = produceQuery.data?.data?.title || 'Unknown Produce';
  const orders = ordersQuery.data?.data?.data || [];

  const meta = ordersQuery.data?.data?.meta;
  const totalOrders = meta?.total || orders.length;

  return (
    <div className="bg-off-white">
      <div className="mx-auto">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Button variant="ghost" className="-ml-3 mb-2 text-ink-3" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listing
            </Button>
            <PageHeader
              title="Orders"
              subtitle={
                <>
                  Viewing all orders for <strong className="text-ink">{produceTitle}</strong>
                </>
              }
            />
          </div>
        </div>

        <ListingOrdersTable orders={orders} totalOrders={totalOrders} />
        <PaginationControls meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
