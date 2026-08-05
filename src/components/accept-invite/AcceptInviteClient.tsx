'use client';

import { Building2, Loader2, Mail, UserPlus, LogIn } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { PageErrorState } from '../ui/state-displays';

import { AcceptInviteSkeleton } from '@/components/accept-invite/AcceptInviteSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useAcceptInvite } from '@/lib/api/generated/invites/invites';
import { useGetOrganization } from '@/lib/api/generated/organizations/organizations';
import { getInitials } from '@/lib/user-utils';

/**
 * Client component for accepting an organization invite. Handles non-authenticated users.
 * @returns The component with a code input form
 */
export default function AcceptInviteClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useAuth();

  const orgId = searchParams.get('org') || '';
  const initialCode = searchParams.get('code') || '';
  const emailParam = searchParams.get('email') || '';

  const [inviteCode, setInviteCode] = useState(initialCode);
  const [email, setEmail] = useState(emailParam);

  const {
    data: orgResponse,
    isLoading: isLoadingOrg,
    error: orgError,
  } = useGetOrganization(orgId, {
    query: {
      enabled: !!orgId,
    },
  });

  const { mutateAsync: acceptInviteMutate, isPending: isAccepting } = useAcceptInvite();

  const handleAccept = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!orgId) {
      toast.error('Missing organization identifier.');
      return;
    }
    if (!inviteCode.trim()) {
      toast.error('Please enter a valid invitation code.');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      const response = await acceptInviteMutate({
        data: {
          orgId: orgId,
          code: inviteCode.trim(),
          email: email.trim(),
        },
      });

      if (response.status === 200) {
        toast.success('Invitation accepted successfully.');
        router.push('/org/clients');
      } else {
        toast.error('Failed to accept the invitation. Please verify the code.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const makeCallbackUrl = () => {
    const params = new URLSearchParams();
    if (orgId) params.set('org', orgId);
    if (inviteCode) params.set('code', inviteCode);
    if (email) params.set('email', email);
    return `/verify-invite?${params.toString()}`;
  };

  const handleLoginRedirect = () => {
    const callbackPath = encodeURIComponent(makeCallbackUrl());
    router.push(`/login?callbackUrl=${callbackPath}`);
  };

  const isLoading = isLoadingOrg || status === 'loading';

  if (isLoading) {
    return <AcceptInviteSkeleton />;
  }

  if (!orgId || orgError || orgResponse?.status !== 200 || !orgResponse?.data) {
    return (
      <PageErrorState
        title="Invalid Invitation"
        description="The invitation link appears to be incomplete or invalid. Please check the URL or request a new invitation from your administrator."
        action={
          <Button onClick={() => router.push('/')} variant="forest">
            Return Home
          </Button>
        }
      />
    );
  }

  const organization = orgResponse.data;
  const orgName = organization.name || 'Organization';
  const orgImage = organization.image;

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white border border-lime/30 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
          {/* Organization Details Section */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Avatar className="h-16 w-16 bg-lime border-2 border-lime/30">
              {orgImage && <AvatarImage src={orgImage} alt={orgName} className="object-cover" />}
              <AvatarFallback className="bg-transparent font-heading text-lg font-extrabold text-deep-forest">
                {getInitials(orgName)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold text-deep-forest">Join {orgName}</h2>
              <p className="font-sans text-sm text-ink-3">
                You have been invited to collaborate with this team.
              </p>
            </div>
          </div>

          {status === 'unauthenticated' ? (
            /* Unauthenticated View */
            <div className="space-y-4 pt-4 border-t border-border/10 text-center">
              <p className="font-sans text-sm text-ink-2">
                An account is required to accept this invitation. Sign in or sign up to join the
                organization.
              </p>

              <Button type="button" onClick={handleLoginRedirect} variant="lime">
                <LogIn className="w-4 h-4" /> Sign In to Accept Invite
              </Button>
            </div>
          ) : (
            /* Authenticated Invitation Acceptance Form */
            <form
              onSubmit={(e) => void handleAccept(e)}
              className="space-y-4 pt-4 border-t border-border/10"
            >
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-ink-3 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-ink-3" /> Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={isAccepting || !!emailParam}
                  className="bg-white border-lime/50 focus-visible:ring-click-green h-10 text-sm"
                />
                {emailParam && (
                  <p className="text-[10px] text-ink-3/70">
                    This invitation is tied to the specified address.
                  </p>
                )}
              </div>

              {/* Invite Code Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="code"
                  className="text-xs font-semibold text-ink-3 flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-ink-3" /> Invitation Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter invitation code"
                  required
                  disabled={isAccepting}
                  className="bg-white border-lime/50 focus-visible:ring-click-green h-10 text-sm tracking-wide font-mono"
                />
              </div>

              {/* Submit Action */}
              <Button
                type="submit"
                disabled={isAccepting}
                variant="lime"
                className="w-full mt-2 h-10 flex items-center justify-center gap-2"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Accepting...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Accept Invitation
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
