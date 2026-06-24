'use client';

import { User, Building2 } from 'lucide-react';

/**
 * Account type step props.
 */
export interface AccountTypeStepProps {
  onSelectType: (type: 'individual' | 'organization') => void;
}

/**
 * The account type step that starts onboarding.
 * @param props - Step props
 * @param props.onSelectType - When a type is selected
 * @returns A step component with large options
 */
export default function AccountTypeStep({ onSelectType }: AccountTypeStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-deep-forest">
          Choose Your Account Type
        </h2>
        <p className="font-sans text-sm text-ink-3 mt-2">
          Select how you want to experience Village. This determines your onboarding setup.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onSelectType('individual')}
          className="cursor-pointer flex flex-col items-center justify-center p-6 bg-white border-2 border-border/20 rounded-xl shadow-sm hover:border-lime hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-lime-pale text-click-green rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-ink text-center">Individual</h3>
          <p className="text-sm text-ink-3 mt-1 text-center">
            I want to participate as a buyer, backyard grower, or local seller.
          </p>
        </button>

        <button
          onClick={() => onSelectType('organization')}
          className="cursor-pointer flex flex-col items-center justify-center p-6 bg-white border-2 border-border/20 rounded-xl shadow-sm hover:border-lime hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-lime-pale text-click-green rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-ink text-center">Organization</h3>
          <p className="text-sm text-ink-3 mt-1 text-center">
            We are a food pantry, restaurant, or non-profit organization.
          </p>
        </button>
      </div>
    </div>
  );
}
