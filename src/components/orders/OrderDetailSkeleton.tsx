'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the order detail page.
 * @returns An animated skeleton page
 */
export function OrderDetailSkeleton() {
  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" /> {/* Back button */}
          <Skeleton className="h-9 w-64" /> {/* Title */}
          <Skeleton className="h-4 w-40" /> {/* Subtitle */}
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {/* Summary Card */}
          <Card className="rounded-xl border-border bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Items Table Card */}
          <Card className="rounded-xl border-border bg-white shadow-sm">
            <CardContent className="p-6">
              <Skeleton className="mb-6 h-6 w-32" />
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between border-b py-4 last:border-0">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Location Map Skeleton */}
          <Card className="rounded-xl border-border bg-white shadow-sm">
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-32" />
              <Skeleton className="mb-4 h-52 w-full rounded-[10px]" /> {/* Map Block */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" /> {/* Copy button */}
                  <Skeleton className="h-9 flex-1" /> {/* Open maps button */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* User Cards Skeletons */}
          {[1, 2].map((i) => (
            <Card key={i} className="rounded-xl border-border bg-white shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="mb-6 h-6 w-32" />
                <div className="space-y-5">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
