'use client';

import { BuyerDashboardHeader } from '@/components/buyer/dashboard/BuyerDashboardHeader';
import { BuyerDashboardStats } from '@/components/buyer/dashboard/BuyerDashboardStats';
import { SupplyMapCard } from '@/components/buyer/dashboard/SupplyMapCard';
import { UpcomingOrdersCard } from '@/components/buyer/dashboard/UpcomingOrdersCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBuyerDashboard } from '@/lib/api/generated/buyers/buyers';
import { useGetOrders } from '@/lib/api/generated/orders/orders';

/**
 * The client for the buyer dashboard with loading and error handling.
 * @returns A page containing all the buyer dashboard elements
 */
export default function BuyerDashboardClient() {
  const {
    data: dashboardResponse,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useGetBuyerDashboard();

  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetOrders({ role: 'buyer', status: 'pending', limit: 5 });

  const isLoading = isDashboardLoading || isOrdersLoading;
  const isError = isDashboardError || isOrdersError;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || dashboardResponse?.status !== 200 || ordersResponse?.status !== 200) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <p className="font-heading font-bold">Failed to load dashboard data.</p>
      </div>
    );
  }

  const dashboardData = dashboardResponse.data;
  const pendingOrders = ordersResponse?.data?.data || [];

  return (
    <div className="flex w-full flex-col">
      <BuyerDashboardHeader />

      <BuyerDashboardStats
        onOrderThisWeekLbs={dashboardData.onOrderThisWeekLbs}
        percentChangeFromLastWeek={dashboardData.percentChangeFromLastWeek}
        totalSpendThisMonth={Number(dashboardData.totalSpendThisMonth)}
        totalSpendLastMonth={Number(dashboardData.totalSpendLastMonth)}
        activeSubscriptions={dashboardData.activeSubscriptions}
        localGrowersSupplying={dashboardData.localGrowersSupplying}
        furthestGrowerDistanceMiles={dashboardData.furthestGrowerDistanceMiles}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <UpcomingOrdersCard orders={pendingOrders} />
        <SupplyMapCard
          localGrowersSupplying={dashboardData.localGrowersSupplying}
          avgGrowerDistanceMiles={dashboardData.avgGrowerDistanceMiles}
        />
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
