'use client';

import { useEffect, useState } from 'react';

import { SubscriptionCard } from './SubscriptionCard';
import { SubscriptionsHeader } from './SubscriptionsHeader';
import { SubscriptionsSkeleton } from './SubscriptionsSkeleton';

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
import type { GetSubscriptionsParams, SubscriptionStatus } from '@/lib/api/generated/models';
import { useGetSubscriptions } from '@/lib/api/generated/subscriptions/subscriptions';

/**
 * The buyer subscriptions page client for displaying the user's subscriptions.
 * @returns Page displaying a list of subscription cards.
 */
export default function BuyerSubscriptionsClient() {
  const { page, limit, setPage, resetPage } = usePagination(12);

  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [sellerInput, setSellerInput] = useState<string>('');
  const [debouncedSellerId, setDebouncedSellerId] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSellerId(sellerInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [sellerInput]);

  useEffect(() => {
    resetPage();
  }, [statusFilter, debouncedSellerId, resetPage]);

  const queryParams: GetSubscriptionsParams = {
    page,
    limit,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(debouncedSellerId && { sellerId: debouncedSellerId }),
  };

  const { data: response, isLoading, isError, refetch } = useGetSubscriptions(queryParams);

  if (isLoading) {
    return <SubscriptionsSkeleton />;
  }

  if (isError || response?.status !== 200 || !response?.data) {
    return (
      <PageErrorState title="Failed to load your subscriptions." onRetry={() => void refetch()} />
    );
  }

  const subscriptions = response.data.data || [];
  const meta = response.data.meta;
  const activeCount =
    response.data.meta.activeCount || subscriptions.filter((sub) => sub.status === 'active').length;

  return (
    <div className="flex w-full flex-col p-8 pt-6">
      <SubscriptionsHeader activeCount={activeCount} />

      {/* Filters Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Filter by Seller ID..."
          value={sellerInput}
          onChange={(e) => setSellerInput(e.target.value)}
          className="max-w-xs bg-white"
        />
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as SubscriptionStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>

        {(statusFilter !== 'all' || sellerInput) && (
          <Button
            onClick={() => {
              setStatusFilter('all');
              setSellerInput('');
            }}
            className="text-sm font-semibold text-forest hover:underline"
            variant="ghost"
          >
            Clear filters
          </Button>
        )}
      </div>

      {subscriptions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map((subscription, i) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                index={i}
                onFilterSeller={setSellerInput}
              />
            ))}
          </div>
          <PaginationControls meta={meta} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState title="No subscriptions match your current filters." />
      )}
    </div>
  );
}
