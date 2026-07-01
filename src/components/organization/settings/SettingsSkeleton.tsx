'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * The loading skeleton for the organiztion settings tab.
 * @returns A skeleton loader component
 */
export function SettingsSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-off-white">
      <div className="max-w-2xl w-full">
        {/* Title Skeleton */}
        <Skeleton className="h-9 w-32 mb-6 bg-neutral-200" />

        {/* Tab Switchers Skeleton */}
        <div className="flex space-x-6 border-b border-border/20 mb-8 pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-36" />
        </div>

        {/* Content Card Skeleton */}
        <div className="bg-cream/30 border border-border/20 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Grid fields skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          </div>

          <div className="pt-6 border-t border-border/10">
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
