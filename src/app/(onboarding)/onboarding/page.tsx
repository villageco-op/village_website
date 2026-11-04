import { Suspense } from 'react';

import OnboardingFlow from '@/components/onboarding/OnboardingClient';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

/**
 * Onboarding flow that guides the user through profile setup, stripe onboarding, and enabling push notifications.
 * @returns html page
 */
export default function Onboarding() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <Suspense fallback={<LoadingSkeleton heights={['h-8', 'h-64']} />}>
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
