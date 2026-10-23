import { Suspense } from 'react';

import OrderConfirmationClient from '@/components/buyer/checkout-success/OrderConfirmationClient';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

/**
 * The order confirmation page. Stripe redirects here after a successful checkout session.
 * @returns The client wrapped in a suspense.
 */
export default function OrderConfirmationPage() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <Suspense fallback={<LoadingSkeleton heights={['h-20', 'h-37']} />}>
        <OrderConfirmationClient />
      </Suspense>
    </main>
  );
}
