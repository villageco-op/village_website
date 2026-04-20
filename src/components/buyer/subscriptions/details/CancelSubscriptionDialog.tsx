'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

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
  const [reason, setReason] = useState('');

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    await onConfirm(reason);
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-deep-forest">
            Cancel Subscription
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this recurring subscription? You will still receive any
            orders that have already been processed for this cycle.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2">
          <label htmlFor="reason" className="text-sm font-semibold text-ink">
            Reason for cancellation <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="reason"
            placeholder="E.g., Moving away, too much food, no longer needed..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            className="resize-none border-forest-dark/20 focus-visible:ring-lime"
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleConfirm()}
            disabled={isPending || !reason.trim()}
          >
            {isPending ? 'Canceling...' : 'Confirm Cancellation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
