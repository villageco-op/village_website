'use client';

import { ReasonDialog } from '@/components/ui/reason-dialog';

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isPending: boolean;
}

/**
 * A dialog component for for canceling a subscription.
 * @param props - Component props
 * @param props.isOpen - Is the dialog open
 * @param props.onClose - Called when closed
 * @param props.onConfirm - Called when confirmed
 * @param props.isPending - Is the cancel pending
 * @returns A dialog with an input for cancelation reason
 */
export function CancelSubscriptionDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: CancelSubscriptionDialogProps) {
  return (
    <ReasonDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      title="Cancel Subscription"
      description="Are you sure you want to cancel this recurring subscription? You will still receive any orders that have already been processed for this cycle."
      placeholder="E.g., Moving away, too much food, no longer needed..."
      cancelText="Keep Subscription"
      confirmText="Confirm Cancellation"
      pendingText="Canceling..."
      confirmVariant="destructive"
    />
  );
}
