'use client';

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { AddressFormFields, type AddressValue } from '@/components/edit-profile/AddressFormFields';
import { AvatarPicker } from '@/components/edit-profile/AvatarPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BasicInfoData } from '@/hooks/useOnboardingActions';

/**
 * Props for the BasicProfileStep component.
 */
interface BasicProfileStepProps {
  onSubmit: (data: BasicInfoData) => void | Promise<void>;
  isPending?: boolean;
  onBack: () => void;
}

/**
 * A form component that collects basic user identity and location information.
 * Features a circular image upload preview and validated input fields.
 * @param props - Component properties
 * @param props.onSubmit - Submission handler receiving form data
 * @param props.isPending - Indicates if the form is currently being processed
 * @param props.onBack - When the back button is pressed
 * @returns A slide-in animated form containing profile image upload and location inputs
 */
export default function BasicProfileStep({ onSubmit, isPending, onBack }: BasicProfileStepProps) {
  const [name, setName] = useState('');
  const [addressInfo, setAddressInfo] = useState<AddressValue>({
    address: '',
    city: 'Gary',
    state: 'IN',
    zip: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isValid =
    name.trim() !== '' &&
    addressInfo.address.trim() !== '' &&
    addressInfo.city.trim() !== '' &&
    addressInfo.state.trim() !== '' &&
    addressInfo.zip.trim() !== '';

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;
    await onSubmit({
      name,
      organization: null,
      imageFile,
      ...addressInfo,
      country: 'United States',
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-deep-forest">
          Welcome to Your Village
        </h2>
        <p className="font-sans text-sm text-ink-3 mt-2">
          Let&apos;s start with the basics to set up your profile.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="space-y-6 noValidate"
      >
        <AvatarPicker
          label="Upload Profile Photo (Optional)"
          value={imagePreview}
          onChange={(preview, file) => {
            setImagePreview(preview);
            setImageFile(file);
          }}
        />

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Real Name <span className="text-required">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <AddressFormFields value={addressInfo} onChange={setAddressInfo} required />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-border/10">
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button type="submit" disabled={!isValid || isPending} variant="lime" className="ml-auto">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
