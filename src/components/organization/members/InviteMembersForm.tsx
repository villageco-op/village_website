'use client';

import { Mail, Plus, Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { MembersTableSkeleton } from './MembersTableSkeleton';

import { Button } from '@/components/ui/button';
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
import { useInviteToOrg } from '@/lib/api/generated/invites/invites';
import { OrgRole } from '@/lib/api/generated/models';
import type { Invite } from '@/lib/api/generated/models';

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
 * @param props.onRetryFetch - When a the load invites button is pressed
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
      console.error('OrganizationOnboardingFlow: Failed to transmit invitation', error);
      toast.error('Could not transmit invite. Please check your connection.');
    }
    {
      setIsInviting(false);
    }
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    void handleSendInvite();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-5 border border-lime/30 rounded-xl shadow-sm"
      >
        <h3 className="font-heading font-bold text-sm text-ink-2 flex items-center gap-2">
          <Mail className="w-4 h-4 text-click-green" /> New Invite Card
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          {/* Email Input */}
          <div className="w-full sm:flex-3 flex flex-col gap-1.5">
            <Label htmlFor="inviteEmail">
              Member Email Address
            </Label>
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
            <Label htmlFor="inviteRole">
              Permission Role
            </Label>
            <Select
              value={role}
              onValueChange={(val) => setRole(val as OrgRole)}
              disabled={isInviting}
            >
              <SelectTrigger
                id="inviteRole"
                className="h-9 w-full"
              >
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
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-ink-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-click-green" /> Sent Invitations
            </h3>
            <div className="overflow-hidden border border-border/40 rounded-xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-lime-pale/40 border-b border-border/30 text-ink-2 font-semibold">
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invitedMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b last:border-0 border-border/10 hover:bg-black/5 transition-colors"
                    >
                      <td className="p-3 font-medium text-ink truncate max-w-45">{member.email}</td>
                      <td className="p-3 capitalize text-ink-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            member.role === OrgRole.admin
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-click-green font-semibold bg-lime-pale/50 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-click-green animate-pulse" />
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
