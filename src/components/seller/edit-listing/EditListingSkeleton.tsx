'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * The skeleton loader for the edit produce listing page.
 * @returns A skeleton structure mimicking the edit listing layout
 */
export function EditListingSkeleton() {
  return (
    <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section Skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Back Button Placeholder */}
            <Skeleton className="h-4 w-28 mb-4 -ml-3" />

            {/* Title & Status Badge Placeholder */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-44" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Form Content Mock Structure */}
        <div className="space-y-6">
          {/* ListingImageUpload Skeleton */}
          <div className="border border-border/20 rounded-xl bg-white p-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg border border-dashed border-neutral-200" />
            </div>
          </div>

          {/* ListingBasicInfo Skeleton */}
          <div className="border border-border/20 rounded-xl bg-white p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
          </div>

          {/* ListingPricingInventory Skeleton */}
          <div className="border border-border/20 rounded-xl bg-white p-6 space-y-4">
            <Skeleton className="h-5 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>

          {/* ListingHarvestDetails Skeleton */}
          <div className="border border-border/20 rounded-xl bg-white p-6 space-y-4">
            <Skeleton className="h-5 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-48 rounded-lg" />
            </div>
          </div>

          {/* ListingStatusActions (Danger zone/Archive bar) */}
          <div className="border border-border/20 rounded-xl bg-white p-6 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>

          {/* Bottom Cancel & Submit Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 pb-12">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
