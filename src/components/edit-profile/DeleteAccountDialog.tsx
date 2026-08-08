'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

/**
 * A dialog component that confirms whether a user wants to permanently delete their account.
 * @param props - Component props
 * @param props.isOpen - Controls the visibility of the dialog
 * @param props.onClose - Called when the dialog is dismissed
 * @param props.onConfirm - Called when the user confirms deletion
 * @param props.isPending - Indicates if the deletion request is currently processing
 * @returns A dialog component
 */
export function DeleteAccountDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteAccountDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-red-600">Delete Account</DialogTitle>
          <DialogDescription className="text-ink-2">
            Are you absolutely sure you want to delete your account? This action cannot be undone.
            Your personal data will be anonymized, and you will lose access to all your order
            history and profile information.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void onConfirm()} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Yes, Delete My Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
