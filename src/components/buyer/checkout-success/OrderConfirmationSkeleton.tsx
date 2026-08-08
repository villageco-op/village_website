'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the order confirmation page fallback.
 * Mimics the central card layout, large success icon circle, headers, and bottom buttons.
 * @returns An animated placeholder screen for the checkout success Suspense boundary.
 */
export function OrderConfirmationSkeleton() {
  return (
    <div className="container-custom max-w-2xl mx-auto">
      <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
          {/* Success Icon Placeholder */}
          <Skeleton className="w-20 h-20 rounded-full bg-black/5 mb-6" />

          {/* Title Placeholder */}
          <Skeleton className="h-10 w-64 bg-black/5 mb-4 rounded-md" />

          {/* Text Content Placeholders */}
          <div className="space-y-2 flex flex-col items-center w-full max-w-md mb-2">
            <Skeleton className="h-5 w-full bg-black/5 rounded" />
            <Skeleton className="h-5 w-5/6 bg-black/5 rounded" />
          </div>

          {/* Subtext / Order Reference Placeholder */}
          <div className="space-y-2 flex flex-col items-center w-full max-w-xs mb-10 mt-2">
            <Skeleton className="h-4 w-48 bg-black/5 rounded" />
            <Skeleton className="h-3 w-56 bg-black/5 rounded opacity-70" />
          </div>

          {/* Action Buttons Placeholders */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            {/* Primary Action */}
            <Skeleton className="w-full sm:w-36 h-12 rounded-md bg-black/5" />
            {/* Secondary Action */}
            <Skeleton className="w-full sm:w-40 h-12 rounded-md bg-black/5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
