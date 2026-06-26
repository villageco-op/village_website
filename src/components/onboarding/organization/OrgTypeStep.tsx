'use client';

import { ArrowLeft, ArrowRight, Store, Utensils } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

/**
 * Props for the Org Type Step.
 */
export interface OrgTypeStepProps {
  onSelectType: (type: 'pantry') => void;
  onBack: () => void;
}

/**
 * The organization type step component.
 * @param props - Component props
 * @param props.onSelectType - When a org type is selected
 * @param props.onBack - When back is pressed
 * @returns Component with large buttons for the org types
 */
export default function OrgTypeStep({ onSelectType, onBack }: OrgTypeStepProps) {
  const [selected, setSelected] = useState<'pantry' | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelectType(selected);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-deep-forest">
          Select Organization Type
        </h2>
        <p className="font-sans text-sm text-ink-3 mt-2">
          Select the option that best describes your organization.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => setSelected('pantry')}
          className={`cursor-pointer flex flex-col items-center justify-center p-6 bg-white border-2 rounded-xl shadow-sm transition-all group text-left ${
            selected === 'pantry'
              ? 'border-lime ring-2 ring-lime/20'
              : 'border-transparent hover:border-lime hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 bg-lime-pale text-click-green rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-ink text-center">Food Pantry</h3>
          <p className="text-sm text-ink-3 mt-1 text-center">
            Distribute fresh produce and surplus items to community members.
          </p>
        </button>

        <div className="flex flex-col items-center justify-center p-6 bg-black/5 border border-dashed border-border/40 rounded-xl opacity-60 relative cursor-not-allowed">
          <span className="absolute top-3 right-3 bg-zinc-200 text-zinc-700 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider scale-90">
            Coming Soon
          </span>
          <div className="w-12 h-12 bg-border/20 text-ink-3 rounded-full flex items-center justify-center mb-4">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-ink-3 text-center">Restaurant</h3>
          <p className="text-sm text-ink-3 mt-1 text-center">
            Source local surplus harvests for commercial dining.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-border/10">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={!selected}
          variant="lime"
          className="ml-auto"
        >
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
