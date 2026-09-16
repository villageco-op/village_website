import StripeReturnSuccessPage from '@/components/onboarding/individual/StripeConnectionSuccess';

/**
 * The page Stripe redirects to after a user connects their account.
 * @returns The Stripe return success page
 */
export default function StripeConnected() {
  return <StripeReturnSuccessPage />;
}
