'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import BasicProfileStep, { type BasicInfoData } from '../onboarding/BasicProfileStep';
import NotificationsStep from '../onboarding/NotificationStep';
import RoleStep from '../onboarding/RoleStep';
import SellerInfoStep from '../onboarding/SellerInfoStep';
import SellerSuccessStep from '../onboarding/SellerSuccessStep';

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
  const [step, setStep] = useState<Step>('basic-info');
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isUploading, setIsUploading] = useState(false);

  const updateProfile = useUpdateCurrentUser();
  const registerToken = useRegisterFcmToken();
  const generateStripe = useGenerateStripeOnboardingLink();
  const uploadImageMutation = useUploadImage();

  const handleBasicInfoSubmit = async (data: BasicInfoData) => {
    try {
      setIsUploading(true);
      let imageUrl: string | undefined = undefined;

      if (data.imageFile) {
        const uploadRes = await uploadImageMutation.mutateAsync({
          data: { file: data.imageFile },
        });

        if (uploadRes.status === 200) {
          imageUrl = uploadRes.data.url;
        } else {
          throw new Error(uploadRes.data.error || 'Failed to upload image');
        }
      }

      await updateProfile.mutateAsync({
        data: {
          name: data.name,
          image: imageUrl,
          address: data.address,
          city: data.city,
        },
      });

      setStep('role');
    } catch (error) {
      console.error('OnboardingFlow: Failed to update basic profile', error);
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
      console.error('OnboardingFlow: Failed to update seller profile', error);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const mockFcmToken = 'mock-fcm-token-123';

        await registerToken.mutateAsync({
          data: { token: mockFcmToken, platform: 'web' },
        });
      }
    } catch (error) {
      console.error('Failed to enable notifications', error);
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
    const res = await generateStripe.mutateAsync();
    console.log('Redirecting to Stripe...', res);
  };

  const STEPS_ORDER: Step[] = [
    'basic-info',
    'role',
    'seller-info',
    'notifications',
    'seller-success',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-xl w-full">
        {/* Progress indicator */}
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
              onSubmit={() => void handleBasicInfoSubmit}
              isPending={isUploading || updateProfile.isPending}
            />
          )}

          {step === 'role' && <RoleStep onSelectRole={() => void handleRoleSelect} />}

          {step === 'seller-info' && (
            <SellerInfoStep onSubmit={() => void handleSellerInfoSubmit} />
          )}

          {step === 'notifications' && (
            <NotificationsStep
              role={selectedRole}
              onEnable={() => void handleEnableNotifications()}
              onSkip={finalizeOnboarding}
            />
          )}

          {step === 'seller-success' && (
            <SellerSuccessStep onStripeRedirect={() => void handleStripeRedirect()} />
          )}
        </div>
      </div>
    </div>
  );
}
