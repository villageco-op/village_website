'use client';

import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/hooks/useAuth';
import type { Location } from '@/lib/api/generated/models/location';

/**
 * Props for the dashboard header.
 */
interface DashboardHeaderProps {
  location?: Location;
}

/**
 * A greeting header for sellers.
 * @param props - The props for the location
 * @param props.location - The sellers location
 * @returns A component displaying a greeting and the sellers name and address
 */
export function DashboardHeader({ location }: DashboardHeaderProps) {
  const { user } = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'Seller';

  // Basic date formatting for "Week of..."
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  const formattedWeek = `${weekStart.toLocaleString('default', { month: 'short' })} ${weekStart.getDate()}–${weekEnd.getDate()}`;

  const address = location?.address || 'No plot address';
  const city = location?.city ? `, ${location.city}` : '';

  return (
    <PageHeader
      title={`Good morning, ${firstName}`}
      subtitle={`Week of ${formattedWeek} · Plot: ${address}${city}`}
    />
  );
}
