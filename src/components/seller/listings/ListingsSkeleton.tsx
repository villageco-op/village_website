'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * A skeleton for the seller listings page loading state.
 * @returns Animated skeleton component
 */
export function ListingsSkeleton() {
  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl border border-border bg-white p-6 shadow-sm"
          >
            <Skeleton className="mb-4 h-10 w-10 rounded-full" />
            <Skeleton className="mb-2 h-5 w-32" />
            <Skeleton className="mb-4 h-3 w-48" />
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="mb-2 h-3 w-full" />
            <Skeleton className="mb-4 h-3 w-3/4" />
            <Skeleton className="mb-2 h-1.5 w-full rounded-full" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
