'use client';

import { ChevronRight, Store, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import type { OrderSummary } from '@/lib/api/generated/models';
import { formatAppDateTime } from '@/lib/date-utils';

/**
 * Props for the pending orders card.
 */
interface PendingOrdersCardProps {
  orders: OrderSummary[];
  pendingCount: number;
  userRole: 'seller' | 'buyer';
}

/**
 * Card that displays pending orders in the seller orders page.
 * @param props - Props for orders and pending count
 * @param props.orders - The orders displayed
 * @param props.pendingCount - The amount of pending orders
 * @param props.userRole - The users role
 * @returns A card displaying pending orders and some information
 */
export function PendingOrdersCard({ orders, pendingCount, userRole }: PendingOrdersCardProps) {
  return (
    <Card className="mb-6 mt-6">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">Pending Orders</h2>
            <p className="mt-0.5 font-sans text-sm text-ink-3">
              You have {pendingCount} scheduled orders
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <EmptyState title="No pending orders at this time." className="py-8 h-auto" />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const totalItemsCount = order.items?.length || 0;
              const extraItemsCount = totalItemsCount > 1 ? totalItemsCount - 1 : 0;

              const firstItem = order.items?.[0];
              const product = firstItem?.product;
              const productTitle = product?.title || 'Order Item';
              const productImage = product?.images?.[0];

              const counterparty =
                order.counterparty || userRole === 'seller' ? order.seller : order.buyer;
              const counterpartyName = counterparty?.name || userRole;

              const extraItemsText = totalItemsCount > 1 ? ` +${extraItemsCount} more` : '';
              const titleText = productTitle + extraItemsText + ' from ' + counterpartyName;

              const location = counterparty?.location;
              const locationText =
                location?.address ||
                [location?.city, location?.state].filter(Boolean).join(', ') ||
                'Location pending';

              const isDelivery = order.fulfillmentType?.toLowerCase() === 'delivery';
              const icon = isDelivery ? (
                <Truck className="h-4 w-4 text-deep-forest" />
              ) : (
                <Store className="h-4 w-4 text-deep-forest" />
              );
              const iconBgClass = isDelivery ? 'bg-sun/30' : 'bg-lime/30';

              const scheduleDate = formatAppDateTime(order.scheduledTime);
              const createdDate = formatAppDateTime(order.createdAt);

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="group relative flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-border hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4 min-w-70">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-border/50">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={productTitle}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center ${iconBgClass}`}
                        >
                          {icon}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-base font-bold text-ink">
                          {titleText}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-ink-3">
                        Placed: {createdDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-wrap items-center gap-6 border-t border-border/40 pt-3 md:border-t-0 md:pt-0 md:px-4 md:border-l">
                    {/* Location */}
                    <div className="flex flex-col gap-0.5 min-w-40">
                      <span className="text-xs text-ink-3">Location</span>
                      <div className="flex items-center gap-1.5 text-xs text-ink">
                        <span className="truncate max-w-45">{locationText}</span>
                      </div>
                    </div>

                    {/* Scheduled Date */}
                    <div className="flex flex-col gap-0.5 min-w-35">
                      <span className="text-xs text-ink-3">
                        {isDelivery ? 'Delivery Date' : 'Pickup Date'}
                      </span>
                      <span className="text-xs font-medium text-ink">{scheduleDate}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-ink-3">Total</span>
                      <span className="font-heading text-base font-bold text-ink">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-end border-t border-border/40 pt-3 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="pointer-events-none h-8 text-xs font-medium transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
                    >
                      Details
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
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
