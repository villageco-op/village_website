'use client';

import { ArrowRight, Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { US_STATES } from '@/lib/constants/location-constants';

/**
 * Data structure for the basic profile information step.
 */
export interface BasicInfoData {
  name: string;
  organization: string | null;
  imageFile: File | null;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

/**
 * Props for the BasicProfileStep component.
 */
interface BasicProfileStepProps {
  onSubmit: (data: BasicInfoData) => void | Promise<void>;
  isPending?: boolean;
}

/**
 * A form component that collects basic user identity and location information.
 * Features a circular image upload preview and validated input fields.
 * @param props - Component properties.
 * @param props.onSubmit - Submission handler receiving form data.
 * @param props.isPending - Indicates if the form is currently being processed.
 * @returns A slide-in animated form containing profile image upload and location inputs.
 */
export default function BasicProfileStep({ onSubmit, isPending }: BasicProfileStepProps) {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Gary');
  const [state, setState] = useState('IN');
  const [zip, setZip] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isValid =
    name.trim() !== '' &&
    address.trim() !== '' &&
    city.trim() !== '' &&
    state.trim() !== '' &&
    zip.trim() !== '';

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;
    await onSubmit({
      name,
      organization: organization.trim() || null,
      imageFile,
      address,
      city,
      country: 'United States',
      state,
      zip,
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-deep-forest">Welcome to the Village</h2>
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
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div
            className="w-24 h-24 rounded-full bg-lime/20 border-2 border-dashed border-lime flex items-center justify-center cursor-pointer overflow-hidden relative group transition-colors hover:border-click-green"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile preview"
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            ) : (
              <Camera className="w-8 h-8 text-click-green group-hover:scale-110 transition-transform" />
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
          <Label
            className="text-xs font-semibold text-ink-3 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Photo (Optional)
          </Label>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-ink-2 font-semibold">
              Real Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Jane Doe"
              className="bg-white border-lime/50 focus-visible:ring-click-green"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization" className="text-ink-2 font-semibold">
              Organization <span className="text-ink-3 font-normal text-xs">(Optional)</span>
            </Label>
            <Input
              id="organization"
              placeholder="e.g. Green Earth Collective"
              className="bg-white border-lime/50 focus-visible:ring-click-green"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-ink-2 font-semibold">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="e.g. 123 Farm Lane"
              className="bg-white border-lime/50 focus-visible:ring-click-green"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-ink-2 font-semibold">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="e.g. Gary"
                className="bg-white border-lime/50 focus-visible:ring-click-green"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-ink-2 font-semibold">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select value={state} onValueChange={setState} required>
                  <SelectTrigger
                    id="state"
                    className="bg-white border-lime/50 focus-visible:ring-click-green"
                  >
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip" className="text-ink-2 font-semibold">
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zip"
                  placeholder="e.g. 46402"
                  inputMode="numeric"
                  maxLength={5}
                  pattern="[0-9]*"
                  className="bg-white border-lime/50 focus-visible:ring-click-green"
                  value={zip}
                  onChange={(e) => {
                    // Only allow numerical input for US Zip codes
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setZip(value);
                  }}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex pt-4">
          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="w-full bg-lime text-forest-dark hover:bg-lime-light font-bold"
          >
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
