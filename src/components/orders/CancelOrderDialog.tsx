'use client';

import { ReasonDialog } from '@/components/ui/reason-dialog';

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isPending: boolean;
}

/**
 * A dialog component for for cancelling an order.
 * @param props - Component props
 * @param props.isOpen - Is the dialog open
 * @param props.onClose - Called when closed
 * @param props.onConfirm - Called when confirmed
 * @param props.isPending - Is the cancel pending
 * @returns A dialog with an input for cancellation reason
 */
export function CancelOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: CancelOrderDialogProps) {
  return (
    <ReasonDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      title="Cancel Order"
      description="Are you sure you want to cancel this order? This action cannot be undone and will automatically issue a refund."
      placeholder="E.g., Out of stock, unexpected delay, changed my mind..."
      cancelText="Keep Order"
      confirmText="Confirm Cancellation"
      pendingText="Canceling..."
      confirmVariant="destructive"
    />
  );
}
