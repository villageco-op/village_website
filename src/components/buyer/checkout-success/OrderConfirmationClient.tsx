'use client';

import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * The order confirmation page with buttons going to billing and browse.
 * @returns The client container component
 */
export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="container-custom max-w-2xl mx-auto">
      <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-lime/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <CheckCircle className="w-10 h-10 text-click-green" />
          </div>

          {/* Text Content */}
          <h1 className="font-heading text-[clamp(2rem,3vw,2.5rem)] font-extrabold text-deep-forest tracking-[-0.02em] leading-tight mb-4">
            Order Confirmed!
          </h1>
          <p className="text-forest-dark/70 max-w-md mx-auto mb-2 text-lg">
            Thank you for your purchase. Every dollar spent locally re-circulates and strengthens
            your community.
          </p>
          <p className="text-forest-dark/60 max-w-md mx-auto mb-10 text-sm">
            You&apos;ll receive an email confirmation shortly.
            {sessionId && (
              <span className="block mt-2 text-xs opacity-70 break-all">
                Order Reference: {sessionId.slice(0, 16)}...
              </span>
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button asChild variant="forest" className="w-full sm:w-auto h-12 px-8 transition-all">
              <Link href="/buyer/billing">
                View Orders <ShoppingBag className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full sm:w-auto h-12 px-8 transition-all">
              <Link href="/buyer/browse">
                Back to Browse <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
