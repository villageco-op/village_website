import { PauseCircle } from 'lucide-react';

interface PauseReasonBannerProps {
  reason: string;
}

/**
 * Banner for paused orders or items.
 * @param props Component props
 * @param props.reason The pause reason
 * @returns A slim banner with a pause icon and the reason
 */
export function PauseReasonBanner({ reason }: PauseReasonBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
      <PauseCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <p className="font-bold">Pause Reason</p>
        <p className="mt-1">{reason}</p>
      </div>
    </div>
  );
}
