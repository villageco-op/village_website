'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * The skeleton loader for the edit profile page.
 * @returns A set of skeletons mimicking the layout structure of the profile page
 */
export function EditProfileSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-off-white">
      <div className="max-w-2xl w-full">
        {/* Title Skeleton */}
        <Skeleton className="h-9 w-40 mb-6 bg-neutral-200 dark:bg-neutral-800" />

        {/* Tabs Switcher Skeleton */}
        <div className="flex space-x-6 border-b border-border/20 mb-8 pb-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>

        {/* Tab Content Area Card Skeleton */}
        <div className="bg-cream/30 border border-border/20 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
          {/* Mock Form Field 1 (e.g., Name / Profile Picture Placeholder) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Mock Form Field 2 (e.g., Email) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Mock Form Field 3 (e.g., Bio / Description) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>

          {/* Bottom Action Buttons (e.g., Save Changes) */}
          <div className="flex justify-end pt-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
