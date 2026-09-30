'use client';

import { InviteMembersForm } from './InviteMembersForm';
import { OrgInviteSkeleton } from './OrgInviteClientSkeleton';

import { PageHeader } from '@/components/ui/page-header';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { PageErrorState } from '@/components/ui/state-displays';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { useGetOrgInvites } from '@/lib/api/generated/invites/invites';
import { OrgRole } from '@/lib/api/generated/models';

/**
 * Page for inviting members to an organization.
 * @returns Component with invite button and invited table
 */
export default function OrgInviteClient() {
  const { user, status: userStatus } = useAuth();

  const isAdmin = user?.orgRole === OrgRole.admin;
  const isUserLoading = userStatus === 'loading';

  const { page, limit, setPage } = usePagination(10);

  const {
    data: invitesRes,
    isLoading: isInvitesLoading,
    isError: isInvitesError,
    refetch: refetchInvites,
  } = useGetOrgInvites(
    { page, limit },
    {
      query: {
        enabled: isAdmin,
      },
    },
  );

  if (isUserLoading) {
    return <OrgInviteSkeleton />;
  }

  if (!isAdmin) {
    return (
      <PageErrorState
        title="Access Denied"
        description="You do not have administrative privileges."
      />
    );
  }

  const isQueryFailed = isInvitesError || invitesRes?.status !== 200;

  const invitesData = !isQueryFailed ? invitesRes?.data?.data : [];
  const meta = !isQueryFailed ? invitesRes?.data?.meta : undefined;

  return (
    <div className="flex w-full flex-col mx-auto">
      <PageHeader title="Invite Organization Members" />

      <InviteMembersForm
        invitedMembers={invitesData}
        isLoading={isInvitesLoading}
        isError={isQueryFailed}
        onSuccessMutation={() => void refetchInvites()}
        onRetryFetch={() => void refetchInvites()}
      />

      {meta && meta.totalPages > 1 && <PaginationControls meta={meta} onPageChange={setPage} />}
    </div>
  );
}
