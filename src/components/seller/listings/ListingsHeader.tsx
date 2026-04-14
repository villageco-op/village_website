'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

/**
 * Props for the listings header.
 */
interface ListingsHeaderProps {
  activeCount: number;
}

/**
 * The header for the seller listings page.
 * @param props - Listings header props
 * @param props.activeCount - The number of active listings the seller has up
 * @returns A component containing a bold header and a new listing button
 */
export function ListingsHeader({ activeCount }: ListingsHeaderProps) {
  return (
    <PageHeader
      title="My Listings"
      subtitle={`${activeCount} active · Visible to buyers on the Village marketplace`}
      actions={
        <Button variant="lime" size="sm" className="text-xs font-semibold">
          + New listing
        </Button>
      }
    />
  );
}
