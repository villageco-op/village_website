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

interface ReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isPending: boolean;
  title: string;
  description: string;
  label?: string;
  placeholder: string;
  cancelText?: string;
  confirmText?: string;
  pendingText?: string;
  confirmVariant?: 'destructive' | 'default' | 'forest' | 'outline' | 'secondary' | 'ghost';
}

/**
 * A reusable dialog component for actions requiring a mandatory reason.
 * @param props - Component properties
 * @param props.isOpen - Whether the dialog is open
 * @param props.onClose - Callback function invoked when the dialog is closed
 * @param props.onConfirm - Async callback function invoked when the user confirms with the entered reason
 * @param props.isPending - Whether the confirmation action is currently pending
 * @param props.title - The title text displayed in the dialog header
 * @param props.description - The description text providing context in the dialog header
 * @param props.label - The label text for the textarea input (defaults to 'Reason for cancellation')
 * @param props.placeholder - The placeholder text displayed inside the textarea
 * @param props.cancelText - The text displayed on the cancel button (defaults to 'Cancel')
 * @param props.confirmText - The text displayed on the confirm button (defaults to 'Confirm')
 * @param props.pendingText - The text displayed on the confirm button while pending (defaults to 'Processing...')
 * @param props.confirmVariant - The button variant for the confirmation action (defaults to 'destructive')
 * @returns The rendered reason dialog component.
 */
export function ReasonDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  title,
  description,
  label = 'Reason for cancellation',
  placeholder,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  pendingText = 'Processing...',
  confirmVariant = 'destructive',
}: ReasonDialogProps) {
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
          <DialogTitle className="font-heading text-xl text-deep-forest">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2">
          <label htmlFor="reason" className="text-sm font-semibold text-ink">
            {label} <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="reason"
            placeholder={placeholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            className="resize-none border-forest-dark/20 focus-visible:ring-lime"
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => void handleConfirm()}
            disabled={isPending || !reason.trim()}
          >
            {isPending ? pendingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
