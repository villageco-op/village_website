import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchStripeOnboardingLink } from '@/lib/api/stripe';

/**
 * Fetches a new Stripe onboarding link and redirects the user.
 */
export async function GET() {
  const cookieStore = await cookies();
  const res = await fetchStripeOnboardingLink(cookieStore.toString());

  if (res?.url) {
    redirect(res.url);
  }

  redirect('/onboarding/stripe-refresh/error');
}
