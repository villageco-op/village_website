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
import { Input } from '@/components/ui/input';

interface RescheduleOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newTimeIso: string) => Promise<void>;
  currentScheduledTime: string;
  isPending: boolean;
}

/**
 * A dialog component for setting a new pickup or delivery time for an order.
 * @param props - Component props
 * @param props.isOpen - Is the dialog open
 * @param props.onClose - Called when closed
 * @param props.onConfirm - Called when confirmed
 * @param props.currentScheduledTime - The current scheduled time
 * @param props.isPending - Is the update schedule time pending
 * @returns A dialog with a date input
 */
export function RescheduleOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  currentScheduledTime,
  isPending,
}: RescheduleOrderDialogProps) {
  const formatLocalTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [newTime, setNewTime] = useState(() => formatLocalTime(currentScheduledTime));

  const handleConfirm = async () => {
    if (!newTime) return;
    const isoString = new Date(newTime).toISOString();
    await onConfirm(isoString);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-deep-forest">
            Reschedule Order
          </DialogTitle>
          <DialogDescription>
            Propose a new pickup or delivery time. The other party will be notified and can accept
            or counter the request.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2">
          <label htmlFor="newTime" className="text-sm font-semibold text-ink">
            New Date & Time
          </label>
          <Input
            id="newTime"
            type="datetime-local"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            disabled={isPending}
            className="border-forest-dark/20 focus-visible:ring-lime"
            min={new Date().toISOString().slice(0, 16)} // Prevent past dates
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            className="bg-lime text-forest-dark hover:bg-lime/80 font-bold"
            onClick={() => void handleConfirm()}
            disabled={isPending || !newTime}
          >
            {isPending ? 'Sending request...' : 'Propose New Time'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
