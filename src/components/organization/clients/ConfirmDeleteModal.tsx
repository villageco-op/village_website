'use client';

import { AlertOctagon, Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ClientResponse } from '@/lib/api/generated/models';

interface ConfirmDeleteModalProps {
  client: ClientResponse;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Modal for deleting a client.
 * @param props - Component props
 * @param props.client - The client being deleted
 * @param props.onClose - When the close button is clicked
 * @param props.onConfirm - When the confirm button is clicked
 * @param props.isSubmitting - Is the deletion submitting
 * @returns A dialog component
 */
export function ConfirmDeleteModal({
  client,
  onClose,
  onConfirm,
  isSubmitting,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertOctagon className="h-5 w-5" />
            <DialogTitle className="font-heading text-lg font-bold">
              Delete Client Record
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-ink-2">
            This action is permanent. Are you sure you want to completely delete{' '}
            <strong>{client.name || 'this record'}</strong>?
          </DialogDescription>
        </DialogHeader>

        <p className="text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-100">
          All referral data will be permanently unlinked from this client and the record deleted.
          This process cannot be undone.
        </p>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-9 text-sm">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
            className="h-9 text-sm flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Confirm Deletion
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
