import { Card, CardContent } from '@/components/ui/card';

/**
 * Props for the dashboard stats component.
 */
interface DashboardStatsProps {
  completedOrdersThisMonth: number;
  pendingOrders: number;
  activeSubscriptions: number;
}

/**
 * A set of cards for displaying general seller metrics.
 * @param props - Component props
 * @param props.completedOrdersThisMonth - The number of completed orders for the current month
 * @param props.pendingOrders - The number of pending orders
 * @param props.activeSubscriptions - The number of active subscriptions
 * @returns A set of cards displaying the statistics
 */
export function DashboardStats({
  completedOrdersThisMonth,
  pendingOrders,
  activeSubscriptions,
}: DashboardStatsProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-lg bg-cream p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              {pendingOrders}
            </div>
            <div className="font-sans text-xs text-ink-3">Pending orders</div>
          </div>

          <div className="rounded-lg bg-lime-pale p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-click-green">
              {completedOrdersThisMonth}
            </div>
            <div className="font-sans text-xs text-ink-3">Orders completed this month</div>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              {activeSubscriptions}
            </div>
            <div className="font-sans text-xs text-ink-3">Active subscriptions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
