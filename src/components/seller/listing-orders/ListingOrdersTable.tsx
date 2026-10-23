'use client';

import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  IdentityCell,
  AmountCell,
  DateCell,
  StatusCell,
  FulfillmentCell,
  QuantityOzCell,
} from '@/components/ui/table-cells';
import { SelectableTableRow } from '@/components/ui/table-row-selectable';
import type { ProduceOrderListItem } from '@/lib/api/generated/models';

interface ListingOrdersTableProps {
  orders: ProduceOrderListItem[];
}

/**
 * A card containing a table of orders specifically for one produce listing.
 * Includes buyer information, quantities, and fulfillment details.
 *
 * @param props - Component props
 * @param props.orders - Array of order data items
 * @returns A table view of the orders
 */
export function ListingOrdersTable({ orders }: ListingOrdersTableProps) {
  const router = useRouter();

  return (
    <Card>
      <CardContent>
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
                <TableRow className="hover:bg-transparent">
                  <TableHead>Buyer</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="pr-4 sm:pr-2 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  return (
                    <SelectableTableRow
                      id={order.id}
                      key={order.id}
                      onSelect={() => router.push(`/orders/${order.id}`)}
                    >
                      <IdentityCell
                        id={order.buyer.id}
                        name={order.buyer.name ?? undefined}
                        image={order.buyer.image}
                        onNameClick={() => router.push(`/public-profile/${order.buyer.id}`)}
                      />
                      <QuantityOzCell quantityOz={order.quantityOz} />
                      <AmountCell amount={order.totalAmount} className="font-bold" />

                      <FulfillmentCell fulfillmentType={order.fulfillmentType} />

                      <DateCell
                        date={order.scheduledTime}
                        options={{ month: 'short', day: 'numeric', year: 'numeric' }}
                      />
                      <StatusCell status={order.status} />
                    </SelectableTableRow>
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
