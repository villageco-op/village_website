'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useRegisterFcmToken } from '@/lib/api/generated/users/users';
import { useUnregisterFcmToken } from '@/lib/api/generated/users/users';
import { useGetFcmStatus } from '@/lib/api/generated/users/users';
import { initFcmListener, executeUnregister } from '@/lib/firebase';

/**
 * Controls for enabling and disabling notifications.
 * @returns A horizontally aligned button with text
 */
export function NotificationControls() {
  const registerToken = useRegisterFcmToken();
  const unregisterToken = useUnregisterFcmToken();
  const { data: fcmStatus, isLoading } = useGetFcmStatus({ platform: 'web' });

  const [overrideEnabled, setOverrideEnabled] = useState<boolean | null>(null);

  const isBrowser = typeof window !== 'undefined' && 'Notification' in window;
  const isGranted = isBrowser ? Notification.permission === 'granted' : false;
  const hasBackendToken = fcmStatus?.status === 200 ? fcmStatus.data.status : false;

  const isNotificationsEnabled = overrideEnabled ?? (isGranted && hasBackendToken);

  const handleToggleNotifications = async () => {
    if (isNotificationsEnabled) {
      const toastId = toast.loading('Disabling notifications...');
      try {
        await executeUnregister();
        setOverrideEnabled(false);
        toast.success('Notifications disabled.', { id: toastId });
      } catch (error) {
        toast.error('Failed to disable notifications.', { id: toastId });
      }
    } else {
      const toastId = toast.loading('Enabling notifications...');
      try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          await initFcmListener((fid) => {
            void (async () => {
              try {
                await registerToken.mutateAsync({
                  data: { token: fid, platform: 'web' },
                });
                setOverrideEnabled(true);
                toast.success('Push notifications enabled!', { id: toastId });
              } catch (error) {
                toast.error('Failed to save notification settings.', { id: toastId });
              }
            })();
          });
        } else {
          toast.warning('Notifications were blocked. Enable them in browser settings.', {
            id: toastId,
          });
        }
      } catch (error) {
        toast.error('Failed to register for notifications.', { id: toastId });
      }
    }
  };

  return (
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
        variant={isNotificationsEnabled ? 'destructive' : 'outline'}
        onClick={() => void handleToggleNotifications()}
        className="w-full sm:w-auto"
        disabled={isLoading || registerToken.isPending || unregisterToken.isPending}
      >
        {isLoading ? 'Checking...' : isNotificationsEnabled ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
}
