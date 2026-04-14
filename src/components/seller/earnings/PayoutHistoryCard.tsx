'use client';

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
import type { Payout } from '@/lib/api/generated/models';
import { handleDownloadSellerPayoutsCSV } from '@/lib/csv-utils';

/**
 * Props for the payout history card.
 */
interface PayoutHistoryCardProps {
  payouts: Payout[];
}

/**
 * A table card displaying the payout history for past produce sales.
 * @param props - Props containing the payouts
 * @param props.payouts - An array of seller payouts
 * @returns A card containing a table displaying the sellers payout history
 */
export function PayoutHistoryCard({ payouts }: PayoutHistoryCardProps) {
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
            onClick={() => void handleDownloadSellerPayoutsCSV(payouts)}
            disabled={payouts.length === 0}
          >
            Download
          </Button>
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
                const dateStr = new Date(payout.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

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
