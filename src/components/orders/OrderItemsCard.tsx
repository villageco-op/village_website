'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AmountCell, OrderProductCell, QuantityOzCell } from '@/components/ui/table-cells';
import { SelectableTableRow } from '@/components/ui/table-row-selectable';
import type { OrderItemDetails } from '@/lib/api/generated/models';

interface OrderItemsCardProps {
  items: OrderItemDetails[];
}

/**
 * Displays a table of order items for an order.
 * @param props - Component props
 * @param props.items - The order items
 * @returns A card displaying a table of order items
 */
export function OrderItemsCard({ items }: OrderItemsCardProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 sm:p-6">
        <div className="flex items-center gap-2 px-6 pt-6 sm:px-0 sm:pt-0 mb-4 border-b border-border/50 pb-4">
          <h2 className="font-heading text-lg font-bold text-ink">Order Items</h2>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center text-sm text-ink-3">No items found in this order.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/oz</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const quantityOz = Number(item.quantityOz || 0);
                  const pricePerOz = Number(item.pricePerOz || 0);
                  const subtotal = quantityOz * pricePerOz;
                  const itemImage = item.images?.[0];

                  return (
                    <SelectableTableRow
                      id={item.id}
                      key={item.id}
                      onSelect={() => void router.push(`/produce/${item.productId}`)}
                    >
                      <OrderProductCell title={item.productName} image={itemImage} />

                      <QuantityOzCell quantityOz={quantityOz} />

                      <AmountCell amount={pricePerOz} />

                      <AmountCell amount={subtotal} />
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
