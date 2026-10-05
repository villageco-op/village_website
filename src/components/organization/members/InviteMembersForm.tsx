'use client';

import { Mail, Plus, Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { MembersTableSkeleton } from './MembersTableSkeleton';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InlineErrorState } from '@/components/ui/state-displays';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInviteToOrg } from '@/lib/api/generated/invites/invites';
import { OrgRole } from '@/lib/api/generated/models';
import type { Invite } from '@/lib/api/generated/models';
import { logger } from '@/lib/logger';

interface InviteMembersFormProps {
  invitedMembers: Invite[];
  isLoading: boolean;
  isError: boolean;
  onSuccessMutation: () => void;
  onRetryFetch?: () => void;
}

/**
 * A form for sending organization member invitations.
 * @param props - Component props
 * @param props.invitedMembers - The sent invites
 * @param props.isLoading - Are the invites loading
 * @param props.isError - Did the invites fail to load
 * @param props.onSuccessMutation - When an invite is successfully sent
 * @param props.onRetryFetch - When the load invites button is pressed
 * @returns A form for sending an invite and displaying sent invites
 */
export function InviteMembersForm({
  invitedMembers,
  isLoading,
  isError,
  onSuccessMutation,
  onRetryFetch,
}: InviteMembersFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<OrgRole>(OrgRole.member);
  const [isInviting, setIsInviting] = useState(false);

  const inviteToOrgMutation = useInviteToOrg();

  const handleSendInvite = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (invitedMembers.some((m) => m.email.toLowerCase() === trimmedEmail.toLowerCase())) {
      toast.error('An invitation has already been sent to this email address.');
      return;
    }

    setIsInviting(true);
    try {
      const res = await inviteToOrgMutation.mutateAsync({
        data: { email: trimmedEmail, role },
      });

      if (res.status === 200) {
        setEmail('');
        toast.success(`Invitation sent to ${trimmedEmail}`);
        onSuccessMutation();
      } else {
        toast.error((res.data as any)?.error || 'Failed to send invite.');
      }
    } catch (error) {
      logger.error('OrganizationOnboardingFlow: Failed to transmit invitation', error);
      toast.error('Could not transmit invite. Please check your connection.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    void handleSendInvite();
  };

  return (
    <div className="space-y-6">
      {/* New Invite Form Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-click-green" /> New Invite Card
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              {/* Email Input */}
              <div className="w-full sm:flex-3 flex flex-col gap-1.5">
                <Label htmlFor="inviteEmail">Member Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="colleague@example.com"
                  className="h-9 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isInviting}
                />
              </div>

              {/* Role Select */}
              <div className="w-full sm:w-48 flex flex-col gap-1.5">
                <Label htmlFor="inviteRole">Permission Role</Label>
                <Select
                  value={role}
                  onValueChange={(val) => setRole(val as OrgRole)}
                  disabled={isInviting}
                >
                  <SelectTrigger id="inviteRole" className="h-9 w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrgRole.member}>Member</SelectItem>
                    <SelectItem value={OrgRole.admin}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:flex-1">
                <Button
                  type="submit"
                  disabled={!email || isInviting}
                  variant="lime"
                  className="w-full h-9 flex items-center justify-center gap-1 text-sm"
                >
                  {isInviting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Invite
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sent Invitations Table Section */}
      {isLoading ? (
        <MembersTableSkeleton rowCount={3} />
      ) : isError ? (
        <InlineErrorState
          title="Failed to load invitations"
          description="We couldn't retrieve the list of sent invites. Please try again."
          icon={AlertCircle}
          onRetry={onRetryFetch}
        />
      ) : (
        invitedMembers.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-click-green" /> Sent Invitations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="pr-6 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="pl-6 font-medium truncate max-w-45">
                        {member.email}
                      </TableCell>
                      <TableCell className="capitalize">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            member.role === OrgRole.admin
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {member.role}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-click-green font-semibold bg-lime-pale/50 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-click-green animate-pulse" />
                          {member.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
