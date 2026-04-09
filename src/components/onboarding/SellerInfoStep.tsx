'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * Data structure containing detailed information about a seller's operation.
 */
interface SellerInfoData {
  aboutMe: string;
  specialties: string;
  goal: number | '';
  willDeliver: boolean;
  deliveryRangeMiles: number | '';
}

/**
 * Props for the SellerInfoStep component.
 */
export interface SellerInfoStepProps {
  onSubmit: (data: SellerInfoData) => void;
}

/**
 * A form for sellers to provide operation details like specialties and delivery preferences.
 * Includes conditional logic for delivery range based on the user's selection.
 * @param props - Component properties.
 * @param props.onSubmit - Callback triggered with the seller's form data or on skip.
 * @returns A form with text inputs, a textarea for biography, and delivery configuration.
 */
export default function SellerInfoStep({ onSubmit }: { onSubmit: (data: SellerInfoData) => void }) {
  const [aboutMe, setAboutMe] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [goal, setGoal] = useState<number | ''>('');
  const [willDeliver, setWillDeliver] = useState(false);
  const [deliveryRangeMiles, setDeliveryRangeMiles] = useState<number | ''>('');

  const handleSubmit = (e?: React.SubmitEvent) => {
    if (e) e.preventDefault();
    onSubmit({ aboutMe, specialties, goal, willDeliver, deliveryRangeMiles });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-deep-forest">
          Tell us about your farm
        </h2>
        <p className="font-sans text-sm text-ink-3 mt-1">
          This helps buyers get to know you. You can skip this and fill it out later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 noValidate">
        <div className="space-y-2">
          <Label htmlFor="about" className="text-ink-2 font-semibold">
            About You
          </Label>
          <Textarea
            id="about"
            placeholder="Tell your community what you grow and why you love it..."
            className="bg-white border-lime/50 focus-visible:ring-click-green resize-none h-24"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialties" className="text-ink-2 font-semibold">
            Specialties (comma separated)
          </Label>
          <Input
            id="specialties"
            placeholder="e.g. Heirloom Tomatoes, Honey, Sourdough"
            className="bg-white border-lime/50 focus-visible:ring-click-green"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal" className="text-ink-2 font-semibold">
            Weekly Goal ($)
          </Label>
          <Input
            id="goal"
            type="number"
            placeholder="How much would you like to make each week?"
            className="bg-white border-lime/50 focus-visible:ring-click-green"
            value={goal}
            onChange={(e) => setGoal(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>

        <div className="bg-white p-4 rounded-lg border border-lime/30 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="delivery"
              checked={willDeliver}
              onCheckedChange={(checked) => setWillDeliver(checked as boolean)}
              className="data-[state=checked]:bg-click-green data-[state=checked]:border-click-green"
            />
            <Label htmlFor="delivery" className="text-ink-2 font-semibold cursor-pointer">
              I am willing to deliver orders myself
            </Label>
          </div>

          {willDeliver && (
            <div className="pl-6 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="range" className="text-xs text-ink-3 uppercase tracking-wide">
                Delivery Range (Miles)
              </Label>
              <Input
                id="range"
                type="number"
                placeholder="e.g. 15"
                className="bg-white border-lime/50 focus-visible:ring-click-green mt-1 max-w-30"
                value={deliveryRangeMiles}
                onChange={(e) => setDeliveryRangeMiles(Number(e.target.value) || '')}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            className="text-ink-3"
            onClick={() => handleSubmit()}
          >
            Skip
          </Button>
          <Button
            type="submit"
            className="ml-auto bg-lime text-forest-dark hover:bg-lime-light font-bold"
          >
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
