'use client';

import { Loader2, LogOut, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { DeleteOrganizationDialog } from './DeleteConfirmationDialog';
import { LeaveOrganizationDialog } from './LeaveOrganizationDialog';
import { SubdomainInput } from './SubdomainInput';

import { AddressFormFields } from '@/components/edit-profile/AddressFormFields';
import { AvatarPicker } from '@/components/edit-profile/AvatarPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SecondaryHeader } from '@/components/ui/secondary-header';
import { useGeocodeAddress } from '@/lib/api/generated/location/location';
import { OrgType, type Organization, type User } from '@/lib/api/generated/models';
import {
  useUpdateOrganization,
  useDeleteOrganization,
} from '@/lib/api/generated/organizations/organizations';
import { useUploadImage } from '@/lib/api/generated/upload/upload';
import { useLeaveOrganization } from '@/lib/api/generated/users/users';

interface OrgSettingsFormProps {
  orgData: Organization | null;
  orgId: string;
  user: User;
  refetchOrg: () => void;
  onDeleteOrganization: () => void;
  onLeaveOrganization?: () => void;
}

/**
 * The org settings tab form with org details and the delete org button.
 * @param props - Component props
 * @param props.orgData - The organization
 * @param props.orgId - The organization Id
 * @param props.user - The current user
 * @param props.refetchOrg - Refetch the organization data
 * @param props.onDeleteOrganization - When the delete org button is pressed
 * @param props.onLeaveOrganization - When the leave org button is pressed
 * @returns A form with inputs and query management
 */
export default function OrgSettingsForm({
  orgData,
  orgId,
  user,
  refetchOrg,
  onDeleteOrganization,
  onLeaveOrganization,
}: OrgSettingsFormProps) {
  const isAdmin = user?.orgRole?.toLowerCase() === 'admin';

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
  const [maxReferrals, setMaxReferrals] = useState<string>(
    orgData?.maxReferrals !== undefined && orgData?.maxReferrals !== null
      ? String(orgData.maxReferrals)
      : '4',
  );
  const [currentAvatar, setCurrentAvatar] = useState(orgData?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const updateOrgMutation = useUpdateOrganization();
  const deleteOrgMutation = useDeleteOrganization();
  const leaveOrgMutation = useLeaveOrganization();
  const uploadImageMutation = useUploadImage();
  const geocodeAddressMutation = useGeocodeAddress();

  const isPantry = orgData?.type === OrgType.pantry;

  const handleUpdateOrganization = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!orgId || !isAdmin) return;

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
    const parsedMaxReferrals = maxReferrals !== '' ? Number.parseInt(maxReferrals, 10) : undefined;

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
          maxReferrals:
            isPantry && !Number.isNaN(parsedMaxReferrals) ? parsedMaxReferrals : undefined,
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

  const handleLeaveOrganization = async () => {
    try {
      const res = await leaveOrgMutation.mutateAsync();
      if (res.status === 200) {
        toast.success('You have left the organization.');
        setShowLeaveModal(false);
        if (onLeaveOrganization) {
          onLeaveOrganization();
        } else {
          onDeleteOrganization();
        }
      } else {
        toast.error('Failed to leave organization.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while leaving the organization.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SecondaryHeader
        title="Organization Details"
        subtitle={isAdmin ? 'Manage visual identity, address, and subdomain.' : ''}
      />

      {!isAdmin && (
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-sm">
          Only organization admins can edit organization settings.
        </div>
      )}

      {isAdmin ? (
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

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="orgName">
                Organization Name <span className="text-required">*</span>
              </Label>
              <Input
                id="orgName"
                key={name}
                placeholder="Enter your organization's name"
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
      ) : (
        /* Non-Admin Read-Only View */
        <Card>
          <CardContent className="space-y-6">
            {orgData?.image && (
              <div className="w-16 h-16 flex items-center space-x-4">
                <Image
                  src={orgData.image}
                  alt={orgData.name}
                  className="w-16 h-16 rounded-full object-cover border"
                  width="16"
                  height="16"
                  priority
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-ink-3 font-medium block">Name</span>
                <p className="text-ink-1 font-medium">{orgData?.name || '—'}</p>
              </div>

              <div>
                <span className="text-xs text-ink-3 font-medium block">Subdomain</span>
                <p className="text-ink-1 font-medium">{orgData?.subdomain || '—'}</p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-ink-3 font-medium block">Address</span>
                <p className="text-ink-1 font-medium">
                  {[orgData?.address, orgData?.city, orgData?.state, orgData?.zip]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </p>
              </div>

              <div>
                <span className="text-xs text-ink-3 font-medium block">Contact Email</span>
                <p className="text-ink-1 font-medium">{orgData?.email || '—'}</p>
              </div>

              <div>
                <span className="text-xs text-ink-3 font-medium block">Website</span>
                <p className="text-ink-1 font-medium">{orgData?.website || '—'}</p>
              </div>

              {isPantry && (
                <div>
                  <span className="text-xs text-ink-3 font-medium block">
                    Client Referral Limit
                  </span>
                  <p className="text-ink-1 font-medium">{orgData?.maxReferrals ?? '—'}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <hr className="border-t border-border/20" />
      <Card className="space-y-6">
        <CardContent>
          <div>
            <h3 className="font-semibold text-ink-1 text-lg">Organization Management</h3>
            <p className="text-sm text-ink-3 mb-4">
              Revoke your access to this organization and its associated resources.
            </p>
            <Button type="button" variant="secondary" onClick={() => setShowLeaveModal(true)}>
              <LogOut className="w-4 h-4 mr-2" /> Leave Organization
            </Button>
          </div>

          {/* Admin Danger Zone */}
          {isAdmin && (
            <div className="pt-4 border-t border-border/10">
              <h3 className="font-semibold text-red-600 text-lg">Danger Zone</h3>
              <p className="text-sm text-ink-3 mb-4">
                Deleting this organization is permanent. All settings, inventories, lists, and
                connected data will be removed. This cannot be undone.
              </p>
              <Button type="button" variant="destructive" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Organization
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <LeaveOrganizationDialog
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveOrganization}
        isPending={leaveOrgMutation.isPending}
        organizationName={orgData?.name}
      />

      {isAdmin && (
        <DeleteOrganizationDialog
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteOrganization}
          onConfirmTextChanged={setDeleteConfirmText}
          isPending={deleteOrgMutation.isPending}
          organizationName={orgData?.name || ''}
        />
      )}
    </div>
  );
}
