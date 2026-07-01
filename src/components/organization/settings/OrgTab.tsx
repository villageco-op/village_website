'use client';

import OrgSettingsForm from './OrgSettingsForm';
import { SettingsSkeleton } from './SettingsSkeleton';

import { PageErrorState } from '@/components/ui/state-displays';
import type { User } from '@/lib/api/generated/models';
import { useGetOrganization } from '@/lib/api/generated/organizations/organizations';

interface OrgTabProps {
  user: User;
  onDeleteOrganization: () => void;
}

/**
 * A tab content component for fully managing organization details and identity.
 * Designed to sit inside a tabbed view area.
 * @param props - Component props
 * @param props.user - The current user
 * @param props.onDeleteOrganization - When delete org is pressed
 * @returns A form component
 */
export default function OrgTab({ user, onDeleteOrganization }: OrgTabProps) {
  const orgId = user?.organizationId;

  const {
    data: orgResult,
    isLoading: isLoadingOrg,
    refetch: refetchOrg,
  } = useGetOrganization(orgId || '', { query: { enabled: !!orgId } });

  if (!orgId) {
    return (
      <PageErrorState
        title="No Organization Associated"
        description="Your personal profile is not associated with an organization."
      />
    );
  }

  if (isLoadingOrg) return <SettingsSkeleton />;

  const orgData = orgResult?.status === 200 ? orgResult.data : null;

  return (
    <OrgSettingsForm
      orgData={orgData}
      orgId={orgId}
      user={user}
      refetchOrg={() => void refetchOrg()}
      onDeleteOrganization={onDeleteOrganization}
    />
  );
}
