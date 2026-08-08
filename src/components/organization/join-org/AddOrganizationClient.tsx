'use client';

import { Building2, Info } from 'lucide-react';
import Link from 'next/link';

import { AddOrganizationCardSkeleton } from './AddOrganizationCardSkeleton';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

/**
 * A landing page to show when a user wants to register or join an organization.
 * @returns The Add Organization client component
 */
export default function AddOrganizationClient() {
  const { user, status } = useAuth();
  const isLoading = status === 'loading';
  const hasOrg = Boolean(user?.organizationId);

  return (
    <div className="min-h-screen bg-off-white py-16 px-4">
      <div className="container-custom max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lime-pale text-click-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-extrabold text-deep-forest tracking-[-0.035em] leading-[1.1] mb-3">
            Register Your Organization
          </h1>
          <p className="text-base text-forest-dark/80 max-w-xl mx-auto">
            Connect your food pantry or business to simplify operations, manage services, and
            connect with your local community.
          </p>
        </div>

        {/* Existing Org Notice Banner */}
        <div className="mb-10 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex items-start gap-3 text-sm">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5">Does your organization already exist on Village?</p>
            <p className="text-amber-900/80">
              If your organization is already registered, ask one of your organization&apos;s
              administrators to send you an invitation link to join.
            </p>
          </div>
        </div>

        {/* Dynamic CTA Card */}
        <Card className="p-6 sm:p-8 text-center">
          {isLoading ? (
            <AddOrganizationCardSkeleton />
          ) : !user ? (
            <CardContent>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-deep-forest mb-2">
                Ready to setup your organization?
              </h2>
              <p className="text-sm text-forest-dark/80 mb-6 max-w-md mx-auto">
                Sign in or create an account to start the organization onboarding process.
              </p>
              <Button asChild variant="lime" className="h-11 px-6">
                <Link href="/login?returnTo=/onboarding?upgrade=org">
                  Log in / Sign up to Start
                </Link>
              </Button>
            </CardContent>
          ) : !hasOrg ? (
            <CardContent>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-deep-forest mb-2">
                Start Organization Onboarding
              </h2>
              <p className="text-sm text-forest-dark/80 mb-6 max-w-md mx-auto">
                Set up your organization and gain access to dedicated management tools.
              </p>
              <Button asChild variant="lime" className="h-11 px-6">
                <Link href="/onboarding?upgrade=org">Continue to Org Onboarding</Link>
              </Button>
            </CardContent>
          ) : (
            <CardContent>
              <h2 className="font-heading text-xl font-bold text-deep-forest mb-2">
                You belong to an organization!
              </h2>
              <p className="text-sm text-forest-dark/80 mb-6 max-w-md mx-auto">
                Head over to your organization workspace to manage settings and members.
              </p>
              <Button asChild variant="lime" className="h-11 px-6">
                <Link href="/org/clients">Go to Org Dashboard</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
