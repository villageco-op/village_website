'use client';

import { PageHeader } from '@/components/ui/page-header';
import { formatAppDate } from '@/lib/date-utils';

/**
 * The page header for the billing summary page.
 * @returns A header component
 */
export function BillingHeader() {
  const currentMonthYear = formatAppDate(new Date(), 'longMonthYear');

  return (
    <PageHeader
      title={`Billing Summary`}
      subtitle={`${currentMonthYear} · Transparent pricing · No hidden fees`}
    />
  );
}
