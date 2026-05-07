'use client';

import { PageHeader } from '@/components/ui/page-header';
import { formatAppDate } from '@/lib/date-utils';

/**
 * The header for the seller earnings page.
 * @returns A bold header displaying the page title and dynamic subtitle.
 */
export function EarningsHeader() {
  const monthYear = formatAppDate(new Date(), 'longMonthYear');

  return (
    <PageHeader
      title="Earnings"
      subtitle={`${monthYear} · All earnings from Village produce sales`}
    />
  );
}
