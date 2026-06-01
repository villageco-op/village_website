'use client';

import React, { useEffect, useRef } from 'react';

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
      unsubUnregisterRef.current = initFcmUnregisterListener((fid) => {
        void (async () => {
          try {
            await unregisterFcmToken({ data: { platform: 'web' } });
            console.log('Successfully deleted FID from backend:', fid);
          } catch (error) {
            console.error('Failed to remove FID from backend during unregistration:', error);
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
                console.error('Failed to silently sync FID:', error);
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
