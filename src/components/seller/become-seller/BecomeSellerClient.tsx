'use client';

import {
  Sprout,
  CreditCard,
  Repeat,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

/**
 * A page to show when a non-seller user attempts to visit a seller page.
 * @returns The become seller client component
 */
export default function BecomeSellerClient() {
  const { user, status } = useAuth();
  const isSeller = user?.stripeOnboardingComplete;
  const isLoading = status == 'loading';

  return (
    <div className="min-h-screen bg-off-white py-20 px-4">
      <div className="container-custom max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-lime-pale text-click-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sprout className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-[clamp(2.4rem,4.2vw,3.6rem)] font-extrabold text-deep-forest tracking-[-0.035em] leading-[1.1] mb-6">
            Become a Seller & Grower
          </h1>
          <p className="text-lg text-forest-dark/80 max-w-2xl mx-auto">
            Join our community marketplace to list your fresh produce, artisanal goods, and farm
            products. Reach local neighbors and manage your sales all in one place.
          </p>
        </div>

        {/* Key Offerings Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-forest-dark/10 shadow-sm">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4 text-click-green">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-deep-forest mb-2">
                Accept Online Payments
              </h3>
              <p className="text-sm text-forest-dark/70">
                Securely process credit cards and bank transfers directly from your customers with
                easy payouts.
              </p>
            </CardContent>
          </Card>

          <Card className="border-forest-dark/10 shadow-sm">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4 text-click-green">
                <Repeat className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-deep-forest mb-2">
                Recurring Subscriptions
              </h3>
              <p className="text-sm text-forest-dark/70">
                Allow customers to easily subscribe to your farm for recurring harvests.
              </p>
            </CardContent>
          </Card>

          <Card className="border-forest-dark/10 shadow-sm bg-black/5">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-border/20 rounded-full flex items-center justify-center mx-auto mb-4 text-ink-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-deep-forest mb-2">
                SNAP/EBT (Coming Soon)
              </h3>
              <p className="text-sm text-forest-dark/70">
                Expand your reach and feed more of your community by accepting food assistance
                payments online.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Call to Action based on User State */}
        <div className="max-w-2xl mx-auto bg-white border border-lime/30 rounded-2xl p-8 shadow-sm text-center">
          {isLoading ? (
            <div className="animate-pulse h-20 bg-lime-pale rounded-lg"></div>
          ) : !user ? (
            <>
              <h2 className="font-heading text-2xl font-bold text-deep-forest mb-3">
                Ready to start selling?
              </h2>
              <p className="text-forest-dark/80 mb-8">
                Create an account or log in to set up your farm profile and connect your bank
                account.
              </p>
              <Button
                asChild
                className="bg-lime text-forest-dark hover:bg-lime-light font-bold h-12 px-8 text-base transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/login?returnTo=/onboarding?upgrade=seller">
                  Log in / Sign up to Start <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </>
          ) : !isSeller ? (
            <div className="text-left max-w-md mx-auto">
              <h2 className="font-heading text-2xl font-bold text-deep-forest mb-6 text-center">
                Steps to Become a Seller
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-click-green mr-3 shrink-0" />
                  <span className="text-forest-dark/80">
                    <strong>1. Tell us about your farm</strong> – Share your story and specialties
                    with buyers.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-click-green mr-3 shrink-0" />
                  <span className="text-forest-dark/80">
                    <strong>2. Connect with Stripe</strong> – Set up your secure payout details to
                    accept online payments.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-click-green mr-3 shrink-0" />
                  <span className="text-forest-dark/80">
                    <strong>3. List your produce</strong> – Start selling directly to your
                    community.
                  </span>
                </li>
              </ul>
              <Button
                asChild
                className="w-full bg-lime text-forest-dark hover:bg-lime-light font-bold h-12 text-base transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/onboarding?upgrade=seller">
                  Complete Seller Onboarding <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4 text-lime">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-deep-forest mb-3">
                You&apos;re already a seller!
              </h2>
              <p className="text-forest-dark/80 mb-8">
                Your farm profile is active and ready to go. Head over to your dashboard to manage
                your listings and orders.
              </p>
              <Button
                asChild
                className="bg-click-green text-white hover:bg-forest-mid font-bold h-12 px-8 text-base"
              >
                <Link href="/producer">
                  Go to Dashboard <LayoutDashboard className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
