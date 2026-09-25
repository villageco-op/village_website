import type { StripeOnboardingResponse } from './generated/models';

/**
 * Get Stripe onboarding status response.
 */
export interface StripeStatusResponse {
  isComplete: boolean;
}

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

/**
 * Checks if the user's Stripe account has completed onboarding on the backend.
 * @param cookieHeader - The cookie header from Stripe
 * @returns The Stripe onboarding status
 */
export async function fetchStripeOnboardingStatus(
  cookieHeader: string | null,
): Promise<StripeStatusResponse | null> {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:8080';
  const apiUrl = new URL('/api/stripe/connect/status', backendBase);

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        Host: apiUrl.host,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`Fetch Stripe onboarding status failed with status: ${res.status}`);
      return null;
    }

    return (await res.json()) as StripeStatusResponse;
  } catch (error) {
    console.error('Error fetching Stripe status in route:', error);
    return null;
  }
}
