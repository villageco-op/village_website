'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { SellerEarningsResponse } from '@/lib/api/generated/models';

/**
 * Props for the earnings stat row component.
 */
interface EarningsStatRowProps {
  data: SellerEarningsResponse;
}

/**
 * A row of 4 statistic cards highlighting key earnings metrics.
 * @param props - The earnings response data
 * @param props.data - The response object from useSellerEarnings
 * @returns A row of cards displaying the seller earning metrics
 */
export function EarningsStatRow({ data }: EarningsStatRowProps) {
  const {
    earnedThisMonth,
    earnedLastMonth,
    remainingToGoal,
    monthlyGoal,
    totalEarnedYTD,
    ytdStartDate,
    avgPerLbSold,
  } = data;

  // Calculate delta percentage for the month
  const deltaVal =
    earnedLastMonth > 0 ? ((earnedThisMonth - earnedLastMonth) / earnedLastMonth) * 100 : 100;

  const isPositive = deltaVal >= 0;
  const formattedDelta = Math.abs(deltaVal).toFixed(0);

  // Format YTD start date
  const formattedYtdDate = new Date(ytdStartDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Earned this month */}
      <Card className="rounded-xl border border-[rgba(42,75,40,0.08)] border-l-[3px] border-l-lime bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
        <CardContent className="p-5">
          <div className="mb-1 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            ${earnedThisMonth.toFixed(2)}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Earned this month</div>
          <div
            className={`mt-1.5 font-heading text-[0.7rem] font-bold ${isPositive ? 'text-click-green' : 'text-clay'}`}
          >
            {isPositive ? '↑' : '↓'} {formattedDelta}% vs last month
          </div>
        </CardContent>
      </Card>

      {/* Remaining to goal */}
      <Card className="rounded-xl border border-[rgba(42,75,40,0.08)] border-l-[3px] border-l-sun bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
        <CardContent className="p-5">
          <div className="mb-1 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            ${Math.max(remainingToGoal, 0).toFixed(2)}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Remaining to goal</div>
          <div className="mt-1.5 font-heading text-[0.7rem] font-bold text-click-green">
            Goal: ${monthlyGoal.toFixed(2)} / month
          </div>
        </CardContent>
      </Card>

      {/* Total earned YTD */}
      <Card className="rounded-xl border border-[rgba(42,75,40,0.08)] border-l-[3px] border-l-forest-dark bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
        <CardContent className="p-5">
          <div className="mb-1 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            ${totalEarnedYTD.toFixed(2)}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Total earned (YTD)</div>
          <div className="mt-1.5 font-heading text-[0.7rem] font-bold text-click-green">
            Since {formattedYtdDate}
          </div>
        </CardContent>
      </Card>

      {/* Avg per lb sold */}
      <Card className="rounded-xl border border-[rgba(42,75,40,0.08)] border-l-[3px] border-l-clay bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
        <CardContent className="p-5">
          <div className="mb-1 font-heading text-[1.8rem] font-extrabold tracking-[-0.025em] text-ink">
            ${avgPerLbSold.toFixed(2)}
          </div>
          <div className="font-sans text-[0.75rem] text-ink-3">Avg per lb sold</div>
          <div className="mt-1.5 font-heading text-[0.7rem] font-bold text-click-green">
            Across all crops
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
