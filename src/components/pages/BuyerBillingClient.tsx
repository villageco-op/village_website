'use client';

import { BillingHeader } from '../buyer/billing/BillingHeader';
import { BillingStatsCard } from '../buyer/billing/BillingStatsCard';
import { InvoiceHistoryCard } from '../buyer/billing/InvoiceHistoryCard';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetBuyerBillingSummary } from '@/lib/api/generated/buyers/buyers';
import { useGetOrders } from '@/lib/api/generated/orders/orders';

/**
 * The client component for the buyer billing & order history page.
 * @returns A composite view of the buyer's billing summary and past invoices.
 */
export default function BuyerBillingClient() {
  const {
    data: summaryRes,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetBuyerBillingSummary();

  const {
    data: ordersRes,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetOrders({ role: 'buyer', status: 'completed', limit: 50 });

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

  const summaryData = summaryRes.data;
  const ordersData = ordersRes.data?.data || [];

  return (
    <div className="flex w-full flex-col">
      <BillingHeader />
      <BillingStatsCard data={summaryData} />
      <InvoiceHistoryCard orders={ordersData} />
    </div>
  );
}
