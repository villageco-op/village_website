import type { StripeOnboardingResponse } from './generated/models';
import { serverFetch } from './server-fetch';

/**
 * Get Stripe onboarding status response.
 */
export interface StripeStatusResponse {
  isComplete: boolean;
}

/**
 * Request a fresh Stripe onboarding URL on the server side using cookie authentication.
 * @returns Object containing the generated URL or null if generation failed.
 */
export async function fetchStripeOnboardingLink(): Promise<StripeOnboardingResponse | null> {
  return serverFetch<StripeOnboardingResponse>('/api/stripe/connect/onboard');
}

/**
 * Checks if the user's Stripe account has completed onboarding on the backend.
 * @returns The Stripe onboarding status
 */
export async function fetchStripeOnboardingStatus(): Promise<StripeStatusResponse | null> {
  return serverFetch<StripeStatusResponse>('/api/stripe/connect/status');
}
