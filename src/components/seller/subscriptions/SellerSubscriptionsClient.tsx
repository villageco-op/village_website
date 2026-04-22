'use client';

import { useEffect, useState } from 'react';

import { SellerSubscriptionCard } from './SellerSubscriptionCard';
import { SellerSubscriptionsHeader } from './SellerSubscriptionsHeader';
import { SellerSubscriptionsSkeleton } from './SellerSubscriptionsSkeleton';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePagination } from '@/hooks/usePagination';
import type { GetSubscriptionsParams, SubscriptionStatus } from '@/lib/api/generated/models';
import { useGetSubscriptions } from '@/lib/api/generated/subscriptions/subscriptions';

/**
 * The seller subscriptions page client for displaying subscriptions from buyers.
 * @returns Page displaying a list of subscription cards with filters.
 */
export default function SellerSubscriptionsClient() {
  const { page, limit, setPage, resetPage } = usePagination(12);

  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [buyerInput, setBuyerInput] = useState<string>('');
  const [productInput, setProductInput] = useState<string>('');

  const [debouncedBuyerId, setDebouncedBuyerId] = useState<string>('');
  const [debouncedProductId, setDebouncedProductId] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBuyerId(buyerInput);
      setDebouncedProductId(productInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [buyerInput, productInput]);

  useEffect(() => {
    resetPage();
  }, [statusFilter, debouncedBuyerId, debouncedProductId, resetPage]);

  const queryParams: GetSubscriptionsParams = { page, limit };
  
  if (statusFilter !== 'all') {
    queryParams.status = statusFilter;
  }
  if (debouncedBuyerId) {
    queryParams.buyerId = debouncedBuyerId;
  }
  if (debouncedProductId) {
    queryParams.productId = debouncedProductId;
  }

  const { data: response, isLoading, isError } = useGetSubscriptions(queryParams);

  if (isLoading) {
    return <SellerSubscriptionsSkeleton />;
  }

  if (isError || response?.status !== 200 || !response?.data) {
    return (
      <div className="m-8 flex h-64 items-center justify-center rounded-xl bg-destructive/10 p-8 text-destructive">
        <p className="font-heading font-bold">Failed to load your subscriptions.</p>
      </div>
    );
  }

  const subscriptions = response.data.data || [];
  const meta = response.data.meta;
  
  const activeCount = response.data.meta.activeCount || subscriptions.filter((sub) => sub.status === 'active').length;

  return (
    <div className="flex w-full flex-col p-8 pt-6">
      <SellerSubscriptionsHeader activeCount={activeCount} />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Filter by Buyer ID..."
          value={buyerInput}
          onChange={(e) => setBuyerInput(e.target.value)}
          className="max-w-xs bg-white"
        />
        <Input
          placeholder="Filter by Product ID..."
          value={productInput}
          onChange={(e) => setProductInput(e.target.value)}
          className="max-w-xs bg-white"
        />
        <Select 
          value={statusFilter} 
          onValueChange={(val) => setStatusFilter(val as SubscriptionStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-45 bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>

        {(debouncedBuyerId || debouncedProductId || statusFilter !== 'all') && (
            <Button 
              onClick={() => {
                setBuyerInput('');
                setProductInput('');
                setStatusFilter('all');
              }}
              className="text-sm font-semibold text-forest hover:underline"
              variant='ghost'
            >
              Clear filters
            </Button>
          )}
      </div>

      {/* Results Grid */}
      {subscriptions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map((subscription, i) => (
              <SellerSubscriptionCard 
              key={subscription.id} 
              subscription={subscription} 
              index={i} 
              onFilterBuyer={setBuyerInput}
              onFilterProduct={setProductInput} />
            ))}
          </div>
          
          <PaginationControls meta={meta} onPageChange={setPage} />
        </>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-forest-dark/20 bg-slate-50 text-ink-3">
          <p>No subscriptions match your current filters.</p>
        </div>
      )}
    </div>
  );
}
