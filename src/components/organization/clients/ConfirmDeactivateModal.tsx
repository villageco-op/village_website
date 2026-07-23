'use client';

import { AlertTriangle, Loader2, UserMinus } from 'lucide-react';

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

interface ConfirmDeactivateModalProps {
  client: ClientResponse;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Modal for deactivating a client.
 * @param props - Component props
 * @param props.client - The client being deactivated
 * @param props.onClose - When the close button is clicked
 * @param props.onConfirm - When the confirm button is clicked
 * @param props.isSubmitting - Is the deactivate submitting
 * @returns A dialog component
 */
export function ConfirmDeactivateModal({
  client,
  onClose,
  onConfirm,
  isSubmitting,
}: ConfirmDeactivateModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="font-heading text-lg font-bold">Deactivate Client</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-ink-2">
            Are you sure you want to deactivate <strong>{client.name || 'this client'}</strong>?
          </DialogDescription>
        </DialogHeader>

        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
          Deactivating this client profile flags them as inactive. They will not be able to create
          referrals. They can be reactivated in the future.
        </p>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-9 text-sm">
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
            className="border-amber-200 text-amber-700 hover:bg-amber-50 h-9 text-sm flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deactivating...
              </>
            ) : (
              <>
                <UserMinus className="h-3.5 w-3.5" />
                Deactivate Profile
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
