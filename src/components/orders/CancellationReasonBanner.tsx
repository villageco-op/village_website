import { AlertCircle } from 'lucide-react';

interface CancellationReasonBannerProps {
  reason: string;
}

/**
 * Cancellation banner for cancelled orders.
 * @param props - Component props
 * @param props.reason - The cancellation reason
 * @returns A slim banner with an alert icon and the reason
 */
export function CancellationReasonBanner({ reason }: CancellationReasonBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-bold">Cancellation Reason</p>
        <p className="mt-1">{reason}</p>
      </div>
    </div>
  );
}
