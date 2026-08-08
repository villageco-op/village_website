import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the CTA card within the join org page.
 * @returns A card containing skeleton loaders
 */
export function AddOrganizationCardSkeleton() {
  return (
    <CardContent className="flex flex-col items-center p-0">
      {/* Card Title Skeleton */}
      <Skeleton className="h-7 w-64 mb-2" />

      {/* Card Description Skeleton */}
      <Skeleton className="h-4 w-full max-w-md mb-2" />
      <Skeleton className="h-4 w-3/4 max-w-md mb-6" />

      {/* Action Button Skeleton */}
      <Skeleton className="h-11 w-52 rounded-md" />
    </CardContent>
  );
}
