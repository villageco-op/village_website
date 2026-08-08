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
import { type OrgMember } from '@/lib/api/generated/models';

interface ConfirmRemovalDialogProps {
  member: OrgMember | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Confirmation dialog for removing an organization member.
 * @param props - Component props
 * @param props.member - The member being removed
 * @param props.onClose - When the close button is pressed
 * @param props.onConfirm - When the confirm button is pressed
 * @param props.isSubmitting - Is the removal request is progress
 * @returns A dialog with a confirm button
 */
export function ConfirmRemovalDialog({
  member,
  onClose,
  onConfirm,
  isSubmitting,
}: ConfirmRemovalDialogProps) {
  return (
    <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="font-heading text-lg font-bold">Remove Member</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-ink-2">
            Are you sure you want to remove <strong>{member?.name || 'this member'}</strong> (
            {member?.email}) from the organization?
          </DialogDescription>
        </DialogHeader>

        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
          Once removed, they will immediately lose access to all shared resources, tools, and
          databases associated with this organization.
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
                Removing...
              </>
            ) : (
              <>
                <UserMinus className="h-3.5 w-3.5" />
                Confirm Removal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
