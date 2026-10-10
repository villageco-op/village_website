'use client';

import { ActiveSubscriptionsCard } from './ActiveSubscriptionsCard';
import BuyerDashboardSkeleton from './BuyerDashboardSkeleton';
import { BuyerQuickLinksCard } from './BuyerQuickLinksCard';

import { BuyerDashboardStats } from '@/components/buyer/dashboard/BuyerDashboardStats';
import { SupplyMapCard } from '@/components/buyer/dashboard/SupplyMapCard';
import { UpcomingOrdersCard } from '@/components/buyer/dashboard/UpcomingOrdersCard';
import { DashboardHeader } from '@/components/seller/dashboard/DashboardHeader';
import { PageErrorState } from '@/components/ui/state-displays';
import { useGetBuyerDashboard } from '@/lib/api/generated/buyers/buyers';
import { useGetOrders } from '@/lib/api/generated/orders/orders';
import { useGetSubscriptions } from '@/lib/api/generated/subscriptions/subscriptions';

/**
 * The client for the buyer dashboard with loading and error handling.
 * @returns A page containing all the buyer dashboard elements
 */
export default function BuyerDashboardClient() {
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
  } = useGetOrders({ role: 'buyer', status: 'pending', limit: 5 });

  const {
    data: subsResponse,
    isLoading: isSubsLoading,
    isError: isSubsError,
    refetch: refetchSubs,
  } = useGetSubscriptions({ limit: 5, status: 'active' });

  const isLoading = isDashboardLoading || isOrdersLoading || isSubsLoading;
  const isError = isDashboardError || isOrdersError || isSubsError;

  if (isLoading) {
    return <BuyerDashboardSkeleton />;
  }

  if (
    isError ||
    dashboardResponse?.status !== 200 ||
    ordersResponse?.status !== 200 ||
    subsResponse?.status !== 200
  ) {
    return (
      <PageErrorState
        title="Failed to load dashboard data."
        onRetry={() => {
          void refetchDashboard();
          void refetchOrders();
          void refetchSubs();
        }}
      />
    );
  }

  const dashboardData = dashboardResponse.data;

  const pendingOrders = ordersResponse?.data?.data || [];
  const orderMeta = ordersResponse.data.meta;

  const activeSubs = subsResponse?.data?.data || [];
  const subsMeta = subsResponse.data.meta;

  return (
    <div className="flex w-full flex-col gap-6">
      <DashboardHeader />

      <BuyerDashboardStats
        onOrderThisWeekLbs={dashboardData.onOrderThisWeekLbs}
        totalSpendThisMonth={Number(dashboardData.totalSpendThisMonth)}
        activeSubscriptions={dashboardData.activeSubscriptions}
        localGrowersSupplying={dashboardData.localGrowersSupplying}
      />

      {pendingOrders.length > 0 && (
        <div className="flex flex-col gap-6 w-full">
          <UpcomingOrdersCard orders={pendingOrders} total={orderMeta.total} />
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:flex-1">
          <SupplyMapCard localGrowersSupplying={dashboardData.localGrowersSupplying} />
        </div>

        <div className="w-full lg:w-64 xl:w-72 shrink-0">
          <BuyerQuickLinksCard />
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {pendingOrders.length === 0 && (
          <UpcomingOrdersCard orders={pendingOrders} total={orderMeta.total} />
        )}
        <ActiveSubscriptionsCard subscriptions={activeSubs} total={subsMeta.total} />
      </div>
    </div>
  );
}
