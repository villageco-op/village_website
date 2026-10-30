import { redirect } from 'next/navigation';

import { fetchStripeOnboardingLink } from '@/lib/api/stripe';

/**
 * Fetches a new Stripe onboarding link and redirects the user.
 */
export async function GET() {
  const res = await fetchStripeOnboardingLink();

  if (res?.url) {
    redirect(res.url);
  }

  redirect('/onboarding/stripe-refresh/error');
}
