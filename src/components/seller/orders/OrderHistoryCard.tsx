'use client';

import { useRouter } from 'next/navigation';

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
import type { Order } from '@/lib/api/generated/models';

/**
 * Props for the order history card.
 */
interface OrderHistoryCardProps {
  orders: Order[];
  completedCount: number;
}

/**
 * A card with a table containing past orders.
 * @param props - Orders and count props
 * @param props.orders - The orders to display
 * @param props.completedCount - Total number of completed orders
 * @returns A table containing each order and some information
 */
export function OrderHistoryCard({ orders, completedCount }: OrderHistoryCardProps) {
  const router = useRouter();

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[0.95rem] font-bold text-ink">Order History</h2>
            <p className="mt-0.5 font-sans text-[0.78rem] text-ink-3">
              Last 30 days · {completedCount} completed
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center font-sans text-sm text-ink-3">
            No historical orders found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="font-heading text-xs font-bold text-ink-3">
                  Order ID
                </TableHead>
                <TableHead className="font-heading text-xs font-bold text-ink-3">Amount</TableHead>
                <TableHead className="font-heading text-xs font-bold text-ink-3">Type</TableHead>
                <TableHead className="font-heading text-xs font-bold text-ink-3">Date</TableHead>
                <TableHead className="font-heading text-xs font-bold text-ink-3">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer border-border/50 transition-colors hover:bg-slate-50/80"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <TableCell className="font-medium text-ink">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-bold text-ink">
                    ${Number(order.totalAmount || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="capitalize text-ink-3">{order.fulfillmentType}</TableCell>
                  <TableCell className="text-ink-3">
                    {order.scheduledTime
                      ? new Date(order.scheduledTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
