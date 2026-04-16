'use client';

import { Calendar, CreditCard, MapPin } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import type { OrderDetailResponse } from '@/lib/api/generated/models';
import { cn } from '@/lib/utils';

interface OrderSummaryCardProps {
  order: OrderDetailResponse;
}

/**
 * A card for displaying all the general information of an order.
 * @param props - Component props
 * @param props.order - The order details
 * @returns A card displaying all the order details
 */
export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const isDelivery = order.fulfillmentType?.toLowerCase() === 'delivery';

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between border-b border-border/50 pb-5">
          <h2 className="font-heading text-lg font-bold text-ink">Order Summary</h2>
          <StatusPill
            status={order.status || 'pending'}
            variant={order.status === 'completed' ? 'lime' : 'sun'}
            className={cn(
              order.status === 'canceled' &&
                'bg-destructive/10 text-destructive border-destructive/20',
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-ink-3">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Scheduled Time</span>
            </div>
            <p className="font-medium text-ink">
              {order.scheduledTime
                ? new Date(order.scheduledTime).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : 'Not scheduled yet'}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-ink-3">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Fulfillment</span>
            </div>
            <p className="font-medium text-ink capitalize flex items-center gap-2">
              {order.fulfillmentType}
              <span className="text-lg leading-none">{isDelivery ? '🚚' : '🏪'}</span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-ink-3">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Payment Method</span>
            </div>
            <p className="font-medium text-ink capitalize">{order.paymentMethod || 'Card'}</p>
          </div>

          <div className="flex flex-col gap-1.5 sm:items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Total Amount
            </span>
            <p className="font-heading text-2xl font-bold text-deep-forest">
              ${Number(order.totalAmount || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {order.status === 'canceled' && order.cancelReason && (
          <div className="mt-6 rounded-lg bg-destructive/5 p-4 border border-destructive/20">
            <p className="text-sm font-bold text-destructive mb-1">Cancellation Reason:</p>
            <p className="text-sm text-destructive/90">{order.cancelReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
