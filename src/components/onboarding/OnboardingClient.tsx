'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import AccountTypeStep from './AccountTypeStep';
import IndividualOnboardingFlow from './individual/IndividualOnboardingFlow';
import OrganizationOnboardingFlow from './organization/OrganizationOnboardingFlow';

/**
 * Base onboarding flow. Handles both individual and org onboarding.
 * @returns A component containing the account type step and onboarding flows.
 */
export default function OnboardingFlow() {
  const searchParams = useSearchParams();
  const isUpgradingToSeller = searchParams?.get('upgrade') === 'seller';
  const isUpgradingToOrg = searchParams?.get('upgrade') === 'org';

  const [flowType, setFlowType] = useState<'individual' | 'organization' | null>(
    isUpgradingToSeller ? 'individual' : isUpgradingToOrg ? 'organization' : null,
  );

  if (flowType === 'individual') {
    return (
      <IndividualOnboardingFlow
        isUpgradingToSeller={isUpgradingToSeller}
        onBack={() => setFlowType(null)}
      />
    );
  }

  if (flowType === 'organization') {
    return (
      <OrganizationOnboardingFlow
        isUpgradingToOrg={isUpgradingToOrg}
        onBack={() => setFlowType(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-xl w-full">
        {/* Isolated progress line showing only the initial selection step */}
        <div className="flex justify-center mb-8 space-x-2">
          <div className="h-2 rounded-full w-8 bg-lime transition-all duration-300" />
        </div>

        <div className="bg-cream/30 border border-border/20 shadow-sm rounded-xl p-8 min-h-100 flex flex-col justify-center relative">
          <AccountTypeStep
            onSelectType={(type) => {
              setFlowType(type);
            }}
          />
        </div>
      </div>
    </div>
  );
}
