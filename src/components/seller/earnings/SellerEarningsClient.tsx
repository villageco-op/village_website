'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { EarningsHeader } from './EarningsHeader';
import { EarningsSkeleton } from './EarningsSkeleton';
import { EarningsStatRow } from './EarningsStatRow';
import { MonthlyGoalCard } from './MonthlyGoalCard';
import { PayoutHistoryCard } from './PayoutHistoryCard';

import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/usePagination';
import {
  getSellerPayouts,
  useGetSellerEarnings,
  useGetSellerPayouts,
} from '@/lib/api/generated/sellers/sellers';
import { handleDownloadSellerPayoutsCSV } from '@/lib/csv-utils';

/**
 * The client component for the seller earnings page.
 * @returns A composite view of the seller's earnings, progress, and payout history.
 */
export default function SellerEarningsClient() {
  const { page, limit, setPage, resetPage } = usePagination(12);
  const [isDownloading, setIsDownloading] = useState(false);

  const [timeframeFilter, setTimeframeFilter] = useState<string>('all');

  useEffect(() => {
    resetPage();
  }, [timeframeFilter, resetPage]);

  const {
    data: earningsRes,
    isLoading: isEarningsLoading,
    isError: isEarningsError,
  } = useGetSellerEarnings();

  const {
    data: payoutsRes,
    isLoading: isPayoutsLoading,
    isError: isPayoutsError,
  } = useGetSellerPayouts({
    limit,
    page,
    ...(timeframeFilter !== 'all' && { timeframe: timeframeFilter }),
  });

  if (isEarningsLoading || isPayoutsLoading) {
    return <EarningsSkeleton />;
  }

  if (
    payoutsRes?.status !== 200 ||
    earningsRes?.status != 200 ||
    isEarningsError ||
    isPayoutsError ||
    !earningsRes?.data
  ) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <p className="font-heading font-bold">Failed to load earnings data.</p>
      </div>
    );
  }

  /**
   * Fetches the entire payout history and triggers the CSV download
   */
  const handleDownloadAll = async () => {
    const totalRecords = payoutsRes?.data?.meta?.total ?? 0;
    if (totalRecords === 0) return;

    setIsDownloading(true);
    try {
      const fullRes = await getSellerPayouts({
        limit: totalRecords,
        page: 1,
        ...(timeframeFilter !== 'all' && { timeframe: timeframeFilter }),
      });

      if (fullRes.status === 200 && fullRes.data?.data) {
        handleDownloadSellerPayoutsCSV(fullRes.data.data);
      }
    } catch (error) {
      console.error('Failed to download payout history:', error);
      toast.error('Failed to download payout history.');
    } finally {
      setIsDownloading(false);
    }
  };

  const earningsData = earningsRes.data;
  const payoutsData = payoutsRes?.data?.data || [];
  const meta = payoutsRes.data?.meta;

  return (
    <div className="flex w-full flex-col">
      <EarningsHeader />

      <EarningsStatRow data={earningsData} />

      <div className="mb-5 flex flex-col">
        <MonthlyGoalCard
          earnedThisMonth={earningsData.earnedThisMonth}
          monthlyGoal={earningsData.monthlyGoal}
          produceBreakdown={earningsData.amountSoldDollarsPerProduceThisMonth}
        />
      </div>

      <PayoutHistoryCard
        payouts={payoutsData}
        onDownload={handleDownloadAll}
        isDownloading={isDownloading}
        timeframeFilter={timeframeFilter}
        setTimeframeFilter={setTimeframeFilter}
      />
      <PaginationControls meta={meta} onPageChange={setPage} />
    </div>
  );
}
