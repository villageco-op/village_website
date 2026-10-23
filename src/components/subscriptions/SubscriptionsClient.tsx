'use client';

import { useState } from 'react';

import { SubscriptionsTable } from './SubscriptionsTable';

import { PageHeader } from '@/components/ui/page-header';
import { usePagination } from '@/hooks/usePagination';
import type {
  GetSubscriptionsParams,
  SubscriptionStatus,
  SubscriptionDetailResponse,
} from '@/lib/api/generated/models';
import { useGetSubscriptions } from '@/lib/api/generated/subscriptions/subscriptions';

interface SubscriptionClientProps {
  role: 'buyer' | 'seller';
}

/**
 * The subscriptions page with a filterable table of subscriptions.
 * @param props - Component props
 * @param props.role - The users role. Either buyer or seller.
 * @returns The subscriptions page client component.
 */
export default function SubscriptionsClient({ role }: SubscriptionClientProps) {
  const { page, limit, setPage, resetPage } = usePagination(12);

  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionDetailResponse | null>(null);

  const queryParams: GetSubscriptionsParams = { page, limit };

  if (statusFilter !== 'all') {
    queryParams.status = statusFilter;
  }

  const { data: response, isLoading, isError, refetch } = useGetSubscriptions(queryParams);

  const subscriptions = response?.status === 200 ? response.data?.data || [] : [];
  const meta = response?.status === 200 ? response.data?.meta : undefined;

  const activeCount = meta?.activeCount || 0;

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Subscriptions"
        subtitle={`You are fulfilling ${activeCount} active subscription${activeCount !== 1 ? 's' : ''}`}
      />

      <SubscriptionsTable
        subscriptions={subscriptions}
        isLoading={isLoading}
        isError={isError}
        userRole={role}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setSelectedSubscription(null);
          resetPage();
        }}
        selectedSubscription={selectedSubscription}
        setSelectedSubscription={setSelectedSubscription}
        meta={meta}
        setPage={(newPage) => {
          setPage(newPage);
          setSelectedSubscription(null);
        }}
        onRefetch={() => {
          void refetch();
          setSelectedSubscription(null);
        }}
      />
    </div>
  );
}
