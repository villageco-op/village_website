'use client';

import { ReasonDialog } from '@/components/ui/reason-dialog';

interface SellerUpdateStatusDialogProps {
  isOpen: boolean;
  action: 'canceled' | 'paused' | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isPending: boolean;
}

/**
 * A dialog component tailored for sellers to pause or cancel a subscription.
 * @param props - Component props
 * @param props.isOpen - Is the dialog open
 * @param props.action - Status action (paused or canceled)
 * @param props.onClose - Called when closed
 * @param props.onConfirm - Called when confirmed
 * @param props.isPending - Is the cancel pending
 * @returns A dialog forcing the user to provide a reason for halting the subscription.
 */
export function SellerUpdateStatusDialog({
  isOpen,
  action,
  onClose,
  onConfirm,
  isPending,
}: SellerUpdateStatusDialogProps) {
  const isCancel = action === 'canceled';

  return (
    <ReasonDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      title={isCancel ? 'Cancel Subscription' : 'Pause Subscription'}
      description={
        isCancel
          ? 'Are you sure you want to permanently cancel this subscription? The buyer will be notified.'
          : 'Are you sure you want to pause this subscription? Orders will stop generating until you resume it. The buyer will be notified.'
      }
      label={`Reason for ${isCancel ? 'cancellation' : 'pausing'}`}
      placeholder={
        isCancel
          ? 'E.g., Plot is shutting down, no longer growing this crop...'
          : 'E.g., Low inventory this month, pest damage, crop resting...'
      }
      cancelText="Keep Active"
      confirmText={`Confirm ${isCancel ? 'Cancel' : 'Pause'}`}
      pendingText="Updating..."
      confirmVariant="destructive"
    />
  );
}
