'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { BillingSummaryResponse } from '@/lib/api/generated/models';

interface BillingStatsCardProps {
  data: BillingSummaryResponse;
}

/**
 * Displays the 4 primary billing statistics based on the designer's HTML mockup.
 * @param props - Props for the billing data
 * @param props.data - Billing summary numbers
 * @returns A card containing clear billing summary statistics
 */
export function BillingStatsCard({ data }: BillingStatsCardProps) {
  return (
    <Card className="mb-5 rounded-xl border border-[rgba(42,75,40,0.08)] bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-4">
          <div className="rounded-lg bg-off-white p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              ${data.totalSpent.toFixed(0)}
            </div>
            <div className="font-sans text-xs text-ink-3">Total spent</div>
          </div>

          <div className="rounded-lg bg-off-white p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-click-green">
              {data.totalProduceLbs.toFixed(0)} lbs
            </div>
            <div className="font-sans text-xs text-ink-3">Total produce</div>
          </div>

          <div className="rounded-lg bg-off-white p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-sun">
              ${data.avgCostPerLb.toFixed(2)}
            </div>
            <div className="font-sans text-xs text-ink-3">Avg cost per lb</div>
          </div>

          <div className="rounded-lg bg-lime-pale p-4 text-center">
            <div className="font-heading text-2xl font-extrabold text-deep-forest">
              {data.localSourcingPercentage.toFixed(0)}%
            </div>
            <div className="font-sans text-xs font-bold text-click-green">Local sourcing</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
