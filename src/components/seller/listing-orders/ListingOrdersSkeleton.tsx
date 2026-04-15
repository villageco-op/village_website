'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the listing orders page.
 * Mimics the header and the orders table.
 *
 * @returns Skeleton UI
 */
export function ListingOrdersSkeleton() {
  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" /> {/* Back button */}
          <Skeleton className="h-9 w-40" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Subtitle */}
        </div>
      </div>

      {/* Table Card Skeleton */}
      <Card className="rounded-xl border-border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="space-y-4">
            {/* Table Header mock */}
            <div className="flex justify-between border-b border-border/50 pb-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Table Rows mock */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border/50 py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
