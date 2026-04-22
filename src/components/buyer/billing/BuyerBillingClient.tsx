'use client';

import { useEffect, useState } from 'react';

import { BillingHeader } from './BillingHeader';
import { BillingStatsCard } from './BillingStatsCard';
import { InvoiceHistoryCard } from './InvoiceHistoryCard';

import { PaginationControls } from '@/components/ui/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { usePagination } from '@/hooks/usePagination';
import { useGetBuyerBillingSummary } from '@/lib/api/generated/buyers/buyers';
import type { GetOrdersParams, OrderStatus } from '@/lib/api/generated/models';
import { getOrders, useGetOrders } from '@/lib/api/generated/orders/orders';
import { handleDownloadBuyerInvoicesCSV } from '@/lib/csv-utils';

/**
 * The client component for the buyer billing & order history page.
 * @returns A composite view of the buyer's billing summary and past invoices.
 */
export default function BuyerBillingClient() {
  const { page, limit, setPage, resetPage } = usePagination(12);
  const [isDownloading, setIsDownloading] = useState(false);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('completed');
  const [timeframeFilter, setTimeframeFilter] = useState<string>('all');

  useEffect(() => {
    resetPage();
  }, [statusFilter, timeframeFilter, resetPage]);

  const queryParams: GetOrdersParams = {
    role: 'buyer',
    page,
    limit,
    ...(statusFilter !== 'all' && { status: statusFilter as OrderStatus }),
    ...(timeframeFilter !== 'all' && { timeframe: timeframeFilter }),
  };

  const {
    data: summaryRes,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetBuyerBillingSummary();

  const {
    data: ordersRes,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetOrders(queryParams);

  if (isSummaryLoading || isOrdersLoading) {
    return (
      <div className="flex w-full flex-col space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (
    isSummaryError ||
    isOrdersError ||
    summaryRes?.status !== 200 ||
    ordersRes?.status !== 200 ||
    !summaryRes?.data
  ) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <p className="font-heading font-bold">Failed to load billing data.</p>
      </div>
    );
  }

  const handleDownloadAll = async () => {
    const totalRecords = ordersRes?.data?.meta?.total ?? 0;
    if (totalRecords === 0) return;

    setIsDownloading(true);
    try {
      const fullRes = await getOrders({
        limit: totalRecords,
        page: 1,
        role: 'buyer',
        ...(statusFilter !== 'all' && { status: statusFilter as OrderStatus }),
        ...(timeframeFilter !== 'all' && { timeframe: timeframeFilter }),
      });

      if (fullRes.status === 200 && fullRes.data?.data) {
        handleDownloadBuyerInvoicesCSV(fullRes.data.data);
      }
    } catch (error) {
      console.error('Failed to download invoice history:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const summaryData = summaryRes.data;
  const ordersData = ordersRes.data?.data || [];
  const meta = ordersRes.data?.meta;

  return (
    <div className="flex w-full flex-col">
      <BillingHeader />
      <BillingStatsCard data={summaryData} />

      <div className="mt-8 flex flex-col">
        <InvoiceHistoryCard
          orders={ordersData}
          onDownload={handleDownloadAll}
          isDownloading={isDownloading}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          timeframeFilter={timeframeFilter}
          setTimeframeFilter={setTimeframeFilter}
        />
        {ordersData.length > 0 && <PaginationControls meta={meta} onPageChange={setPage} />}
      </div>
    </div>
  );
}
