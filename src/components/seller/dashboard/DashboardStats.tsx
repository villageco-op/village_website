import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props for the dashboard stats component.
 */
interface DashboardStatsProps {
  earnedThisMonth: number;
  earnedLastMonth: number;
  soldThisWeekLbs: number;
  onTrackWithGoal: boolean;
  activeListingsCount: number;
  activeListingsNames: string[];
}

/**
 * A set of cards for displaying general seller metrics.
 * @param props - The props for the various stats
 * @param props.earnedThisMonth - Amount earned this month
 * @param props.earnedLastMonth - Amount earned last month
 * @param props.soldThisWeekLbs - Pounds of produce sold this wekk
 * @param props.onTrackWithGoal - True if monthly earnings are on pace with earnings goal
 * @param props.activeListingsCount - Number of active listings from seller
 * @param props.activeListingsNames - Produce names for each active listing
 * @returns A set of cards displaying the statistics
 */
export function DashboardStats({
  earnedThisMonth,
  earnedLastMonth,
  soldThisWeekLbs,
  onTrackWithGoal,
  activeListingsCount,
  activeListingsNames,
}: DashboardStatsProps) {
  // Calculate month-over-month difference
  const earnedDiff =
    earnedLastMonth > 0 ? ((earnedThisMonth - earnedLastMonth) / earnedLastMonth) * 100 : 0;

  const isEarnedUp = earnedDiff >= 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Earned Stat */}
      <Card className="border-l-4 border-l-lime border-y-forest-dark/10 border-r-forest-dark/10 shadow-[0_2px_12px_rgba(42,75,40,0.05)] rounded-xl py-5 px-5">
        <CardContent className="p-0">
          <div className="mb-0.75 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            ${earnedThisMonth.toLocaleString()}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Earned this month</div>
          <div
            className={cn(
              'mt-1.5 font-heading text-[0.7rem] font-bold',
              isEarnedUp ? 'text-click-green' : 'text-clay',
            )}
          >
            {isEarnedUp ? '↑' : '↓'} {Math.abs(earnedDiff).toFixed(0)}% from last month
          </div>
        </CardContent>
      </Card>

      {/* Harvested/Sold Stat */}
      <Card className="border-l-4 border-l-sun border-y-forest-dark/10 border-r-forest-dark/10 shadow-[0_2px_12px_rgba(42,75,40,0.05)] rounded-xl py-5 px-5">
        <CardContent className="p-0">
          <div className="mb-0.75 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            {soldThisWeekLbs} lbs
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Harvested/Sold this week</div>
          <div
            className={cn(
              'mt-1.5 font-heading text-[0.7rem] font-bold',
              onTrackWithGoal ? 'text-click-green' : 'text-clay',
            )}
          >
            {onTrackWithGoal ? '↑ On track for monthly goal' : '↓ Falling behind monthly goal'}
          </div>
        </CardContent>
      </Card>

      {/* Active Listings Stat */}
      <Card className="border-l-4 border-l-deep-forest border-y-forest-dark/10 border-r-forest-dark/10 shadow-[0_2px_12px_rgba(42,75,40,0.05)] rounded-xl py-5 px-5">
        <CardContent className="p-0">
          <div className="mb-0.75 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            {activeListingsCount}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Active listings</div>
          <div className="mt-1.5 truncate font-heading text-[0.7rem] font-bold text-click-green">
            {activeListingsNames.length > 0
              ? activeListingsNames.join(' · ')
              : 'No active listings'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
