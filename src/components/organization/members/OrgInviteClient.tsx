'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { InviteMembersForm } from './InviteMembersForm';
import { OrgInviteSkeleton } from './OrgInviteClientSkeleton';

import { Button } from '@/components/ui/button';
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

  const router = useRouter();
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
    <div className="flex w-full flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/org/members')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink">
              Invite Organization Members
            </h1>
            <p className="text-sm text-ink-3">
              Send organization entry credentials to new team members.
            </p>
          </div>
        </div>
      </div>

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
