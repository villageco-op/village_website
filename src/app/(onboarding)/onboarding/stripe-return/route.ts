import { redirect } from 'next/navigation';

import { fetchStripeOnboardingStatus } from '@/lib/api/stripe';

/**
 * Evaluates completion state after returning from Stripe Onboarding.
 */
export async function GET() {
  const res = await fetchStripeOnboardingStatus();

  if (!res) {
    redirect('/onboarding/stripe-return/error');
  }

  if (res.isComplete) {
    redirect('/onboarding/stripe-connected');
  }

  redirect('/onboarding/stripe-return/incomplete');
}
