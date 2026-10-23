'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import type { SubscriptionDetailResponse, UserBasicInfo } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

interface SubscriptionSummaryCardProps {
  subscription: SubscriptionDetailResponse;
  fromUser: UserBasicInfo;
}

/**
 * A card with subscription information for displaying subscriptions.
 * @param props Component props
 * @param props.subscription The subscription details
 * @param props.fromUser - The other user (counter party)
 * @returns A card containing basic subscription details
 */
export function SubscriptionSummaryCard({ subscription, fromUser }: SubscriptionSummaryCardProps) {
  const router = useRouter();
  const pricePerOz = Number(subscription.product?.pricePerOz || 0);
  const quantity = Number(subscription.quantityOz || 0);
  const totalCost = (pricePerOz * quantity).toFixed(2);

  const nextDelivery = formatAppDate(
    subscription.nextDeliveryDate,
    'weekdayDayMonth',
    'Pending / Not Scheduled',
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between border-b border-border/50 pb-5">
          <div className="flex flex-col gap-1">
            <h3
              className="cursor-pointer font-heading text-lg font-bold text-deep-forest hover:underline"
              onClick={() => void router.push(`/produce/${subscription.productId}`)}
            >
              {subscription.product?.title || 'Unknown Product'}
            </h3>
            {fromUser && (
              <p className="text-xs text-ink-3">
                From:{' '}
                <span
                  className="cursor-pointer font-medium text-deep-forest hover:underline"
                  onClick={() => void router.push(`/public-profile/${fromUser.id}`)}
                >
                  {fromUser.name || 'N/A'}
                </span>
              </p>
            )}
          </div>
          <StatusPill status={subscription.status} />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 justify-between">
          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)]">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Fulfillment Type
            </span>
            <p className="font-medium text-ink capitalize">
              {subscription.fulfillmentType || 'N/A'}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)]">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">Frequency</span>
            <p className="font-medium text-ink">
              Every {subscription.product?.harvestFrequencyDays || 7} days
            </p>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)]">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Next Order
            </span>
            <p className="font-medium text-ink">{nextDelivery}</p>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)]">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">Amount</span>
            <p className="font-medium text-ink">{quantity} oz</p>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)]">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Price per oz
            </span>
            <p className="font-medium text-ink">${pricePerOz.toFixed(2)}</p>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)] sm:items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Total Cost
            </span>
            <p className="font-heading text-2xl font-bold text-deep-forest">${totalCost}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
