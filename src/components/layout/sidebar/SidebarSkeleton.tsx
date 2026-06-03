'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton component for the deep-forest themed Sidebar.
 * Matches the structure of the uncollapsed sidebar during initial page/status loading.
 * @returns Animated grouping of sidebar skeleton elements
 */
export function SidebarSkeleton() {
  return (
    <div className="sticky top-16 self-start flex flex-col h-[calc(100vh-64px)] w-58 bg-forest-dark transition-all duration-300 ease-in-out">
      {/* Scrollable Main Section Placeholder */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col">
          {/* SidebarProfile Skeleton */}
          <div className="flex items-center gap-3 px-4.5 py-5 border-b border-white/5">
            <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-24 bg-white/10" />
              <Skeleton className="h-3 w-16 bg-white/10" />
            </div>
          </div>

          {/* Navigation Groups Skeletons */}
          <div className="flex-1 py-4.5 space-y-6">
            {[1, 2].map((groupIndex) => (
              <div key={groupIndex} className="pb-1">
                {/* Group Label Header */}
                <div className="flex items-center gap-1.5 px-4.5 pb-3">
                  <div className="h-px w-3.5 bg-lime/20" />
                  <Skeleton className="h-2.5 w-14 bg-lime/20" />
                </div>

                {/* Group Nav Items */}
                <div className="flex flex-col space-y-2 px-4.5">
                  {[1, 2, 3].map((itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2.5 py-2.25">
                      <Skeleton className="h-7.5 w-7.5 rounded-lg bg-white/10 shrink-0" />
                      <Skeleton className="h-3.5 w-24 bg-white/10" />
                    </div>
                  ))}
                </div>

                {/* Divider between mock groups */}
                {groupIndex === 1 && <Separator className="mx-4.5 mt-4.5 w-auto bg-white/5" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Collapse Section Skeleton */}
      <div className="w-full shrink-0 pb-4 pt-2">
        <Separator className="mx-4.5 mb-4 w-auto bg-white/5" />
        <div className="flex w-full items-center gap-2.5 px-4.5 py-2.25 opacity-60">
          <Skeleton className="h-7.5 w-7.5 rounded-lg bg-white/10 shrink-0" />
          <Skeleton className="h-3.5 w-28 bg-white/10" />
        </div>
      </div>
    </div>
  );
}
