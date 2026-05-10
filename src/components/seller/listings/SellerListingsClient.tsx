'use client';

import { AddNewListingCard } from './AddNewListingCard';
import { ListingCard } from './ListingCard';
import { ListingsHeader } from './ListingsHeader';
import { ListingsSkeleton } from './ListingsSkeleton';

import { PaginationControls } from '@/components/ui/pagination-controls';
import { PageErrorState } from '@/components/ui/state-displays';
import { usePagination } from '@/hooks/usePagination';
import { useGetSellerListings } from '@/lib/api/generated/produce/produce';

/**
 * The client component for the seller listings page.
 * @returns A component with seller listing cards and buttons for adding listings.
 */
export default function SellerListingsClient() {
  const { page, limit, setPage } = usePagination(12);
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetSellerListings({ status: 'active', limit, page });

  if (isLoading) {
    return <ListingsSkeleton />;
  }

  if (isError || response?.status !== 200) {
    return <PageErrorState title="Failed to load listings data." onRetry={() => void refetch()} />;
  }

  const listings = response?.data?.data || [];
  const meta = response?.data?.meta;
  const activeCount = meta.total || listings.filter((item) => item.status === 'active').length;

  return (
    <div className="flex w-full flex-col">
      <ListingsHeader activeCount={activeCount} />

      {/* 3-Column Grid */}
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((produce) => (
          <ListingCard key={produce.id} produce={produce} />
        ))}
        <AddNewListingCard />
      </div>
      <PaginationControls meta={meta} onPageChange={setPage} />
    </div>
  );
}
