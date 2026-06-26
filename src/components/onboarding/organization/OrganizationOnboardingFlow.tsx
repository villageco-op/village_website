'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import OrgDetailsStep, { type OrgDetailsData } from './OrgDetailsStep';
import OrgInviteStep from './OrgInviteStep';
import OrgTypeStep from './OrgTypeStep';

import { useInviteToOrg } from '@/lib/api/generated/invites/invites';
import { useGeocodeAddress } from '@/lib/api/generated/location/location';
import type { OrgRole } from '@/lib/api/generated/models/orgRole';
import { useCreateOrganization } from '@/lib/api/generated/organizations/organizations';
import { useUploadImage } from '@/lib/api/generated/upload/upload';

type OrgStep = 'org-type' | 'org-details' | 'org-invite';

interface OrganizationOnboardingFlowProps {
  onBack: () => void;
}

/**
 * The organization onboarding handler component.
 * @param props - Component props
 * @param props.onBack - When back is pressed
 * @returns The onboarding flow component for organizations
 */
export default function OrganizationOnboardingFlow({ onBack }: OrganizationOnboardingFlowProps) {
  const router = useRouter();

  const [step, setStep] = useState<OrgStep>('org-type');
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageMutation = useUploadImage();
  const geocodeAddressMutation = useGeocodeAddress();
  const createOrgMutation = useCreateOrganization();
  const inviteToOrgMutation = useInviteToOrg();

  const handleOrgDetailsSubmit = async (data: OrgDetailsData) => {
    const toastId = toast.loading('Uploading organization logo...');

    try {
      setIsUploading(true);
      let imageUrl: string | undefined = undefined;

      if (data.imageFile) {
        const uploadRes = await uploadImageMutation.mutateAsync({
          data: { file: data.imageFile },
        });

        if (uploadRes.status === 200) {
          imageUrl = uploadRes.data.url;
          toast.loading('Geocoding organization address...', { id: toastId });
        } else {
          throw new Error(uploadRes.data.error || 'Failed to upload logo');
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

      const { lat, lng } = geocodeRes.data;

      toast.loading('Creating organization hub...', { id: toastId });

      const createRes = await createOrgMutation.mutateAsync({
        data: {
          name: data.name,
          type: 'pantry',
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zip: data.zip,
          lat: lat ?? null,
          lng: lng ?? null,
          subdomain: data.subdomain,
          email: data.email,
          website: data.website,
          image: imageUrl,
        },
      });

      if (createRes.status !== 201) {
        throw new Error((createRes.data as any)?.error || 'Organization registration failed');
      }

      toast.success('Organization registered!', { id: toastId });
      setStep('org-invite');
    } catch (error: any) {
      console.error('OrganizationOnboardingFlow: Failed to register organization', error);
      toast.error(
        error?.message || 'Could not complete registration. Please check your connection.',
        { id: toastId },
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleOrgInviteSubmit = async (email: string, role: OrgRole): Promise<boolean> => {
    try {
      const res = await inviteToOrgMutation.mutateAsync({
        data: { email, role },
      });
      if (res.status === 200) {
        return true;
      } else {
        toast.error((res.data as any)?.error || 'Failed to send invite.');
        return false;
      }
    } catch (error) {
      console.error('OrganizationOnboardingFlow: Failed to transmit invitation', error);
      toast.error('Could not transmit invite. Please check your connection.');
      return false;
    }
  };

  const handleFinishOrgOnboarding = () => {
    router.push('/org-dashboard');
  };

  const ORG_STEPS_ORDER: OrgStep[] = ['org-type', 'org-details', 'org-invite'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-xl w-full">
        {/* Progress Tracker Tracker */}
        <div className="flex justify-center mb-8 space-x-2">
          {ORG_STEPS_ORDER.map((s, i) => {
            const isActive = step === s;
            const isPast = ORG_STEPS_ORDER.indexOf(step) > i;

            return (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'w-8 bg-lime' : isPast ? 'w-4 bg-click-green' : 'w-4 bg-border/40'
                }`}
              />
            );
          })}
        </div>

        {/* Form Node Card */}
        <div className="bg-cream/30 border border-border/20 shadow-sm rounded-xl p-8 min-h-100 flex flex-col justify-center relative">
          {step === 'org-type' && (
            <OrgTypeStep onSelectType={() => setStep('org-details')} onBack={onBack} />
          )}

          {step === 'org-details' && (
            <OrgDetailsStep
              onSubmit={(data) => {
                void handleOrgDetailsSubmit(data);
              }}
              onBack={() => setStep('org-type')}
              isPending={isUploading || createOrgMutation.isPending}
            />
          )}

          {step === 'org-invite' && (
            <OrgInviteStep
              onInvite={handleOrgInviteSubmit}
              onFinish={handleFinishOrgOnboarding}
              onBack={() => setStep('org-details')}
              isPending={inviteToOrgMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
