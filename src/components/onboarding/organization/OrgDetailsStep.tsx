'use client';

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { AddressFormFields, type AddressValue } from '@/components/edit-profile/AddressFormFields';
import { AvatarPicker } from '@/components/edit-profile/AvatarPicker';
import { SubdomainInput } from '@/components/organization/settings/SubdomainInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrgType } from '@/lib/api/generated/models';

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
  maxReferrals?: number;
}

interface OrgDetailsStepProps {
  type: OrgType;
  onSubmit: (data: OrgDetailsData) => void | Promise<void>;
  onBack: () => void;
  isPending?: boolean;
}

/**
 * The organization details step.
 * @param props - Component props
 * @param props.type - The selected organization type
 * @param props.onSubmit - When the submit button is pressed
 * @param props.onBack - When the back button is pressed
 * @param props.isPending - Indicates a submission is pending
 * @returns A form component with inputs for all the org info
 */
export default function OrgDetailsStep({ type, onSubmit, onBack, isPending }: OrgDetailsStepProps) {
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
  const [maxReferrals, setMaxReferrals] = useState<string>('4');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isPantry = type === OrgType.pantry;

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

    const parsedMaxReferrals = maxReferrals !== '' ? Number.parseInt(maxReferrals, 10) : undefined;

    await onSubmit({
      name,
      subdomain,
      ...addressInfo,
      country: 'United States',
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      imageFile,
      maxReferrals: isPantry && !Number.isNaN(parsedMaxReferrals) ? parsedMaxReferrals : undefined,
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-6 text-center">
        <h2 className="font-heading text-2xl font-bold text-deep-forest">Organization Profile</h2>
        <p className="font-sans text-sm text-ink-3 mt-1">
          Provide your organization details and settings. Everything entered can be changed later.
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
            <Label htmlFor="orgName">
              Organization Name <span className="text-required">*</span>
            </Label>
            <Input
              id="orgName"
              placeholder="e.g. Gary Food Pantry Network"
              className="h-9"
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
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@garypantry.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://garypantry.org"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          {isPantry && (
            <div className="space-y-1.5">
              <Label htmlFor="maxReferrals">Client Referral Limit</Label>
              <p className="text-xs text-ink-3 mt-1 mb-4">
                The number of referrals a single client is allowed to make.
              </p>
              <Input
                id="maxReferrals"
                type="number"
                min={0}
                placeholder="e.g. 4"
                className="max-w-40"
                value={maxReferrals}
                onChange={(e) => setMaxReferrals(e.target.value)}
              />
            </div>
          )}
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
