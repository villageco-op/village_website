'use client';

import { Calendar, Package, RefreshCw } from 'lucide-react';
import router from 'next/router';

import { Card, CardContent } from '@/components/ui/card';
import type { SubscriptionDetailResponse } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

interface SubscriptionSummaryCardProps {
  subscription: SubscriptionDetailResponse;
}

/**
 * A card with subscription information for displaying subscriptions.
 * @param props - Props containing the subscription
 * @param props.subscription - The subscription details
 * @returns A card containing basic subscription details
 */
export function SubscriptionSummaryCard({ subscription }: SubscriptionSummaryCardProps) {
  const pricePerOz = Number(subscription.product?.pricePerOz || 0);
  const quantity = Number(subscription.quantityOz || 0);
  const totalCost = (pricePerOz * quantity).toFixed(2);

  const nextDelivery = formatAppDate(
    subscription.nextDeliveryDate,
    'weekdayDayMonth',
    'Pending / Not Scheduled',
  );

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <h2 className="mb-4 font-heading text-[0.95rem] font-bold text-ink border-b border-border/50 pb-3">
          Subscription Summary
        </h2>

        <div className="mb-6">
          <h3
            className="cursor-pointer font-heading text-lg font-bold text-deep-forest hover:underline"
            onClick={() => void router.push(`/produce/${subscription.productId}`)}
          >
            {subscription.product?.title || 'Unknown Product'} ↗
          </h3>
          <p className="text-sm text-ink-3">${pricePerOz.toFixed(2)} per oz</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-slate-50/50 p-4">
            <Package className="mt-0.5 h-5 w-5 text-ink-3" />
            <div>
              <p className="text-xs text-ink-3">Current Amount</p>
              <p className="font-semibold text-ink">{quantity} oz</p>
              <p className="mt-1 text-xs font-medium text-forest-dark">Cycle Total: ${totalCost}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-slate-50/50 p-4">
            <RefreshCw className="mt-0.5 h-5 w-5 text-ink-3" />
            <div>
              <p className="text-xs text-ink-3">Fulfillment Type</p>
              <p className="font-semibold text-ink capitalize">{subscription.fulfillmentType}</p>
              <p className="mt-1 text-xs text-ink-3">
                Frequency: {subscription.product?.harvestFrequencyDays || 7} days
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-lg bg-sun/10 p-4 text-sm">
          <Calendar className="h-5 w-5 text-yellow-800" />
          <div>
            <p className="font-medium text-yellow-900">Next Scheduled Delivery / Pickup</p>
            <p className="text-yellow-800">{nextDelivery}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
