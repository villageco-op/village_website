'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/state-displays';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  IdentityCell,
  AmountCell,
  FulfillmentCell,
  LocationCell,
  OrderProductCell,
  DateTimeCell,
} from '@/components/ui/table-cells';
import { SelectableTableRow } from '@/components/ui/table-row-selectable';
import type { OrderSummary } from '@/lib/api/generated/models';

interface UpcomingOrdersCardProps {
  orders: OrderSummary[];
  total: number;
  userRole: 'seller' | 'buyer';
}

/**
 * A card containing a table of upcoming orders for the buyer.
 * @param props - Component props
 * @param props.orders - Array of order data items
 * @param props.total - The total number of orders
 * @param props.userRole - The users role
 * @returns A table view of the upcoming orders
 */
export function UpcomingOrdersCard({ orders, total, userRole }: UpcomingOrdersCardProps) {
  const router = useRouter();
  const hasMoreOrders = orders.length < total;

  return (
    <Card>
      <CardContent className="p-0 sm:p-6">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-6 sm:px-0 sm:pt-0 gap-3">
          <div>
            <h2 className="font-heading text-[1.05rem] font-bold text-ink">Upcoming Orders</h2>
            <p className="mt-0.5 font-sans text-[0.8rem] text-ink-3">
              `Showing ${orders.length}/${total}`
            </p>
          </div>

          {hasMoreOrders && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/${userRole}/orders`}>View all</Link>
            </Button>
          )}
        </div>

        {orders.length === 0 ? (
          <EmptyState title="No upcoming orders" />
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

                  const counterparty =
                    order.counterparty || (userRole === 'seller' ? order.buyer : order.seller);
                  const counterpartyName = counterparty?.name || userRole;
                  const counterpartyId = userRole === 'seller' ? order.buyerId : order.sellerId;

                  return (
                    <SelectableTableRow
                      id={order.id}
                      key={order.id}
                      onSelect={() => router.push(`/orders/${order.id}`)}
                    >
                      <OrderProductCell
                        title={product?.title}
                        image={product?.images?.[0]}
                        extraCount={extraItemsCount}
                      />

                      <IdentityCell
                        id={counterpartyId}
                        name={counterpartyName}
                        onNameClick={() => void router.push(`/public-profile/${counterpartyId}`)}
                        avatarFallback={false}
                      />

                      <AmountCell amount={order.totalAmount} />

                      <DateTimeCell date={order.scheduledTime} />

                      <LocationCell location={counterparty?.location} />

                      <FulfillmentCell fulfillmentType={order.fulfillmentType} />
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
