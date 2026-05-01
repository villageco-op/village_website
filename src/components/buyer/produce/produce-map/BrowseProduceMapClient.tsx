'use client';

import { useRouter } from 'next/navigation';
import { VisuallyHidden } from 'radix-ui';
import { useEffect, useState } from 'react';

import { BuyerOrderForm } from '../../new-order/OrderBuyerForm';

import { BrowseProduceMap } from './BrowseProduceMap';
import { BrowseProduceMapFilters } from './BrowseProduceMapFilters';
import { SellerProduceSidebar } from './SellerProduceSidebar';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import type { GetProduceMapParams, SellerMapGroup } from '@/lib/api/generated/models';
import { useGetProduceMap } from '@/lib/api/generated/produce/produce';

interface BrowseProduceMapClientProps {
  onViewChange: (view: 'list' | 'map') => void;
}

/**
 * The buyer browse produce page (Map View) with search and filter controls.
 * @param props - Browse produce list props
 * @param props.onViewChange - When the view toggle is clicked
 * @returns The client for the browse produce map view page
 */
export default function BrowseProduceMapClient({ onViewChange }: BrowseProduceMapClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SellerMapGroup | null>(null);

  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Use map specific params
  const [filters, setFilters] = useState<Omit<GetProduceMapParams, 'search' | 'lat' | 'lng'>>({});

  // Default to user coordinates or fallback
  const baseLat = user?.lat ?? 41.602;
  const baseLng = user?.lng ?? -87.3371;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams: GetProduceMapParams = {
    lat: baseLat,
    lng: baseLng,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...filters,
  };

  const { data: response, isLoading, isError } = useGetProduceMap(queryParams);

  if (isError || (response && response.status !== 200)) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive p-8">
        <p className="font-heading font-bold">Failed to load produce map data.</p>
      </div>
    );
  }

  const mapGroups = response?.data || [];

  return (
    <>
      <BrowseProduceMapFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
        setFilters={setFilters}
        currentView="map"
        onViewChange={onViewChange}
      />

      <div className="relative flex-1 min-h-125 w-full overflow-hidden rounded-xl border border-forest-dark/20 bg-slate-50 shadow-sm">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-deep-forest border-t-transparent" />
          </div>
        ) : mapGroups.length > 0 ? (
          <>
            <BrowseProduceMap
              baseLat={baseLat}
              baseLng={baseLng}
              mapGroups={mapGroups}
              onSelectGroup={(group) => setSelectedGroup(group)}
            />
            {selectedGroup && (
              <SellerProduceSidebar
                group={selectedGroup}
                onClose={() => setSelectedGroup(null)}
                onOrderItem={(id: string) => setSelectedProduceId(id)}
                onGrowerClick={(id: string) => router.push(`/seller/${id}`)}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-ink-3">
            <p>No produce found matching your filters in this area.</p>
          </div>
        )}
      </div>

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
