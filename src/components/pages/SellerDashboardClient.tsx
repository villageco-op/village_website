'use client';

import { DashboardHeader } from '@/components/seller/dashboard/Dashboardheader';
import { DashboardStats } from '@/components/seller/dashboard/DashboardStats';
import { MonthlyEarningsCard } from '@/components/seller/dashboard/MonthlyEarningsCard';
import { PlotLocationCard } from '@/components/seller/dashboard/PlotLocationCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { SellerDashboardResponse } from '@/lib/api/generated/models';
import { useGetSellerDashboard } from '@/lib/api/generated/sellers/sellers';

/**
 * The client for the seller dashboard with loading and error handling.
 * @returns A page containing all the seller dashboard elements
 */
export default function SellerDashboardClient() {
  const { data: response, isLoading, isError } = useGetSellerDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !response?.data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <p className="font-heading font-bold">Failed to load dashboard data.</p>
      </div>
    );
  }

  const dashboardData: SellerDashboardResponse = response.data as SellerDashboardResponse;

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader location={dashboardData.sellerLocation} />

      <DashboardStats
        earnedThisMonth={dashboardData.earnedThisMonth}
        earnedLastMonth={dashboardData.earnedLastMonth}
        soldThisWeekLbs={dashboardData.soldThisWeekLbs}
        onTrackWithGoal={dashboardData.onTrackWithGoal}
        activeListingsCount={dashboardData.activeListingsCount}
        activeListingsNames={dashboardData.activeListingsNames}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <MonthlyEarningsCard
          earnedThisMonth={dashboardData.earnedThisMonth}
          monthlyGoal={dashboardData.monthlyGoal}
          earningsByProduce={dashboardData.earningsByProduceThisMonth}
        />
        <PlotLocationCard location={dashboardData.sellerLocation} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex w-full flex-col space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
