import StripeReturnErrorPage from '@/components/onboarding/individual/StripeReturnError';

/**
 * The page for handling Stripe return/status errors. Lets the user retry.
 * @returns The Stripe return error page
 */
export default function StripeReturnError() {
  return <StripeReturnErrorPage />;
}
