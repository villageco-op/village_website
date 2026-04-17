'use client';

import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ProduceOrderListResponseDataItem } from '@/lib/api/generated/models';
import { cn } from '@/lib/utils';

interface ListingOrdersTableProps {
  orders: ProduceOrderListResponseDataItem[];
  totalOrders: number;
}

/**
 * A card containing a table of orders specifically for one produce listing.
 * Includes buyer information, quantities, and fulfillment details.
 *
 * @param props - Component props
 * @param props.orders - Array of order data items
 * @param props.totalOrders - Total count of orders
 * @returns A table view of the orders
 */
export function ListingOrdersTable({ orders, totalOrders }: ListingOrdersTableProps) {
  const router = useRouter();

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-0 sm:p-6">
        <div className="mb-5 hidden items-center justify-between px-6 pt-6 sm:flex sm:px-0 sm:pt-0">
          <div>
            <h2 className="font-heading text-[1.05rem] font-bold text-ink">Order List</h2>
            <p className="mt-0.5 font-sans text-[0.8rem] text-ink-3">
              {totalOrders} {totalOrders === 1 ? 'order' : 'orders'} found
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📦
            </div>
            <h3 className="font-heading text-lg font-bold text-ink">No orders yet</h3>
            <p className="mt-1 max-w-sm text-sm text-ink-3">
              When customers purchase this listing, their orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-heading text-xs font-bold text-ink-3 pl-4 sm:pl-2">
                    Buyer
                  </TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3">
                    Order ID
                  </TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3">
                    Quantity
                  </TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3">Total</TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3">
                    Fulfillment
                  </TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3">Date</TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3 pr-4 sm:pr-2 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  // Convert API Oz to user-friendly Lbs
                  const quantityLbs = (Number(order.quantityOz || 0) / 16)
                    .toFixed(1)
                    .replace(/\.0$/, '');
                  const isDelivery = order.fulfillmentType?.toLowerCase() === 'delivery';

                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer border-border/50 transition-colors hover:bg-slate-50/80"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      <TableCell className="pl-4 sm:pl-2">
                        <div className="flex items-center gap-3 min-w-35">
                          <Avatar className="h-8 w-8 border border-border/50">
                            <AvatarImage
                              src={order.buyer.image || ''}
                              alt={order.buyer.name || 'Buyer'}
                            />
                            <AvatarFallback className="bg-lime/20 text-forest-dark font-semibold text-xs">
                              {order.buyer.name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-ink text-sm truncate max-w-30">
                            {order.buyer.name || 'Anonymous User'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="font-medium text-ink-3 text-xs">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>

                      <TableCell className="text-sm font-medium text-ink">
                        {quantityLbs} lbs
                      </TableCell>

                      <TableCell className="font-bold text-ink text-sm">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm capitalize text-ink-3">
                            {order.fulfillmentType}
                          </span>
                          <span title={isDelivery ? 'Delivery' : 'Pickup'}>
                            {isDelivery ? '🚚' : '🏪'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-ink-3 text-sm whitespace-nowrap">
                        {order.scheduledTime
                          ? new Date(order.scheduledTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Pending'}
                      </TableCell>

                      <TableCell className="pr-4 sm:pr-2 text-right">
                        <StatusPill
                          status={order.status || 'Pending'}
                          variant={order.status === 'completed' ? 'lime' : 'sun'}
                          className={cn(
                            'inline-flex ml-auto',
                            order.status === 'canceled' &&
                              'bg-destructive/10 text-destructive border-destructive/20',
                          )}
                        />
                      </TableCell>
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
