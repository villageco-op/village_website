'use client';

import { ArrowRight, Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAssetPath } from '@/lib/utils';

/**
 * Data structure for the basic profile information step.
 */
export interface BasicInfoData {
  name: string;
  imageFile: File | null;
  address: string;
  city: string;
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
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isValid = name.trim() !== '' && address.trim() !== '' && city.trim() !== '';

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;
    await onSubmit({ name, imageFile, address, city });
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
                src={getAssetPath(imagePreview)}
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

          <div className="space-y-2">
            <Label htmlFor="city" className="text-ink-2 font-semibold">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              placeholder="e.g. Austin"
              className="bg-white border-lime/50 focus-visible:ring-click-green"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
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
