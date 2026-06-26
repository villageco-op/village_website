'use client';

import { ArrowLeft, Check, Loader2, Mail, Plus, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import type { OrgRole } from '@/lib/api/generated/models/orgRole';

interface InvitedMember {
  email: string;
  role: OrgRole;
  status: 'Pending' | 'Sent';
}

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
 * @returns A component with an invite form and a table displaying sent invites
 */
export default function OrgInviteStep({ onInvite, onFinish, onBack }: OrgInviteStepProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<OrgRole>('member');
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);
  const [isInviting, setIsInviting] = useState(false);

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
    const ok = await onInvite(trimmedEmail, role);
    setIsInviting(false);

    if (ok) {
      setInvitedMembers((prev) => [...prev, { email: trimmedEmail, role, status: 'Pending' }]);
      setEmail('');
      toast.success(`Invitation sent to ${trimmedEmail}`);
    }
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    void handleSendInvite();
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-deep-forest">Invite Team Members</h2>
        <p className="font-sans text-sm text-ink-3 mt-1">
          Add other administrators or members to assist with management (Optional).
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-5 border border-lime/30 rounded-xl shadow-sm"
      >
        <h3 className="font-heading font-bold text-sm text-ink-2 flex items-center gap-2">
          <Mail className="w-4 h-4 text-click-green" /> New Invite Card
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Email Input */}
          <div className="w-full sm:flex-3 flex flex-col justify-between gap-1.5">
            <Label htmlFor="inviteEmail" className="text-xs font-semibold text-ink-3 leading-none">
              Member Email Address
            </Label>
            <Input
              id="inviteEmail"
              type="email"
              placeholder="colleague@example.com"
              className="bg-white border-lime/50 focus-visible:ring-click-green h-9 text-sm w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isInviting}
            />
          </div>

          {/* Role Select */}
          <div className="w-full sm:w-48 flex flex-col justify-between gap-1.5">
            <Label htmlFor="inviteRole" className="text-xs font-semibold text-ink-3 leading-none">
              Permission Role
            </Label>
            <Select
              value={role}
              onValueChange={(val) => setRole(val as OrgRole)}
              disabled={isInviting}
            >
              <SelectTrigger
                id="inviteRole"
                className="bg-white border-lime/50 focus-visible:ring-click-green h-9 text-sm w-full leading-none flex items-center"
              >
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:flex-1 flex items-end">
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

      {/* Sent Invites Table */}
      {invitedMembers.length > 0 && (
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
                {invitedMembers.map((member, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-0 border-border/10 hover:bg-black/5 transition-colors"
                  >
                    <td className="p-3 font-medium text-ink truncate max-w-45">{member.email}</td>
                    <td className="p-3 capitalize text-ink-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          member.role === 'admin'
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
      )}

      {/* Navigation and Submission Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-border/10 gap-3">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isInviting}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Button
          type="button"
          onClick={onFinish}
          disabled={isInviting}
          variant="forest"
          className="ml-auto"
        >
          Finish & Go to Dashboard <Check className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
