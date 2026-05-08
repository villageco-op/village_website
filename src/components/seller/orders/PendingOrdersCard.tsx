'use client';

import { Store, Truck } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import type { Order } from '@/lib/api/generated/models';
import { getTimeDiffText } from '@/lib/date-utils';

/**
 * Props for the pending orders card.
 */
interface PendingOrdersCardProps {
  orders: Order[];
  pendingCount: number;
}

/**
 * Card that displays pending orders in the seller orders page.
 * @param props - Props for orders and pending count
 * @param props.orders - The orders displayed
 * @param props.pendingCount - The amount of pending orders
 * @returns A card displaying pending orders and some information
 */
export function PendingOrdersCard({ orders, pendingCount }: PendingOrdersCardProps) {
  return (
    <Card className="mb-5 rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[0.95rem] font-bold text-ink">Pending Orders</h2>
            <p className="mt-0.5 font-sans text-[0.78rem] text-ink-3">
              Awaiting pickup or delivery
            </p>
          </div>
          <StatusPill status={`${pendingCount} pending`} variant="sun" />
        </div>

        {orders.length === 0 ? (
          <div className="py-6 text-center font-sans text-sm text-ink-3">
            No pending orders at this time.
          </div>
        ) : (
          <div className="flex flex-col">
            {orders.map((order) => {
              const isDelivery = order.fulfillmentType?.toLowerCase() === 'delivery';
              const icon = isDelivery ? (
                <Truck className="text-deep-forest h-5 w-5" />
              ) : (
                <Store className="text-deep-forest h-5 w-5" />
              );
              const iconBgClass = isDelivery ? 'bg-sun/30' : 'bg-lime/30';

              const date = order.scheduledTime
                ? new Date(order.scheduledTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : 'Date pending';

              const timeDiff = getTimeDiffText(order.createdAt);

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex cursor-pointer items-start gap-3 border-b border-border/50 py-3.5 transition-colors hover:bg-slate-50/80 last:border-0 last:pb-0"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base ${iconBgClass}`}
                  >
                    {icon}
                  </div>

                  <div className="flex-1">
                    <div className="mb-0.5 font-heading text-[0.82rem] font-bold text-ink">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="font-sans text-[0.76rem] leading-snug text-ink-3">
                      Total: ${Number(order.totalAmount || 0).toFixed(2)} ·{' '}
                      {isDelivery ? 'Delivery' : 'Pickup'}: {date}
                    </div>
                    <div className="mt-2">
                      <StatusPill status={order.status || 'Processing'} />
                    </div>
                  </div>

                  <div className="mt-0.5 whitespace-nowrap font-heading text-[0.65rem] text-ink-3">
                    {timeDiff}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
