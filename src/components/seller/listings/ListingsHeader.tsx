'use client';

import { Button } from '@/components/ui/button';

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
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="mb-1 font-heading text-[1.6rem] font-extrabold tracking-[-0.025em] text-ink">
          My Listings
        </h1>
        <p className="font-sans text-[0.88rem] text-ink-3">
          {activeCount} active · Visible to buyers on the Village marketplace
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5">
        <Button variant="lime" size="sm" className="text-xs font-semibold">
          + New listing
        </Button>
      </div>
    </div>
  );
}
