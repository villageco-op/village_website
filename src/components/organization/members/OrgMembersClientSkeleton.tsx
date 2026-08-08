'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the Organization Members management page.
 * @returns An animated skeleton UI matching the Org Members layout
 */
export function OrgMembersSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" /> {/* Title: Organization Members */}
          <Skeleton className="h-4 w-80" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-44 rounded-md" /> {/* Invite Button */}
      </div>

      {/* Table & Controls Container */}
      <Card className="rounded-xl border border-border bg-white shadow-sm">
        <CardContent className="p-6">
          {/* Search and Filter Inputs Skeleton */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-10 w-full max-w-sm" /> {/* Search Input */}
            <Skeleton className="h-10 w-40" /> {/* Role Filter Dropdown */}
          </div>

          {/* Table Skeleton */}
          <div className="space-y-4">
            {/* Table Header Row */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex flex-1 items-center gap-4">
                <Skeleton className="h-4 w-24" /> {/* Member Column Label */}
              </div>
              <div className="flex flex-1 justify-center">
                <Skeleton className="h-4 w-16" /> {/* Role Column Label */}
              </div>
              <div className="flex flex-1 justify-end">
                <Skeleton className="h-4 w-12" /> {/* Actions Column Label */}
              </div>
            </div>

            {/* Simulated Table Rows */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b py-4 last:border-0"
              >
                {/* Member Identity (Avatar + Name/Email) */}
                <div className="flex flex-1 items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>

                {/* Role Badge Placeholder */}
                <div className="flex flex-1 justify-center">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Actions Button Placeholder */}
                <div className="flex flex-1 justify-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
