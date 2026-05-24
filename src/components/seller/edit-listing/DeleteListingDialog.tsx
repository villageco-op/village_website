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

interface DeleteListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isPending: boolean;
}

/**
 * A dialog component that confirms whether a user wants to permanently delete a produce listing.
 * @param props - Component props
 * @param props.isOpen - Controls the visibility of the dialog
 * @param props.onClose - Called when the dialog is dismissed
 * @param props.onConfirm - Called when the user confirms deletion
 * @param props.isPending - Indicates if the deletion request is currently processing
 * @returns A dialog component
 */
export function DeleteListingDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteListingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-red-600">Delete Listing</DialogTitle>
          <DialogDescription className="text-ink-2">
            Are you sure you want to delete this listing? This action cannot be undone and the item
            will be permanently removed from your catalog.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void onConfirm()} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Yes, Delete Listing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
