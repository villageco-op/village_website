'use client';

import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { useRegisterFcmToken, useUnregisterFcmToken } from '@/lib/api/generated/users/users';
import { initFcmListener, initFcmUnregisterListener } from '@/lib/firebase';

/**
 * Handles registering and unregistering fcm tokens via listeners.
 * @param props - Component props
 * @param props.children - Passthrough children components
 * @returns A wrapper that handles notification callbacks
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { mutateAsync: registerFcmToken } = useRegisterFcmToken();
  const { mutateAsync: unregisterFcmToken } = useUnregisterFcmToken();

  const unsubRegisterRef = useRef<() => void>(() => {});
  const unsubUnregisterRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      unsubUnregisterRef.current = initFcmUnregisterListener(() => {
        void (async () => {
          try {
            await unregisterFcmToken({ data: { platform: 'web' } });
            toast.success('Push notifications disabled.');
          } catch (error) {
            console.error('Failed to remove FID from backend:', error);
            toast.error('Failed to update notification settings on the server.');
          }
        });
      });

      if (Notification.permission === 'granted') {
        const setupFcm = async () => {
          unsubRegisterRef.current = await initFcmListener((fid) => {
            void (async () => {
              try {
                await registerFcmToken({ data: { token: fid, platform: 'web' } });
              } catch (error) {
                console.error('Failed to sync FID:', error);
                toast.error('Could not sync notification token with your account.');
              }
            });
          });
        };
        void setupFcm();
      }
    }

    return () => {
      if (unsubRegisterRef.current) unsubRegisterRef.current();
      if (unsubUnregisterRef.current) unsubUnregisterRef.current();
    };
  }, [registerFcmToken, unregisterFcmToken]);

  return <>{children}</>;
}
