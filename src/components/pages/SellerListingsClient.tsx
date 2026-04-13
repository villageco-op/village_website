'use client';

import { AddNewListingCard } from '../seller/listings/AddNewListingCard';
import { ListingCard } from '../seller/listings/ListingCard';
import { ListingsHeader } from '../seller/listings/ListingsHeader';
import { ListingsSkeleton } from '../seller/listings/ListingsSkeleton';

import { useGetSellerListings } from '@/lib/api/generated/produce/produce';

/**
 * The client component for the seller listings page.
 * @returns A component with seller listing cards and buttons for adding listings.
 */
export default function SellerListingsClient() {
  const { data: response, isLoading, isError } = useGetSellerListings({ status: 'active' });

  if (isLoading) {
    return <ListingsSkeleton />;
  }

  if (isError || response?.status !== 200) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <p className="font-heading font-bold">Failed to load listings data.</p>
      </div>
    );
  }

  const listings = response?.data?.data || [];
  const activeCount = listings.filter((item) => item.status === 'active').length;

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
    </div>
  );
}
