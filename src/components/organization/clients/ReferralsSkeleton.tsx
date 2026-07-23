import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for the referrals modal.
 * @param props - Component props
 * @param props.rows - The number or table rows
 * @returns A loading skeleton component
 */
export function ReferralsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3"
        >
          {/* Avatar + Name/Email */}
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-7 w-7 rounded-full bg-slate-200" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28 bg-slate-200" />
              <Skeleton className="h-2.5 w-36 bg-slate-200" />
            </div>
          </div>

          {/* Status Badge Placeholder */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 rounded-full bg-slate-200" />
            <Skeleton className="h-3 w-12 bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
