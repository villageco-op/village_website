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
  const { remainingToGoal, totalEarnedYTD, avgPerLbSold } = data;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-lg bg-cream p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              ${Math.max(remainingToGoal, 0).toFixed(2)}
            </div>
            <div className="font-sans text-xs text-ink-3">Remaining to goal</div>
          </div>

          <div className="rounded-lg bg-lime-pale p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              ${totalEarnedYTD.toFixed(2)}
            </div>
            <div className="font-sans text-xs text-ink-3">Total earned (YTD)</div>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              ${avgPerLbSold.toFixed(2)}
            </div>
            <div className="font-sans text-xs text-ink-3">Avg per lb sold</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
