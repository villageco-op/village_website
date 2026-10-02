'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import { StatusPill } from '@/components/ui/status-pill';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { OrderSummary } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

/**
 * Props for the order history card.
 */
interface OrderHistoryCardProps {
  orders: OrderSummary[];
  completedCount: number;
  userRole: 'seller' | 'buyer';
}

/**
 * A card with a table containing past orders.
 * @param props - Orders and count props
 * @param props.orders - The orders to display
 * @param props.completedCount - Total number of completed orders
 * @param props.userRole - The users role
 * @returns A table containing each order and some information
 */
export function OrderHistoryCard({ orders, completedCount, userRole }: OrderHistoryCardProps) {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">Order History</h2>
            <p className="mt-0.5 font-sans text-sm text-ink-3">
              Last 30 days · {completedCount} completed
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <EmptyState title="No historical orders found." className="py-8 h-auto" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead className="w-75">Product / Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const firstItem = order.items?.[0];
                  const product = firstItem?.product;
                  const productTitle = product?.title || 'Order Item';
                  const productImage = product?.images?.[0];

                  const counterparty =
                    order.counterparty || userRole === 'seller' ? order.seller : order.buyer;
                  const counterpartyName = counterparty?.name || userRole;

                  const location = counterparty?.location;
                  const locationText = location?.city || location?.address || 'N/A';

                  return (
                    <TableRow
                      key={order.id}
                      className="group cursor-pointer transition-colors hover:bg-slate-50/80"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      {/* Product Thumbnail & Details */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-border/50">
                            {productImage ? (
                              <Image
                                src={productImage}
                                alt={productTitle}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-ink-3">
                                #{order.id.slice(0, 3)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-heading text-sm font-semibold text-ink line-clamp-1">
                              {productTitle}
                            </span>
                            <span className="font-mono text-xs text-ink-3">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Counterparty / Seller */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-ink">{counterpartyName}</span>
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-ink-3">
                          <span className="truncate max-w-40">{locationText}</span>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-3.5 text-xs text-ink-3">
                        {formatAppDate(order.scheduledTime || order.createdAt, 'dayMonth')}
                      </TableCell>

                      {/* Total Amount */}
                      <TableCell className="py-3.5 text-right font-heading text-sm font-bold text-ink">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5 text-center">
                        <StatusPill status={order.status} />
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
