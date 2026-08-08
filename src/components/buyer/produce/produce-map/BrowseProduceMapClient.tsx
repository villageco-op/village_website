'use client';

import { useRouter } from 'next/navigation';
import { VisuallyHidden } from 'radix-ui';
import { useEffect, useState } from 'react';

import { BuyerOrderForm } from '../../new-order/OrderBuyerForm';

import { BrowseProduceMap } from './BrowseProduceMap';
import { BrowseProduceMapFilters } from './BrowseProduceMapFilters';
import { SellerProduceSidebar } from './SellerProduceSidebar';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { PageErrorState } from '@/components/ui/state-displays';
import type { GetProduceMapParams, SellerMapGroup, User } from '@/lib/api/generated/models';
import { useGetProduceMap } from '@/lib/api/generated/produce/produce';

interface BrowseProduceMapClientProps {
  onViewChange: (view: 'list' | 'map') => void;
  user?: User;
}

/**
 * The buyer browse produce page (Map View) with search and filter controls.
 * @param props - Browse produce list props
 * @param props.onViewChange - When the view toggle is clicked
 * @param props.user - The user object
 * @returns The client for the browse produce map view page
 */
export default function BrowseProduceMapClient({
  onViewChange,
  user,
}: BrowseProduceMapClientProps) {
  const router = useRouter();

  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SellerMapGroup | null>(null);

  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Use map specific params
  const [filters, setFilters] = useState<Omit<GetProduceMapParams, 'search' | 'lat' | 'lng'>>({});

  const [browserCoords, setBrowserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!user && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBrowserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Map client fallback: Browser geolocation prompt declined or failed.', error);
        },
        { enableHighAccuracy: false, timeout: 30000 },
      );
    }
  }, [user]);

  // Default to user coordinates or fallback
  const baseLat = user?.lat ?? browserCoords?.lat ?? 41.602;
  const baseLng = user?.lng ?? browserCoords?.lng ?? -87.3371;

  const queryParams: GetProduceMapParams = {
    lat: baseLat,
    lng: baseLng,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...filters,
  };

  const { data: response, isLoading, isError, refetch } = useGetProduceMap(queryParams);

  if (isError || (response && response.status !== 200)) {
    return (
      <PageErrorState title="Failed to load produce map data." onRetry={() => void refetch()} />
    );
  }

  const mapGroups = response?.data || [];

  return (
    <div className="flex flex-col h-screen w-full">
      <BrowseProduceMapFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
        setFilters={setFilters}
        currentView="map"
        onViewChange={onViewChange}
      />

      <div className="relative flex-1 min-h-125 w-full pt-4 overflow-hidden rounded-xl border border-forest-dark/20 bg-slate-50 shadow-sm">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-deep-forest border-t-transparent" />
          </div>
        ) : (
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
                onGrowerClick={(id: string) => router.push(`/public-profile/${id}`)}
              />
            )}
          </>
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
    </div>
  );
}
