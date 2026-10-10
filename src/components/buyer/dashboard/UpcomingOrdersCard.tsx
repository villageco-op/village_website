'use client';

import { Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  OrderIdentityCell,
  OrderAmountCell,
  OrderFulfillmentCell,
  OrderLocationCell,
  OrderProductCell,
  OrderDateTimeCell,
} from '@/components/orders/OrderTableCells';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { OrderSummary } from '@/lib/api/generated/models';

interface UpcomingOrdersCardProps {
  orders: OrderSummary[];
  total: number;
}

/**
 * A card containing a table of upcoming orders for the buyer.
 * @param props - Component props
 * @param props.orders - Array of order data items
 * @param props.total - The total number of orders
 * @returns A table view of the upcoming orders
 */
export function UpcomingOrdersCard({ orders, total }: UpcomingOrdersCardProps) {
  const router = useRouter();
  const hasMoreOrders = orders.length < total;

  return (
    <Card>
      <CardContent className="p-0 sm:p-6">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-6 sm:px-0 sm:pt-0 gap-3">
          <div>
            <h2 className="font-heading text-[1.05rem] font-bold text-ink">Upcoming Orders</h2>
            <p className="mt-0.5 font-sans text-[0.8rem] text-ink-3">
              Showing {orders.length}/{total}
            </p>
          </div>

          {hasMoreOrders && (
            <Button asChild variant="outline" size="sm">
              <Link href="/buyer/orders">View all</Link>
            </Button>
          )}
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No upcoming orders"
            description="When you place an order, it will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const itemsCount = order.items?.length || 0;
                  const extraItemsCount = itemsCount > 1 ? itemsCount - 1 : 0;
                  const firstItem = order.items?.[0];
                  const product = firstItem?.product;

                  const counterparty = order.counterparty || order.seller;
                  const sellerName = counterparty?.name || order.seller?.name || undefined;

                  return (
                    <TableRow
                      key={order.id}
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="cursor-pointer transition-colors hover:bg-slate-50/80"
                    >
                      {/* Product */}
                      <OrderProductCell
                        title={product?.title}
                        image={product?.images?.[0]}
                        extraCount={extraItemsCount}
                      />

                      {/* From (Seller) */}
                      <OrderIdentityCell
                        id={order.sellerId}
                        name={sellerName}
                        onNameClick={() => void router.push(`/public-profile/${order.sellerId}`)}
                        avatarFallback={false}
                      />

                      {/* Total */}
                      <OrderAmountCell amount={order.totalAmount} />

                      {/* Time */}
                      <OrderDateTimeCell date={order.scheduledTime} />

                      {/* Location */}
                      <OrderLocationCell location={counterparty?.location} />

                      {/* Type */}
                      <OrderFulfillmentCell fulfillmentType={order.fulfillmentType} />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
