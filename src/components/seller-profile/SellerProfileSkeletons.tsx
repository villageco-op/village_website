'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * The seller hero skeleton.
 * @returns Animated skeleton
 */
export function SellerHeroSkeleton() {
  return (
    <div className="bg-white pb-6 pt-8 shadow-sm">
      <div className="container-custom max-w-250">
        <Skeleton className="mb-6 h-4 w-28" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-48" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The seller stats row skeleton.
 * @returns Animated skeleton
 */
export function SellerStatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm md:grid-cols-4 md:divide-x md:divide-cream-dark">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center px-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/**
 * The seller about tab skeleton.
 * @returns Animated skeleton
 */
export function SellerAboutTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        <Skeleton className="mb-3 h-5 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>
      <div>
        <Skeleton className="mb-3 h-5 w-28" />
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <Card key={i} className="rounded-xl border-1.5 border-cream-dark p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The seller review card skeleton.
 * @returns Animated skeleton
 */
export function SellerReviewCardSkeleton() {
  return (
    <Card className="rounded-2xl border-1.5 border-cream-dark p-6 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="mb-1 h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="mt-4 h-4 w-32" />
    </Card>
  );
}

/**
 * The seller listing card skeleton.
 * @returns Animated skeleton
 */
export function SellerListingCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-1.5 border-cream-dark bg-white">
      <Skeleton className="h-25 w-full rounded-none" />
      <CardContent className="p-5">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <div className="mb-3 flex gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="mb-4 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Skeleton className="mb-1 h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * The seller listings tab skeleton.
 * @returns Animated skeleton
 */
export function SellerListingsTabSkeleton() {
  return (
    <div>
      <div className="mb-6 flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SellerListingCardSkeleton />
        <SellerListingCardSkeleton />
        <SellerListingCardSkeleton />
        <SellerListingCardSkeleton />
      </div>
    </div>
  );
}

/**
 * The quick order section skeleton.
 * @returns Animated skeleton
 */
export function QuickOrderSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {[1, 2].map((i) => (
        <Card key={i} className="rounded-xl border-1.5 border-cream-dark p-4 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center">
                <Skeleton className="mr-1.5 h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}
