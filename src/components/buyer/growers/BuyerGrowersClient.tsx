'use client';

import { useEffect, useState } from 'react';

import { GrowerCard } from './GrowerCard';
import { GrowersHeader } from './GrowersHeader';
import { GrowersSkeleton } from './GrowersSkeleton';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginationControls } from '@/components/ui/pagination-controls';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState, PageErrorState } from '@/components/ui/state-displays';
import { usePagination } from '@/hooks/usePagination';
import { useGetBuyerGrowers } from '@/lib/api/generated/buyers/buyers';
import type { GetBuyerGrowersParams, GrowersResponse } from '@/lib/api/generated/models';

/**
 * The buyer growers page client for displaying the growers the buyer has ordered from.
 * @returns Page displaying a list of cards.
 */
export default function BuyerGrowersClient() {
  const { page, limit, setPage, resetPage } = usePagination(12);

  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [distanceFilter, setDistanceFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, distanceFilter, resetPage]);

  const queryParams: GetBuyerGrowersParams = {
    page,
    limit,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(distanceFilter !== 'all' && { maxDistance: Number(distanceFilter) }),
  };

  const { data: response, isLoading, isError, refetch } = useGetBuyerGrowers(queryParams);

  if (isLoading) {
    return <GrowersSkeleton />;
  }

  if (isError || response?.status !== 200 || !response?.data) {
    return <PageErrorState title="Failed to load your growers." onRetry={() => void refetch()} />;
  }

  const growersResponse: GrowersResponse = response.data;
  const growers = growersResponse.data;
  const meta = growersResponse.meta;
  const activeCount = meta?.total || growers.length;

  // Determine if all growers are in the same city for the subtitle
  const uniqueCities = growersResponse.cities || [];
  const cityText = uniqueCities.length === 1 ? `All ${uniqueCities[0]}` : 'Multiple locations';

  return (
    <div className="flex w-full flex-col p-8 pt-6">
      <GrowersHeader activeCount={activeCount} cityText={cityText} />

      {/* Filters Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by produce or grower name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs bg-white"
        />
        <Select value={distanceFilter} onValueChange={(val) => setDistanceFilter(val)}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="Filter by distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Distance</SelectItem>
            <SelectItem value="5">Within 5 miles</SelectItem>
            <SelectItem value="10">Within 10 miles</SelectItem>
            <SelectItem value="25">Within 25 miles</SelectItem>
            <SelectItem value="50">Within 50 miles</SelectItem>
          </SelectContent>
        </Select>

        {(distanceFilter !== 'all' || searchInput) && (
          <Button
            onClick={() => {
              setDistanceFilter('all');
              setSearchInput('');
            }}
            className="text-sm font-semibold text-forest hover:underline"
            variant="ghost"
          >
            Clear filters
          </Button>
        )}
      </div>

      {growers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {growers.map((grower, i) => (
            <GrowerCard key={grower.sellerId} grower={grower} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState title="You haven't ordered from any local growers yet." />
      )}
      <PaginationControls meta={meta} onPageChange={setPage} />
    </div>
  );
}
