'use client';

import { PageHeader } from '@/components/ui/page-header';

/**
 * The header for the seller earnings page.
 * @returns A bold header displaying the page title and dynamic subtitle.
 */
export function EarningsHeader() {
  const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <PageHeader
      title="Earnings"
      subtitle={`${monthYear} · All earnings from Village produce sales`}
    />
  );
}
