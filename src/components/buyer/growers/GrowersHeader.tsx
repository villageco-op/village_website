'use client';

import { PageHeader } from '@/components/ui/page-header';

interface GrowersHeaderProps {
  activeCount: number;
  cityText: string;
}

/**
 * A greeting header for the buyer growers page.
 * @param props - Props for the subtitle data
 * @param props.activeCount - Active number of growers
 * @param props.cityText - Text for city/distance information
 * @returns A component displaying a greeting and the active growers count
 */
export function GrowersHeader({ activeCount, cityText }: GrowersHeaderProps) {
  return (
    <PageHeader
      title={`My Growers`}
      subtitle={`${activeCount} active relationship${activeCount !== 1 ? 's' : ''} · ${cityText}`}
    />
  );
}
