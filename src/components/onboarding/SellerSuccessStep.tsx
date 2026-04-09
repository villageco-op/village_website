'use client';

import { Sprout, CreditCard, SkipForward } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * Props for the SellerSuccessStep component.
 */
export interface SellerSuccessStepProps {
  onStripeRedirect: () => void;
}

/**
 * A final onboarding completion step for sellers providing clear calls-to-action for next steps.
 * Features links to payment onboarding and product listing creation.
 * @param props - Component properties.
 * @param props.onStripeRedirect - Handler that initiates the external Stripe onboarding flow.
 * @returns A success screen with prioritized task cards and a link to the dashboard.
 */
export default function SellerSuccessStep({ onStripeRedirect }: SellerSuccessStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 py-4">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-deep-forest">You&apos;re in! 🎉</h2>
        <p className="font-sans text-ink-3 mt-2">
          Just two quick things left to do before you can start earning.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 bg-white border border-lime/50 rounded-xl shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 bg-lime-pale text-click-green rounded-full flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-ink">Set up payments</h3>
            <p className="text-sm text-ink-3 mt-1 mb-3">
              Connect your bank account securely via Stripe so you can get paid. Required to list
              produce.
            </p>
            <Button
              onClick={onStripeRedirect}
              size="sm"
              className="bg-click-green hover:bg-forest-mid text-white"
            >
              Complete Stripe Onboarding
            </Button>
          </div>
        </div>

        <div className="p-5 bg-white border border-border/40 rounded-xl shadow-sm flex items-start gap-4 opacity-80">
          <div className="w-10 h-10 bg-black/5 text-ink-3 rounded-full flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-ink">List your harvest</h3>
            <p className="text-sm text-ink-3 mt-1 mb-3">
              Add your first product to the marketplace.
            </p>
            <Button asChild size="sm" variant="outline" className="border-lime/50">
              <Link href="/producer/listings/new">Create Listing &rarr;</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button asChild variant="ghost" className="text-ink-3 group">
          <Link href="/producer">
            Skip to dashboard{' '}
            <SkipForward className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
