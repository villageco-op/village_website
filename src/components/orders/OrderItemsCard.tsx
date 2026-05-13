'use client';

import { Package } from 'lucide-react';
import router from 'next/router';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { OrderDetailResponseItemsItem } from '@/lib/api/generated/models';

interface OrderItemsCardProps {
  items: OrderDetailResponseItemsItem[];
}

/**
 * Displays a table of order items for an order.
 * @param props - Component props
 * @param props.items - The order items
 * @returns A card displaying a table of order items
 */
export function OrderItemsCard({ items }: OrderItemsCardProps) {
  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-0 sm:p-6">
        <div className="flex items-center gap-2 px-6 pt-6 sm:px-0 sm:pt-0 mb-4 border-b border-border/50 pb-4">
          <Package className="h-5 w-5 text-ink-3" />
          <h2 className="font-heading text-lg font-bold text-ink">Order Items</h2>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center text-sm text-ink-3">No items found in this order.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-heading text-xs font-bold text-ink-3">
                    Product
                  </TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3 text-right">
                    Quantity
                  </TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3 text-right">
                    Price/lb
                  </TableHead>
                  <TableHead className="font-heading text-xs font-bold text-ink-3 text-right">
                    Subtotal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const quantityLbs = Number(item.quantityOz || 0) / 16;
                  const pricePerLb = Number(item.pricePerOz || 0) * 16;
                  const subtotal = quantityLbs * pricePerLb;

                  return (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer border-border/50 hover:bg-off-white"
                      onClick={() => void router.push(`/produce/${item.id}`)}
                    >
                      <TableCell className="font-medium text-ink">
                        {item.productName || 'Unknown Product'}
                      </TableCell>
                      <TableCell className="text-right text-ink-3">
                        {quantityLbs.toFixed(1).replace(/\.0$/, '')} lbs
                      </TableCell>
                      <TableCell className="text-right text-ink-3">
                        ${pricePerLb.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-ink">
                        ${subtotal.toFixed(2)}
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
