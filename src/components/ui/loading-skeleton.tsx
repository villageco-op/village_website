import { Skeleton } from '@/components/ui/skeleton';

interface PageSkeletonProps {
  heights?: string[];
  className?: string;
}

/**
 * A consolidated, highly reusable row-based loading skeleton component.
 * @param props - Component props
 * @param props.heights - Array of Tailwind height classes for each row (e.g., ['h-20', 'h-32', 'h-64'])
 * @param props.className - Optional custom wrapper class names
 * @returns The skeleton component
 */
export default function LoadingSkeleton({
  heights = ['h-64'],
  className = 'flex w-full flex-col space-y-6',
}: PageSkeletonProps) {
  return (
    <div className={className}>
      {heights.map((height, index) => (
        <Skeleton key={index} className={`${height} w-full rounded-xl`} />
      ))}
    </div>
  );
}
