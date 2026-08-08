import { Suspense } from 'react';

import OrderConfirmationClient from '@/components/buyer/checkout-success/OrderConfirmationClient';
import { OrderConfirmationSkeleton } from '@/components/buyer/checkout-success/OrderConfirmationSkeleton';

/**
 * The order confirmation page. Stripe redirects here after a successful checkout session.
 * @returns The client wrapped in a suspense.
 */
export default function OrderConfirmationPage() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <Suspense fallback={<OrderConfirmationSkeleton />}>
        <OrderConfirmationClient />
      </Suspense>
    </main>
  );
}
