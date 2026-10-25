'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SellerListingCard } from './SellerListingCard';

import { Eyebrow } from '@/components/ui/eyebrow';
import { Input } from '@/components/ui/input';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PaginationControls } from '@/components/ui/pagination-controls';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageErrorState } from '@/components/ui/state-displays';
import { usePagination } from '@/hooks/usePagination';
import { GetProduceListSortBy } from '@/lib/api/generated/models';
import { useGetProduceList } from '@/lib/api/generated/produce/produce';

interface SellerListingsTabProps {
  sellerId: string;
  onOrderItem: (id: string) => void;
}

/**
 * The tab for viewing the sellers listings within the public profile.
 * @param props - Props for the listings tab
 * @param props.sellerId - The seller Id
 * @param props.onOrderItem - When order is clicked
 * @returns The seller listings tab component
 */
export default function SellerListingsTab({ sellerId, onOrderItem }: SellerListingsTabProps) {
  const { page, limit, setPage } = usePagination(12);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, setPage]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetProduceList({
    sellerId: sellerId,
    page,
    limit,
    search: debouncedSearch || undefined,
    sortBy: sortBy !== 'all' ? (sortBy as GetProduceListSortBy) : undefined,
  });

  if (isLoading) {
    return <LoadingSkeleton heights={['h-40', 'h-64']} />;
  }

  if (response?.status !== 200 || isError) {
    return <PageErrorState title="Failed to load listings." onRetry={() => void refetch()} />;
  }

  const listings = response?.data?.data || [];
  const meta = response?.data?.meta || { total: 0, page: 1, limit: 4, totalPages: 1 };

  return (
    <div>
      <Eyebrow>Listings</Eyebrow>

      <div className="mb-6 flex flex-wrap gap-3 w-full">
        <div className="relative flex-1 min-w-62.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
          <Input
            placeholder="Search listings..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-40">
          <Select
            value={sortBy}
            onValueChange={(val) => {
              setSortBy(val);
              setPage(1);
            }}
          >
            <SelectTrigger title="Sort By Select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Default</SelectItem>
              <SelectItem value={GetProduceListSortBy.price}>Lowest Price</SelectItem>
              <SelectItem value={GetProduceListSortBy.distance}>Nearest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {listings.length > 0 ? (
          listings.map((item) => (
            <SellerListingCard
              item={item}
              key={item.id}
              onOrderClicked={() => onOrderItem(item.id)}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-cream-dark bg-white text-ink-3">
            <p>No listings found matching your search.</p>
          </div>
        )}
      </div>

      {listings.length > 0 && (
        <div className="mt-6">
          <PaginationControls meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
