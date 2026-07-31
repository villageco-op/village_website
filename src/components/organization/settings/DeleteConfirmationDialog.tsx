'use client';

import { Trash2, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeleteOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onConfirmTextChanged: (text: string) => void;
  isPending: boolean;
  organizationName: string;
}

/**
 * The delete organization dialog.
 * @param props - Component props
 * @param props.isOpen - Is the dialog open
 * @param props.onClose - When the close button is pressed
 * @param props.onConfirm - When the confirm button is pressed
 * @param props.onConfirmTextChanged - When the confirmation text is updated
 * @param props.isPending - Is the submission pending
 * @param props.organizationName - The organization name
 * @returns A dialog with a confirmation input
 */
export function DeleteOrganizationDialog({
  isOpen,
  onClose,
  onConfirm,
  onConfirmTextChanged,
  isPending,
  organizationName,
}: DeleteOrganizationDialogProps) {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full border border-forest-dark/10 shadow-lg p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border/15 pb-3 mb-4">
          <h3 className="font-heading text-lg font-bold text-red-700 flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Confirm Deletion
          </h3>
          <button
            onClick={() => {
              setConfirmText('');
              onClose();
            }}
            className="cursor-pointer text-ink-3 hover:text-ink-2"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-forest-dark/80">
            You are about to delete{' '}
            <span className="font-bold text-deep-forest">{organizationName}</span>. This will
            permanently clean up all database assets associated with this organization.
          </p>

          <div className="space-y-1.5 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-xs text-amber-800">
              <strong>Warning:</strong> Each member and admin will lose access to the organization
              immediately.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmName" className="text-xs text-ink-3">
              To confirm, please type organization name exactly:{' '}
              <span className="font-semibold select-all text-deep-forest">{organizationName}</span>
            </Label>
            <Input
              id="confirmName"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                onConfirmTextChanged(e.target.value);
              }}
              placeholder="Enter organization name"
              className="bg-white border-red-200 focus-visible:ring-red-500 h-9"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/10">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmText('');
                onClose();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void onConfirm()}
              disabled={confirmText !== organizationName || isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                'Permanently Delete'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
