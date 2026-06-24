'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the onboarding flow layout.
 * Mimics the isolated account type selection state to prevent cumulative layout shifts.
 * @returns An animated placeholder screen for the Suspense boundary.
 */
export function OnboardingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-xl w-full">
        {/* Step Progress Indicators Bar */}
        <div className="flex justify-center mb-8 space-x-2">
          {/* Matches the single active dot layout from the new root orchestrator */}
          <Skeleton className="h-2 w-8 rounded-full bg-black/5" />
        </div>

        {/* Form Card Content Container */}
        <div className="bg-cream/30 border border-border/20 shadow-sm rounded-xl p-8 min-h-100 flex flex-col justify-center relative space-y-6">
          {/* Step Header Title & Subtitle */}
          <div className="space-y-2 mb-4 text-center">
            <Skeleton className="h-7 w-56 bg-black/5 mx-auto" />
            <Skeleton className="h-4 w-72 bg-black/5 mx-auto" />
          </div>

          {/* Account Type Card Choice Selection Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {/* Individual Account Choice Card */}
            <div className="border border-border/10 rounded-xl p-5 space-y-3 flex flex-col items-center text-center">
              <Skeleton className="h-10 w-10 rounded-full bg-black/5" />
              <Skeleton className="h-5 w-28 bg-black/5" />
              <Skeleton className="h-3 w-full bg-black/5" />
              <Skeleton className="h-3 w-4/5 bg-black/5" />
            </div>

            {/* Organization Account Choice Card */}
            <div className="border border-border/10 rounded-xl p-5 space-y-3 flex flex-col items-center text-center">
              <Skeleton className="h-10 w-10 rounded-full bg-black/5" />
              <Skeleton className="h-5 w-32 bg-black/5" />
              <Skeleton className="h-3 w-full bg-black/5" />
              <Skeleton className="h-3 w-4/5 bg-black/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
