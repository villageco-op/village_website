'use client';

import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCheckSubdomain } from '@/lib/api/generated/organizations/organizations';
import { US_STATES } from '@/lib/constants/location-constants';

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
  const [debouncedSubdomain, setDebouncedSubdomain] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Gary');
  const [state, setState] = useState('IN');
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSubdomain(subdomain);
    }, 400);
    return () => clearTimeout(handler);
  }, [subdomain]);

  const { data: checkData, isFetching: isChecking } = useCheckSubdomain(
    { subdomain: debouncedSubdomain },
    { query: { enabled: debouncedSubdomain.length >= 3 } },
  );
  console.log(`Check Data: ${JSON.stringify(checkData)}`);
  const isSubdomainAvailable =
    debouncedSubdomain.length >= 3 && checkData?.status === 200 && checkData?.data?.available;
  const suggestion = checkData?.status === 200 ? checkData?.data?.suggestion : undefined;

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

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    setSubdomain(formatted);
  };

  const handleSuggestionClick = () => {
    if (suggestion) {
      setSubdomain(suggestion);
      setDebouncedSubdomain(suggestion);
    }
  };

  const isValid =
    name.trim() !== '' &&
    address.trim() !== '' &&
    city.trim() !== '' &&
    state.trim() !== '' &&
    zip.trim() !== '' &&
    isSubdomainAvailable;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;
    await onSubmit({
      name,
      subdomain,
      address,
      city,
      state,
      country: 'United States',
      zip,
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
        {/* Profile Logo Upload */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <div
            className="w-20 h-20 rounded-full bg-lime/20 border-2 border-dashed border-lime flex items-center justify-center cursor-pointer overflow-hidden relative group transition-colors hover:border-click-green"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Org preview logo"
                fill
                className="object-cover"
                sizes="80px"
                priority
              />
            ) : (
              <Camera className="w-6 h-6 text-click-green group-hover:scale-110 transition-transform" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
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
            Upload Org Logo (Optional)
          </Label>
        </div>

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

          <div className="space-y-1.5">
            <Label htmlFor="subdomain" className="text-ink-2 font-semibold text-sm">
              Custom Subdomain <span className="text-red-500">*</span>
            </Label>
            <div className="flex rounded-md shadow-sm">
              <Input
                id="subdomain"
                placeholder="gary-pantry"
                className="bg-white border-lime/50 focus-visible:ring-click-green rounded-r-none h-9 text-right font-mono text-sm"
                value={subdomain}
                onChange={handleSubdomainChange}
                required
              />
              <span className="inline-flex min-w-max shrink-0 whitespace-nowrap items-center px-3 rounded-r-md border border-l-0 border-lime/50 bg-lime-pale text-ink-3 text-sm font-mono select-none">
                .villageco-op.com
              </span>
            </div>
            {/* Realtime subdomain verification status rendering */}
            <div className="text-xs mt-1 min-h-5">
              {isChecking && (
                <div className="text-ink-3 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-click-green" /> Verifying
                  availability...
                </div>
              )}
              {!isChecking && subdomain.length > 0 && subdomain.length < 3 && (
                <div className="text-red-500">Subdomain must be at least 3 characters.</div>
              )}
              {!isChecking && debouncedSubdomain.length >= 3 && (
                <>
                  {isSubdomainAvailable ? (
                    <div className="text-green-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Subdomain is
                      available!
                    </div>
                  ) : (
                    <div className="text-red-500 flex flex-wrap items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Taken.
                      {suggestion && (
                        <button
                          type="button"
                          onClick={handleSuggestionClick}
                          className="font-bold text-click-green hover:underline ml-1"
                        >
                          Use suggest: &ldquo;{suggestion}&rdquo;
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-ink-2 font-semibold text-sm">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="e.g. 101 Civic Center Plaza"
              className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-ink-2 font-semibold text-sm">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="e.g. Gary"
                className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="state" className="text-ink-2 font-semibold text-sm">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select value={state} onValueChange={setState} required>
                  <SelectTrigger
                    id="state"
                    className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
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

              <div className="space-y-1.5">
                <Label htmlFor="zip" className="text-ink-2 font-semibold text-sm">
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zip"
                  placeholder="e.g. 46402"
                  inputMode="numeric"
                  maxLength={5}
                  pattern="[0-9]*"
                  className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
                  value={zip}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setZip(value);
                  }}
                  required
                />
              </div>
            </div>
          </div>

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
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-ink-2 hover:text-ink hover:bg-black/5 font-semibold h-9"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="flex-1 bg-lime text-forest-dark hover:bg-lime-light font-bold h-9"
          >
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
