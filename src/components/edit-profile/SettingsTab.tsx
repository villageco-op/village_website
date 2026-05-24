'use client';

import { Bell, LogOut, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DeleteAccountDialog } from './DeleteAccountDialog';

import { Button } from '@/components/ui/button';
import { useDeleteAccount, useRegisterFcmToken } from '@/lib/api/generated/users/users';

interface SettingsTabProps {
  onLogout: () => void;
}

/**
 * The tab for enabling notifications and account management.
 * @param props - Component props
 * @param props.onLogout - When logout is triggered
 * @returns A component with action buttons
 */
export default function SettingsTab({ onLogout }: SettingsTabProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const registerToken = useRegisterFcmToken();
  const deleteAccountMutation = useDeleteAccount();

  const handleEnableNotifications = async () => {
    const toastId = toast.loading('Enabling notifications...');
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const mockFcmToken = 'mock-fcm-token-123';
        await registerToken.mutateAsync({
          data: { token: mockFcmToken, platform: 'web' },
        });
        toast.success('Push notifications enabled!', { id: toastId });
      } else {
        toast.warning('Notifications were blocked. Enable them in browser settings.', {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error('Failed to register for notifications.', { id: toastId });
    }
  };

  const handleConfirmDelete = async () => {
    const toastId = toast.loading('Deleting your account...');
    try {
      await deleteAccountMutation.mutateAsync();
      toast.success('Account deleted successfully.', { id: toastId });
      setIsDeleteDialogOpen(false);
      onLogout();
    } catch (error) {
      toast.error('Failed to delete account. Please try again.', { id: toastId });
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Notifications */}
      <div className="bg-white p-5 rounded-lg border border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-sun-light text-sun rounded-full flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-deep-forest text-lg">Push Notifications</h3>
            <p className="text-sm text-ink-3">
              Get real-time alerts about important activity on your account.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => void handleEnableNotifications()}
          className="w-full sm:w-auto"
        >
          Enable
        </Button>
      </div>

      {/* Account Management */}
      <div className="bg-white p-5 rounded-lg border border-border/40 space-y-6">
        <div>
          <h3 className="font-semibold text-deep-forest text-lg">Account Management</h3>
          <p className="text-sm text-ink-3 mb-4">Manage your current session and account status.</p>
          <Button variant="secondary" onClick={onLogout} className="w-full sm:w-auto text-ink-2">
            <LogOut className="w-4 h-4 mr-2" /> Log out
          </Button>
        </div>

        <hr className="border-t border-border/20" />

        <div>
          <h3 className="font-semibold text-red-600 text-lg">Danger Zone</h3>
          <p className="text-sm text-ink-3 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
          </Button>
        </div>
      </div>

      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={deleteAccountMutation.isPending}
      />
    </div>
  );
}
