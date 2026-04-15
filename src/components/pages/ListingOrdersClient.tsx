'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ListingOrdersSkeleton } from '@/components/seller/listing-orders/ListingOrdersSkeleton';
import { ListingOrdersTable } from '@/components/seller/listing-orders/ListingOrdersTable';
import { Button } from '@/components/ui/button';
import { useGetProduceOrders } from '@/lib/api/generated/produce/produce'; // Adjust based on your actual generated path
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

  // Fetch listing details to show the title in the header
  const produceQuery = useGetProduce(id, { query: { enabled: !!id } });

  // Fetch the orders for this specific listing
  const ordersQuery = useGetProduceOrders(id, { limit: 50 }, { query: { enabled: !!id } });

  const isLoading = produceQuery.isLoading || ordersQuery.isLoading;
  const isError = produceQuery.isError || ordersQuery.isError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ListingOrdersSkeleton />
        </div>
      </div>
    );
  }

  if (isError || produceQuery.data?.status !== 200 || ordersQuery.data?.status !== 200) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-off-white p-4">
        <h2 className="mb-2 text-2xl font-bold text-deep-forest">Failed to load orders</h2>
        <p className="mb-6 text-ink-3">
          We couldn&apos;t load the orders for this listing. Please try again.
        </p>
        <Button onClick={() => router.back()}>Back to Listing</Button>
      </div>
    );
  }

  const produceTitle = produceQuery.data?.data?.title || 'Unknown Produce';
  const orders = ordersQuery.data?.data?.data || [];
  const totalOrders = ordersQuery.data?.data?.meta?.total || orders.length;

  return (
    <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Button
              variant="ghost"
              className="-ml-3 mb-2 text-ink-3 hover:bg-slate-200/50 hover:text-ink"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listing
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl font-bold text-deep-forest">Orders</h1>
            </div>
            <p className="mt-1 font-sans text-sm text-ink-3">
              Viewing all orders for <strong className="text-ink">{produceTitle}</strong>
            </p>
          </div>
        </div>

        {/* Orders Table Card */}
        <ListingOrdersTable orders={orders} totalOrders={totalOrders} />
      </div>
    </div>
  );
}
