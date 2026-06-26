'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loading component matching the accept invite page layout.
 * @returns Animated skeleton loader
 */
export function AcceptInviteSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Card Container */}
        <div className="bg-white border border-lime/30 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
          {/* Organization Avatar & Header Skeleton */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Skeleton className="h-16 w-16 rounded-full bg-black/5" />
            <Skeleton className="h-6 w-48 bg-black/5" />
            <Skeleton className="h-4 w-64 bg-black/5" />
          </div>

          {/* Form Skeleton */}
          <div className="space-y-4 pt-4 border-t border-border/10">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-black/5" />
              <Skeleton className="h-9 w-full bg-black/5" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-black/5" />
              <Skeleton className="h-9 w-full bg-black/5" />
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="pt-2">
            <Skeleton className="h-10 w-full bg-black/5 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
