'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import BasicProfileStep, { type BasicInfoData } from './BasicProfileStep';
import NotificationsStep from './NotificationStep';
import RoleStep from './RoleStep';
import SellerInfoStep from './SellerInfoStep';
import SellerSuccessStep from './SellerSuccessStep';

import { useGeocodeAddress } from '@/lib/api/generated/location/location';
import { useGenerateStripeOnboardingLink } from '@/lib/api/generated/stripe/stripe';
import { useUploadImage } from '@/lib/api/generated/upload/upload';
import { useUpdateCurrentUser, useRegisterFcmToken } from '@/lib/api/generated/users/users';

/**
 * The different steps within the onboarding flow.
 */
type Step = 'basic-info' | 'role' | 'seller-info' | 'notifications' | 'seller-success';
/**
 * Types of user roles supported by the application.
 */
export type Role = 'buyer' | 'seller' | null;

/**
 * Info collected in the seller info step.
 */
interface SellerInfoData {
  aboutMe: string;
  specialties: string;
  goal: number | '';
  willDeliver: boolean;
  deliveryRangeMiles: number | '';
}

/**
 * The client component for the onboarding page. Walks through the steps and submits the data.
 * @returns The component for the full on boarding flow.
 */
export default function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isUpgradingToSeller = searchParams?.get('upgrade') === 'seller';

  const [step, setStep] = useState<Step>(isUpgradingToSeller ? 'seller-info' : 'basic-info');
  const [selectedRole, setSelectedRole] = useState<Role>(isUpgradingToSeller ? 'seller' : null);
  const [isUploading, setIsUploading] = useState(false);

  const updateProfile = useUpdateCurrentUser();
  const registerToken = useRegisterFcmToken();
  const generateStripe = useGenerateStripeOnboardingLink();
  const uploadImageMutation = useUploadImage();
  const geocodeAddressMutation = useGeocodeAddress();

  const handleBasicInfoSubmit = async (data: BasicInfoData) => {
    const toastId = toast.loading('Uploading your profile picture...');

    try {
      setIsUploading(true);
      let imageUrl: string | undefined = undefined;

      if (data.imageFile) {
        const uploadRes = await uploadImageMutation.mutateAsync({
          data: { file: data.imageFile },
        });

        if (uploadRes.status === 200) {
          imageUrl = uploadRes.data.url;
          toast.loading('Saving your profile details...', { id: toastId });
        } else {
          throw new Error(uploadRes.data.error || 'Failed to upload image');
        }
      }

      const geocodeRes = await geocodeAddressMutation.mutateAsync({
        data: {
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
        },
      });

      if (geocodeRes.status !== 200) {
        throw new Error(geocodeRes.data.error || 'Failed to geocode address');
      }

      const { lat, lng } = geocodeRes.data;

      await updateProfile.mutateAsync({
        data: {
          name: data.name,
          image: imageUrl,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          country: data.country,
          organization: data.organization ?? undefined,
          lat,
          lng,
        },
      });

      toast.success('Profile updated!', { id: toastId });
      setStep('role');
    } catch (error) {
      console.error('OnboardingFlow: Failed to update basic profile', error);
      toast.error('Could not save profile. Please check your connection.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRoleSelect = (role: 'buyer' | 'seller') => {
    setSelectedRole(role);
    if (role === 'buyer') {
      setStep('notifications');
    } else {
      setStep('seller-info');
    }
  };

  const handleSellerInfoSubmit = async (data: SellerInfoData) => {
    try {
      const specialtiesArray = data.specialties
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile.mutateAsync({
        data: {
          aboutMe: data.aboutMe,
          specialties: specialtiesArray,
          goal: data.goal ? Number(data.goal) : undefined,
          deliveryRangeMiles: data.willDeliver ? Number(data.deliveryRangeMiles) : 0,
        },
      });

      setStep('notifications');
    } catch (error) {
      toast.error('Could not save profile. Please check your connection.');
    }
  };

  const handleEnableNotifications = async () => {
    const toastId = toast.loading('Enabling notifications...');
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const mockFcmToken = 'mock-fcm-token-123';
        await registerToken.mutateAsync({
          data: { token: mockFcmToken, platform: 'web' },
        });
        toast.success('Notifications enabled!', { id: toastId });
      } else {
        toast.warning('Notifications were blocked. You can enable them in browser settings.', {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error('Failed to register for notifications.', { id: toastId });
    } finally {
      finalizeOnboarding();
    }
  };

  const finalizeOnboarding = () => {
    if (selectedRole === 'buyer') {
      router.push('/buyer');
    } else {
      setStep('seller-success');
    }
  };

  const handleStripeRedirect = async () => {
    const toastId = toast.loading('Preparing Stripe onboarding...');
    try {
      const res = await generateStripe.mutateAsync();
      if (res.status === 200 && res.data.url) {
        toast.success('Redirecting...', { id: toastId });
        window.location.href = res.data.url;
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error('Could not connect to Stripe. Try again in a moment.', { id: toastId });
    }
  };

  const STEPS_ORDER: Step[] = isUpgradingToSeller
    ? ['seller-info', 'notifications', 'seller-success']
    : ['basic-info', 'role', 'seller-info', 'notifications', 'seller-success'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-xl w-full">
        <div className="flex justify-center mb-8 space-x-2">
          {STEPS_ORDER.map((s, i) => {
            if (selectedRole === 'buyer' && (s === 'seller-info' || s === 'seller-success'))
              return null;

            const isActive = step === s;
            const isPast = STEPS_ORDER.indexOf(step) > i;

            return (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'w-8 bg-lime' : isPast ? 'w-4 bg-click-green' : 'w-4 bg-border/40'
                }`}
              />
            );
          })}
        </div>

        <div className="bg-cream/30 border border-border/20 shadow-sm rounded-xl p-8 min-h-100 flex flex-col justify-center relative">
          {step === 'basic-info' && (
            <BasicProfileStep
              onSubmit={handleBasicInfoSubmit}
              isPending={isUploading || updateProfile.isPending}
            />
          )}

          {step === 'role' && <RoleStep onSelectRole={handleRoleSelect} />}

          {step === 'seller-info' && (
            <SellerInfoStep
              onSubmit={(data) => {
                void handleSellerInfoSubmit(data);
              }}
            />
          )}

          {step === 'notifications' && (
            <NotificationsStep
              role={selectedRole}
              onEnable={() => {
                void handleEnableNotifications();
              }}
              onSkip={finalizeOnboarding}
            />
          )}

          {step === 'seller-success' && (
            <SellerSuccessStep
              onStripeRedirect={() => {
                void handleStripeRedirect();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
