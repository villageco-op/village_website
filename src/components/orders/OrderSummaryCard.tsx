'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import type { OrderDetailResponse, UserBasicInfo } from '@/lib/api/generated/models';
import { formatAppDateTime } from '@/lib/date-utils';

interface OrderSummaryCardProps {
  order: OrderDetailResponse;
  fromUser: UserBasicInfo;
}

/**
 * A card for displaying all the general information of an order.
 * @param props - Component props
 * @param props.order - The order details
 * @param props.fromUser - The other user (counter party)
 * @returns A card displaying all the order details
 */
export function OrderSummaryCard({ order, fromUser }: OrderSummaryCardProps) {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between border-b border-border/50 pb-5">
          <h2 className="font-heading text-lg font-bold text-ink">Order Summary</h2>
          <StatusPill status={order.status} />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 justify-between">
          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)]">
            <div className="flex items-center gap-2 text-ink-3">
              <span className="text-xs font-bold uppercase tracking-wider">Scheduled Time</span>
            </div>
            <p className="font-medium text-ink">
              {formatAppDateTime(order.scheduledTime, 'fullWithDay', 'Not scheduled yet')}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)]">
            <div className="flex items-center gap-2 text-ink-3">
              <span className="text-xs font-bold uppercase tracking-wider">Fulfillment</span>
            </div>
            <p className="font-medium text-ink capitalize flex items-center gap-2">
              {order.fulfillmentType}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)]">
            <div className="flex items-center gap-2 text-ink-3">
              <span className="text-xs font-bold uppercase tracking-wider">From</span>
            </div>
            <p
              className="cursor-pointer font-medium text-ink capitalize flex items-center gap-2 hover:underline"
              onClick={() => void router.push(`/public-profile/${fromUser.id}`)}
            >
              {fromUser.name || 'N/A'}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-[calc(50%-12px)] sm:items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Total Amount
            </span>
            <p className="font-heading text-2xl font-bold text-deep-forest">
              ${Number(order.totalAmount || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
