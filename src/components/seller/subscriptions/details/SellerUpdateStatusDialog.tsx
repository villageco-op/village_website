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
  const [reason, setReason] = useState('');

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    await onConfirm(reason);
  };

  const isCancel = action === 'canceled';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-deep-forest">
            {isCancel ? 'Cancel Subscription' : 'Pause Subscription'}
          </DialogTitle>
          <DialogDescription>
            {isCancel
              ? 'Are you sure you want to permanently cancel this subscription? The buyer will be notified.'
              : 'Are you sure you want to pause this subscription? Orders will stop generating until you resume it. The buyer will be notified.'}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2">
          <label htmlFor="reason" className="text-sm font-semibold text-ink">
            Reason for {isCancel ? 'cancellation' : 'pausing'}{' '}
            <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="reason"
            placeholder={
              isCancel
                ? 'E.g., Plot is shutting down, no longer growing this crop...'
                : 'E.g., Low inventory this month, pest damage, crop resting...'
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            className="resize-none border-forest-dark/20 focus-visible:ring-lime"
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Keep Active
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleConfirm()}
            disabled={isPending || !reason.trim()}
          >
            {isPending ? 'Updating...' : `Confirm ${isCancel ? 'Cancel' : 'Pause'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
