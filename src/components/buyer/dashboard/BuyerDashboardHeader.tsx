'use client';

import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/hooks/useAuth';

/**
 * A greeting header for buyers.
 * @returns A component displaying a greeting and the buyer's organization
 */
export function BuyerDashboardHeader() {
  const { user } = useAuth();

  const name = user?.name?.split(' ')[0] || 'Buyer';

  // Basic date formatting for "Week of..."
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  const formattedWeek = `${weekStart.toLocaleString('default', { month: 'short' })} ${weekStart.getDate()}–${weekEnd.getDate()}`;

  return <PageHeader title={`Order Dashboard`} subtitle={`${name} · Week of ${formattedWeek}`} />;
}
