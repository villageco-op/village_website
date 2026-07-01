import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DeleteOrganizationDialog } from './DeleteConfirmationDialog';
import { SubdomainInput } from './SubdomainInput';

import { AddressFormFields } from '@/components/edit-profile/AddressFormFields';
import { AvatarPicker } from '@/components/edit-profile/AvatarPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGeocodeAddress } from '@/lib/api/generated/location/location';
import type { Organization, User } from '@/lib/api/generated/models';
import {
  useUpdateOrganization,
  useDeleteOrganization,
} from '@/lib/api/generated/organizations/organizations';
import { useUploadImage } from '@/lib/api/generated/upload/upload';

interface OrgSettingsFormProps {
  orgData: Organization | null;
  orgId: string;
  user: User;
  refetchOrg: () => void;
  onDeleteOrganization: () => void;
}

/**
 * The org settings tab form with org details and the delete org button.
 * @param props - Component props
 * @param props.orgData - The organization
 * @param props.orgId - The organization Id
 * @param props.user - The current user
 * @param props.refetchOrg - Refetch the organization data
 * @param props.onDeleteOrganization - When the delete org button is pressed
 * @returns A form with inputs and query management
 */
export default function OrgSettingsForm({
  orgData,
  orgId,
  user,
  refetchOrg,
  onDeleteOrganization,
}: OrgSettingsFormProps) {
  const [name, setName] = useState(orgData?.name || '');
  const [subdomain, setSubdomain] = useState(orgData?.subdomain || '');
  const [isSubdomainValid, setIsSubdomainValid] = useState(true);
  const [addressInfo, setAddressInfo] = useState({
    address: orgData?.address || '',
    city: orgData?.city || 'Gary',
    state: orgData?.state || 'IN',
    zip: orgData?.zip || '',
  });
  const [email, setEmail] = useState(orgData?.email || '');
  const [website, setWebsite] = useState(orgData?.website || '');
  const [currentAvatar, setCurrentAvatar] = useState(orgData?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const updateOrgMutation = useUpdateOrganization();
  const deleteOrgMutation = useDeleteOrganization();
  const uploadImageMutation = useUploadImage();
  const geocodeAddressMutation = useGeocodeAddress();

  const handleUpdateOrganization = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!orgId) return;

    const isValid =
      name.trim() !== '' &&
      addressInfo.address.trim() !== '' &&
      addressInfo.city.trim() !== '' &&
      addressInfo.state.trim() !== '' &&
      addressInfo.zip.trim() !== '' &&
      isSubdomainValid;

    if (!isValid) {
      toast.error('Please verify that all fields and subdomains are valid.');
      return;
    }

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

    try {
      await updateOrgMutation.mutateAsync({
        id: orgId,
        data: {
          name,
          subdomain,
          ...addressInfo,
          country: 'United States',
          email: email.trim() || undefined,
          website: website.trim() || undefined,
          image: imageUrl,
          lat,
          lng,
        },
      });
      toast.success('Organization details updated successfully.');
      void refetchOrg();
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating organization settings.');
    }
  };

  const handleDeleteOrganization = async () => {
    if (!orgId || deleteConfirmText !== orgData?.name) return;

    try {
      await deleteOrgMutation.mutateAsync({ id: orgId });
      toast.success('Organization has been deleted.');
      setShowDeleteModal(false);
      onDeleteOrganization();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete organization. Please try again.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="font-heading text-xl font-bold text-deep-forest">Organization Details</h2>
        <p className="text-sm text-ink-3 mt-1">
          Manage visual identity, addresses, and physical locations.
        </p>
      </div>

      <form onSubmit={(e) => void handleUpdateOrganization(e)} className="space-y-5">
        <AvatarPicker
          label="Update Profile Photo"
          value={currentAvatar}
          onChange={(preview, file) => {
            if (!file) return;

            setCurrentAvatar(preview);
            setImageFile(file);
          }}
        />

        {/* Organization Form Controls */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="orgName" className="text-ink-2 font-semibold text-sm">
              Organization Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="orgName"
              key={name}
              placeholder="Enter your organizations name"
              className="bg-white border-lime/50 focus-visible:ring-click-green h-9"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <SubdomainInput
            value={subdomain}
            onChange={setSubdomain}
            originalValue={orgData?.subdomain}
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

        <div className="pt-4 border-t border-border/10 flex justify-end">
          <Button
            type="submit"
            disabled={updateOrgMutation.isPending || !isSubdomainValid}
            variant="lime"
          >
            {updateOrgMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="pt-8 border-t border-red-200 mt-8">
        <div className="bg-red-50/50 border border-red-100 rounded-lg p-5">
          <h3 className="text-red-800 font-heading text-lg font-bold">Danger Zone</h3>
          <p className="text-xs text-red-700/80 mt-1 mb-4">
            Deleting this organization is permanent. All settings, inventories, lists, and connected
            data will be removed. This cannot be undone.
          </p>
          <Button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Organization
          </Button>
        </div>
      </div>

      <DeleteOrganizationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteOrganization}
        onConfirmTextChanged={setDeleteConfirmText}
        isPending={deleteOrgMutation.isPending}
        organizationName={orgData?.name || ''}
      />
    </div>
  );
}
