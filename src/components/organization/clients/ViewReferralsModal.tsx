'use client';

import { User } from 'lucide-react';

import { ReferralsSkeleton } from './ReferralsSkeleton';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState, InlineErrorState } from '@/components/ui/state-displays';
import { useGetClientReferrals } from '@/lib/api/generated/clients/clients';
import type { ClientResponse } from '@/lib/api/generated/models';

interface ViewReferralsModalProps {
  client: ClientResponse;
  maxReferrals: number;
  onClose: () => void;
}

/**
 * Modal for viewing a clients referrals.
 * @param props - Component props
 * @param props.client - The client being deactivated
 * @param props.maxReferrals - The max referrals per client
 * @param props.onClose - When the close button is clicked
 * @returns A dialog component
 */
export function ViewReferralsModal({ client, maxReferrals, onClose }: ViewReferralsModalProps) {
  const {
    data: response,
    isLoading,
    isError,
    refetch: refetchReferrals,
  } = useGetClientReferrals(client.id);

  const referrals = response?.status === 200 ? response.data?.data || [] : [];
  const totalReferrals =
    response?.status === 200 ? (response.data?.meta?.total ?? referrals.length) : referrals.length;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2 text-forest">
            <DialogTitle className="font-heading text-lg font-bold text-ink">Referrals</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-ink-3">
            You are Viewing the referrals used by{' '}
            <span className="font-semibold text-ink">{client.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Status Tracker Banner */}
          <div className="flex items-center justify-between rounded-lg border border-forest/10 bg-forest/[0.02] p-3.5">
            <div>
              <p className="text-xs text-ink-3">Referrals Used</p>
              <p className="text-lg font-bold text-ink">
                {totalReferrals} of {maxReferrals}
              </p>
            </div>
          </div>

          {/* Referred Profiles Section */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-2">
              Referred Clients
            </p>

            {isLoading ? (
              <ReferralsSkeleton />
            ) : isError ? (
              <InlineErrorState
                title="Failed to load referral list."
                onRetry={() => void refetchReferrals()}
              />
            ) : referrals.length === 0 ? (
              <EmptyState title="No active referrals recorded yet." />
            ) : (
              <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                {referrals.map((referredClient) => (
                  <div
                    key={referredClient.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-500">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-ink">
                          {referredClient.name}
                        </span>
                        <span className="text-xs text-ink-3">{referredClient.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
