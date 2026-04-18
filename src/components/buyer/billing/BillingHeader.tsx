'use client';

import { PageHeader } from '@/components/ui/page-header';

/**
 * The page header for the billing summary page.
 * @returns A header component
 */
export function BillingHeader() {
  const currentMonthYear = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <PageHeader
      title={`Billing Summary`}
      subtitle={`${currentMonthYear} · Transparent pricing · No hidden fees`}
    />
  );
}
