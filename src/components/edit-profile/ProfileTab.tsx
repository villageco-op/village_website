'use client';

import { ExternalLink, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AddressFormFields, type AddressValue } from './AddressFormFields';
import { AvatarPicker } from './AvatarPicker';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SecondaryHeader } from '@/components/ui/secondary-header';
import { Textarea } from '@/components/ui/textarea';
import { useGeocodeAddress } from '@/lib/api/generated/location/location';
import type { User } from '@/lib/api/generated/models/user';
import { useUploadImage } from '@/lib/api/generated/upload/upload';
import { useUpdateCurrentUser } from '@/lib/api/generated/users/users';

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
  const [name, setName] = useState('');
  const [addressInfo, setAddressInfo] = useState<AddressValue>({
    address: '',
    city: 'Gary',
    state: 'IN',
    zip: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [aboutMe, setAboutMe] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [goal, setGoal] = useState<string | ''>('');
  const [willDeliver, setWillDeliver] = useState(false);
  const [deliveryRangeMiles, setDeliveryRangeMiles] = useState<string | ''>('');

  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = useUpdateCurrentUser();
  const uploadImageMutation = useUploadImage();
  const geocodeAddressMutation = useGeocodeAddress();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAddressInfo({
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
      });
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

  const handleSaveProfile = async (e: React.SubmitEvent) => {
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
          ...addressInfo,
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
          image: imageUrl,
          ...addressInfo,
          country: 'United States',
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
          <SecondaryHeader title="Basic Information" />
          {isSeller && (
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href={`/public-profile/${user.id}`}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Profile
              </Link>
            </Button>
          )}
        </div>

        <AvatarPicker
          label="Update Profile Photo"
          value={imagePreview}
          onChange={(preview, file) => {
            if (!file) return;

            setImagePreview(preview);
            setImageFile(file);
          }}
        />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Real Name</Label>
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
      </div>

      {/* Seller Info Section */}
      {isSeller && (
        <>
          <hr className="border-t border-border/20" />
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-deep-forest">Seller Details</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about">About You</Label>
                <Textarea
                  id="about"
                  placeholder="Tell your community what you grow and why you love it..."
                  className="resize-none h-24"
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties (comma separated)</Label>
                <Input
                  id="specialties"
                  placeholder="e.g. Heirloom Tomatoes, Honey, Sourdough"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Weekly Goal ($)</Label>
                <Input
                  id="goal"
                  type="number"
                  placeholder="Target weekly revenue"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value === '' ? '' : e.target.value)}
                />
              </div>

              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="delivery"
                      checked={willDeliver}
                      onCheckedChange={(checked) => setWillDeliver(checked as boolean)}
                    />
                    <Label htmlFor="delivery" className="cursor-pointer">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      <div className="flex pt-4">
        <Button
          type="submit"
          variant="lime"
          disabled={isSaving}
          className="w-full sm:w-auto ml-auto"
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
