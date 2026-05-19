'use client';

import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  OrderIdentityCell,
  OrderIdCell,
  OrderAmountCell,
  OrderDateCell,
  OrderStatusCell,
} from '@/components/orders/OrderTableCells';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Order } from '@/lib/api/generated/models';

interface UpcomingOrdersCardProps {
  orders: Order[];
}

/**
 * A card containing a table of upcoming orders for the buyer.
 * @param props - Component props
 * @param props.orders - Array of order data items
 * @returns A table view of the upcoming orders
 */
export function UpcomingOrdersCard({ orders }: UpcomingOrdersCardProps) {
  const router = useRouter();

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-0 sm:p-6">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-6 sm:px-0 sm:pt-0 gap-3">
          <div>
            <h2 className="font-heading text-[1.05rem] font-bold text-ink">Upcoming Orders</h2>
            <p className="mt-0.5 font-sans text-[0.8rem] text-ink-3">This week · All confirmed</p>
          </div>
          <Badge className="bg-lime-pale text-click-green hover:bg-lime-pale border-0 rounded-full px-3 py-1 font-heading text-[0.65rem] font-bold uppercase tracking-[0.05em] w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
            All on schedule
          </Badge>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No upcoming orders"
            description="When you place an order, its delivery status will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-heading text-[0.66rem] font-bold tracking-[0.08em] uppercase text-ink-3 pl-4 sm:pl-2">
                    Grower
                  </TableHead>
                  <TableHead className="font-heading text-[0.66rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                    Order ID
                  </TableHead>
                  <TableHead className="font-heading text-[0.66rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                    Total
                  </TableHead>
                  <TableHead className="font-heading text-[0.66rem] font-bold tracking-[0.08em] uppercase text-ink-3">
                    Delivery
                  </TableHead>
                  <TableHead className="font-heading text-[0.66rem] font-bold tracking-[0.08em] uppercase text-ink-3 pr-4 sm:pr-2 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  return (
                    <TableRow
                      key={order.id}
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="cursor-pointer border-border/50 transition-colors hover:bg-slate-50/80"
                    >
                      <OrderIdentityCell
                        id={order.sellerId}
                        labelPrefix="Seller"
                        onNameClick={() => void router.push(`/public-profile/${order.sellerId}`)}
                      />
                      <OrderIdCell id={order.id} />
                      <OrderAmountCell amount={order.totalAmount} />
                      <OrderDateCell
                        date={order.scheduledTime}
                        options={{ weekday: 'short', month: 'short', day: 'numeric' }}
                      />
                      <OrderStatusCell status={order.status ?? undefined} />
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
