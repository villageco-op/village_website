'use client';

import { EarningsHeader } from '../seller/earnings/EarningsHeader';
import { EarningsSkeleton } from '../seller/earnings/EarningsSkeleton';
import { EarningsStatRow } from '../seller/earnings/EarningsStatRow';
import { MonthlyGoalCard } from '../seller/earnings/MonthlyGoalCard';
import { PayoutHistoryCard } from '../seller/earnings/PayoutHistoryCard';

import { useGetSellerEarnings, useGetSellerPayouts } from '@/lib/api/generated/sellers/sellers';

/**
 * The client component for the seller earnings page.
 * @returns A composite view of the seller's earnings, progress, and payout history.
 */
export default function SellerEarningsClient() {
  const {
    data: earningsRes,
    isLoading: isEarningsLoading,
    isError: isEarningsError,
  } = useGetSellerEarnings();

  const {
    data: payoutsRes,
    isLoading: isPayoutsLoading,
    isError: isPayoutsError,
  } = useGetSellerPayouts({ limit: 50 });

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

  const earningsData = earningsRes.data;
  const payoutsData = payoutsRes?.data?.data || [];

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

      <PayoutHistoryCard payouts={payoutsData} />
    </div>
  );
}
