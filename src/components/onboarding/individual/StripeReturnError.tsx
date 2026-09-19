'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGenerateStripeOnboardingLink } from '@/lib/api/generated/stripe/stripe';

/**
 * Displays an error message to the user explaining the Stripe return check failure.
 * Gives the user options to retry generating a new onboarding link or go back to onboarding.
 * @returns A card with error details and action buttons.
 */
export default function StripeReturnErrorPage() {
  const [isPending, setIsPending] = useState(false);
  const generateStripe = useGenerateStripeOnboardingLink();

  const handleRetry = async () => {
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
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <AlertCircle className="w-10 h-10 text-amber-700" />
          </div>

          <h1 className="font-heading text-[clamp(2rem,3vw,2.5rem)] font-extrabold text-deep-forest tracking-[-0.02em] leading-tight mb-3">
            Connection Status Unclear
          </h1>
          <p className="font-sans text-forest-dark/70 max-w-md mx-auto mb-8 text-base sm:text-lg">
            We couldn’t verify your Stripe onboarding status right now. This usually happens if your
            session timed out or network connectivity was lost.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button
              onClick={() => void handleRetry()}
              disabled={isPending}
              variant="forest"
              className="w-full sm:w-auto transition-all"
            >
              {isPending ? 'Preparing Link...' : 'Try Connecting Again'}
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/onboarding">Return to Onboarding</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
