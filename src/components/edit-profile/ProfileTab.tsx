'use client';

import { Camera, ExternalLink, Loader2, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGeocodeAddress } from '@/lib/api/generated/location/location';
import type { User } from '@/lib/api/generated/models/user';
import { useUploadImage } from '@/lib/api/generated/upload/upload';
import { useUpdateCurrentUser } from '@/lib/api/generated/users/users';
import { US_STATES } from '@/lib/constants/location-constants';
import { getAssetPath } from '@/lib/utils';

interface ProfileTabProps {
  user: User;
  isSeller: boolean;
}

/**
 * A tab for editing basic user information and seller information.
 * @param props - Component props
 * @param props.user - The user object
 * @param props.isSeller - Is the user a seller
 * @returns The component with input fields and a save button
 */
export default function ProfileTab({ user, isSeller }: ProfileTabProps) {
  // Basic Info State
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Seller Info State
  const [aboutMe, setAboutMe] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [goal, setGoal] = useState<string | ''>('');
  const [willDeliver, setWillDeliver] = useState(false);
  const [deliveryRangeMiles, setDeliveryRangeMiles] = useState<string | ''>('');

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useUpdateCurrentUser();
  const uploadImageMutation = useUploadImage();
  const geocodeAddressMutation = useGeocodeAddress();

  // Populate data on mount
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setOrganization(user.organization || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setState(user.state || '');
      setZip(user.zip || '');
      setImagePreview(user.image || null);

      if (isSeller) {
        setAboutMe(user.aboutMe || '');
        setSpecialties((user.specialties as string[])?.join(', ') || '');
        setGoal(user.goal || '');
        setDeliveryRangeMiles(user.deliveryRangeMiles || '');
        setWillDeliver((Number(user.deliveryRangeMiles) || 0) > 0);
      }
    }
  }, [user, isSeller]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Saving your profile...');

    try {
      setIsSaving(true);
      let imageUrl = user.image || undefined;

      if (imageFile) {
        const uploadRes = await uploadImageMutation.mutateAsync({
          data: { file: imageFile },
        });

        if (uploadRes.status === 200) {
          imageUrl = uploadRes.data.url;
        } else {
          throw new Error(uploadRes.data.error || 'Failed to upload image');
        }
      }

      const geocodeRes = await geocodeAddressMutation.mutateAsync({
        data: {
          address,
          city,
          state,
          zip,
        },
      });

      if (geocodeRes.status !== 200) {
        throw new Error(geocodeRes.data.error || 'Failed to geocode address');
      }

      const { lat, lng } = geocodeRes.data;

      const specialtiesArray = isSeller
        ? specialties
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

      await updateProfile.mutateAsync({
        data: {
          name,
          organization: organization.trim() || undefined,
          image: imageUrl,
          address,
          city,
          state,
          country: 'United States',
          zip,
          lat,
          lng,
          ...(isSeller && {
            aboutMe,
            specialties: specialtiesArray,
            goal: goal ? Number(goal) : undefined,
            deliveryRangeMiles: willDeliver ? Number(deliveryRangeMiles) : 0,
          }),
        },
      });

      toast.success('Profile updated successfully!', { id: toastId });
    } catch (error) {
      console.error('EditProfile: Failed to update profile', error);
      toast.error('Could not save profile. Please try again.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSaveProfile(e)}
      className="space-y-8 animate-in fade-in duration-300"
    >
      {/* Basic Info Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-deep-forest">Basic Information</h2>
          {isSeller && (
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href={`/public-profile/${user.id}`}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Profile
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 mb-2">
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
            Change Photo
          </Label>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-ink-2 font-semibold">
              Real Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Jane Doe"
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
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-ink-2 font-semibold">
              Street Address
            </Label>
            <Input
              id="address"
              placeholder="e.g. 123 Farm Lane"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-ink-2 font-semibold">
                City
              </Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-ink-2 font-semibold">
                  State
                </Label>
                <Select value={state} onValueChange={setState} required>
                  <SelectTrigger id="state">
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
                  ZIP Code
                </Label>
                <Input
                  id="zip"
                  inputMode="numeric"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Info Section */}
      {isSeller && (
        <>
          <hr className="border-t border-border/20" />
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-deep-forest">Seller Details</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about" className="text-ink-2 font-semibold">
                  About You
                </Label>
                <Textarea
                  id="about"
                  placeholder="Tell your community what you grow and why you love it..."
                  className="resize-none h-24"
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
                  placeholder="Target weekly revenue"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value === '' ? '' : e.target.value)}
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
                      className="mt-1 max-w-30"
                      value={deliveryRangeMiles}
                      onChange={(e) => setDeliveryRangeMiles(e.target.value || '')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex pt-4">
        <Button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto bg-lime text-forest-dark hover:bg-lime-light font-bold ml-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
