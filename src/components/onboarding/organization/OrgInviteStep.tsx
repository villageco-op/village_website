'use client';

import { ArrowLeft, Check } from 'lucide-react';

import { InviteMembersForm } from '@/components/organization/members/InviteMembersForm';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/usePagination';
import { useGetOrgInvites } from '@/lib/api/generated/invites/invites';
import type { OrgRole } from '@/lib/api/generated/models/orgRole';

interface OrgInviteStepProps {
  onInvite: (email: string, role: OrgRole) => Promise<boolean>;
  onFinish: () => void;
  onBack: () => void;
  isPending?: boolean;
}

/**
 * The organization invite step.
 * @param props - Component props
 * @param props.onInvite - When an invite is sent
 * @param props.onFinish - When continue is pressed
 * @param props.onBack - When back is pressed
 * @param props.isPending - Is a submission pending
 * @returns A component with an invite form, dynamic table, and pagination controls
 */
export default function OrgInviteStep({ onFinish, onBack }: OrgInviteStepProps) {
  const { page, limit, setPage } = usePagination(10);

  const {
    data: invitesRes,
    isLoading: isInvitesLoading,
    refetch: refetchInvites,
    isError: isInvitesError,
  } = useGetOrgInvites({ page, limit });

  const invitesFailed = isInvitesError || invitesRes?.status !== 200;

  const invitesData = !invitesFailed ? invitesRes?.data?.data : [];
  const meta = !invitesFailed ? invitesRes?.data?.meta : undefined;

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-deep-forest">Invite Team Members</h2>
        <p className="font-sans text-sm text-ink-3 mt-1">
          Add other administrators or members to assist with management (Optional).
        </p>
      </div>

      <InviteMembersForm
        invitedMembers={invitesData}
        isLoading={isInvitesLoading}
        isError={invitesFailed}
        onSuccessMutation={() => void refetchInvites()}
        onRetryFetch={() => void refetchInvites()}
      />

      {meta && meta.totalPages > 1 && <PaginationControls meta={meta} onPageChange={setPage} />}

      <div className="flex justify-between items-center pt-4 border-t border-border/10 gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Button type="button" onClick={onFinish} variant="forest" className="ml-auto">
          Finish & Go to Dashboard <Check className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
