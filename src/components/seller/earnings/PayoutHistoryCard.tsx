'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Payout } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

/**
 * Props for the payout history card.
 */
interface PayoutHistoryCardProps {
  payouts: Payout[];
  onDownload: () => Promise<void>;
  isDownloading?: boolean;
  timeframeFilter: string;
  setTimeframeFilter: (val: string) => void;
}

/**
 * A table card displaying the payout history for past produce sales.
 * @param props - Props containing the payouts
 * @param props.payouts - An array of seller payouts
 * @param props.onDownload - When download is triggered
 * @param props.isDownloading - True when downloading is occurring
 * @param props.timeframeFilter - Currently selected timeframe
 * @param props.setTimeframeFilter - When the timeframe is set
 * @returns A card containing a table displaying the sellers payout history
 */
export function PayoutHistoryCard({
  payouts,
  onDownload,
  isDownloading,
  timeframeFilter,
  setTimeframeFilter,
}: PayoutHistoryCardProps) {
  return (
    <Card className="rounded-xl border border-[rgba(42,75,40,0.08)] bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[0.95rem] font-bold text-ink">Payout History</h2>
            <p className="mt-0.5 font-sans text-[0.78rem] text-ink-3">Last 3 months</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => void onDownload()}
            disabled={payouts.length === 0 || isDownloading}
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

          {timeframeFilter !== 'all' && (
            <Button
              onClick={() => setTimeframeFilter('all')}
              className="text-sm font-semibold text-forest hover:underline"
              variant="ghost"
            >
              Clear filter
            </Button>
          )}
        </div>

        {payouts.length === 0 ? (
          <div className="py-8 text-center font-sans text-sm text-ink-3">
            No payout history found.
          </div>
        ) : (
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-[rgba(42,75,40,0.08)]">
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Date
                </TableHead>
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Crop
                </TableHead>
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Qty Sold
                </TableHead>
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Buyer
                </TableHead>
                <TableHead className="font-heading text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink-3">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout, i) => {
                const dateStr = formatAppDate(payout.date, 'short');

                return (
                  <TableRow key={i} className="border-[rgba(42,75,40,0.05)] hover:bg-off-white">
                    <TableCell className="py-3.5 font-sans text-[0.82rem] text-ink-2">
                      {dateStr}
                    </TableCell>
                    <TableCell className="py-3.5 font-heading font-bold text-ink">
                      {payout.productName}
                    </TableCell>
                    <TableCell className="py-3.5 font-sans text-[0.82rem] text-ink-2">
                      {payout.quantityLbs} lbs
                    </TableCell>
                    <TableCell className="py-3.5 font-sans text-[0.82rem] text-ink-2">
                      {payout.buyerName}
                    </TableCell>
                    <TableCell className="py-3.5 font-heading font-bold text-click-green">
                      +${payout.amountDollars.toFixed(2)}
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
