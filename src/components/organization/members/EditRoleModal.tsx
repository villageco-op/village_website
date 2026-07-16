'use client';

import { Check, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrgRole, type OrgMember } from '@/lib/api/generated/models';

interface EditRoleModalProps {
  member: OrgMember | null;
  targetRole: OrgRole;
  onTargetRoleChange: (role: OrgRole) => void;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Modal for updating a organization members role.
 * @param props - Component props
 * @param props.member - The selected member
 * @param props.targetRole - The new role
 * @param props.onTargetRoleChange - When the target role is change
 * @param props.onClose - When the close button is pressed
 * @param props.onConfirm - When confirm is pressed
 * @param props.isSubmitting - Is the update role request in progress
 * @returns A modal with a role option and submit button
 */
export function EditRoleModal({
  member,
  targetRole,
  onTargetRoleChange,
  onClose,
  onConfirm,
  isSubmitting,
}: EditRoleModalProps) {
  return (
    <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold text-ink">
            Update Member Role
          </DialogTitle>
          <DialogDescription className="text-sm text-ink-3">
            Modify the organizational authority level for{' '}
            <strong>{member?.name || 'this user'}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">
            Select Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onTargetRoleChange(OrgRole.member)}
              className={`cursor-pointer p-3 text-left rounded-lg border flex flex-col gap-1 transition-all ${
                targetRole === OrgRole.member
                  ? 'border-forest bg-forest/[0.02] ring-1 ring-forest'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">Member</span>
                {targetRole === OrgRole.member && <Check className="h-4 w-4 text-forest" />}
              </div>
              <span className="text-xs text-ink-3">
                Standard access; can participate and view info.
              </span>
            </button>

            <button
              type="button"
              onClick={() => onTargetRoleChange(OrgRole.admin)}
              className={`cursor-pointer p-3 text-left rounded-lg border flex flex-col gap-1 transition-all ${
                targetRole === OrgRole.admin
                  ? 'border-forest bg-forest/[0.02] ring-1 ring-forest'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">Administrator</span>
                {targetRole === OrgRole.admin && <Check className="h-4 w-4 text-forest" />}
              </div>
              <span className="text-xs text-ink-3">
                Full administrative access, including billing & members.
              </span>
            </button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-9 text-sm">
            Cancel
          </Button>
          <Button
            onClick={() => void onConfirm()}
            variant="forest"
            disabled={isSubmitting}
            className="h-9 text-sm flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                Apply Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
