'use client';

import { PageHeader } from '@/components/ui/page-header';

/**
 * Props for the orders header.
 */
interface OrdersHeaderProps {
  pendingCount: number;
}

/**
 * The header for the seller orders page.
 * @param props - Props for the pending count
 * @param props.pendingCount - Number of pending orders
 * @returns A bold header and the pending orders count
 */
export function OrdersHeader({ pendingCount }: OrdersHeaderProps) {
  return (
    <PageHeader
      title="Orders"
      subtitle={`${pendingCount} pending · All time orders from buyers on Village`}
    />
  );
}
