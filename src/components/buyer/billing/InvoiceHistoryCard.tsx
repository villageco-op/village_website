'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order } from '@/lib/api/generated/models';
import { handleDownloadBuyerInvoicesCSV } from '@/lib/csv-utils';

interface InvoiceHistoryCardProps {
  orders: Order[];
}

/**
 * Displays a table of the buyer's completed orders with routing and download functionality.
 * @param props - Props for the orders
 * @param props.orders - List of past orders
 * @returns A card containing a table of orders with download buttons
 */
export function InvoiceHistoryCard({ orders }: InvoiceHistoryCardProps) {
  const router = useRouter();

  return (
    <Card className="rounded-xl border border-[rgba(42,75,40,0.08)] bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[0.95rem] font-bold text-ink">Invoice History</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => void handleDownloadBuyerInvoicesCSV(orders)}
            disabled={orders.length === 0}
          >
            Download all
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center font-sans text-sm text-ink-3">
            No invoice history found.
          </div>
        ) : (
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-[rgba(42,75,40,0.08)] hover:bg-transparent">
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Date
                </TableHead>
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Order ID
                </TableHead>
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Type
                </TableHead>
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Total
                </TableHead>
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const dateStr = order.scheduledTime
                  ? new Date(order.scheduledTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—';

                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer border-[rgba(42,75,40,0.05)] hover:bg-off-white"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    <TableCell className="py-3.5 font-sans text-[0.82rem] text-ink-2">
                      {dateStr}
                    </TableCell>
                    <TableCell className="py-3.5 font-heading font-bold text-ink">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="py-3.5 font-sans text-[0.82rem] capitalize text-ink-2">
                      {order.fulfillmentType}
                    </TableCell>
                    <TableCell className="py-3.5 font-sans text-[0.82rem] text-ink-2">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (order.stripeReceiptUrl) {
                            window.open(order.stripeReceiptUrl, '_blank');
                          } else {
                            toast.error('Receipt link unavailable. Please refresh and try again.');
                          }
                        }}
                      >
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
