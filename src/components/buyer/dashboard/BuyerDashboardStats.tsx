import { Card, CardContent } from '@/components/ui/card';
import type { ActiveSubscription } from '@/lib/api/generated/models';
import { cn } from '@/lib/utils';

/**
 * Props for the buyer dashboard stats component.
 */
interface BuyerDashboardStatsProps {
  onOrderThisWeekLbs: number;
  percentChangeFromLastWeek: number;
  totalSpendThisMonth: number;
  totalSpendLastMonth: number;
  activeSubscriptions: ActiveSubscription[];
  localGrowersSupplying: number;
  furthestGrowerDistanceMiles: number;
}

/**
 * A set of cards for displaying general buyer metrics.
 * @param props - The props for the various stats
 * @param props.onOrderThisWeekLbs - Total weight (lbs) of produce ordered this week by the buyer
 * @param props.percentChangeFromLastWeek - The percentage difference in volume compared to the previous week
 * @param props.totalSpendThisMonth - The dollar amount spent by the buyer in the current calendar month
 * @param props.totalSpendLastMonth - The dollar amount spent by the buyer in the previous calendar month
 * @param props.activeSubscriptions - Array of subscription objects containing produce names and details
 * @param props.localGrowersSupplying - The count of unique local growers currently fulfilling orders
 * @param props.furthestGrowerDistanceMiles - The distance in miles to the most distant grower in the network
 * @returns A set of cards displaying the statistics
 */
export function BuyerDashboardStats({
  onOrderThisWeekLbs,
  percentChangeFromLastWeek,
  totalSpendThisMonth,
  totalSpendLastMonth,
  activeSubscriptions,
  localGrowersSupplying,
  furthestGrowerDistanceMiles,
}: BuyerDashboardStatsProps) {
  const isVolumeUp = percentChangeFromLastWeek >= 0;

  const activeSubsText =
    activeSubscriptions.length > 0
      ? activeSubscriptions
          .map((s) => s.produceName)
          .slice(0, 4)
          .join(' · ') + (activeSubscriptions.length > 4 ? '...' : '')
      : 'No active subscriptions';

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Produce On Order */}
      <Card className="border-l-4 border-l-lime border-y-forest-dark/10 border-r-forest-dark/10 shadow-[0_2px_12px_rgba(42,75,40,0.05)] rounded-xl py-5 px-5">
        <CardContent className="p-0">
          <div className="mb-0.75 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            {onOrderThisWeekLbs} lbs
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Produce on order this week</div>
          <div
            className={cn(
              'mt-1.5 font-heading text-[0.7rem] font-bold',
              isVolumeUp ? 'text-click-green' : 'text-clay',
            )}
          >
            {isVolumeUp ? '↑' : '↓'} {Math.abs(percentChangeFromLastWeek)}%{' '}
            {isVolumeUp ? 'above' : 'below'} last week
          </div>
        </CardContent>
      </Card>

      {/* Spend Stat */}
      <Card className="border-l-4 border-l-sun border-y-forest-dark/10 border-r-forest-dark/10 shadow-[0_2px_12px_rgba(42,75,40,0.05)] rounded-xl py-5 px-5">
        <CardContent className="p-0">
          <div className="mb-0.75 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            $
            {totalSpendThisMonth.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Total spend this month</div>
          <div className="mt-1.5 font-heading text-[0.7rem] font-bold text-ink-3">
            vs. ${totalSpendLastMonth.toLocaleString()} last month
          </div>
        </CardContent>
      </Card>

      {/* Active Subscriptions Stat */}
      <Card className="border-l-4 border-l-deep-forest border-y-forest-dark/10 border-r-forest-dark/10 shadow-[0_2px_12px_rgba(42,75,40,0.05)] rounded-xl py-5 px-5">
        <CardContent className="p-0">
          <div className="mb-0.75 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            {activeSubscriptions.length}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Active subscriptions</div>
          <div className="mt-1.5 truncate font-heading text-[0.7rem] font-bold text-click-green">
            {activeSubsText}
          </div>
        </CardContent>
      </Card>

      {/* Local Growers Stat */}
      <Card className="border-l-4 border-l-clay border-y-forest-dark/10 border-r-forest-dark/10 shadow-[0_2px_12px_rgba(42,75,40,0.05)] rounded-xl py-5 px-5">
        <CardContent className="p-0">
          <div className="mb-0.75 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            {localGrowersSupplying}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Local growers supplying you</div>
          <div className="mt-1.5 font-heading text-[0.7rem] font-bold text-clay">
            All within {furthestGrowerDistanceMiles.toFixed(1)} miles of your store
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
