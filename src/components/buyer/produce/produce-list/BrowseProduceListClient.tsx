'use client';

import { useRouter } from 'next/navigation';
import { VisuallyHidden } from 'radix-ui';
import { useEffect, useState } from 'react';

import { BuyerOrderForm } from '../../new-order/OrderBuyerForm';

import { BrowseProduceFilters } from './BrowseProduceFilters';
import { BrowseProduceSkeleton } from './BrowseProduceSkeleton';
import { BrowseProduceTable } from './BrowseProduceTable';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { EmptyState, PageErrorState } from '@/components/ui/state-displays';
import { usePagination } from '@/hooks/usePagination';
import type { GetProduceListParams, User } from '@/lib/api/generated/models';
import { useGetProduceList } from '@/lib/api/generated/produce/produce';

interface BrowseProduceListClientProps {
  onViewChange: (view: 'list' | 'map') => void;
  user?: User;
}

/**
 * The buyer browse produce page with search and filter controls.
 * @param props - Browse produce list props
 * @param props.onViewChange - When the view toggle is clicked
 * @param props.user - The user object
 * @returns The client for the browse produce page
 */
export default function BrowseProduceListClient({
  onViewChange,
  user,
}: BrowseProduceListClientProps) {
  const router = useRouter();
  const { page, limit, setPage, resetPage } = usePagination(20);

  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [filters, setFilters] = useState<
    Omit<GetProduceListParams, 'page' | 'limit' | 'search' | 'lat' | 'lng'>
  >({});

  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, filters, resetPage]);

  const currentLat = user?.lat ?? customCoords?.lat ?? 41.602;
  const currentLng = user?.lng ?? customCoords?.lng ?? -87.3371;

  const queryParams: GetProduceListParams = {
    page,
    limit,
    lat: currentLat,
    lng: currentLng,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...filters,
  };

  const { data: response, isLoading, isError, refetch } = useGetProduceList(queryParams);

  useEffect(() => {
    if (!user && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location retrieved from browser: ' + JSON.stringify(position));
          setCustomCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied or unavailable, using fallback coordinates.', error);
        },
        { enableHighAccuracy: false, timeout: 30000 },
      );
    }
  }, [user]);

  if (isError || (response && response.status !== 200)) {
    return (
      <PageErrorState title="Failed to load produce listings." onRetry={() => void refetch()} />
    );
  }

  const produceList = response?.data?.data || [];
  const meta = response?.data?.meta || { total: 0, limit: 0, totalPages: 0, page: 0 };

  return (
    <>
      <BrowseProduceFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
        setFilters={setFilters}
        currentView="list"
        onViewChange={onViewChange}
        onLocationChange={(lat, lng) => setCustomCoords({ lat, lng })}
        currentLocationName={user ? 'Profile Location' : undefined}
      />

      {isLoading ? (
        <BrowseProduceSkeleton />
      ) : produceList.length > 0 ? (
        <div className="space-y-4">
          <BrowseProduceTable
            produce={produceList}
            onOrderItem={(id: string) => void setSelectedProduceId(id)}
            onGrowerClick={(id: string) => void router.push(`/public-profile/${id}`)}
          />
          <PaginationControls meta={meta} onPageChange={setPage} />
        </div>
      ) : (
        <EmptyState title="No produce found matching your filters." />
      )}
      <Dialog
        open={!!selectedProduceId}
        onOpenChange={(open) => !open && setSelectedProduceId(null)}
      >
        <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
          <VisuallyHidden.Root>
            <DialogTitle>Order Form for {selectedProduceId}</DialogTitle>
            <DialogDescription>
              Fill out this form to place your order for the selected produce.
            </DialogDescription>
          </VisuallyHidden.Root>
          {selectedProduceId && (
            <BuyerOrderForm
              produceId={selectedProduceId}
              onClose={() => setSelectedProduceId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
