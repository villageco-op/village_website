import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  register,
  onRegistered,
  unregister,
  onUnregistered,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

/**
 * Listens for the Firebase Installation ID (FID) and triggers a callback when received.
 * Also initiates the registration process.
 * @param onTokenReceived - Callback function that receives the FID string
 * @returns An unsubscribe function to clean up the listener
 */
export const initFcmListener = async (onTokenReceived: (fid: string) => void) => {
  if (!messaging) return () => {};
  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const unsubscribe = onRegistered(messaging, (fid: string) => {
      if (fid) onTokenReceived(fid);
    });

    await register(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    return unsubscribe;
  } catch (error) {
    console.error('Failed to initialize modern FCM registration:', error);
    return () => {};
  }
};

/**
 * Listens for unregistration events (fires after unregister() succeeds).
 * @param onTokenRemoved - Callback function that receives the unregistered FID string to send to your delete API route
 * @returns An unsubscribe function to clean up the listener
 */
export const initFcmUnregisterListener = (onTokenRemoved: (fid: string) => void) => {
  if (!messaging) return () => {};

  return onUnregistered(messaging, (fid: string) => {
    if (fid) {
      onTokenRemoved(fid);
    }
  });
};

/**
 * Manually deletes the browser's current FID registration instance.
 */
export const executeUnregister = async (): Promise<void> => {
  if (!messaging) return;
  try {
    await unregister(messaging);
  } catch (error) {
    console.error('Failed to unregister FCM instance:', error);
    throw error;
  }
};
