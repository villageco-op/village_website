'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import BasicProfileStep from './BasicProfileStep';
import NotificationsStep from './NotificationStep';
import RoleStep from './RoleStep';
import SellerInfoStep from './SellerInfoStep';
import SellerSuccessStep from './SellerSuccessStep';

import { type BasicInfoData, useSubmitBasicProfile } from '@/hooks/useOnboardingActions';
import { useGenerateStripeOnboardingLink } from '@/lib/api/generated/stripe/stripe';
import { useUpdateCurrentUser, useRegisterFcmToken } from '@/lib/api/generated/users/users';
import { initFcmListener } from '@/lib/firebase';

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

interface IndividualOnboardingFlowProps {
  isUpgradingToSeller: boolean;
  isInvitedOrgMember: boolean;
  onBack: () => void;
}

/**
 * The client component for the onboarding page. Walks through the steps and submits the data.
 * @param props - Component props
 * @param props.isUpgradingToSeller - Indicates this is an buyer returning to become a seller
 * @param props.isInvitedOrgMember - Indicates this is an org member that is returning to
 * complete individual onboarding
 * @param props.onBack - When the back button is pressed
 * @returns The component for the full on boarding flow
 */
export default function IndividualOnboardingFlow({
  isUpgradingToSeller,
  isInvitedOrgMember,
  onBack,
}: IndividualOnboardingFlowProps) {
  const router = useRouter();

  const [step, setStep] = useState<Step>(isUpgradingToSeller ? 'seller-info' : 'basic-info');
  const [selectedRole, setSelectedRole] = useState<Role>(isUpgradingToSeller ? 'seller' : null);

  const updateProfile = useUpdateCurrentUser();
  const registerToken = useRegisterFcmToken();
  const generateStripe = useGenerateStripeOnboardingLink();
  const { submitBasicProfile, isPending } = useSubmitBasicProfile();

  const handleBasicInfoSubmit = async (data: BasicInfoData) => {
    const success = await submitBasicProfile(data);
    if (success) {
      setStep('role');
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
        await initFcmListener((fid) => {
          void (async () => {
            try {
              await registerToken.mutateAsync({
                data: { token: fid, platform: 'web' },
              });
              toast.success('Push notifications enabled!', { id: toastId });
            } catch (error) {
              toast.error('Failed to save notification settings.', { id: toastId });
            }
          });
        });
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
    : isInvitedOrgMember
      ? ['basic-info', 'notifications']
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
              isPending={isPending}
              onBack={onBack}
            />
          )}

          {step === 'role' && (
            <RoleStep onSelectRole={handleRoleSelect} onBack={() => setStep('basic-info')} />
          )}

          {step === 'seller-info' && (
            <SellerInfoStep
              onSubmit={(data) => {
                void handleSellerInfoSubmit(data);
              }}
              onBack={() => setStep('role')}
              isUpgradingToSeller
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
