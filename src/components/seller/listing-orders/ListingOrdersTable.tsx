'use client';

import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  OrderIdentityCell,
  OrderIdCell,
  OrderAmountCell,
  OrderDateCell,
  OrderStatusCell,
  OrderFulfillmentCell,
  OrderQuantityOzCell,
} from '@/components/orders/OrderTableCells';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ProduceOrderListResponseDataItem } from '@/lib/api/generated/models';

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
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When customers purchase this listing, their orders will appear here."
          />
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
                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer border-border/50 transition-colors hover:bg-slate-50/80"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      <OrderIdentityCell
                        id={order.buyer.id}
                        name={order.buyer.name ?? undefined}
                        image={order.buyer.image}
                      />
                      <OrderIdCell id={order.id} className="font-medium text-xs" />
                      <OrderQuantityOzCell quantityOz={order.quantityOz} />
                      <OrderAmountCell amount={order.totalAmount} className="font-bold" />

                      <OrderFulfillmentCell fulfillmentType={order.fulfillmentType} />

                      <OrderDateCell
                        date={order.scheduledTime}
                        options={{ month: 'short', day: 'numeric', year: 'numeric' }}
                      />
                      <OrderStatusCell status={order.status} />
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
