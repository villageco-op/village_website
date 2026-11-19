'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { OrderBuyerReport, OrderSellerReport } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

interface OrderStatusReportCardProps {
  report?: OrderBuyerReport | OrderSellerReport;
  reportedAt?: Date | string | null;
}

/**
 * Status report card for order details.
 * @param props - Component props
 * @param props.report - The buyer or seller report
 * @param props.reportedAt - When the report was created
 * @returns The card component
 */
export function OrderStatusReportCard({ report, reportedAt }: OrderStatusReportCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-2 font-heading text-[0.95rem] font-bold text-ink">
          Order Status Report
        </div>
        {!report ? (
          <p className="font-sans text-[0.84rem] text-ink-2">Pending confirmation</p>
        ) : (
          <div className="flex flex-col gap-1 font-sans text-[0.84rem] text-ink-2">
            <div>
              <span className="font-semibold capitalize">Status:</span> {report.replace('_', ' ')}
            </div>
            {reportedAt && (
              <div>
                <span className="font-semibold">At:</span> {formatAppDate(reportedAt, 'full')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
