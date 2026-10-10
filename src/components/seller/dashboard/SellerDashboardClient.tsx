'use client';

import { MonthlyGoalCard } from '../earnings/MonthlyGoalCard';

import DashboardSkeleton from './DashboardSkeleton';
import { SellerQuickLinksCard } from './SellerQuickLinks';

import { ActiveSubscriptionsCard } from '@/components/buyer/dashboard/ActiveSubscriptionsCard';
import { UpcomingOrdersCard } from '@/components/buyer/dashboard/UpcomingOrdersCard';
import { DashboardHeader } from '@/components/seller/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/seller/dashboard/DashboardStats';
import { PageErrorState } from '@/components/ui/state-displays';
import { useGetOrders } from '@/lib/api/generated/orders/orders';
import { useGetSellerDashboard } from '@/lib/api/generated/sellers/sellers';
import { useGetSubscriptions } from '@/lib/api/generated/subscriptions/subscriptions';

/**
 * The client for the seller dashboard with loading and error handling.
 * @returns A page containing all the seller dashboard elements
 */
export default function SellerDashboardClient() {
  const {
    data: dashboardResponse,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useGetSellerDashboard();

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
    return <DashboardSkeleton />;
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

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:flex-1">
          <DashboardStats
            completedOrdersThisMonth={dashboardData.completedOrdersThisMonth}
            pendingOrders={dashboardData.pendingOrders}
            activeSubscriptions={dashboardData.activeSubscriptions}
          />
          <MonthlyGoalCard
            earnedThisMonth={dashboardData.earnedThisMonth}
            monthlyGoal={dashboardData.monthlyGoal}
            produceBreakdown={dashboardData.earningsByProduceThisMonth}
          />
        </div>

        <div className="w-full lg:w-64 xl:w-72 shrink-0">
          <SellerQuickLinksCard />
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        <UpcomingOrdersCard orders={pendingOrders} total={orderMeta.total} />
        <ActiveSubscriptionsCard subscriptions={activeSubs} total={subsMeta.total} />
      </div>
    </div>
  );
}
