import { useState } from 'react';
import { toast } from 'sonner';

import { useGeocodeAddress } from '@/lib/api/generated/location/location';
import { useUploadImage } from '@/lib/api/generated/upload/upload';
import { useUpdateCurrentUser } from '@/lib/api/generated/users/users';

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
 * Custom hook for submitting basic user profile information during onboarding.
 * @returns True is successful
 */
export function useSubmitBasicProfile() {
  const [isUploading, setIsUploading] = useState(false);
  const updateProfile = useUpdateCurrentUser();
  const uploadImageMutation = useUploadImage();
  const geocodeAddressMutation = useGeocodeAddress();

  const submitBasicProfile = async (data: BasicInfoData) => {
    const toastId = toast.loading('Uploading your profile picture...');

    try {
      setIsUploading(true);
      let imageUrl: string | undefined;

      if (data.imageFile) {
        const uploadRes = await uploadImageMutation.mutateAsync({
          data: { file: data.imageFile },
        });

        if (uploadRes.status === 200) {
          imageUrl = uploadRes.data.url;
          toast.loading('Saving your profile details...', { id: toastId });
        } else {
          throw new Error(uploadRes.data.error || 'Failed to upload image');
        }
      }

      const geocodeRes = await geocodeAddressMutation.mutateAsync({
        data: {
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
        },
      });

      if (geocodeRes.status !== 200) {
        throw new Error(geocodeRes.data.error || 'Failed to geocode address');
      }

      await updateProfile.mutateAsync({
        data: {
          name: data.name,
          image: imageUrl,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          country: data.country,
          lat: geocodeRes.data.lat ?? null,
          lng: geocodeRes.data.lng ?? null,
        },
      });

      toast.success('Profile updated!', { id: toastId });
      return true;
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error('Could not save profile. Please check your connection.', { id: toastId });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    submitBasicProfile,
    isPending: isUploading || updateProfile.isPending,
  };
}
