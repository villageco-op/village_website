import { Card, CardContent } from '@/components/ui/card';

/**
 * Props for the buyer dashboard stats component.
 */
interface BuyerDashboardStatsProps {
  onOrderThisWeekLbs: number;
  totalSpendThisMonth: number;
  activeSubscriptions: number;
  localGrowersSupplying: number;
}

/**
 * A set of cards for displaying general buyer metrics.
 * @param props - The props for the various stats
 * @param props.onOrderThisWeekLbs - Total weight (lbs) of produce ordered this week by the buyer
 * @param props.totalSpendThisMonth - The dollar amount spent by the buyer in the current calendar month
 * @param props.activeSubscriptions - Number of active subscriptions
 * @param props.localGrowersSupplying - The count of unique local growers currently fulfilling orders
 * @returns A set of cards displaying the statistics
 */
export function BuyerDashboardStats({
  onOrderThisWeekLbs,
  totalSpendThisMonth,
  activeSubscriptions,
  localGrowersSupplying,
}: BuyerDashboardStatsProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Produce On Order */}
          <div className="rounded-lg bg-cream p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-click-green">
              {onOrderThisWeekLbs} lbs
            </div>
            <div className="font-sans text-xs text-ink-3">Produce on order this week</div>
          </div>

          {/* Spend Stat */}
          <div className="rounded-lg bg-slate-100 p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              $
              {totalSpendThisMonth.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="font-sans text-xs text-ink-3">Total spend this month</div>
          </div>

          {/* Active Subscriptions Stat */}
          <div className="rounded-lg bg-lime-pale p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              {activeSubscriptions}
            </div>
            <div className="font-sans text-xs text-ink-3">Active subscriptions</div>
          </div>

          {/* Local Growers Stat */}
          <div className="rounded-lg bg-cream p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              {localGrowersSupplying}
            </div>
            <div className="font-sans text-xs text-ink-3">Local growers supplying you</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
