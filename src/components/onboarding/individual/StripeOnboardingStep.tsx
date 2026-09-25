'use client';

import { CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Props for the Stripe onboarding step.
 */
export interface StripeOnboardingStepProps {
  onStripeRedirect: () => void;
  isPending?: boolean;
}

/**
 * Step dedicated to driving the user to connect their Stripe payment account.
 * @param props - Component properties.
 * @param props.onStripeRedirect - Handler that initiates the external Stripe onboarding flow.
 * @param props.isPending - Is the stripe redirect pending?
 * @returns The onboarding step component
 */
export default function StripeOnboardingStep({
  onStripeRedirect,
  isPending = false,
}: StripeOnboardingStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 py-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-lime-pale text-click-green rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-deep-forest">Set up payments</h2>
        <p className="font-sans text-ink-3 mt-2 max-w-md mx-auto">
          Connect your bank account securely via Stripe so you can start accepting payments and
          selling produce.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <Button onClick={onStripeRedirect} disabled={isPending} variant="forest" className="w-full">
          {isPending ? 'Preparing Stripe...' : 'Connect with Stripe'}
        </Button>
      </div>
    </div>
  );
}
