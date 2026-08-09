'use client';

import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmRemovalDialog } from './ConfirmMemberRemovalDialog';
import { EditRoleModal } from './EditRoleModal';
import { MembersTable } from './MembersTable';
import { OrgMembersSkeleton } from './OrgMembersClientSkeleton';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { PageErrorState } from '@/components/ui/state-displays';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { OrgRole, type OrgMember } from '@/lib/api/generated/models';
import {
  useGetOrganizationMembers,
  useRemoveOrgMember,
  useUpdateOrgMemberRole,
} from '@/lib/api/generated/organizations/organizations';

/**
 * Organization member management page.
 * @returns Self managed client component with a members table.
 */
export default function OrgMembersClient() {
  const { user, status: userStatus } = useAuth();

  const isAdmin = user?.orgRole === OrgRole.admin;
  const orgId = user?.organizationId;
  const isUserLoading = userStatus === 'loading';

  const { page, limit, setPage, resetPage } = usePagination(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
  const [selectedMemberForRole, setSelectedMemberForRole] = useState<OrgMember | null>(null);
  const [targetRole, setTargetRole] = useState<OrgRole>(OrgRole.member);
  const [selectedMemberForRemoval, setSelectedMemberForRemoval] = useState<OrgMember | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, roleFilter, resetPage]);

  const {
    data: membersRes,
    isLoading: isMembersLoading,
    isError: isMembersError,
    refetch: refetchMembers,
  } = useGetOrganizationMembers(
    orgId || '',
    {
      search: debouncedSearch || undefined,
      role: roleFilter !== 'all' ? (roleFilter as OrgRole) : undefined,
      page,
      limit,
    },
    { query: { enabled: !!orgId && isAdmin } },
  );

  const { mutateAsync: updateMemberRole, isPending: isUpdatingRole } = useUpdateOrgMemberRole();
  const { mutateAsync: removeMember, isPending: isRemovingMember } = useRemoveOrgMember();

  if (isUserLoading) {
    return <OrgMembersSkeleton />;
  }

  if (!isAdmin) {
    return (
      <PageErrorState
        title="Access Denied"
        description="You do not have administrative privileges."
      />
    );
  }

  if (!orgId) {
    return (
      <PageErrorState
        title="No Organization Found"
        description="Your user account is not associated with an active organization."
      />
    );
  }

  const handleRoleChangeConfirm = async () => {
    if (!selectedMemberForRole) return;
    try {
      const response = await updateMemberRole({
        data: { userId: selectedMemberForRole.id, role: targetRole },
      });
      if (response.status === 200) {
        toast.success(`Role updated successfully.`);
        void refetchMembers();
        setSelectedMemberForRole(null);
        setSelectedMember(null);
      }
    } catch (e) {
      toast.error('Could not complete the role change.');
    }
  };

  const handleRemovalConfirm = async () => {
    if (!selectedMemberForRemoval) return;
    try {
      const response = await removeMember({ data: { userId: selectedMemberForRemoval.id } });
      if (response.status === 200) {
        toast.success(`Member was removed.`);
        void refetchMembers();
        setSelectedMemberForRemoval(null);
        setSelectedMember(null);
      }
    } catch (e) {
      toast.error('Could not complete the removal request.');
    }
  };

  const members = membersRes?.status === 200 ? membersRes.data?.data : [];
  const meta = membersRes?.status === 200 ? membersRes.data?.meta : undefined;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Organization Members"
          subtitle="Invite, manage, and assign roles to members."
        />
        <Button asChild variant="forest">
          <Link href="/org/invite" className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Invite New Member</span>
          </Link>
        </Button>
      </div>

      <MembersTable
        members={members || []}
        currentUser={user}
        isLoading={isMembersLoading}
        isError={isMembersError}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setSelectedMember(null);
        }}
        roleFilter={roleFilter}
        setRoleFilter={(r) => {
          setRoleFilter(r);
          setSelectedMember(null);
        }}
        meta={meta}
        setPage={(p) => {
          setPage(p);
          setSelectedMember(null);
        }}
        onRefetch={() => {
          void refetchMembers();
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        onChangeRoleClick={(member) => {
          setSelectedMemberForRole(member);
          setTargetRole(member.orgRole);
        }}
        onRemoveClick={(member) => setSelectedMemberForRemoval(member)}
      />

      <EditRoleModal
        member={selectedMemberForRole}
        targetRole={targetRole}
        onTargetRoleChange={setTargetRole}
        onClose={() => setSelectedMemberForRole(null)}
        onConfirm={handleRoleChangeConfirm}
        isSubmitting={isUpdatingRole}
      />

      <ConfirmRemovalDialog
        member={selectedMemberForRemoval}
        onClose={() => setSelectedMemberForRemoval(null)}
        onConfirm={handleRemovalConfirm}
        isSubmitting={isRemovingMember}
      />
    </div>
  );
}
