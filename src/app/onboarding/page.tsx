import { Suspense } from 'react';

import OnboardingFlow from '../../components/onboarding/OnboardingClient';

import { OnboardingSkeleton } from '@/components/onboarding/OnboardingSkeleton';

/**
 * Onboarding flow that guides the user through profile setup, stripe onboarding, and enabling push notifications.
 * @returns html page
 */
export default function Onboarding() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <Suspense fallback={<OnboardingSkeleton />}>
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
