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

interface LeaveOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
  organizationName?: string;
}

/**
 * The leave organization dialog.
 * @param props - Component props
 * @param props.isOpen - Is the dialog open
 * @param props.onClose - When the close button is pressed
 * @param props.onConfirm - When the confirm button is pressed
 * @param props.isPending - Is the submission pending
 * @param props.organizationName - The organization name
 * @returns A dialog with a confirmation input
 */
export function LeaveOrganizationDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  organizationName,
}: LeaveOrganizationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-red-600">
            Leave Organization
          </DialogTitle>
          <DialogDescription className="text-ink-2">
            Are you sure you want to leave{' '}
            {organizationName ? <strong>{organizationName}</strong> : 'this organization'}? You will
            lose access to all organization resources until re-invited.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void onConfirm()} disabled={isPending}>
            {isPending ? 'Leaving...' : 'Leave Organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
