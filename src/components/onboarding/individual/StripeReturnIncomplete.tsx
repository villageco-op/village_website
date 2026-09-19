'use client';

import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGenerateStripeOnboardingLink } from '@/lib/api/generated/stripe/stripe';

/**
 * Stripe Return Incomplete Page.
 * Displayed when a user exits the Stripe flow before finishing setup.
 * Allows connecting to Stripe again or returning home.
 * @returns A page with a retry and home button
 */
export default function StripeReturnIncompletePage() {
  const [isPending, setIsPending] = useState(false);
  const generateStripe = useGenerateStripeOnboardingLink();

  const handleConnectAgain = async () => {
    setIsPending(true);
    const toastId = toast.loading('Generating new onboarding link...');

    try {
      const res = await generateStripe.mutateAsync();
      if (res.status === 200 && res.data.url) {
        toast.success('Redirecting to Stripe...', { id: toastId });
        window.location.href = res.data.url;
      } else {
        throw new Error();
      }
    } catch {
      toast.error('Could not connect to Stripe. Please try again or refresh the page.', {
        id: toastId,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container-custom max-w-2xl mx-auto py-12">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
          {/* Neutral Info Badge */}
          <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <RefreshCw className="w-10 h-10 text-deep-forest" />
          </div>

          {/* Heading */}
          <h1 className="font-heading text-[clamp(2rem,3vw,2.5rem)] font-extrabold text-deep-forest tracking-[-0.02em] leading-tight mb-3">
            Setup Interrupted
          </h1>
          <p className="font-sans text-forest-dark/70 max-w-md mx-auto mb-8 text-base sm:text-lg">
            You exited the setup before finishing your Stripe Connect profile. You can resume at any
            time to start accepting payments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button
              onClick={() => void handleConnectAgain()}
              disabled={isPending}
              variant="forest"
              className="w-full sm:w-auto transition-all"
            >
              {isPending ? 'Preparing Link...' : 'Connect Stripe'}
            </Button>

            <Button asChild variant="outline" className="w-full sm:w-auto transition-all">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
