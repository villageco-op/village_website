import type { StripeOnboardingResponse } from './generated/models';

/**
 * Request a fresh Stripe onboarding URL on the server side using cookie authentication.
 * @param cookieHeader - The incoming cookie string from Next.js server context.
 * @returns Object containing the generated URL or null if generation failed.
 */
export async function fetchStripeOnboardingLink(
  cookieHeader: string | null,
): Promise<StripeOnboardingResponse | null> {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:8080';
  const apiUrl = new URL('/api/stripe/connect/onboard', backendBase);

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        Host: apiUrl.host,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`Fetch Stripe onboarding link failed with status: ${res.status}`);
      return null;
    }

    const data = (await res.json()) as StripeOnboardingResponse;
    return data;
  } catch (error) {
    console.error('Error fetching Stripe onboarding link in server action/route:', error);
    return null;
  }
}
