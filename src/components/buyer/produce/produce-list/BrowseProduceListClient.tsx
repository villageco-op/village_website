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
import { usePagination } from '@/hooks/usePagination';
import type { GetProduceListParams } from '@/lib/api/generated/models';
import { useGetProduceList } from '@/lib/api/generated/produce/produce';

interface BrowseProduceListClientProps {
  onViewChange: (view: 'list' | 'map') => void;
}

/**
 * The buyer browse produce page with search and filter controls.
 * @param props - Browse produce list props
 * @param props.onViewChange - When the view toggle is clicked
 * @returns The client for the browse produce page
 */
export default function BrowseProduceListClient({ onViewChange }: BrowseProduceListClientProps) {
  const router = useRouter();
  const { page, limit, setPage, resetPage } = usePagination(20);

  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [filters, setFilters] = useState<
    Omit<GetProduceListParams, 'page' | 'limit' | 'search' | 'lat' | 'lng'>
  >({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, filters, resetPage]);

  const queryParams: GetProduceListParams = {
    page,
    limit,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...filters,
  };

  const { data: response, isLoading, isError } = useGetProduceList(queryParams);

  if (isError || (response && response.status !== 200)) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive p-8">
        <p className="font-heading font-bold">Failed to load produce listings.</p>
      </div>
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
      />

      {isLoading ? (
        <BrowseProduceSkeleton />
      ) : produceList.length > 0 ? (
        <div className="space-y-4">
          <BrowseProduceTable
            produce={produceList}
            onOrderItem={(id: string) => void setSelectedProduceId(id)}
            onGrowerClick={(id: string) => void router.push(`/seller/${id}`)}
          />
          <PaginationControls meta={meta} onPageChange={setPage} />
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-forest-dark/20 bg-slate-50 text-ink-3">
          <p>No produce found matching your filters.</p>
        </div>
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
