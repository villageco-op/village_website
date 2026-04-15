'use client';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import type { SellerProduceListing } from '@/lib/api/generated/models';
import { getProduceIcon, getStatusColors } from '@/lib/produce-utils';
import { cn } from '@/lib/utils';

/**
 * Props for the listing card.
 */
interface ListingCardProps {
  produce: SellerProduceListing;
}

/**
 * A card that displays information for a given seller produce listing.
 * @param props - Listing card props
 * @param props.produce - A produce listing
 * @returns A card containing listing information, analytics, and buttons
 */
export function ListingCard({ produce }: ListingCardProps) {
  const { user } = useAuth();
  const plotAddress = user?.address || 'No plot address';

  const pricePerLb = (Number(produce.pricePerOz || 0) * 16).toFixed(2);
  const statusColors = getStatusColors(produce.status);

  const analytics = produce.analytics;

  const availableLbs = analytics
    ? (analytics.availableInventory / 16).toFixed(1).replace(/\.0$/, '')
    : Math.floor(Number(produce.totalOzInventory || 0) / 16);

  const soldLbs = analytics ? (analytics.totalOzSold / 16).toFixed(1).replace(/\.0$/, '') : 0;

  const neededLbs = analytics ? Math.ceil(analytics.upcomingSubscriptionOzNeeded / 16) : 0;

  const rawHarvestDate = analytics?.nextHarvestDate || produce.availableBy;
  const harvestDate = new Date(rawHarvestDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="mb-5 flex flex-col justify-between rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="flex flex-col p-6">
        {/* Header Info */}
        <div className="mb-2.5 text-[2.5rem]">{getProduceIcon(produce.produceType)}</div>

        <div className="mb-1 font-heading text-base font-extrabold text-ink">{produce.title}</div>

        <div className="mb-3.5 font-sans text-[0.78rem] text-ink-3">Plot · {plotAddress}</div>

        <div className="mb-4 flex items-center justify-between">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
              statusColors.bg,
              statusColors.text,
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', statusColors.dot)}></span>
            <span className="capitalize">{produce.status || 'Draft'}</span>
          </span>
          <span className="font-heading text-[0.9rem] font-extrabold text-deep-forest">
            ${pricePerLb}/lb
          </span>
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="mb-4 flex flex-col gap-3">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs">
              <div>
                <p className="mb-0.5 text-ink-3">Earned this month</p>
                <p className="font-heading text-[0.85rem] font-extrabold text-ink">
                  $
                  {analytics.totalMonthlyEarnings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-ink-3">Active Buyers</p>
                <p className="font-heading text-[0.85rem] font-extrabold text-ink">
                  {analytics.numberOfSubscriptions} subs · {analytics.numberOfOrders} orders
                </p>
              </div>
            </div>

            {/* Inventory Warning */}
            {!analytics.inventorySufficientForUpcoming && (
              <div className="flex items-start gap-2 rounded-md bg-clay/10 p-2.5 text-[0.75rem] text-red-900 border border-clay/20">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                <span className="font-medium leading-tight">
                  Inventory alert: You need {neededLbs} more lbs to fulfill upcoming subscriptions!
                </span>
              </div>
            )}

            {/* Harvest & Progress Bar */}
            <div className="mt-1 flex flex-col gap-1.5">
              <div className="flex justify-between text-[0.75rem] text-ink-3">
                <span>
                  Avail: <strong className="font-semibold text-ink">{availableLbs} lbs</strong>
                </span>
                <span>
                  Harvest: <strong className="font-semibold text-ink">{harvestDate}</strong>
                </span>
              </div>

              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    statusColors.bar,
                  )}
                  style={{ width: `${Math.min(analytics.percentSold, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[0.7rem] text-ink-3">
                <span>{analytics.percentSold}% sold</span>
                <span>{soldLbs} lbs pre-sold</span>
              </div>
            </div>
          </div>
        )}

        {/* Fallback for listings without analytics */}
        {!analytics && (
          <div className="mb-4 font-sans text-[0.76rem] text-ink-3">
            Available: {availableLbs} lbs · Harvest: {harvestDate}
          </div>
        )}

        {/* Actions - Pushed to the bottom */}
        <div className="mt-auto flex gap-2 pt-2">
          <Button variant="outline-forest" size="sm" className="px-4 text-xs font-semibold">
            Edit
          </Button>
          <Button variant="forest" size="sm" className="px-4 text-xs font-semibold">
            View orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
