'use client';

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { AddressFormFields, type AddressValue } from '@/components/edit-profile/AddressFormFields';
import { AvatarPicker } from '@/components/edit-profile/AvatarPicker';
import { SubdomainInput } from '@/components/organization/settings/SubdomainInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Organization form detail data.
 */
export interface OrgDetailsData {
  name: string;
  subdomain: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  email?: string;
  website?: string;
  imageFile: File | null;
}

interface OrgDetailsStepProps {
  onSubmit: (data: OrgDetailsData) => void | Promise<void>;
  onBack: () => void;
  isPending?: boolean;
}

/**
 * The organization details step.
 * @param props - Component props
 * @param props.onSubmit - When the submit button is pressed
 * @param props.onBack - When the back button is pressed
 * @param props.isPending - Indicates a submission is pending
 * @returns A form component with inputs for all the org info
 */
export default function OrgDetailsStep({ onSubmit, onBack, isPending }: OrgDetailsStepProps) {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [isSubdomainValid, setIsSubdomainValid] = useState(false);
  const [addressInfo, setAddressInfo] = useState<AddressValue>({
    address: '',
    city: 'Gary',
    state: 'IN',
    zip: '',
  });
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isValid =
    name.trim() !== '' &&
    addressInfo.address.trim() !== '' &&
    addressInfo.city.trim() !== '' &&
    addressInfo.state.trim() !== '' &&
    addressInfo.zip.trim() !== '' &&
    isSubdomainValid;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;
    await onSubmit({
      name,
      subdomain,
      ...addressInfo,
      country: 'United States',
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      imageFile,
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-6 text-center">
        <h2 className="font-heading text-2xl font-bold text-deep-forest">Organization Profile</h2>
        <p className="font-sans text-sm text-ink-3 mt-1">
          Provide primary identity and physical settings for your organization hub.
        </p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 noValidate">
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
          <div className="space-y-1.5">
            <Label htmlFor="orgName" className="text-ink-2 font-semibold text-sm">
              Organization Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="orgName"
              placeholder="e.g. Gary Food Pantry Network"
              className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <SubdomainInput
            value={subdomain}
            onChange={setSubdomain}
            onValidityChange={setIsSubdomainValid}
            required
          />

          <AddressFormFields value={addressInfo} onChange={setAddressInfo} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-ink-2 font-semibold text-sm">
                Contact Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@garypantry.org"
                className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-ink-2 font-semibold text-sm">
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://garypantry.org"
                className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-border/10 gap-3">
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
                Create Organization <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
