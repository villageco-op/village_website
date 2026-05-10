'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/state-displays';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order, OrderStatus } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

interface InvoiceHistoryCardProps {
  orders: Order[];
  onDownload: () => Promise<void>;
  isDownloading?: boolean;
  statusFilter: OrderStatus | 'all';
  setStatusFilter: (val: OrderStatus | 'all') => void;
  timeframeFilter: string;
  setTimeframeFilter: (val: string) => void;
}

/**
 * Displays a table of the buyer's completed orders with routing, filtering, and download functionality.
 * @param props - Props for the orders and filter states
 * @param props.orders - The orders to display
 * @param props.onDownload - When download is triggered
 * @param props.isDownloading - True when downloading is occurring
 * @param props.statusFilter - Currently selected status
 * @param props.setStatusFilter - When the status filter is set
 * @param props.timeframeFilter - Currently selected timeframe
 * @param props.setTimeframeFilter - When the timeframe is set
 * @returns A card containing filters and a table of orders
 */
export function InvoiceHistoryCard({
  orders,
  onDownload,
  isDownloading,
  statusFilter,
  setStatusFilter,
  timeframeFilter,
  setTimeframeFilter,
}: InvoiceHistoryCardProps) {
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
            onClick={() => void onDownload()}
            disabled={orders.length === 0 || isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Downloading...
              </>
            ) : (
              'Download All'
            )}
          </Button>
        </div>

        {/* Filters Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as OrderStatus | 'all')}
          >
            <SelectTrigger className="w-full sm:w-48 bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeframeFilter} onValueChange={(val) => setTimeframeFilter(val)}>
            <SelectTrigger className="w-full sm:w-48 bg-white">
              <SelectValue placeholder="Filter by timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          {(statusFilter !== 'all' || timeframeFilter !== 'all') && (
            <Button
              onClick={() => {
                setStatusFilter('all');
                setTimeframeFilter('all');
              }}
              className="text-sm font-semibold text-forest hover:underline"
              variant="ghost"
            >
              Clear filters
            </Button>
          )}
        </div>

        {orders.length === 0 ? (
          <EmptyState title="No orders found matching your filters." />
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
                const dateStr = formatAppDate(order.scheduledTime, 'dayMonth');

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
