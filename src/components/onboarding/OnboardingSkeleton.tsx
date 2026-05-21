'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the onboarding flow layout.
 * Mimics the multi-step layout, indicator bars, and card dimensions of OnboardingFlow.
 * @returns An animated placeholder screen for the Suspense boundary.
 */
export function OnboardingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-xl w-full">
        {/* Step Progress Indicators Bar */}
        <div className="flex justify-center mb-8 space-x-2">
          {/* We display a standard baseline of steps (e.g., 4 items) to mirror the loading state layout */}
          <Skeleton className="h-2 w-8 rounded-full bg-black/5" />
          <Skeleton className="h-2 w-4 rounded-full bg-black/5" />
          <Skeleton className="h-2 w-4 rounded-full bg-black/5" />
          <Skeleton className="h-2 w-4 rounded-full bg-black/5" />
        </div>

        {/* Form Card Content Container */}
        <div className="bg-cream/30 border border-border/20 shadow-sm rounded-xl p-8 min-h-100 flex flex-col justify-center relative space-y-6">
          {/* Step Header Title & Subtitle */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-7 w-48 bg-black/5" />
            <Skeleton className="h-4 w-72 bg-black/5" />
          </div>

          {/* Core Content Body Placeholders */}
          <div className="space-y-4 w-full">
            {/* Field Input 1 */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-black/5" />
              <Skeleton className="w-full h-11 rounded-md bg-black/5" />
            </div>

            {/* Field Input 2 */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-black/5" />
              <Skeleton className="w-full h-11 rounded-md bg-black/5" />
            </div>

            {/* Field Input 3 */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-black/5" />
              <Skeleton className="w-full h-24 rounded-md bg-black/5" />
            </div>
          </div>

          {/* Form Actions/Button Section */}
          <div className="pt-4 flex justify-end w-full">
            <Skeleton className="w-32 h-11 rounded-md bg-black/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
