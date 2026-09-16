'use client';

import { CheckCircle2, PlusCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Stripe Return / Onboarding Completion Page.
 * Displayed when a user completes their Stripe Connect onboarding flow.
 * @returns Simple component with title and next step buttons.
 */
export default function StripeReturnSuccessPage() {
  return (
    <div className="container-custom max-w-2xl mx-auto py-12">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 bg-lime/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-10 h-10 text-click-green" />
          </div>

          {/* Heading */}
          <h1 className="font-heading text-[clamp(2rem,3vw,2.5rem)] font-extrabold text-deep-forest tracking-[-0.02em] leading-tight mb-3">
            Stripe Account Connected!
          </h1>
          <p className="font-sans text-forest-dark/70 max-w-md mx-auto mb-8 text-base sm:text-lg">
            Your payment setup is complete. Your account is now fully enabled to start doing
            business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button asChild variant="forest" className="w-full sm:w-auto transition-all">
              <Link href="/seller/new-listing">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Listing
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full sm:w-auto transition-all">
              <Link href="/seller">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
