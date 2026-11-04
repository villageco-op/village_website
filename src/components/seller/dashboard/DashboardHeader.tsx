'use client';

import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/hooks/useAuth';
import { getTimeGreeting, formatWeekRange } from '@/lib/date-utils';

interface DashboardHeaderProps {
  /** Optional IANA timezone string (e.g. 'America/New_York'). Defaults to user browser time. */
  timeZone?: string;
}

/**
 * A greeting header for sellers.
 * @param props - Component props
 * @param props.timeZone - Optional IANA timezone string
 * @returns A component displaying a greeting and the current week
 */
export function DashboardHeader({ timeZone }: DashboardHeaderProps) {
  const { user } = useAuth();

  const firstName = user?.name?.split(' ')[0] || '';

  const greeting = getTimeGreeting(new Date(), timeZone);
  const formattedGreeting = firstName ? `${greeting}, ${firstName}` : greeting;

  const formattedWeek = formatWeekRange(new Date(), timeZone);

  return <PageHeader title={formattedGreeting} subtitle={`Week of ${formattedWeek}`} />;
}
