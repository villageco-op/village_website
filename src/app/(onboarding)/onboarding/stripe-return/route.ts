import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchStripeOnboardingStatus } from '@/lib/api/stripe';

/**
 * Evaluates completion state after returning from Stripe Onboarding.
 */
export async function GET() {
  const cookieStore = await cookies();
  const res = await fetchStripeOnboardingStatus(cookieStore.toString());

  if (!res) {
    redirect('/onboarding/stripe-return/error');
  }

  if (res.isComplete) {
    redirect('/onboarding/stripe-connected');
  }

  redirect('/onboarding/stripe-return/incomplete');
}
