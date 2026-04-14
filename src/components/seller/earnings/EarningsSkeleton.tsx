'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * The skeleton loader for the seller earnings page.
 * @returns A set of skeletons mimicking the seller earnings page
 */
export function EarningsSkeleton() {
  return (
    <div className="flex w-full flex-col">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stat Row Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-xl border-border bg-white shadow-sm">
            <CardContent className="p-5 space-y-2.5">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goal Card Skeleton */}
      <Card className="mb-5 rounded-xl border-border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="mb-4 h-12 w-48" />
          <Skeleton className="mb-6 h-3 w-full rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table Skeleton */}
      <Card className="rounded-xl border-border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
