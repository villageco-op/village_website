'use client';

import { BuyerDashboardHeader } from '@/components/buyer/dashboard/BuyerDashboardHeader';
import { BuyerDashboardStats } from '@/components/buyer/dashboard/BuyerDashboardStats';
import { SupplyMapCard } from '@/components/buyer/dashboard/SupplyMapCard';
import { UpcomingOrdersCard } from '@/components/buyer/dashboard/UpcomingOrdersCard';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { PageErrorState } from '@/components/ui/state-displays';
import { usePagination } from '@/hooks/usePagination';
import { useGetBuyerDashboard } from '@/lib/api/generated/buyers/buyers';
import { useGetOrders } from '@/lib/api/generated/orders/orders';

/**
 * The client for the buyer dashboard with loading and error handling.
 * @returns A page containing all the buyer dashboard elements
 */
export default function BuyerDashboardClient() {
  const { page, limit, setPage } = usePagination(5);

  const {
    data: dashboardResponse,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useGetBuyerDashboard();

  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useGetOrders({ role: 'buyer', status: 'pending', limit, page });

  const isLoading = isDashboardLoading || isOrdersLoading;
  const isError = isDashboardError || isOrdersError;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || dashboardResponse?.status !== 200 || ordersResponse?.status !== 200) {
    return (
      <PageErrorState
        title="Failed to load dashboard data."
        onRetry={() => {
          void refetchDashboard();
          void refetchOrders();
        }}
      />
    );
  }

  const dashboardData = dashboardResponse.data;

  const pendingOrders = ordersResponse?.data?.data || [];
  const meta = ordersResponse.data.meta;

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
        <div className="flex flex-col">
          <UpcomingOrdersCard orders={pendingOrders} />
          <PaginationControls meta={meta} onPageChange={setPage} className="mt-2 mb-10" />
        </div>
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
